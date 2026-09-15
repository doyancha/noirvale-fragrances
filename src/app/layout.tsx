import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { siteConfig } from '@/lib/config';
import { HeaderStack } from '@/components/layout/HeaderStack';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { getBusinessSettings } from '@/lib/business/server';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.seo.defaultTitle,
    template: `%s | ${siteConfig.brand.displayName}`,
  },
  description: siteConfig.seo.defaultDescription,
  ...(siteConfig.seo.siteUrl
    ? {
        metadataBase: new URL(siteConfig.seo.siteUrl),
        alternates: {
          canonical: '/',
        },
        openGraph: {
          title: siteConfig.seo.defaultTitle,
          description: siteConfig.seo.defaultDescription,
          url: siteConfig.seo.siteUrl,
          siteName: siteConfig.brand.displayName,
          locale: 'en_US',
          type: 'website',
          images: [
            {
              url: siteConfig.seo.ogImage,
              width: 1200,
              height: 800,
              alt: siteConfig.brand.displayName,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: siteConfig.seo.defaultTitle,
          description: siteConfig.seo.defaultDescription,
          images: [siteConfig.seo.ogImage],
        },
      }
    : {}),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getBusinessSettings();
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen overflow-x-hidden bg-noir-950 text-ivory antialiased">
        <HeaderStack settings={settings} />
        {children}
        <Footer settings={settings} />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
