import './globals.css';
import { StoreProvider } from '@/context/StoreProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

// Note: removed `next/font/google` import to avoid build-time network fetch
// in restricted environments. The app falls back to the CSS variable --font-sans
// (defined in globals.css) or system fonts.

export const metadata = {
  title: 'Veeluxe | Skincare essentials',
  description: 'Discover thoughtful skincare essentials from Veeluxe with a modern, calm, and elevated ritual.',
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#fef8f7] text-[#333]">
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
