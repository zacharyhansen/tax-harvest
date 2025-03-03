'use client';

import {
  ClerkLoaded,
  OrganizationList,
  OrganizationSwitcher,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useAuth,
  UserButton,
} from '@clerk/nextjs';
import { dark } from '@clerk/themes';
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
import { Building, Pencil } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { Combobox } from '@repo/ui/components/combobox';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';

import ThemeButton from './theme-button';
import { EnvironmentProvider, useEnvironment } from './environment.provider';
import { NavTree } from './nav-tree';
import { UserProvider, useUser } from './user.provider';
import { ViewContextProvider } from './view-context.provider';

import { trpc } from '~/lib/trpc';
import { clientEnvironment } from '~/lib/env/clientEnvironment';
import { useBreadcrumbs } from '~/modules/hooks/use-breadcrumbs';

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
  const { getToken, orgId } = useAuth();
  const breadcrumbs = useBreadcrumbs();
  const pathname = usePathname();
  const { theme } = useTheme();
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

  if (!orgId) {
    return (
      <div className="text-card-foreground grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <div className="text-primary flex justify-center space-x-2 align-middle text-xl font-bold">
            <Building className="inline" />
            <p>Select your organization</p>
          </div>
          <div className="text-sm text-gray-600">
            If you do not have any active organizations, please contact your
            company to add you to their org.
          </div>
          <div className="mt-4 flex items-center justify-center gap-x-6">
            <OrganizationList hidePersonal />
          </div>
        </div>
      </div>
    );
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <EnvironmentProvider>
          <UserProvider>
            <ViewContextProvider>
              <Dashboard
                pathname={pathname}
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
                      <OrganizationSwitcher
                        hidePersonal={true}
                        appearance={{
                          baseTheme: theme === 'dark' ? dark : undefined,
                        }}
                      />
                      <ConfiguratorButton />
                      <UserButton />
                    </SignedIn>
                    <ThemeButton />
                  </>
                }
                navGroups={NavTree}
              >
                {children}
              </Dashboard>
              <ReactQueryDevtools initialIsOpen={false} />
              <Toaster />
            </ViewContextProvider>
          </UserProvider>
        </EnvironmentProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

const ConfiguratorButton = () => {
  const {
    isConfigurator,
    isConfiguring,
    toggleConfiguring,
    user,
    setRoleImpersonation,
  } = useUser();
  const { configuration_schema } = useEnvironment();

  return isConfigurator ? (
    <div className="flex items-center space-x-2">
      {isConfiguring ? (
        <Combobox
          value={user.role_name}
          placeholder="Configure for role..."
          onChange={value => {
            setRoleImpersonation({
              name: value!,
              configuration_schema,
            });
          }}
          options={[
            {
              label: 'Admin',
              value: 'admin',
            },
            {
              label: 'Agent',
              value: 'agent',
            },
          ]}
        />
      ) : null}
      <Button
        variant={isConfiguring ? 'default' : 'outline'}
        size="icon"
        className="h-8 w-8 flex-none rounded-full"
        onClick={toggleConfiguring}
      >
        <Pencil className="h-3 w-3" />
      </Button>
    </div>
  ) : null;
};
