import '@repo/ui/tailwind.css';
import { GeistSans } from 'geist/font/sans';
import { ClerkProvider } from '@clerk/nextjs';
import { cn } from '@repo/ui/utils';

export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(GeistSans.className, 'max-h-screen overflow-y-hidden')}
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
