import 'server-only';
import { getOrdersDb, FieldValue } from '@/lib/firebase-admin';
import { sendOrderEmails } from '@/lib/order-emails';
import { priceCart } from '@/lib/pricing';
import { normalizeNigerianPhone } from '@/lib/phone';

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
  let pricedOrder;
  try {
    pricedOrder = priceCart(metadata.items, metadata.deliveryAreaId);
  } catch (error) {
    throw new PaymentVerificationError(error.message || 'The order pricing is invalid.');
  }
  const { items, itemsSubtotal, deliveryArea, deliveryFee, total } = pricedOrder;
  const expectedKobo = total * 100;

  if (!Number.isSafeInteger(expectedKobo) || transaction.amount !== expectedKobo) {
    throw new PaymentVerificationError('The amount paid does not match the current product and delivery prices.');
  }

  const name = typeof metadata.name === 'string' ? metadata.name.trim().slice(0, 120) : '';
  const address = typeof metadata.address === 'string' ? metadata.address.trim().slice(0, 1000) : '';
  const phoneNumber = normalizeNigerianPhone(metadata.phoneNumber);
  const email = typeof transaction.customer?.email === 'string' ? transaction.customer.email.trim().toLowerCase() : '';

  if (!phoneNumber) {
    throw new PaymentVerificationError('Please enter a valid Nigerian phone number, for example 08012345678.');
  }

  if (name.length < 2 || address.length < 5 || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    throw new PaymentVerificationError('Verified payment is missing valid customer or delivery details.');
  }

  return {
    reference: validateReference(transaction.reference),
    name,
    email,
    address,
    phoneNumber,
    items,
    itemsSubtotal,
    deliveryArea,
    deliveryFee,
    total,
    status: 'paid',
  };
}

function isSameOrder(existing, incoming) {
  return existing.total === incoming.total
    && existing.email === incoming.email
    && (existing.phoneNumber ?? null) === (incoming.phoneNumber ?? null)
    && JSON.stringify(existing.items) === JSON.stringify(incoming.items)
    && (existing.itemsSubtotal ?? existing.total) === (incoming.itemsSubtotal ?? incoming.total)
    && (existing.deliveryArea ?? null) === (incoming.deliveryArea ?? null)
    && (existing.deliveryFee ?? 0) === (incoming.deliveryFee ?? 0);
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
      emailStatus: 'pending',
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
      emailStatus: 'sending',
      notificationStartedAt: FieldValue.serverTimestamp(),
    });
    return true;
  });
}

function sanitizeEmailError(error, order) {
  let message = typeof error?.message === 'string' ? error.message : 'Unknown email error';
  [
    order.name,
    order.email,
    order.phoneNumber,
    order.address,
    process.env.CONTACT_EMAIL,
    process.env.EMAIL_FROM,
    process.env.SMTP_USER,
    process.env.SMTP_FROM,
  ].filter(Boolean).forEach((value) => {
    message = message.replaceAll(value, '[redacted]');
  });
  return {
    name: typeof error?.name === 'string' ? error.name : 'Error',
    code: typeof error?.code === 'string' ? error.code : typeof error?.name === 'string' ? error.name : 'UNKNOWN',
    message: message.slice(0, 500),
  };
}

export async function sendClaimedOrderEmails(order, emailTypes) {
  const orderRef = getOrdersDb().collection('orders').doc(order.reference);
  const requestedEmailTypes = emailTypes || ['business', 'customer'];
  let failedEmails = [];
  const emailErrors = {};

  try {
    const failures = await sendOrderEmails(order, { emailTypes: requestedEmailTypes });
    failedEmails = failures.map((failure) => failure.emailType);
    failures.forEach((failure) => {
      const details = sanitizeEmailError(failure.error, order);
      emailErrors[failure.emailType] = details;
      console.error('Order email delivery failed', {
        reference: order.reference,
        email: failure.emailType,
        code: details.code,
        message: details.message,
      });
    });
  } catch (error) {
    const details = sanitizeEmailError(error, order);
    console.error('Order email delivery failed', {
      reference: order.reference,
      email: requestedEmailTypes.join(' and '),
      code: details.code,
      message: details.message,
    });
    failedEmails = requestedEmailTypes;
    requestedEmailTypes.forEach((type) => {
      emailErrors[type] = details;
    });
  }

  let emailStatus = failedEmails.length ? 'failed' : 'sent';
  try {
    await getOrdersDb().runTransaction(async (transaction) => {
      const snapshot = await transaction.get(orderRef);
      if (!snapshot.exists) return;

      const existing = snapshot.data();
      if (existing.emailStatus === 'sent') {
        emailStatus = 'sent';
        failedEmails = [];
        return;
      }

      const updatedEmailErrors = { ...(existing.emailErrors || {}) };
      requestedEmailTypes.forEach((type) => {
        if (emailErrors[type]) updatedEmailErrors[type] = emailErrors[type];
        else delete updatedEmailErrors[type];
      });

      transaction.update(orderRef, {
        emailStatus,
        emailStatusAt: FieldValue.serverTimestamp(),
        failedEmails,
        notificationStatus: emailStatus,
        emailErrors: updatedEmailErrors,
      });
    });
  } catch (error) {
    const details = sanitizeEmailError(error, order);
    console.error('Unable to update order email status', {
      reference: order.reference,
      code: details.code,
      message: details.message,
    });
  }

  return { emailStatus, failedEmails };
}

export async function claimFailedOrderEmails(reference) {
  const validReference = validateReference(reference);
  const db = getOrdersDb();
  const orderRef = db.collection('orders').doc(validReference);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(orderRef);
    if (!snapshot.exists) return null;

    const order = { ...snapshot.data(), reference: snapshot.id };
    if (order.emailStatus !== 'failed' || order.notificationStatus === 'sending') return null;

    const emailTypes = Array.isArray(order.failedEmails)
      ? order.failedEmails.filter((type) => type === 'business' || type === 'customer')
      : ['business', 'customer'];
    if (emailTypes.length === 0) return null;

    transaction.update(orderRef, {
      emailStatus: 'sending',
      notificationStatus: 'sending',
      notificationStartedAt: FieldValue.serverTimestamp(),
    });
    return { order, emailTypes };
  });
}

export async function processPaystackReference(reference) {
  const validReference = validateReference(reference);
  const transaction = await verifyWithPaystack(validReference);
  const existingOrder = await getOrderByReference(validReference);
  let order;
  if (existingOrder) {
    const storedAmountKobo = existingOrder.total * 100;
    if (!Number.isSafeInteger(storedAmountKobo) || transaction.amount !== storedAmountKobo) {
      throw new PaymentVerificationError('The verified payment amount does not match the stored order.');
    }
    order = existingOrder;
  } else {
    order = buildVerifiedOrder(transaction);
  }
  await createOrderOnce(order);
  const emailClaimed = await claimOrderEmails(order.reference);

  return { order, emailClaimed };
}

export async function getOrderByReference(reference) {
  if (typeof reference !== 'string' || !REFERENCE_PATTERN.test(reference)) return null;
  const snapshot = await getOrdersDb().collection('orders').doc(reference).get();
  return snapshot.exists ? { ...snapshot.data(), reference: snapshot.id } : null;
}

function normalizeOrderDate(value) {
  if (value && typeof value.toDate === 'function') {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (value && typeof value === 'object' && Number.isFinite(value.seconds)) {
    const date = new Date(value.seconds * 1000 + (Number(value.nanoseconds) || 0) / 1_000_000);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const date = new Date(Math.abs(value) < 100_000_000_000 ? value * 1000 : value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'string' && value.trim()) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export async function getRecentOrders(limit = 200) {
  const snapshot = await getOrdersDb()
    .collection('orders')
    .get();

  return snapshot.docs
    .map((document) => {
      const order = document.data();
      return {
        ...order,
        reference: document.id,
        createdAtDate: normalizeOrderDate(order.createdAt),
      };
    })
    .sort((first, second) => {
      if (!first.createdAtDate) return second.createdAtDate ? 1 : 0;
      if (!second.createdAtDate) return -1;
      return second.createdAtDate.getTime() - first.createdAtDate.getTime();
    })
    .slice(0, limit);
}