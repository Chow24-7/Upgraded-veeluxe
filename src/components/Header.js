'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useStore } from '@/context/StoreProvider';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/blog', label: 'Blog' },
  { href: '/#reviews', label: 'Reviews' },
  { href: '/#contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { hydrated, cartCount, wishlistCount } = useStore();
  const pendingHomeScrollRef = useRef(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const visibleCartCount = hydrated ? cartCount : 0;
  const visibleWishlistCount = hydrated ? wishlistCount : 0;

  useEffect(() => {
    if (pathname !== '/' || !pendingHomeScrollRef.current) return;

    pendingHomeScrollRef.current = false;
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [pathname]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMobileMenuOpen(false));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  // pulse animation when cart increases
  const [cartPulse, setCartPulse] = useState(false);
  const prevCartRef = useRef(null);
  const cartFlightActiveRef = useRef(false);
  const pulseTimeoutRef = useRef(null);
  const pulseCart = useCallback(() => {
    setCartPulse(false);
    window.requestAnimationFrame(() => setCartPulse(true));
    window.clearTimeout(pulseTimeoutRef.current);
    pulseTimeoutRef.current = window.setTimeout(() => setCartPulse(false), 350);
  }, []);

  useEffect(() => {
    const handleFlightStart = () => {
      cartFlightActiveRef.current = true;
    };
    const handleFlightArrived = () => {
      cartFlightActiveRef.current = false;
      pulseCart();
    };

    window.addEventListener('veeluxe:cart-flight-started', handleFlightStart);
    window.addEventListener('veeluxe:cart-flight-arrived', handleFlightArrived);
    return () => {
      window.removeEventListener('veeluxe:cart-flight-started', handleFlightStart);
      window.removeEventListener('veeluxe:cart-flight-arrived', handleFlightArrived);
      window.clearTimeout(pulseTimeoutRef.current);
    };
  }, [pulseCart]);

  useEffect(() => {
    if (!hydrated) return;
    const prev = prevCartRef.current;
    if (prev !== null && visibleCartCount > prev && !cartFlightActiveRef.current) {
      pulseCart();
    }
    prevCartRef.current = visibleCartCount;
  }, [hydrated, pulseCart, visibleCartCount]);

  const handleHomeClick = (event) => {
    event.preventDefault();

    if (pathname === '/') {
      window.history.replaceState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    pendingHomeScrollRef.current = true;
    router.push('/');
  };

  const handleReviewsClick = (event) => {
    event.preventDefault();

    if (pathname !== '/') {
      router.push('/#reviews');
      return;
    }

    window.history.pushState(null, '', '/#reviews');
    window.requestAnimationFrame(() => {
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleMobileNavClick = (item, event) => {
    setMobileMenuOpen(false);
    if (item.label === 'Home') handleHomeClick(event);
    if (item.label === 'Reviews') handleReviewsClick(event);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#f0e4df] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="overflow-hidden rounded-lg border border-transparent">
            <Image src="/images/logo.png" alt="Veeluxe logo" width={64} height={64} priority className="h-12 w-12 rounded-md sm:h-16 sm:w-16" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-[0.2em] text-[#333] uppercase sm:text-lg sm:tracking-[0.24em]">Veeluxe</p>
            <p className="hidden text-sm text-muted sm:block">Skincare essentials</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const itemPath = item.href.split('#')[0] || '/';
            const isActive = item.href.includes('#')
              ? false
              : itemPath === '/'
                ? pathname === '/'
                : pathname === itemPath || pathname.startsWith(`${itemPath}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={item.label === 'Home' ? handleHomeClick : item.label === 'Reviews' ? handleReviewsClick : undefined}
                className={`text-sm font-semibold transition ${
                  isActive ? 'text-[#ff5722]' : 'text-[#333] hover:text-[#ff5722]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f4dcd4] text-[#333] md:hidden"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
          <Link href="/wishlist" aria-label={`Wishlist${visibleWishlistCount > 0 ? `, ${visibleWishlistCount} saved items` : ''}`} className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#f4dcd4] text-[#333]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 20s-6.5-4.35-8.17-8.26A4.94 4.94 0 0 1 7.5 4.5a4.24 4.24 0 0 1 4.5 2.49A4.24 4.24 0 0 1 16.5 4.5a4.94 4.94 0 0 1 3.67 7.24C18.5 15.65 12 20 12 20Z" />
            </svg>
            {visibleWishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5722] text-[10px] font-semibold text-white">
                {visibleWishlistCount}
              </span>
            )}
          </Link>
          <Link id="cart-icon" href="/cart" aria-label={`Cart${visibleCartCount > 0 ? `, ${visibleCartCount} items` : ''}`} className={`relative flex h-11 w-11 items-center justify-center rounded-full border border-[#f4dcd4] text-[#333] ${cartPulse ? 'cart-pulse' : ''}`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M3 4h2l2.4 8.2a1 1 0 0 0 1 .8h8.5a1 1 0 0 0 1-.8L17 7H7" />
            </svg>
            {visibleCartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5722] text-[10px] font-semibold text-white">
                {visibleCartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      {mobileMenuOpen && (
        <nav className="border-t border-[#f0e4df] bg-white px-4 py-3 md:hidden" aria-label="Mobile navigation">
          <div className="mx-auto max-w-7xl space-y-1">
            {navItems.map((item) => {
              const itemPath = item.href.split('#')[0] || '/';
              const isActive = item.href.includes('#')
                ? false
                : itemPath === '/'
                  ? pathname === '/'
                  : pathname === itemPath || pathname.startsWith(`${itemPath}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(event) => handleMobileNavClick(item, event)}
                  className={`block rounded-lg px-3 py-3 text-base font-semibold transition ${
                    isActive ? 'bg-[#fff5f0] text-[#ff5722]' : 'text-[#333] hover:bg-[#fff5f0] hover:text-[#ff5722]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
