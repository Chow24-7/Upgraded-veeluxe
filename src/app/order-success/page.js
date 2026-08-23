import Link from 'next/link';
import DeliveryAnimation from '@/components/DeliveryAnimation';

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-20 lg:px-8 lg:py-28">
      <div className="w-full rounded-[24px] border border-[#f2e7e2] bg-white p-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
        <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">Order confirmed</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#333]">Thank you for your order.</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-[#555]">
          Your skincare essentials are on the way. A confirmation email will be sent shortly.
        </p>
        <DeliveryAnimation />
        <Link href="/products" className="mt-8 inline-flex rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19]">Continue shopping</Link>
      </div>
    </div>
  );
}
