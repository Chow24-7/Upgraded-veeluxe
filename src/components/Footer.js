'use client';

import Link from 'next/link';
import { useState } from 'react';

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/__veeluxe?igsh=eTBpeG0zaTZ4YWlk&utm_source=qr' },
  { label: 'WhatsApp', href: 'https://wa.me/2347014888211' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@__veeluxe?_t=ZM-8xfc4k64Snu&_r=1' },
  { label: 'Snapchat', href: 'https://snapchat.com/t/hFkBoZFz' },
];

export default function Footer() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '', website: '' });
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setFeedback('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to send message');

      setStatus('success');
      setFeedback(payload.message);
      setFormState({ name: '', email: '', message: '', website: '' });
    } catch (error) {
      setStatus('error');
      setFeedback(error.message);
    }
  };

  return (
    <footer id="contact" className="bg-[#222] py-16 text-[#d3d3d3]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <div>
          <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">Veeluxe</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Modern skincare, made to feel calm and elevated.</h3>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#c7c7c7]">
            Discover glow-first essentials that bring comfort, ritual, and visible results to your daily routine.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white">Quick links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about" className="inline-flex min-h-11 items-center transition hover:text-[#ff5722]">About</Link></li>
            <li><Link href="/products" className="inline-flex min-h-11 items-center transition hover:text-[#ff5722]">Products</Link></li>
            <li><Link href="/blog" className="inline-flex min-h-11 items-center transition hover:text-[#ff5722]">Blog</Link></li>
            <li><Link href="/cart" className="inline-flex min-h-11 items-center transition hover:text-[#ff5722]">Cart</Link></li>
            <li><Link href="/wishlist" className="inline-flex min-h-11 items-center transition hover:text-[#ff5722]">Wishlist</Link></li>
            <li><Link href="/privacy" className="inline-flex min-h-11 items-center transition hover:text-[#ff5722]">Privacy Policy</Link></li>
            <li><Link href="/terms" className="inline-flex min-h-11 items-center transition hover:text-[#ff5722]">Terms and Conditions</Link></li>
            <li><Link href="/shipping-returns" className="inline-flex min-h-11 items-center transition hover:text-[#ff5722]">Shipping and Returns</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white">Stay connected</h4>
          <div className="mt-4 flex flex-wrap gap-3">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-[#3f3f3f] px-3 py-2 text-sm transition hover:border-[#ff5722] hover:text-[#ff5722]">
                {social.label}
              </a>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <input
              type="text"
              name="website"
              value={formState.website}
              onChange={(event) => setFormState((current) => ({ ...current, website: event.target.value }))}
              className="absolute -left-[9999px] h-px w-px overflow-hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <label className="sr-only" htmlFor="contact-name">Name</label>
            <input id="contact-name" autoComplete="name" className="w-full rounded-lg border border-[#3f3f3f] bg-[#2b2b2b] px-3 py-3 text-sm text-white outline-none focus:border-[#ff5722]" placeholder="Name" value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} required minLength={2} maxLength={100} />
            <label className="sr-only" htmlFor="contact-email">Email</label>
            <input id="contact-email" autoComplete="email" className="w-full rounded-lg border border-[#3f3f3f] bg-[#2b2b2b] px-3 py-3 text-sm text-white outline-none focus:border-[#ff5722]" placeholder="Email" type="email" value={formState.email} onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))} required maxLength={254} />
            <label className="sr-only" htmlFor="contact-message">Message</label>
            <textarea id="contact-message" className="min-h-24 w-full rounded-lg border border-[#3f3f3f] bg-[#2b2b2b] px-3 py-2 text-sm text-white outline-none focus:border-[#ff5722]" placeholder="Message" value={formState.message} onChange={(event) => setFormState((current) => ({ ...current, message: event.target.value }))} required minLength={5} maxLength={5000} />
            <button type="submit" className="min-h-11 w-full rounded-lg bg-[#ff5722] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19]" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Send message'}
            </button>
            {feedback ? <p role={status === 'error' ? 'alert' : 'status'} className={`text-sm ${status === 'error' ? 'text-[#f2b1a7]' : 'text-[#f4e8c2]'}`}>{feedback}</p> : null}
          </form>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-6 pt-6 text-center text-sm text-[#9b9b9b] lg:px-8">
        © 2026 Veeluxe. All rights reserved.
      </div>
    </footer>
  );
}
