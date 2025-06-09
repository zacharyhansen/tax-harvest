'use client'

import {
  ClerkLoaded,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/ui/components/breadcrumb'
import { Toaster } from '@repo/ui/components/sonner'
import { Dashboard } from '@repo/ui/layouts/dashboard'
import MediaProvider from '@repo/ui/providers/media-provider'
import { ThemeProvider } from '@repo/ui/providers/theme-provider'
import { capitalCase } from 'change-case'
import { usePathname } from 'next/navigation'

import { AddAccountButton } from '~/modules/account/add-account/add-account.button'
import { useBreadcrumbs } from '~/modules/hooks/use-breadcrumbs'
// import { PlaidConnectButton } from '~/modules/plaid'
import { PortfolioProvider, PortfolioSwitcher } from '~/modules/portfolio'

import ApolloProviderWrapper from './ApolloProviderWrapper'
import { NavTree } from './nav-tree'
import ThemeButton from './theme-button'
import { UserProvider } from './user.provider'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const breadcrumbs = useBreadcrumbs() || []
  const pathname = usePathname()
  const clerkUser = useUser()

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
                    breadcrumb={(
                      <Breadcrumb>
                        <BreadcrumbList>
                          {breadcrumbs.map(({ title, link }, index) => {
                            const formattedTitle = capitalCase(title)
                            return index === breadcrumbs.length - 1
                              ? (
                                  <BreadcrumbItem key={title}>
                                    <BreadcrumbPage>
                                      {formattedTitle}
                                    </BreadcrumbPage>
                                  </BreadcrumbItem>
                                )
                              : (
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
                                      key={`${title}separtor`}
                                      className="hidden md:flex"
                                    />
                                  </div>
                                )
                          })}
                        </BreadcrumbList>
                      </Breadcrumb>
                    )}
                    sidebarOptions={(
                      <>
                        <SignedIn>
                          <AddAccountButton />
                          {/* <PlaidConnectButton /> */}
                          <UserButton />
                          <ThemeButton />
                        </SignedIn>
                      </>
                    )}
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
  )
}
