import ProductCard from '@/components/ProductCard';
import PageSection from '../_components/PageSection';
import { products } from '@/data/products';

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <PageSection className="text-center">
        <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">Products</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#333] sm:text-4xl">Discover essentials for a simple, luminous routine.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#555]">
          Each formula is designed to hydrate, brighten, and support your skin with calm confidence.
        </p>
      </PageSection>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => (
          <PageSection key={product.id} delay={index * 60} className="transform-gpu will-change-transform">
            <ProductCard product={product} />
          </PageSection>
        ))}
      </div>
    </div>
  );
}
