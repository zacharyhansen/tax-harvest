import '@repo/ui/tailwind.css';
import { ClerkProvider } from '@clerk/nextjs';
import { cn } from '@repo/ui/utils';
import { Inter } from 'next/font/google';

const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
});

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
        <ClerkProvider
          afterSignOutUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
          signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
          signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
