import Image from 'next/image';
import Link from 'next/link';
import PageSection from '../_components/PageSection';

const values = [
  'Thoughtful formulations that support everyday comfort.',
  'Minimal routines that feel elevated and easy to keep.',
  'Ingredients selected for glow, hydration, and confidence.',
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
      <PageSection className="overflow-hidden rounded-[24px] border border-[#f2e7e2] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[320px]">
            <Image src="/images/about-hero.jpg" alt="Veeluxe skincare ritual" fill className="object-cover" />
          </div>
          <div className="p-8 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ff5722]">Our story</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#333] sm:text-4xl">Founder Victoria created Veeluxe around one simple idea: skincare should feel calm, elegant, and real.</h1>
            <p className="mt-5 text-lg leading-8 text-[#555]">
              What began as a personal search for products that felt kind to the skin and beautiful on the shelf evolved into a collection designed for modern routines. Veeluxe blends performance and simplicity, so each product feels considered rather than excessive.
            </p>
            <Link href="/products" className="mt-8 inline-flex rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19]">Explore the collection</Link>
          </div>
        </div>
      </PageSection>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <PageSection className="rounded-[24px] border border-[#f2e7e2] bg-[#fff] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <h2 className="text-2xl font-semibold text-[#333]">The philosophy behind the brand</h2>
          <p className="mt-4 text-lg leading-8 text-[#555]">
            We believe in keeping rituals intuitive. A great skincare routine does not need to be complicated to be effective. With a few high-quality essentials, you can create a gentle daily habit that supports healthy-looking skin.
          </p>
        </PageSection>
        <PageSection className="rounded-[24px] border border-[#f2e7e2] bg-[#fffaf8] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <h2 className="text-2xl font-semibold text-[#333]">What we stand for</h2>
          <ul className="mt-4 space-y-3 text-lg text-[#555]">
            {values.map((value, index) => (
              <PageSection key={value} delay={index * 80} className="flex gap-3">
                <span className="text-[#ff5722]">•</span>
                <span>{value}</span>
              </PageSection>
            ))}
          </ul>
        </PageSection>
      </section>
    </div>
  );
}
