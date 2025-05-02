'use client';

import {
  ClerkLoaded,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs';
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
import { usePathname } from 'next/navigation';
import { capitalCase } from 'change-case';

import ThemeButton from './theme-button';
import { NavTree } from './nav-tree';
import { UserProvider } from './user.provider';
import ApolloProviderWrapper from './ApolloProviderWrapper';

import { useBreadcrumbs } from '~/modules/hooks/use-breadcrumbs';
import { PlaidConnectButton } from '~/modules/plaid';
import { PortfolioProvider, PortfolioSwitcher } from '~/modules/portfolio';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const breadcrumbs = useBreadcrumbs() || [];
  const pathname = usePathname();
  const clerkUser = useUser();

  return (
    <ClerkLoaded>
      <ApolloProviderWrapper>
        <SignedIn>
          <MediaProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <UserProvider>
                <PortfolioProvider>
                  <Dashboard
                    pathname={pathname}
                    header={<PortfolioSwitcher />}
                    breadcrumb={
                      <Breadcrumb>
                        <BreadcrumbList>
                          {breadcrumbs.map(({ title, link }, index) => {
                            const formattedTitle = capitalCase(title);
                            return index === breadcrumbs.length - 1 ? (
                              <BreadcrumbItem key={title}>
                                <BreadcrumbPage>
                                  {formattedTitle}
                                </BreadcrumbPage>
                              </BreadcrumbItem>
                            ) : (
                              <div
                                className="flex items-center gap-x-2"
                                key={title}
                              >
                                <BreadcrumbItem className="hidden md:flex">
                                  <BreadcrumbLink href={link}>
                                    {formattedTitle}
                                  </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator
                                  key={title + 'separtor'}
                                  className="hidden md:flex"
                                />
                              </div>
                            );
                          })}
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
                    userRole={
                      clerkUser.user?.publicMetadata.role as string | undefined
                    }
                  >
                    {children}
                  </Dashboard>
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
    </ClerkLoaded>
  );
}
