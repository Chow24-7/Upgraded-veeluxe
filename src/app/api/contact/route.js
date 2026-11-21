import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const { limited, retryAfter } = rateLimit(`contact:${getClientIp(request)}`, 5, 15 * 60 * 1000);
  if (limited) {
    return NextResponse.json({ error: 'Please wait before sending another message.' }, {
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

  if (typeof body?.website === 'string' && body.website.trim()) {
    return NextResponse.json({ message: 'Thanks for reaching out. We will reply soon.' });
  }

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (name.length < 2 || name.length > 100 || !EMAIL_PATTERN.test(email) || email.length > 254 || message.length < 5 || message.length > 5000) {
    return NextResponse.json({ error: 'Please provide a valid name, email, and message.' }, { status: 400 });
  }

  try {
    await sendEmail({
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: 'New contact form message',
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ message: 'Thanks for reaching out. We will reply soon.' });
  } catch (error) {
    let errorMessage = typeof error?.message === 'string' ? error.message : 'Unknown email error';
    [name, email, message, process.env.CONTACT_EMAIL, process.env.SMTP_USER, process.env.SMTP_FROM, process.env.EMAIL_FROM]
      .filter(Boolean)
      .forEach((value) => {
        errorMessage = errorMessage.replaceAll(value, '[redacted]');
      });
    console.error('Contact form email failed:', {
      name: typeof error?.name === 'string' ? error.name : 'Error',
      code: typeof error?.code === 'string' ? error.code : 'UNKNOWN',
      message: errorMessage.slice(0, 500),
    });
    return NextResponse.json({ error: 'Unable to send message right now.' }, { status: 500 });
  }
}
