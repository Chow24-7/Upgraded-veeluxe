import Link from 'next/link';
import PageSection from '../_components/PageSection';
import { canonicalMetadata, createBreadcrumbData } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = canonicalMetadata('/terms', {
  title: 'Terms and Conditions | Veeluxe',
  description: 'Read the terms for shopping with Veeluxe in Nigeria.',
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <JsonLd data={createBreadcrumbData([
        { name: 'Home', path: '/' },
        { name: 'Terms and Conditions', path: '/terms' },
      ])} />
      <PageSection className="overflow-hidden rounded-[24px] border border-[#f2e7e2] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        <div className="p-8 lg:p-12">
          <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">Shopping with Veeluxe</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#333] sm:text-4xl">Terms and Conditions</h1>
          <p className="mt-5 max-w-none text-lg leading-8 text-[#555]">These terms describe the basics of shopping with Veeluxe.</p>

          <div className="mt-10 space-y-8 border-t border-[#f2e7e2] pt-8">
            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Orders and product information</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">An order is submitted when checkout is completed and payment is confirmed. We will contact you if an item is unavailable or if we need to clarify delivery details.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Payment</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">Payments are processed securely through Paystack. Prices are displayed in Nigerian naira unless a product page states otherwise. An order is treated as paid only after payment has been verified.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Delivery</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">We aim to deliver to customers in Nigeria using the address supplied at checkout. Delivery availability, fees, and timing can depend on the destination and courier.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Product use</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">Use skincare products according to their labels and instructions, and discontinue use if a product causes persistent discomfort. Product descriptions are general information and are not medical advice.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Returns and support</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">If an order arrives damaged, incorrect, or incomplete, contact us with the order reference and clear photos so we can review it. For hygiene and safety, opened skincare products may not be eligible for return except where applicable law requires otherwise. Further information is available in the <Link href="/shipping-returns" className="font-semibold text-[#ff5722] underline">Shipping and Returns policy</Link>.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Contact and changes</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">For order questions, contact Veeluxe through <a className="font-semibold text-[#ff5722] underline" href="https://wa.me/2347014888211" target="_blank" rel="noopener noreferrer">WhatsApp</a> or <a className="font-semibold text-[#ff5722] underline" href="https://www.instagram.com/__veeluxe?igsh=eTBpeG0zaTZ4YWlk&utm_source=qr" target="_blank" rel="noopener noreferrer">Instagram</a>, or email us at <a className="font-semibold text-[#ff5722] underline" href="mailto:Veeluxebrand@gmail.com">Veeluxebrand@gmail.com</a>.</p>
            </section>
          </div>

          <Link href="/products" className="mt-10 inline-flex min-h-11 items-center rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19]">Explore products</Link>
        </div>
      </PageSection>
    </div>
  );
}