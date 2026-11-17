import './globals.css';
import { StoreProvider } from '@/context/StoreProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, SITE_URL } from '@/lib/seo';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
});

// Note: removed `next/font/google` import to avoid build-time network fetch
// in restricted environments. The app falls back to the CSS variable --font-sans
// (defined in globals.css) or system fonts.

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Veeluxe | Skincare essentials',
  description: 'Discover thoughtful skincare essentials from Veeluxe with a modern, calm, and elevated ritual.',
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({ children }) {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: 'Veeluxe',
    url: absoluteUrl('/'),
    logo: absoluteUrl('/images/logo.png'),
    sameAs: [
      'https://www.instagram.com/__veeluxe?igsh=eTBpeG0zaTZ4YWlk&utm_source=qr',
      'https://wa.me/2347014888211',
      'https://www.tiktok.com/@__veeluxe?_t=ZM-8xfc4k64Snu&_r=1',
      'https://snapchat.com/t/hFkBoZFz',
    ],
  };

  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className={`${inter.variable} min-h-full bg-[#fef8f7] text-[#333]`}>
        <JsonLd data={organizationData} />
        <StoreProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ScrollToTop />
        </StoreProvider>
      </body>
    </html>
  );
}
