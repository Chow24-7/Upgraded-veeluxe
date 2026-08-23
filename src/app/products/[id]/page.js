import Image from 'next/image';
import Link from 'next/link';
import PageSection from '../../_components/PageSection';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export async function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

export default function ProductPage({ params }) {
  const id = Number(params.id);
  const product = products.find((p) => p.id === id);
  if (!product) return <div className="p-8">Product not found</div>;

  const related = products.filter((p) => p.id !== id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <PageSection>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="overflow-hidden rounded-[18px] border border-[#f2e7e2] bg-white p-6">
            <div className="relative h-96 w-full overflow-hidden rounded-md">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>
          </div>
          <div>
            <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">Product</p>
            <h1 className="mt-3 text-4xl font-semibold text-[#333]">{product.name}</h1>
            <p className="mt-4 text-lg text-muted">{product.description}</p>
            <p className="mt-6 text-2xl font-bold text-[#ff5722]">₦{product.price.toLocaleString()}</p>
            <div className="mt-6 flex gap-4">
              <Link href="/products" className="rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white">Back to products</Link>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection className="mt-16">
        <h2 className="text-2xl font-semibold text-[#333]">You may also like</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </PageSection>
    </div>
  );
}
