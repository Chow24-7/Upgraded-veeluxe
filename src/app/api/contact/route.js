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

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    if (type === 'order') {
      const items = Array.isArray(orderDetails?.items) ? orderDetails.items : [];
      const itemLines = items.length > 0
        ? items.map((item) => `- ${item.name} x ${item.quantity} at ₦${Number(item.price || 0).toLocaleString()} each = ₦${(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}`).join('\n')
        : 'No item details provided.';
      const total = Number(orderDetails?.amount || 0);
      const reference = orderDetails?.reference || 'N/A';

      const businessEmail = transporter.sendMail({
        from,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        subject: `New Veeluxe order from ${name}`,
        text: `New Veeluxe order\n\nCustomer name: ${name}\nCustomer email: ${email}\nDelivery address: ${orderDetails?.address || 'N/A'}\nPayment reference: ${reference}\nTotal amount paid: ₦${total.toLocaleString()}\n\nProducts ordered:\n${itemLines}`,
      });

      const customerEmail = transporter.sendMail({
        from,
        to: email,
        subject: 'Your Veeluxe order is confirmed',
        text: `Hello ${name},\n\nThank you for choosing Veeluxe. We have received your order and are getting your skincare essentials ready.\n\nYour order:\n${itemLines}\n\nTotal paid: ₦${total.toLocaleString()}\n\nWe appreciate you trusting Veeluxe to be part of your skincare ritual.\n\nWith care,\nThe Veeluxe team`,
      });

      const results = await Promise.allSettled([businessEmail, customerEmail]);
      const failed = results.filter((result) => result.status === 'rejected');
      failed.forEach((result) => console.error('Order email failed:', result.reason));

      if (failed.length === results.length) {
        return NextResponse.json({ error: 'Unable to send order emails right now.' }, { status: 500 });
      }

      return NextResponse.json({
        message: failed.length > 0 ? 'Order received, but one confirmation email could not be sent.' : 'Order confirmation emails sent.',
        emailsSent: results.length - failed.length,
      }, { status: failed.length > 0 ? 207 : 200 });
    }

    await transporter.sendMail({
      from,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `New contact form message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ message: 'Thanks for reaching out. We will reply soon.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unable to send message right now.' }, { status: 500 });
  }
}
