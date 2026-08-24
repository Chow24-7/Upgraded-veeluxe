"use client";

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreProvider';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlistItems } = useStore();
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.label || '');
  const [toastVisible, setToastVisible] = useState(false);
  const isSaved = wishlistItems.some((item) => item.id === product.id);
  const selectedOption = product.sizes?.find((size) => size.label === selectedSize);
  const selectedPrice = selectedOption?.price || product.price;

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const cartProduct = { ...product, price: selectedPrice, ...(selectedSize ? { selectedSize } : {}) };
    addToCart(cartProduct);
    setAdded(true);
    setToastVisible(true);
    setTimeout(() => setAdded(false), 700);
    setTimeout(() => setToastVisible(false), 4200);

    const sourceImage = event.currentTarget.closest('article')?.querySelector('img');
    const cartIcon = document.getElementById('cart-icon');
    if (sourceImage && cartIcon) {
      const sourceRect = sourceImage.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
      const flyingImage = sourceImage.cloneNode(true);
      flyingImage.className = 'cart-flight-image';
      flyingImage.style.left = `${sourceRect.left + sourceRect.width / 2 - 28}px`;
      flyingImage.style.top = `${sourceRect.top + sourceRect.height / 2 - 28}px`;
      flyingImage.style.setProperty('--cart-x', `${cartRect.left + cartRect.width / 2 - (sourceRect.left + sourceRect.width / 2)}px`);
      flyingImage.style.setProperty('--cart-y', `${cartRect.top + cartRect.height / 2 - (sourceRect.top + sourceRect.height / 2)}px`);
      document.body.appendChild(flyingImage);
      window.setTimeout(() => flyingImage.remove(), 560);
    }
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
            {product.sizes ? (
              <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#666]">
                Size
                <select value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)} className="rounded-md border border-[#e2d8d3] px-2 py-1 text-xs font-normal text-[#333]">
                  {product.sizes.map((size) => <option key={size.label} value={size.label}>{size.label}</option>)}
                </select>
              </label>
            ) : null}
            <p className="mt-3 text-lg font-semibold text-[#ff5722]">₦{selectedPrice.toLocaleString()}</p>
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
      {toastVisible && (
        <div className="fixed bottom-5 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-4 rounded-xl border border-[#f2e7e2] bg-white px-4 py-3 text-sm shadow-[0_12px_32px_rgba(0,0,0,0.15)]">
          <span className="font-semibold text-[#333]">Added to cart</span>
          <Link href="/cart" className="shrink-0 rounded-full bg-[#ff5722] px-4 py-2 font-semibold text-white transition hover:bg-[#e64a19]">Proceed to checkout?</Link>
        </div>
      )}
    </article>
  );
}
