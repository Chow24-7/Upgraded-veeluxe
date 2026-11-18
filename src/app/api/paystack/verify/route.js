import { after } from 'next/server';
import { NextResponse } from 'next/server';
import { PaymentVerificationError, processPaystackReference, sendClaimedOrderEmails } from '@/lib/paystack-orders';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request) {
  const { limited, retryAfter } = rateLimit(`paystack-verify:${getClientIp(request)}`, 10, 60 * 1000);
  if (limited) {
    return NextResponse.json({ error: 'Too many verification attempts. Please try again shortly.' }, {
      status: 429,
      headers: { 'Retry-After': String(retryAfter) },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const { order, emailClaimed } = await processPaystackReference(body?.reference);
    if (emailClaimed) after(() => sendClaimedOrderEmails(order));
    return NextResponse.json({ verified: true, reference: order.reference });
  } catch (error) {
    if (error instanceof PaymentVerificationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Paystack verification failed:', error);
    return NextResponse.json({ error: 'Unable to verify and save this payment right now. Please try again.' }, { status: 500 });
  }
}