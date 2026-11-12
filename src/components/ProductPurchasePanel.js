'use client';

import { useState } from 'react';
import ProductPurchaseActions from '@/components/ProductPurchaseActions';

export default function ProductPurchasePanel({ product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.label || '');
  const [quantity, setQuantity] = useState(1);
  const selectedOption = product.sizes?.find((size) => size.label === selectedSize);
  const selectedPrice = selectedOption?.price || product.price;

  return (
    <div className="mt-6">
      {product.sizes ? (
        <label className="flex items-center gap-3 text-sm font-semibold text-[#555]">
          Size
          <select
            value={selectedSize}
            onChange={(event) => setSelectedSize(event.target.value)}
            className="rounded-md border border-[#e2d8d3] bg-white px-3 py-2 text-sm font-normal text-[#333]"
          >
            {product.sizes.map((size) => (
              <option key={size.label} value={size.label}>{size.label}</option>
            ))}
          </select>
        </label>
      ) : null}

      <p className="mt-6 text-2xl font-bold text-[#ff5722]">₦{selectedPrice.toLocaleString()}</p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-lg border border-[#e2d8d3]" aria-label="Quantity">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="flex h-11 w-11 items-center justify-center text-lg text-[#333]"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="min-w-10 text-center text-sm font-semibold text-[#333]" aria-live="polite">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            className="flex h-11 w-11 items-center justify-center text-lg text-[#333]"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <ProductPurchaseActions
          product={product}
          selectedSize={selectedSize}
          price={selectedPrice}
          quantity={quantity}
          layoutClassName="flex items-center gap-4"
          wishlistClassName="flex h-11 w-11 items-center justify-center rounded-full text-[#ff5722] text-2xl leading-none"
          buttonClassName="min-h-11 rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19]"
          animateFromProductImage={false}
        />
      </div>
    </div>
  );
}