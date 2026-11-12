"use client";

import Image from 'next/image';
import { useState } from 'react';
import ProductPurchaseActions from '@/components/ProductPurchaseActions';

export default function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.label || '');
  const selectedOption = product.sizes?.find((size) => size.label === selectedSize);
  const selectedPrice = selectedOption?.price || product.price;

  return (
    <article data-product-card={product.id} className="relative z-10 flex h-full flex-col overflow-hidden rounded-[12px] border border-[#f2e7e2] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] product-card-hover transition-transform duration-300">
      <div className="relative h-64 overflow-hidden">
        <Image src={product.image} alt={`${product.name} skincare product`} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
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
            <ProductPurchaseActions
              product={product}
              selectedSize={selectedSize}
              price={selectedPrice}
              wishlistClassName="relative z-20 pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full text-[#ff5722] text-lg leading-none"
              buttonClassName="relative z-20 pointer-events-auto min-h-11 rounded-full bg-[#ff5722] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#e64a19]"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
