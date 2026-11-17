'use client';

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Image from 'next/image';
import { useStore } from '@/context/StoreProvider';

export default function WishlistPage() {
  const { hydrated, wishlistItems, wishlistCount, removeFromWishlist, addToCart } = useStore();
  const visibleWishlistItems = hydrated ? wishlistItems : [];
  const visibleWishlistCount = hydrated ? wishlistCount : 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">Wishlist</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#333]">Saved for later</h1>
        </div>
        <p className="text-sm text-[#666]">{visibleWishlistCount} saved item{visibleWishlistCount === 1 ? '' : 's'}</p>
      </div>

      {!hydrated ? (
        <div className="mt-10 rounded-[24px] border border-[#f2e7e2] bg-white p-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <p className="text-lg text-[#555]">Loading your wishlist...</p>
        </div>
      ) : visibleWishlistItems.length === 0 ? (
        <div className="mt-10 rounded-[24px] border border-[#f2e7e2] bg-white p-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <p className="text-lg text-[#555]">You have not saved any products yet.</p>
          <Link href="/products" className="mt-6 inline-flex rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19]">Explore products</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleWishlistItems.map((product) => (
            <div key={product.id} className="flex flex-col overflow-hidden rounded-[12px] border border-[#f2e7e2] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <div className="relative h-48 w-full overflow-hidden rounded-md">
                <Image src={product.image} alt={`${product.name} skincare product`} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
              </div>
              <div className="mt-3 flex flex-1 items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[#333]">{product.name}</h3>
                  <p className="mt-1 text-sm text-muted">₦{product.price.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => addToCart(product)} className="min-h-11 rounded-lg bg-[#ff5722] px-3 py-2 text-sm font-semibold text-white">Add to cart</button>
                  <button onClick={() => removeFromWishlist(product.id)} className="min-h-11 px-2 text-sm text-[#b94a48]">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
