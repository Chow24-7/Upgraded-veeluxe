import { canonicalMetadata } from '@/lib/seo';

export const metadata = canonicalMetadata('/wishlist', {
  title: 'Your wishlist | Veeluxe',
  robots: { index: false, follow: false },
});

export default function WishlistLayout({ children }) {
  return children;
}