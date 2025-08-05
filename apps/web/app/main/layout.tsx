'use client';

import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  ClerkProvider,
} from '@clerk/nextjs';
import { Toaster } from '@repo/ui/components/sonner';
import { Dashboard } from '@repo/ui/layouts/dashboard';
import MediaProvider from '@repo/ui/providers/media-provider';
import { ThemeProvider } from '@repo/ui/providers/theme-provider';
import { usePathname } from 'next/navigation';
import { AddAccountButton } from '~/modules/account/add-account/add-account.button';
import { useBreadcrumbs } from '~/modules/hooks/use-breadcrumbs';
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
import { TrendingUp, Shield, FileSpreadsheet, Building2 } from 'lucide-react';

// Ag grid register
ModuleRegistry.registerModules([AllCommunityModule]);

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
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
    </ClerkProvider>
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
      <motion.div
        className="container mx-auto flex max-h-screen max-w-6xl flex-col items-center gap-8 overflow-y-auto px-4 py-8 md:py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-6 text-center" variants={itemVariants}>
          <motion.div
            className="bg-primary/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full"
            variants={itemVariants}
          >
            <TrendingUp className="text-primary h-10 w-10" />
          </motion.div>

          <motion.h1
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
            variants={itemVariants}
          >
            Turn Your Investments Into Tax Savings
          </motion.h1>

          <motion.p
            className="text-muted-foreground mx-auto max-w-[800px] text-lg md:text-xl"
            variants={itemVariants}
          >
            Tax-loss harvesting can save you thousands of dollars annually.
            Start by uploading your portfolio to discover hidden opportunities
            in your investments.
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-4"
          variants={itemVariants}
        >
          <AddAccountButton size="lg" className="px-8 py-6 text-lg" />

          <motion.p
            className="text-muted-foreground text-center text-sm"
            variants={itemVariants}
          >
            Get started in under 5 minutes • Bank-level security • Cancel
            anytime
          </motion.p>
        </motion.div>
        <motion.div
          className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          variants={itemVariants}
        >
          <motion.div
            className="bg-card flex flex-col items-center gap-3 rounded-lg border p-4 sm:p-6"
            variants={itemVariants}
          >
            <FileSpreadsheet className="text-primary h-8 w-8" />
            <h3 className="font-semibold">Upload Your Portfolio</h3>
            <p className="text-muted-foreground text-center text-sm">
              Provide a snapshot of your positions and year-to-date profit &
              loss
            </p>
          </motion.div>

          <motion.div
            className="bg-card flex flex-col items-center gap-3 rounded-lg border p-4 sm:p-6"
            variants={itemVariants}
          >
            <Building2 className="text-primary h-8 w-8" />
            <h3 className="font-semibold">Connect Securely</h3>
            <p className="text-muted-foreground text-center text-sm">
              Link your brokerage accounts for automatic opportunity detection
            </p>
          </motion.div>

          <motion.div
            className="bg-card flex flex-col items-center gap-3 rounded-lg border p-4 sm:col-span-2 sm:p-6 lg:col-span-1"
            variants={itemVariants}
          >
            <Shield className="text-primary h-8 w-8" />
            <h3 className="font-semibold">Save Automatically</h3>
            <p className="text-muted-foreground text-center text-sm">
              We'll continuously monitor and alert you to tax-saving
              opportunities
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <Dashboard
      pathname={pathname}
      header={<PortfolioSwitcher />}
      // breadcrumb={
      //   <Breadcrumb>
      //     <BreadcrumbList>
      //       {breadcrumbs.map(({ title, link }, index) => {
      //         const formattedTitle = capitalCase(title);
      //         return index === breadcrumbs.length - 1 ? (
      //           <BreadcrumbItem key={title}>
      //             <BreadcrumbPage>{formattedTitle}</BreadcrumbPage>
      //           </BreadcrumbItem>
      //         ) : (
      //           <div className="flex items-center gap-x-2" key={title}>
      //             <BreadcrumbItem className="hidden md:flex">
      //               <BreadcrumbLink href={link}>
      //                 {formattedTitle}
      //               </BreadcrumbLink>
      //             </BreadcrumbItem>
      //             <BreadcrumbSeparator
      //               key={`${title}separtor`}
      //               className="hidden md:flex"
      //             />
      //           </div>
      //         );
      //       })}
      //     </BreadcrumbList>
      //   </Breadcrumb>
      // }
      sidebarOptions={
        <>
          <SignedIn>
            <UserButton />
            <ThemeButton />
          </SignedIn>
        </>
      }
      navGroups={NavTree}
      userRole={clerkUser.user?.publicMetadata.role as string | undefined}
      footer={<div className="flex items-center justify-center gap-2 group-data-[state=collapsed]:flex-col">
        <ThemeButton />
        <UserButton />
      </div>}
    >
      {children}
    </Dashboard>
  );
}
