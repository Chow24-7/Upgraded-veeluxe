"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useStore } from '@/context/StoreProvider';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlistItems } = useStore();
  const [added, setAdded] = useState(false);
  const isSaved = wishlistItems.some((item) => item.id === product.id);

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 700);
  };

  return (
    <article className="relative z-10 flex h-full flex-col overflow-hidden rounded-[12px] border border-[#f2e7e2] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] product-card-hover transition-transform duration-300">
      <div className="relative h-64 overflow-hidden">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#333]">{product.name}</h3>
            <p className="mt-1 text-sm text-muted">{product.description}</p>
            <p className="mt-3 text-lg font-semibold text-[#ff5722]">₦{product.price.toLocaleString()}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={handleWishlist}
              className="relative z-20 pointer-events-auto text-[#ff5722] text-lg leading-none"
              aria-pressed={isSaved}
              aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isSaved ? '♥' : '♡'}
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`relative z-20 pointer-events-auto rounded-full bg-[#ff5722] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#e64a19] ${added ? 'btn-added' : ''}`}
            >
              {added ? 'Added' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
