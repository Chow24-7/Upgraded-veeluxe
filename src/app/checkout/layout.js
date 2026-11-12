import { canonicalMetadata } from '@/lib/seo';

export const metadata = canonicalMetadata('/checkout', {
  title: 'Checkout | Veeluxe',
  robots: { index: false, follow: false },
});

export default function CheckoutLayout({ children }) {
  return children;
}