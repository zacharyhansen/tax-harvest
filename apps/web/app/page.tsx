import MediaProvider from '@repo/ui/providers/media-provider';
import { ThemeProvider } from '@repo/ui/providers/theme-provider';
import { Tractor } from 'lucide-react';
import Link from 'next/link';
import { AuthInfoOverlay } from './auth/components/AuthInfoOverlay';

export default function SignInPage() {
  return (
    <MediaProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="container grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col p-14 lg:flex">
            <Link href="/en">
              <div className="relative z-20 flex items-center text-lg font-medium text-white">
                <Tractor className="mr-2" />
                TaxHarvest.AI
              </div>
            </Link>
            <div className="absolute inset-0 m-8 rounded-3xl bg-[url('/images/coverImage.jpg')] bg-cover bg-center bg-no-repeat">
              <AuthInfoOverlay />
            </div>
          </div>
          <div className="flex justify-center lg:p-8">
            <div className="bg-primary group relative overflow-hidden rounded-xl transition-all hover:scale-105 hover:shadow-xl">
              <Link
                href="/auth/signup"
                className="bg-background relative flex flex-col items-center gap-4 rounded-xl px-8 py-6"
              >
                <div className="bg-primary/20 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
                <h3 className="text-primary text-2xl font-bold">
                  Join TaxHarvest.AI Today
                </h3>
                <p className="text-muted-foreground text-sm">
                  Start optimizing your tax strategy with AI
                </p>
                <button className="bg-primary text-primary-foreground mt-2 rounded-lg px-6 py-2 shadow-lg transition-all hover:shadow-xl">
                  Get Started →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </MediaProvider>
  );
}
