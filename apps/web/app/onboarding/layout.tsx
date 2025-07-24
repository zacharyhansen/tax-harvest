'use client';

import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  ClerkProvider,
} from '@clerk/nextjs';
import { Toaster } from '@repo/ui/components/sonner';
import MediaProvider from '@repo/ui/providers/media-provider';
import { ThemeProvider } from '@repo/ui/providers/theme-provider';
import { PortfolioProvider } from '~/modules/portfolio';
import ApolloProviderWrapper from '../main/ApolloProviderWrapper';
import { UserProvider } from '../main/user.provider';
import { ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';
import NextTopLoader from 'nextjs-toploader';

// Ag grid register
ModuleRegistry.registerModules([AllCommunityModule]);

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <NextTopLoader color="#faa700" showSpinner={true} />
      <ApolloProviderWrapper>
        <SignedIn>
          <MediaProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <UserProvider>
                <PortfolioProvider>
                  <div className="bg-background/50 min-h-screen backdrop-blur-sm">
                    <div className="flex min-h-screen items-center justify-center p-4">
                      {children}
                    </div>
                  </div>
                  <Toaster />
                </PortfolioProvider>
              </UserProvider>
            </ThemeProvider>
          </MediaProvider>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ApolloProviderWrapper>
    </ClerkProvider>
  );
}
