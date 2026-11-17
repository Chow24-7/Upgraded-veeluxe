'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/context/StoreProvider';

export default function ProductPurchaseActions({
  product,
  price,
  selectedSize,
  quantity = 1,
  layoutClassName = 'flex flex-col items-end gap-2',
  wishlistClassName = 'text-[#ff5722] text-lg leading-none',
  buttonClassName = 'rounded-full bg-[#ff5722] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#e64a19]',
  animateFromProductImage = true,
}) {
  const { addToCart, toggleWishlist, wishlistItems, hydrated } = useStore();
  const [added, setAdded] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const isSaved = hydrated && wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    const cartProduct = { ...product, price, ...(selectedSize ? { selectedSize } : {}) };
    addToCart(cartProduct, quantity);
    setAdded(true);
    setToastVisible(true);
    window.setTimeout(() => setAdded(false), 700);
    window.setTimeout(() => setToastVisible(false), 4200);

    if (!animateFromProductImage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sourceImage = document.querySelector(`[data-product-card="${product.id}"] img`);
    const cartIcon = document.getElementById('cart-icon');
    if (sourceImage && cartIcon) {
      document.querySelectorAll('.cart-flight-image').forEach((image) => image.remove());
      const sourceRect = sourceImage.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
      const flyingImage = sourceImage.cloneNode(true);
      flyingImage.removeAttribute('style');
      flyingImage.className = 'cart-flight-image';
      flyingImage.style.left = `${sourceRect.left + sourceRect.width / 2 - 28}px`;
      flyingImage.style.top = `${sourceRect.top + sourceRect.height / 2 - 28}px`;
      flyingImage.style.setProperty('--cart-x', `${cartRect.left + cartRect.width / 2 - (sourceRect.left + sourceRect.width / 2)}px`);
      flyingImage.style.setProperty('--cart-y', `${cartRect.top + cartRect.height / 2 - (sourceRect.top + sourceRect.height / 2)}px`);
      const finishFlight = () => {
        if (!flyingImage.isConnected) return;
        window.clearTimeout(flightCleanupTimeout);
        flyingImage.remove();
        window.dispatchEvent(new CustomEvent('veeluxe:cart-flight-arrived'));
      };
      const flightCleanupTimeout = window.setTimeout(finishFlight, 900);
      flyingImage.addEventListener('animationend', finishFlight, { once: true });
      document.body.appendChild(flyingImage);
      window.dispatchEvent(new CustomEvent('veeluxe:cart-flight-started'));
    }
  };

  return (
    <>
      <div className={layoutClassName}>
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={wishlistClassName}
          aria-pressed={isSaved}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isSaved ? '♥' : '♡'}
        </button>
        <button
          type="button"
          onClick={handleAddToCart}
          className={`${buttonClassName} ${added ? 'btn-added' : ''}`}
        >
          {added ? 'Added' : 'Add to Cart'}
        </button>
      </div>
      {toastVisible ? (
        <div className="fixed bottom-5 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-4 rounded-xl border border-[#f2e7e2] bg-white px-4 py-3 text-sm shadow-[0_12px_32px_rgba(0,0,0,0.15)]">
          <span className="font-semibold text-[#333]">Added to cart</span>
          <Link href="/cart" className="shrink-0 rounded-full bg-[#ff5722] px-4 py-2 font-semibold text-white transition hover:bg-[#e64a19]">Proceed to checkout?</Link>
        </div>
      ) : null}
    </>
  );
}