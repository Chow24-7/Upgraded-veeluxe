import 'server-only';
import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
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

export async function sendOrderEmails(order, { emailTypes = ['business', 'customer'] } = {}) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const businessEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
  const itemLines = formatItems(order.items);
  const totals = formatOrderTotals(order);

  const messages = [
    {
      type: 'business',
      options: {
        from,
        to: businessEmail,
        subject: `New Veeluxe order ${order.reference}`,
        text: `New verified Veeluxe order\n\nCustomer name: ${order.name}\nCustomer email: ${order.email}\nCustomer phone: ${order.phoneNumber || 'No phone number'}\nDelivery address: ${order.address}\nPayment reference: ${order.reference}\n\n${totals}\n\nProducts ordered:\n${itemLines}`,
      },
    },
    {
      type: 'customer',
      options: {
        from,
        to: order.email,
        subject: 'Your Veeluxe order is confirmed',
        text: `Hello ${order.name},\n\nThank you for choosing Veeluxe. Your payment has been verified and your order is confirmed.\n\nOrder reference: ${order.reference}\nPhone number: ${order.phoneNumber || 'No phone number'}\n\nYour order:\n${itemLines}\n\n${totals}\n\nWith care,\nThe Veeluxe team`,
      },
    },
  ].filter((message) => emailTypes.includes(message.type));

  const results = await Promise.all(messages.map(async (message) => {
    try {
      await transporter.sendMail(message.options);
      return null;
    } catch (error) {
      return { emailType: message.type, error };
    }
  }));

  transporter.close();
  return results.filter(Boolean);
}