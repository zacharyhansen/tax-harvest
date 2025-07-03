'use client';

import Image from 'next/image';
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/ui/components/breadcrumb';
import { Toaster } from '@repo/ui/components/sonner';
import { Dashboard } from '@repo/ui/layouts/dashboard';
import MediaProvider from '@repo/ui/providers/media-provider';
import { ThemeProvider } from '@repo/ui/providers/theme-provider';
import { capitalCase } from 'change-case';
import { usePathname } from 'next/navigation';
import { AddAccountButton } from '~/modules/account/add-account/add-account.button';
import { useBreadcrumbs } from '~/modules/hooks/use-breadcrumbs';
// import { PlaidConnectButton } from '~/modules/plaid'
import { PortfolioProvider, PortfolioSwitcher } from '~/modules/portfolio';
import { motion } from 'framer-motion';
import ApolloProviderWrapper from './ApolloProviderWrapper';
import { NavTree } from './nav-tree';
import ThemeButton from './theme-button';
import { UserProvider } from './user.provider';
import { SetUpStatus, usePortfolioSummaryQuery } from '~/generated/gql';
import LoadingScreen from './loading';
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
    <>
      <NextTopLoader color="#faa700" showSpinner={false} />
      <ApolloProviderWrapper>
        <SignedIn>
          <MediaProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <UserProvider>
                <PortfolioProvider>
                  <OnboardingWrapper>{children}</OnboardingWrapper>
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
    </>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const buttonVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.95,
  },
};

function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { data, loading } = usePortfolioSummaryQuery();
  const breadcrumbs = useBreadcrumbs() || [];
  const pathname = usePathname();
  const clerkUser = useUser();

  if (loading) {
    return <LoadingScreen />;
  }

  if (data?.portfolioSummary.setUpStatus === SetUpStatus.NoAccounts) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <motion.div
          className="container mx-auto flex max-w-5xl flex-col items-center gap-4 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="space-y-4" variants={itemVariants}>
            <motion.h1
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              variants={itemVariants}
            >
              Welcome to Tax Harvest.AI{' '}
            </motion.h1>
            <motion.p
              className="text-muted-foreground mx-auto max-w-[700px] md:text-xl"
              variants={itemVariants}
            >
              Let's get started with setting up your account.
            </motion.p>
          </motion.div>

          <motion.div className="mt-8" variants={itemVariants}>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <AddAccountButton size="lg" />
            </motion.div>
          </motion.div>

          <motion.div
            className="relative aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-lg"
            variants={imageVariants}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
          >
            <Image
              src="/images/moneyToPill.png"
              alt="Welcome illustration"
              fill
              className="max-h-[50vh] object-contain"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
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
                  <BreadcrumbPage>{formattedTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <div className="flex items-center gap-x-2" key={title}>
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
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      }
      sidebarOptions={
        <>
          <SignedIn>
            <AddAccountButton />
            {/* <PlaidConnectButton /> */}
            <UserButton />
            <ThemeButton />
          </SignedIn>
        </>
      }
      navGroups={NavTree}
      userRole={clerkUser.user?.publicMetadata.role as string | undefined}
    >
      {children}
    </Dashboard>
  );
}
