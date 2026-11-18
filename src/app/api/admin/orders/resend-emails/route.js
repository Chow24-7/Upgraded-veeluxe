import { cookies } from 'next/headers';
import { after, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, isAdminSessionValid } from '@/lib/admin-auth';
import { claimFailedOrderEmails, sendClaimedOrderEmails } from '@/lib/paystack-orders';

export const runtime = 'nodejs';

export async function POST(request) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isAdminSessionValid(session)) {
    return NextResponse.json({ error: 'Admin authentication is required.' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const claimed = await claimFailedOrderEmails(body?.reference);
    if (!claimed) {
      return NextResponse.json({ error: 'This order has no failed emails available to resend.' }, { status: 409 });
    }

    after(() => sendClaimedOrderEmails(claimed.order, claimed.emailTypes));
    return NextResponse.json({ queued: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to queue email resend.' }, { status: 400 });
  }
}
