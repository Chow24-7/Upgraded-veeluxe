import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import 'dotenv/config';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message, type, orderDetails } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Please complete all fields.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject = type === 'order' ? `New Veeluxe order from ${name}` : `New contact form message from ${name}`;
    const text = type === 'order'
      ? `Order confirmation request from ${name}\nEmail: ${email}\n\nOrder details:\n${message}\n\nReference: ${orderDetails?.reference || 'N/A'}\nAmount: ₦${(orderDetails?.amount || 0).toLocaleString()}\nAddress: ${orderDetails?.address || 'N/A'}`
      : `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject,
      text,
    });

    return NextResponse.json({ message: type === 'order' ? 'Order confirmation request sent.' : 'Thanks for reaching out. We will reply soon.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unable to send message right now.' }, { status: 500 });
  }
}
