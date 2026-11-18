import { createHmac, timingSafeEqual } from 'node:crypto';
import { after, NextResponse } from 'next/server';
import { PaymentVerificationError, processPaystackReference, sendClaimedOrderEmails } from '@/lib/paystack-orders';

export const runtime = 'nodejs';

export async function POST(request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: 'Webhook verification is not configured.' }, { status: 500 });
  }

  const signature = request.headers.get('x-paystack-signature') || '';
  if (!/^[a-f\d]{128}$/i.test(signature)) {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 });
  }

  const rawBody = await request.text();
  const expected = createHmac('sha512', secretKey).update(rawBody).digest();
  const received = Buffer.from(signature, 'hex');
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid webhook payload.' }, { status: 400 });
  }

  if (event.event !== 'charge.success') {
    return NextResponse.json({ received: true });
  }

  try {
    const { order, emailClaimed } = await processPaystackReference(event.data?.reference);
    if (emailClaimed) after(() => sendClaimedOrderEmails(order));
    return NextResponse.json({ received: true });
  } catch (error) {
    if (error instanceof PaymentVerificationError && error.status < 500) {
      console.error('Paystack webhook payment was not accepted:', error.message);
      return NextResponse.json({ received: true, ignored: true });
    }
    console.error('Paystack webhook processing failed:', error);
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 });
  }
}