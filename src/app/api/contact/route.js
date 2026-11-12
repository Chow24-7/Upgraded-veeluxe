import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
      from,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: 'New contact form message',
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ message: 'Thanks for reaching out. We will reply soon.' });
  } catch (error) {
    console.error('Contact form email failed:', error);
    return NextResponse.json({ error: 'Unable to send message right now.' }, { status: 500 });
  }
}
