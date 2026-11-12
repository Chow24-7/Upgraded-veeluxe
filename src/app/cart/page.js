'use client';

import Link from 'next/link';
import { useStore } from '@/context/StoreProvider';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartCount } = useStore();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">Cart</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#333]">Your curated essentials</h1>
        </div>
        <p className="text-sm text-[#666]">{cartCount} item{cartCount === 1 ? '' : 's'}</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="mt-10 rounded-[24px] border border-[#f2e7e2] bg-white p-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <p className="text-lg text-[#555]">Your cart is empty right now.</p>
          <Link href="/products" className="mt-6 inline-flex rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19]">Browse products</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.cartKey || item.id} className="flex flex-col gap-4 rounded-[18px] border border-[#f2e7e2] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#333]">{item.name}</h2>
                  <p className="mt-1 text-sm text-muted">{item.selectedSize ? `${item.selectedSize} · ` : ''}₦{item.price.toLocaleString()} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-[#e2d8d3]">
                    <button type="button" onClick={() => updateQuantity(item.cartKey || item.id, item.quantity - 1)} className="flex h-11 w-11 items-center justify-center text-lg text-[#333]" aria-label={`Decrease ${item.name} quantity`}>-</button>
                    <span className="min-w-8 text-center text-sm font-semibold text-[#333]">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.cartKey || item.id, item.quantity + 1)} className="flex h-11 w-11 items-center justify-center text-lg text-[#333]" aria-label={`Increase ${item.name} quantity`}>+</button>
                  </div>
                  <button type="button" onClick={() => removeFromCart(item.cartKey || item.id)} className="min-h-11 px-2 text-sm font-semibold text-[#ff5722]">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-[24px] border border-[#f2e7e2] bg-[#fff] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <h2 className="text-xl font-semibold text-[#333]">Summary</h2>
            <div className="mt-6 space-y-3 text-sm text-[#666]">
              <div className="flex justify-between"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>Calculated at checkout</span></div>
            </div>
            <Link href="/checkout" className="mt-8 inline-flex w-full justify-center rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19]">Proceed to checkout</Link>
            <button type="button" onClick={clearCart} className="mt-3 w-full rounded-full border border-[#f2e7e2] px-6 py-3 text-sm font-semibold text-[#333] transition hover:bg-[#fff5f0]">Clear cart</button>
          </aside>
        </div>
      )}
    </div>
  );
}
