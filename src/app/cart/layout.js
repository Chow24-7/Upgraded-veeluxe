import { canonicalMetadata } from '@/lib/seo';

export const metadata = canonicalMetadata('/cart', {
  title: 'Your cart | Veeluxe',
  robots: { index: false, follow: false },
});

export default function CartLayout({ children }) {
  return children;
}