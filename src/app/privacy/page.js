import Link from 'next/link';
import PageSection from '../_components/PageSection';
import { canonicalMetadata, createBreadcrumbData } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = canonicalMetadata('/privacy', {
  title: 'Privacy Policy | Veeluxe',
  description: 'Learn how Veeluxe uses and protects information shared when you shop or contact us.',
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <JsonLd data={createBreadcrumbData([
        { name: 'Home', path: '/' },
        { name: 'Privacy Policy', path: '/privacy' },
      ])} />
      <PageSection className="overflow-hidden rounded-[24px] border border-[#f2e7e2] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        <div className="p-8 lg:p-12">
          <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">Your information</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#333] sm:text-4xl">Privacy Policy</h1>
          <p className="mt-5 max-w-none text-lg leading-8 text-[#555]">
            This policy explains how Veeluxe handles information when you browse our store, place an order, or contact us.
          </p>

          <div className="mt-10 space-y-8 border-t border-[#f2e7e2] pt-8">
            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Information we collect</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">When you place an order, we receive the name, email address, phone number, delivery address, items ordered, and payment reference needed to process and support that order. We collect your phone number so our dispatch rider can contact you about delivery, and may share it with our delivery partner for this purpose. If you send a contact message, we receive the details you choose to provide. Our website may also process basic technical information needed to deliver and protect the service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">How we use information</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">We use order details to confirm payment, prepare delivery, answer customer questions, maintain order records, and send relevant service messages. Contact details are used to reply to enquiries. We do not sell customer personal information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Payments</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">Online payments are processed through Paystack. Veeluxe does not ask customers to send card PINs, passwords, or one-time passcodes through our contact form or social channels. Payment information is handled by the payment provider according to its own terms and privacy practices. We receive payment confirmation and transaction details needed to manage an order.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Storage and sharing</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">Order records are stored in the store&apos;s database and may be shared with service providers that help process payments, host the website, deliver orders, or send customer service emails. These providers should use information only to provide their services.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Your choices and questions</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">You may contact us to ask about personal information connected with an order or enquiry. We may need to retain some records where required for accounting, payment disputes, or other applicable obligations. For privacy questions, message us on <a className="font-semibold text-[#ff5722] underline" href="https://wa.me/2347014888211" target="_blank" rel="noopener noreferrer">WhatsApp</a> or contact us through <a className="font-semibold text-[#ff5722] underline" href="https://www.instagram.com/__veeluxe?igsh=eTBpeG0zaTZ4YWlk&utm_source=qr" target="_blank" rel="noopener noreferrer">Instagram</a>, or email us at <a className="font-semibold text-[#ff5722] underline" href="mailto:Veeluxebrand@gmail.com">Veeluxebrand@gmail.com</a>.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#333]">Policy updates</h2>
              <p className="mt-3 text-lg leading-8 text-[#555]">We may update this notice when store practices change.</p>
            </section>
          </div>

          <Link href="/products" className="mt-10 inline-flex min-h-11 items-center rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19]">Explore products</Link>
        </div>
      </PageSection>
    </div>
  );
}