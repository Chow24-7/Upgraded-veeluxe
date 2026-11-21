import 'server-only';
import { sendEmail } from '@/lib/mailer';

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
  const businessEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
  const itemLines = formatItems(order.items);
  const totals = formatOrderTotals(order);

  const messages = [
    {
      type: 'business',
      options: {
        to: businessEmail,
        replyTo: order.email,
        subject: `New Veeluxe order ${order.reference}`,
        text: `New verified Veeluxe order\n\nCustomer name: ${order.name}\nCustomer email: ${order.email}\nCustomer phone: ${order.phoneNumber || 'No phone number'}\nDelivery address: ${order.address}\nPayment reference: ${order.reference}\n\n${totals}\n\nProducts ordered:\n${itemLines}`,
      },
    },
    {
      type: 'customer',
      options: {
        to: order.email,
        replyTo: process.env.CONTACT_EMAIL,
        subject: 'Your Veeluxe order is confirmed',
        text: `Hello ${order.name},\n\nThank you for choosing Veeluxe. Your payment has been verified and your order is confirmed.\n\nOrder reference: ${order.reference}\nPhone number: ${order.phoneNumber || 'No phone number'}\n\nYour order:\n${itemLines}\n\n${totals}\n\nWith care,\nThe Veeluxe team`,
      },
    },
  ].filter((message) => emailTypes.includes(message.type));

  const results = await Promise.all(messages.map(async (message) => {
    try {
      await sendEmail({
        ...message.options,
        idempotencyKey: `veeluxe-${order.reference}-${message.type}`,
      });
      return null;
    } catch (error) {
      return { emailType: message.type, error };
    }
  }));

  return results.filter(Boolean);
}
