import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageSection from '../../_components/PageSection';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import ProductPurchasePanel from '@/components/ProductPurchasePanel';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, canonicalMetadata, createBreadcrumbData } from '@/lib/seo';

export async function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = products.find((item) => String(item.id) === id);

  if (!product) notFound();

  return canonicalMetadata(`/products/${id}`, {
    title: `${product.name} | Veeluxe`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Veeluxe`,
      description: product.description,
      images: [{ url: product.image, alt: product.name }],
    },
  });
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = products.find((item) => String(item.id) === id);
  if (!product) notFound();

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: [absoluteUrl(product.image)],
        sku: String(product.id),
        brand: { '@type': 'Organization', name: 'Veeluxe' },
        offers: (product.sizes?.length ? product.sizes : [{ label: null, price: product.price }]).map((size) => ({
          '@type': 'Offer',
          name: size.label ? `${product.name} ${size.label}` : product.name,
          url: absoluteUrl(`/products/${product.id}`),
          priceCurrency: 'NGN',
          price: size.price,
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
        })),
      }} />
      <JsonLd data={createBreadcrumbData([
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: product.name, path: `/products/${product.id}` },
      ])} />
      <PageSection>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="overflow-hidden rounded-[18px] border border-[#f2e7e2] bg-white p-6">
            <div className="relative h-96 w-full overflow-hidden rounded-md">
              <Image src={product.image} alt={`${product.name} skincare product`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>
          <div>
            <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">Product</p>
            <h1 className="mt-3 text-4xl font-semibold text-[#333]">{product.name}</h1>
            <p className="mt-4 text-lg text-muted">{product.description}</p>
            <ProductPurchasePanel key={product.id} product={product} />
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
