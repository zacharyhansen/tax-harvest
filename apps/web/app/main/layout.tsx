'use client';

import {
	ClerkProvider,
	RedirectToSignIn,
	SignedIn,
	SignedOut,
	UserButton,
} from '@clerk/nextjs';
import { Button } from '@repo/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { Toaster } from '@repo/ui/components/sonner';
import { toast } from '@repo/ui/components/toast-sonner';
import MediaProvider from '@repo/ui/providers/media-provider';
import { ThemeProvider } from '@repo/ui/providers/theme-provider';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { motion } from 'framer-motion';
import {
	Building2,
	ChevronsUpDown,
	FileSpreadsheet,
	Shield,
	TrendingUp,
	Wallet2,
} from 'lucide-react';
import NextTopLoader from 'nextjs-toploader';
import { useRouter } from 'next/navigation';
import {
	usePortfolioConnectionsSetupQuery,
	usePortfoliosQuery,
	useSwitchPortfolioMutation,
} from '~/generated/gql';
import { PortfolioProvider, usePortfolio } from '~/modules/portfolio';
import { InstitutionCardList } from '../connect/components/institution-card-list';
import ApolloProviderWrapper from './ApolloProviderWrapper';
import LoadingScreen from './loading';
import { TopNavigation } from './top-navigation';
import { UserProvider } from './user.provider';

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
						<ThemeProvider attribute="class">
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

/**
 * OnboardingWrapper component that shows onboarding UI when portfolio has pending connections,
 * otherwise displays the normal app layout with navigation.
 *
 * @example
 * ```tsx
 * <OnboardingWrapper>
 *   <MainContent />
 * </OnboardingWrapper>
 * ```
 */
function OnboardingWrapper({ children }: { children: React.ReactNode }) {
	const { data, loading } = usePortfolioConnectionsSetupQuery({});
	const { data: portfoliosData } = usePortfoliosQuery();
	const { portfolio, reload } = usePortfolio();
	const [switchPortfolio] = useSwitchPortfolioMutation({
		onError: () => {
			toast.error('Unable to switch portfolio');
		},
	});
	const router = useRouter();

	if (loading) {
		return <LoadingScreen />;
	}

	// Filter portfolios that are not pending (have completed connections)
	const completedPortfolios =
		portfoliosData?.portfolios.filter(
			(p) => p.id !== portfolio.id && p.id !== portfolio.id,
		) || [];

	// If we have no connections or there are pending ones show those to the user
	if (
		!data?.portfolioConnections ||
		data?.portfolioConnections.length === 0 ||
		data?.portfolioConnections.filter(
			(connection) => connection.state === 'PENDING',
		).length > 0
	) {
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
					className="w-full flex flex-col items-center gap-4"
					variants={itemVariants}
				>
					<InstitutionCardList />

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

				{/* Portfolio Switcher and User Button */}
				<motion.div
					className={`flex items-center gap-4 w-full max-w-xs ${completedPortfolios.length === 0 ? 'justify-center' : ''}`}
					variants={itemVariants}
				>
					{completedPortfolios.length > 0 && (
						<div className="flex-1">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="w-full justify-between data-[state=open]:bg-accent h-auto py-3 px-4"
									>
										<div className="flex items-center gap-2">
											<div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
												<Wallet2 className="size-4" />
											</div>
											<div className="grid flex-1 text-left text-sm leading-tight">
												<div className="text-xs">Portfolio</div>
												<span className="truncate text-sm font-semibold">
													{portfolio.name}
												</span>
											</div>
										</div>
										<ChevronsUpDown className="ml-auto size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="min-w-56 rounded-lg"
									align="start"
									side="bottom"
									sideOffset={4}
								>
									<DropdownMenuLabel className="text-muted-foreground text-xs">
										Switch to Portfolio
									</DropdownMenuLabel>
									{completedPortfolios.map((p) => (
										<DropdownMenuItem
											key={p.id}
											onClick={() => {
												router.replace('?');
												void switchPortfolio({
													onCompleted: reload,
													variables: {
														porfolioId: p.id,
													},
												});
											}}
											className="gap-2 p-2"
										>
											{p.name}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					)}
					<UserButton />
				</motion.div>
			</motion.div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<TopNavigation />
			<main className="flex-1">{children}</main>
		</div>
	);
}
