import { ThemeProvider } from '@repo/ui/providers/theme-provider';
import MediaProvider from '@repo/ui/providers/media-provider';
import { Waypoints } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <MediaProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="container grid h-[100vh] flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col p-14 lg:flex">
            <Link href="/en">
              <div className="text-primary-foreground relative z-20 flex items-center text-lg font-medium">
                <Waypoints className="mr-2" />
                Riska.ai
              </div>
            </Link>
            <div className="absolute inset-0 m-8 rounded-3xl bg-[url('/images/low-poly.jpg')] bg-cover bg-center bg-no-repeat" />
          </div>
          <div className="flex justify-center lg:p-8">{children}</div>
        </div>
      </ThemeProvider>
    </MediaProvider>
  );
}
