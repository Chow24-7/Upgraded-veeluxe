'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function HomeHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/' || window.location.hash !== '#reviews') return undefined;

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
