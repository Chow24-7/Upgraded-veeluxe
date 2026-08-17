'use client';

import RevealOnScroll from '@/components/RevealOnScroll';

export default function PageSection({ children, className = '', delay = 0, ...props }) {
  return (
    <RevealOnScroll className={`transition-all duration-600 ease-out ${className}`} delay={delay} {...props}>
      {children}
    </RevealOnScroll>
  );
}
