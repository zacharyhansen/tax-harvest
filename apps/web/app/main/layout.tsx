'use client';

import {
  ClerkLoaded,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useAuth,
  UserButton,
} from '@clerk/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import MediaProvider from '@repo/ui/providers/media-provider';
import { ThemeProvider } from '@repo/ui/providers/theme-provider';
import { Toaster } from '@repo/ui/components/sonner';
import { Dashboard } from '@repo/ui/layouts/dashboard';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/ui/components/breadcrumb';
import { httpBatchLink, httpLink } from '@trpc/client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import ThemeButton from './theme-button';
import { NavTree } from './nav-tree';
import { UserProvider } from './user.provider';
import { ViewContextProvider } from './view-context.provider';

import { trpc } from '~/lib/trpc';
import { clientEnvironment } from '~/lib/env/clientEnvironment';
import { useBreadcrumbs } from '~/modules/hooks/use-breadcrumbs';
import { PlaidConnectButton } from '~/modules/plaid';
import { PortfolioProvider, PortfolioSwitcher } from '~/modules/portfolio';

const queryClient = new QueryClient();

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkLoaded>
      <SignedIn>
        <MediaProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TrpcApp>{children}</TrpcApp>
          </ThemeProvider>
        </MediaProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkLoaded>
  );
}

const TrpcApp = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const breadcrumbs = useBreadcrumbs();
  const pathname = usePathname();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: `${clientEnvironment.NEXT_PUBLIC_CORE_SERVER_URL}/trpc`,
          async headers() {
            const token = await getToken();
            return {
              authorization: `Bearer ${token}`,
            };
          },
        }),
        httpBatchLink({
          url: `${clientEnvironment.NEXT_PUBLIC_CORE_SERVER_URL}/trpc`,
          async headers() {
            const token = await getToken();
            return {
              authorization: `Bearer ${token}`,
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <PortfolioProvider>
            <ViewContextProvider>
              <Dashboard
                pathname={pathname}
                header={<PortfolioSwitcher />}
                breadcrumb={
                  <Breadcrumb>
                    <BreadcrumbList>
                      {breadcrumbs.map(({ title, link }, index) =>
                        index === breadcrumbs.length - 1 ? (
                          <BreadcrumbItem key={title}>
                            <BreadcrumbPage>{title}</BreadcrumbPage>
                          </BreadcrumbItem>
                        ) : (
                          <div
                            className="flex items-center gap-x-2"
                            key={title}
                          >
                            <BreadcrumbItem className="hidden md:flex">
                              <BreadcrumbLink href={link}>
                                {title}
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator
                              key={title + 'separtor'}
                              className="hidden md:flex"
                            />
                          </div>
                        )
                      )}
                    </BreadcrumbList>
                  </Breadcrumb>
                }
                sidebarOptions={
                  <>
                    <SignedIn>
                      <PlaidConnectButton />
                      <UserButton />
                      <ThemeButton />
                    </SignedIn>
                  </>
                }
                navGroups={NavTree}
              >
                {children}
              </Dashboard>
              <ReactQueryDevtools initialIsOpen={false} />
              <Toaster />
            </ViewContextProvider>
          </PortfolioProvider>
        </UserProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};
