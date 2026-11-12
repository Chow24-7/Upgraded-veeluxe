import Link from 'next/link';
import DeliveryAnimation from '@/components/DeliveryAnimation';
import { getOrderByReference } from '@/lib/paystack-orders';
import { canonicalMetadata } from '@/lib/seo';

export const runtime = 'nodejs';
export const metadata = canonicalMetadata('/order-success', {
  title: 'Order confirmation | Veeluxe',
  robots: { index: false, follow: false },
});

export default async function OrderSuccessPage({ searchParams }) {
  const { ref } = await searchParams;
  const reference = typeof ref === 'string' ? ref : '';
  let order = null;

  if (reference) {
    try {
      order = await getOrderByReference(reference);
    } catch (error) {
      console.error('Unable to load order confirmation:', error);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-20 lg:px-8 lg:py-28">
      <div className="w-full rounded-[24px] border border-[#f2e7e2] bg-white p-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
        <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">{order ? 'Order confirmed' : 'Payment processing'}</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#333]">{order ? 'Thank you for your order.' : 'We are confirming your payment.'}</h1>
        {reference ? <p className="mt-4 break-all text-sm font-semibold text-[#555]">Order reference: {reference}</p> : null}
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-[#555]">
          {order
            ? 'Your payment has been verified and your skincare essentials are being prepared.'
            : 'Your payment may still be processing. Keep this reference and refresh this page shortly to see your order summary.'}
        </p>
        {order ? (
          <div className="mx-auto mt-8 max-w-xl rounded-[16px] border border-[#f2e7e2] bg-[#fffaf8] p-5 text-left">
            <h2 className="text-lg font-semibold text-[#333]">Order summary</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#555]">
              {order.items.map((item, index) => (
                <li key={`${item.productId}-${index}`} className="flex justify-between gap-4">
                  <span className="min-w-0 break-words">{item.name}{item.size ? ` (${item.size})` : ''} × {item.quantity}</span>
                  <span className="shrink-0">₦{(item.unitPrice * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-[#f2e7e2] pt-4 font-semibold text-[#333]">
              <span>Total paid</span>
              <span>₦{order.total.toLocaleString()}</span>
            </div>
          </div>
        ) : null}
        <DeliveryAnimation />
        <Link href="/products" className="mt-8 inline-flex rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19]">Continue shopping</Link>
      </div>
    </div>
  );
}
