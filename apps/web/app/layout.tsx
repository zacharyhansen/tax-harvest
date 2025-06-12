import { ClerkLoaded, ClerkProvider } from '@clerk/nextjs';
import { cn } from '@repo/ui/utils';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Tax Harvest.AI',
    template: '%s | Tax Harvest.AI',
  },
  description:
    'Optimize your investment portfolio with ai native tax-loss harvesting strategies',
  keywords: [
    'tax-loss harvesting',
    'investment optimization',
    'portfolio management',
    'tax strategy',
    'ai financial advisor',
    'ai tax advisor',
    'ai portfolio management',
  ],
  authors: [{ name: 'Tax Harvest Team' }],
  creator: 'Tax Harvest',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Tax Harvest',
    description:
      'Optimize your investment portfolio with ai native tax-loss harvesting strategies',
    siteName: 'Tax Harvest',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tax Harvest.AI - AI-Powered Tax Loss Harvesting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tax Harvest',
    description:
      'Optimize your investment portfolio with ai native tax-loss harvesting strategies',
    images: [
      {
        url: '/twitter-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tax Harvest.AI - AI-Powered Tax Loss Harvesting',
      },
    ],
  },
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

export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(inter.className, 'max-h-screen overflow-y-hidden')}
      suppressHydrationWarning={true}
    >
      <body>
        <NextTopLoader color="#faa700" showSpinner={false} />

        <ClerkProvider
          afterSignOutUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
          signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
          signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
        >
          <ClerkLoaded>{children}</ClerkLoaded>
        </ClerkProvider>
      </body>
    </html>
  );
}
