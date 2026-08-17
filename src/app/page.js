import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import PageSection from './_components/PageSection';
import { products } from '@/data/products';

const testimonials = [
  {
    quote: 'The products feel luxurious without being overwhelming. My skin looks calmer and brighter.',
    author: 'Ayo, Lagos',
  },
  {
    quote: 'The cleanser and serum are my everyday staples. It feels like a true calm ritual.',
    author: 'Tosin, Abuja',
  },
];

export default function HomePage() {
  return (
    <div>
      <PageSection className="mx-auto grid max-w-7xl gap-8 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ff5722]">Skincare that feels considered</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#333] sm:text-5xl">Glow softly with essentials made for everyday ritual.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#555]">
            Veeluxe brings together gentle cleansing, brightening care, and nourishing formulas designed to support calm, healthy skin.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/products" className="rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19]">Shop products</Link>
            <Link href="/about" className="rounded-full border border-[#ff5722] px-6 py-3 text-sm font-semibold text-[#ff5722] transition hover:bg-[#fff5f0]">About Veeluxe</Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-[24px] border border-[#f2e7e2] bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
          <Image src="/images/IMG_5980.jpg" alt="Skincare product display" width={900} height={1100} className="h-full w-full rounded-[18px] object-cover" priority />
        </div>
      </PageSection>

      <PageSection className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="rounded-[24px] border border-[#f2e7e2] bg-[#fff] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.05)] lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-[18px]">
              <Image src="/images/founder.jpg" alt="Victoria, founder of Veeluxe" width={560} height={620} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ff5722]">About Veeluxe</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#333]">Founded by Victoria, with a belief that skincare should feel simple and uplifting.</h2>
              <p className="mt-4 text-lg leading-8 text-[#555]">
                Every formula is created to bring comfort to your routine while supporting visible results. The goal is not to overload your shelf, but to offer essentials you will reach for again and again.
              </p>
              <Link href="/about" className="mt-6 inline-flex rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19]">Read our story</Link>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection id="bestsellers" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ff5722]">Bestsellers</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#333]">Loved by customers for everyday glow.</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-[#ff5722]">View all products</Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product, index) => (
            <PageSection key={product.id} delay={index * 80} className="transform-gpu will-change-transform">
              <ProductCard product={product} />
            </PageSection>
          ))}
        </div>
      </PageSection>

      <PageSection id="reviews" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-[24px] bg-[#fffefc] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ff5722]">Testimonials</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#333]">What real customers say.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <PageSection key={index} delay={80 + index * 80}>
                <blockquote className="rounded-[16px] border border-[#f2e7e2] bg-white p-6">
                  <p className="text-lg leading-8 text-[#555]">“{testimonial.quote}”</p>
                  <footer className="mt-4 text-sm font-semibold text-[#333]">{testimonial.author}</footer>
                </blockquote>
              </PageSection>
            ))}
          </div>
        </div>
      </PageSection>
    </div>
  );
}
