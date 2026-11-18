import 'server-only';
import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function formatItems(items) {
  return items.map((item) => {
    const size = item.size ? ` (${item.size})` : '';
    return `- ${item.name}${size} x ${item.quantity} at ₦${item.unitPrice.toLocaleString()} each = ₦${(item.unitPrice * item.quantity).toLocaleString()}`;
  }).join('\n');
}

function formatOrderTotals(order) {
  const lines = [`Items subtotal: ₦${(order.itemsSubtotal ?? order.total).toLocaleString()}`];
  if (order.deliveryArea) lines.push(`Delivery area: ${order.deliveryArea}`);
  if (order.deliveryFee !== undefined) lines.push(`Delivery fee: ₦${order.deliveryFee.toLocaleString()}`);
  lines.push(`Total paid: ₦${order.total.toLocaleString()}`);
  return lines.join('\n');
}

export async function sendOrderEmails(order) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const businessEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
  const itemLines = formatItems(order.items);
  const totals = formatOrderTotals(order);

  const results = await Promise.allSettled([
    transporter.sendMail({
      from,
      to: businessEmail,
      subject: `New Veeluxe order ${order.reference}`,
      text: `New verified Veeluxe order\n\nCustomer name: ${order.name}\nCustomer email: ${order.email}\nDelivery address: ${order.address}\nPayment reference: ${order.reference}\n\n${totals}\n\nProducts ordered:\n${itemLines}`,
    }),
    transporter.sendMail({
      from,
      to: order.email,
      subject: 'Your Veeluxe order is confirmed',
      text: `Hello ${order.name},\n\nThank you for choosing Veeluxe. Your payment has been verified and your order is confirmed.\n\nOrder reference: ${order.reference}\n\nYour order:\n${itemLines}\n\n${totals}\n\nWith care,\nThe Veeluxe team`,
    }),
  ]);

  const failures = results.filter((result) => result.status === 'rejected');
  if (failures.length) {
    failures.forEach((result) => console.error('Verified order email failed:', result.reason));
    throw new Error('One or more order confirmation emails could not be sent.');
  }
}