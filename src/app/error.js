'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error('Application route error:', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center lg:px-8 lg:py-28">
      <div className="w-full rounded-[24px] border border-[#f2e7e2] bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:p-10">
        <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#333] sm:text-4xl">We could not load this page.</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-[#555]">Please try again, or continue to the home page or our products.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => reset()} className="inline-flex min-h-11 items-center rounded-full bg-[#ff5722] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e64a19]">Try again</button>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full border border-[#ff5722] px-6 py-3 text-sm font-semibold text-[#ff5722] transition hover:bg-[#fff5f0]">Back to home</Link>
          <Link href="/products" className="inline-flex min-h-11 items-center rounded-full border border-[#f2e7e2] px-6 py-3 text-sm font-semibold text-[#333] transition hover:bg-[#fff5f0]">Browse products</Link>
        </div>
      </div>
    </div>
  );
}