'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePaystackPayment } from 'react-paystack';
import { useStore } from '@/context/StoreProvider';

export default function CheckoutClient() {
  const router = useRouter();
  const { cartItems, clearCart } = useStore();
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const amountKobo = subtotal * 100;
  const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || '';

  const config = useMemo(
    () => ({
      email: form.email,
      amount: amountKobo,
      publicKey: paystackPublicKey,
      currency: 'NGN',
      metadata: {
        name: form.name,
        address: form.address,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          selectedSize: item.selectedSize || null,
        })),
      },
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
    }),
    [amountKobo, cartItems, form.address, form.email, form.name, paystackPublicKey]
  );

  const initializePayment = usePaystackPayment(config);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPaymentError('');

    if (form.name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || form.address.trim().length < 5) {
      setPaymentError('Please complete your name, email, and shipping address before paying.');
      return;
    }

    if (cartItems.length === 0) {
      setPaymentError('Your cart is empty. Add a product before checking out.');
      return;
    }

    if (!paystackPublicKey) {
      setPaymentError('Paystack is not configured yet. Add NEXT_PUBLIC_PAYSTACK_KEY to your local environment file to enable payments.');
      return;
    }

    setIsProcessing(true);
    const paymentConfig = {
      ...config,
      reference: `veeluxe-${Date.now()}-${globalThis.crypto.randomUUID()}`,
    };

    const onSuccess = async (response) => {
      const reference = response?.reference;
      if (!reference) {
        setPaymentError('Paystack did not return a payment reference. Your cart has not been cleared.');
        setIsProcessing(false);
        return;
      }

      try {
        const verificationResponse = await fetch('/api/paystack/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference }),
        });
        const payload = await verificationResponse.json().catch(() => ({}));
        if (!verificationResponse.ok) {
          throw new Error(payload.error || 'The payment could not be verified yet.');
        }

        clearCart();
        router.replace(`/order-success?ref=${encodeURIComponent(reference)}`);
      } catch (error) {
        setPaymentError(`We could not verify payment ${reference}. ${error.message} Your cart has not been cleared. Please keep this reference and try again later.`);
        setIsProcessing(false);
      }
    };

    const onClose = () => {
      setIsProcessing(false);
      setPaymentError('Payment was cancelled or closed before completion.');
    };

    initializePayment({ config: paymentConfig, onSuccess, onClose });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[24px] border border-[#f2e7e2] bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">Checkout</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#333]">Complete your order</h1>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block text-sm font-medium text-[#555]">
              Full name
              <input autoComplete="name" className="mt-1 w-full rounded-lg border border-[#e2d8d3] px-4 py-3" placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required minLength={2} />
            </label>
            <label className="block text-sm font-medium text-[#555]">
              Email address
              <input autoComplete="email" className="mt-1 w-full rounded-lg border border-[#e2d8d3] px-4 py-3" placeholder="Email address" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </label>
            <label className="block text-sm font-medium text-[#555]">
              Shipping address
              <input autoComplete="street-address" className="mt-1 w-full rounded-lg border border-[#e2d8d3] px-4 py-3" placeholder="Shipping address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} required minLength={5} />
            </label>
            <button type="submit" className="w-full rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19] disabled:cursor-not-allowed disabled:opacity-70" disabled={isProcessing}>
              {isProcessing ? 'Preparing payment...' : 'Pay now with Paystack'}
            </button>
            <p className="text-center text-sm leading-6 text-[#666]">
              By paying you agree to our{' '}
              <a href="/terms" className="font-semibold text-[#ff5722] underline underline-offset-2">Terms</a>
              {' '}and{' '}
              <a href="/shipping-returns" className="font-semibold text-[#ff5722] underline underline-offset-2">Shipping &amp; Returns</a>
              {' '}policy.
            </p>
            {paymentError ? <p role="alert" className="text-sm text-[#b94a48]">{paymentError}</p> : null}
          </form>
        </div>

        <aside className="rounded-[24px] border border-[#f2e7e2] bg-[#fffaf8] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <h2 className="text-xl font-semibold text-[#333]">Order summary</h2>
          <div className="mt-6 space-y-3 text-sm text-[#666]">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-[#f2e7e2] pt-4 text-lg font-semibold text-[#333]">
            <div className="flex items-center justify-between"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
            <div className="mt-2 flex items-center justify-between text-sm text-[#666]">
              <span>Paystack amount</span>
              <span>₦{(amountKobo / 100).toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
