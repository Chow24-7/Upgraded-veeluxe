import Link from 'next/link';
import PageSection from '../_components/PageSection';
import { canonicalMetadata, createBreadcrumbData } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = canonicalMetadata('/shipping-returns', {
  title: 'Shipping and Returns | Veeluxe',
  description: 'Shipping, delivery, returns, and refunds information for Veeluxe orders in Nigeria.',
});

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <JsonLd data={createBreadcrumbData([
        { name: 'Home', path: '/' },
        { name: 'Shipping and Returns', path: '/shipping-returns' },
      ])} />
      <PageSection className="overflow-hidden rounded-[24px] border border-[#f2e7e2] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        <div className="p-8 lg:p-12">
          <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">Delivery and support</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#333] sm:text-4xl">Shipping and Returns</h1>
          <p className="mt-5 max-w-none text-lg leading-8 text-[#555]">This guide explains how delivery and return requests work.</p>

          <div className="mt-10 space-y-8 border-t border-[#f2e7e2] pt-8">
            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Delivery areas and timing</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">Veeluxe expects to deliver to addresses in Nigeria that are serviceable by its delivery partners. Orders are prepared after payment has been verified. Estimated delivery timing can vary with destination, courier availability, public holidays, weather, and other operational conditions.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Delivery fees and receiving an order</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">Delivery fees should be shown or confirmed before an order is paid. Customers should provide a complete address and a reachable phone number, and arrange for someone to receive the parcel where possible. If a courier cannot complete delivery, we may contact the customer to arrange next steps.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Damaged, incorrect, or missing items</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">If something is damaged, incorrect, or missing, contact us with your order reference and clear photographs of the parcel and items. Keep the packaging until we have reviewed the request. We will assess the information and explain whether a replacement, refund, or another resolution is available.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Returns and hygiene</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">Because skincare items are personal-use products, opened, used, or unsealed items may not be accepted for a change-of-mind return, subject to applicable consumer protections. Do not send an item back before contacting us and receiving return instructions. Products sent back without prior approval may not be traceable or eligible for review.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Refunds and replacements</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">If a refund is approved, it will generally be sent back through the original payment method where possible. Processing time can depend on the payment provider and bank. A replacement may be offered when appropriate and available.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Contact us</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">For delivery or return support, include your order reference and message us on <a className="font-semibold text-[#ff5722] underline" href="https://wa.me/2347014888211" target="_blank" rel="noopener noreferrer">WhatsApp</a> or <a className="font-semibold text-[#ff5722] underline" href="https://www.instagram.com/__veeluxe?igsh=eTBpeG0zaTZ4YWlk&utm_source=qr" target="_blank" rel="noopener noreferrer">Instagram</a>, or email us at <a className="font-semibold text-[#ff5722] underline" href="mailto:Veeluxebrand@gmail.com">Veeluxebrand@gmail.com</a>.</p>
            </section>
          </div>

          <Link href="/products" className="mt-10 inline-flex min-h-11 items-center rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19]">Explore products</Link>
        </div>
      </PageSection>
    </div>
  );
}