import 'server-only';
import { getOrdersDb, FieldValue } from '@/lib/firebase-admin';
import { sendOrderEmails } from '@/lib/order-emails';
import { priceCart } from '@/lib/pricing';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REFERENCE_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;

export class PaymentVerificationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'PaymentVerificationError';
    this.status = status;
  }
}

function parseMetadata(value) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      throw new PaymentVerificationError('Paystack returned invalid order metadata.');
    }
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new PaymentVerificationError('Paystack did not include order details.');
  }
  return value;
}

function validateReference(reference) {
  if (typeof reference !== 'string' || !REFERENCE_PATTERN.test(reference)) {
    throw new PaymentVerificationError('A valid payment reference is required.');
  }
  return reference;
}

async function verifyWithPaystack(reference) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new PaymentVerificationError('Payment verification is not configured.', 500);
  }

  let response;
  try {
    response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
      cache: 'no-store',
    });
  } catch {
    throw new PaymentVerificationError('Could not reach Paystack to verify this payment. Please try again.', 503);
  }

  if (!response.ok) {
    throw new PaymentVerificationError('Paystack could not verify this payment reference.');
  }

  const result = await response.json().catch(() => null);
  const transaction = result?.data;
  if (!result?.status || !transaction || transaction.reference !== reference) {
    throw new PaymentVerificationError('Paystack returned an invalid verification response.');
  }
  if (transaction.status !== 'success') {
    throw new PaymentVerificationError('Payment has not been confirmed as successful.');
  }
  if (transaction.currency !== 'NGN') {
    throw new PaymentVerificationError('The payment currency is not supported.');
  }

  return transaction;
}

function buildVerifiedOrder(transaction) {
  const metadata = parseMetadata(transaction.metadata);
  const { items, total } = priceCart(metadata.items);
  const expectedKobo = total * 100;

  if (!Number.isSafeInteger(expectedKobo) || transaction.amount !== expectedKobo) {
    throw new PaymentVerificationError('The amount paid does not match the current product prices.');
  }

  const name = typeof metadata.name === 'string' ? metadata.name.trim().slice(0, 120) : '';
  const address = typeof metadata.address === 'string' ? metadata.address.trim().slice(0, 1000) : '';
  const email = typeof transaction.customer?.email === 'string' ? transaction.customer.email.trim().toLowerCase() : '';

  if (name.length < 2 || address.length < 5 || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    throw new PaymentVerificationError('Verified payment is missing valid customer or delivery details.');
  }

  return {
    reference: validateReference(transaction.reference),
    name,
    email,
    address,
    items,
    total,
    status: 'paid',
  };
}

function isSameOrder(existing, incoming) {
  return existing.total === incoming.total
    && existing.email === incoming.email
    && JSON.stringify(existing.items) === JSON.stringify(incoming.items);
}

async function createOrderOnce(order) {
  const db = getOrdersDb();
  const orderRef = db.collection('orders').doc(order.reference);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(orderRef);
    if (snapshot.exists) {
      const existing = snapshot.data();
      if (!isSameOrder(existing, order)) {
        throw new PaymentVerificationError('This payment reference is already associated with a different order.', 409);
      }
      return existing;
    }

    transaction.create(orderRef, {
      ...order,
      createdAt: FieldValue.serverTimestamp(),
      notificationStatus: 'pending',
    });
    return order;
  });
}

async function claimOrderEmails(reference) {
  const db = getOrdersDb();
  const orderRef = db.collection('orders').doc(reference);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(orderRef);
    if (!snapshot.exists || snapshot.data().notificationStatus !== 'pending') return false;
    transaction.update(orderRef, {
      notificationStatus: 'sending',
      notificationStartedAt: FieldValue.serverTimestamp(),
    });
    return true;
  });
}

export async function processPaystackReference(reference) {
  const validReference = validateReference(reference);
  const transaction = await verifyWithPaystack(validReference);
  const order = buildVerifiedOrder(transaction);
  await createOrderOnce(order);

  if (await claimOrderEmails(order.reference)) {
    try {
      await sendOrderEmails(order);
      await getOrdersDb().collection('orders').doc(order.reference).update({
        notificationStatus: 'sent',
        notificationSentAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error(`Order notification failed for ${order.reference}:`, error);
      await getOrdersDb().collection('orders').doc(order.reference).update({
        notificationStatus: 'failed',
      });
    }
  }

  return order;
}

export async function getOrderByReference(reference) {
  if (typeof reference !== 'string' || !REFERENCE_PATTERN.test(reference)) return null;
  const snapshot = await getOrdersDb().collection('orders').doc(reference).get();
  return snapshot.exists ? { ...snapshot.data(), reference: snapshot.id } : null;
}

export async function getRecentOrders(limit = 100) {
  const snapshot = await getOrdersDb()
    .collection('orders')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();
  return snapshot.docs.map((document) => ({ ...document.data(), reference: document.id }));
}