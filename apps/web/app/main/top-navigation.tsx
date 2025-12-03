'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@repo/ui/components/button';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@repo/ui/components/navigation-menu';
import { ScrollArea } from '@repo/ui/components/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@repo/ui/components/sheet';
import { cn } from '@repo/ui/utils';
import {
	Bot,
	Building2,
	ChartArea,
	Logs,
	Menu,
	Merge,
	NotebookText,
	Play,
	Scissors,
	Settings,
	ShieldCheck,
	TrendingUpDown,
	UserPlus,
	Users,
	Wallet2,
	Waypoints,
	Wheat,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { TypedRoutes } from '~/lib/routes';
import ThemeButton from './theme-button';

const navItems = [
	{ href: 'home' as const, label: 'Tax Lots', icon: Wallet2 },
	{
		href: 'taxOpportunities' as const,
		label: 'Recommended',
		icon: Scissors,
	},
	{ href: 'harvests' as const, label: 'Harvests', icon: Wheat },
	{ href: 'autoInvesting' as const, label: 'Auto Invest', icon: Bot },
];

const accountNavItems = [
	{
		href: 'accounts' as const,
		label: 'View Accounts',
		description: 'Manage your connected accounts',
		icon: Waypoints,
	},
	{
		href: 'invite' as const,
		label: 'Invite',
		description: 'Invite users to your portfolio',
		icon: UserPlus,
	},
	{
		href: 'settings' as const,
		label: 'Settings',
		description: 'Account settings and preferences',
		icon: Settings,
	},
];

const adminNavItems = [
	{
		href: 'performance' as const,
		label: 'Performance',
		description: 'System performance metrics',
		icon: ChartArea,
	},
	{
		href: 'aiAdvisor' as const,
		label: 'AI Advisor',
		description: 'AI-powered advisor',
		icon: Bot,
	},
	{
		href: 'actions' as const,
		label: 'Actions',
		description: 'System actions',
		icon: Play,
	},
	{
		href: 'logs' as const,
		label: 'Logs',
		description: 'System logs',
		icon: Logs,
	},
	{
		href: 'institutions' as const,
		label: 'Institutions',
		description: 'Financial institutions',
		icon: Building2,
	},
	{
		href: 'plaidHistory' as const,
		label: 'Plaid Merges',
		description: 'Plaid merge history',
		icon: Merge,
	},
	{
		href: 'accountPnlHistory' as const,
		label: 'Account P&L History',
		description: 'Historical P&L data',
		icon: TrendingUpDown,
	},
	{
		href: 'users' as const,
		label: 'Users',
		description: 'User management',
		icon: Users,
	},
	{
		href: 'transactions' as const,
		label: 'Transactions',
		description: 'Transaction history',
		icon: NotebookText,
	},
];

/**
 * Top navigation bar component with horizontal tab-based navigation
 * @example
 * ```tsx
 * <TopNavigation />
 * ```
 */
export function TopNavigation() {
	const pathname = usePathname();
	const { user } = useUser();
	const isAdmin = user?.publicMetadata.role === 'admin';
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-14 items-center px-4">
				{/* Logo and Company Name */}
				<Link
					href={TypedRoutes.home()}
					className="flex items-center gap-3 mr-6"
				>
					<Image
						src="/images/tractor.png"
						alt="Tax Harvest"
						width={40}
						height={40}
					/>
					<span className="font-semibold text-primary hidden sm:inline">
						TaxHarvest
					</span>
				</Link>

				{/* Mobile: Hamburger Menu */}
				<div className="md:hidden flex items-center gap-2">
					<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-[280px]">
							<SheetHeader>
								<SheetTitle>Navigation</SheetTitle>
							</SheetHeader>
							<ScrollArea className="h-[calc(100vh-80px)] py-4">
								<nav className="flex flex-col space-y-2">
									{navItems.map((item) => {
										const Icon = item.icon;
										const route = TypedRoutes[item.href]();
										const isActive = pathname === route;

										return (
											<Link
												key={item.href}
												href={route}
												onClick={() => setMobileMenuOpen(false)}
												className={cn(
													'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
													isActive
														? 'bg-accent text-accent-foreground'
														: 'hover:bg-accent hover:text-accent-foreground',
												)}
											>
												<Icon className="h-4 w-4" />
												{item.label}
											</Link>
										);
									})}

									{/* Account section in mobile */}
									<div className="pt-4 pb-2">
										<div className="flex items-center gap-2 px-3 text-sm font-semibold text-muted-foreground">
											<Waypoints className="h-4 w-4" />
											Account
										</div>
									</div>
									{accountNavItems.map((item) => {
										const Icon = item.icon;
										const route = TypedRoutes[item.href]();
										const isActive = pathname?.startsWith(route);

										return (
											<Link
												key={item.href}
												href={route}
												onClick={() => setMobileMenuOpen(false)}
												className={cn(
													'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
													isActive
														? 'bg-accent text-accent-foreground'
														: 'hover:bg-accent hover:text-accent-foreground',
												)}
											>
												<Icon className="h-4 w-4" />
												<div className="flex flex-col gap-0.5">
													<span className="font-medium">{item.label}</span>
													{item.description && (
														<span className="text-xs text-muted-foreground">
															{item.description}
														</span>
													)}
												</div>
											</Link>
										);
									})}

									{/* Admin items in mobile */}
									{isAdmin && (
										<>
											<div className="pt-4 pb-2">
												<div className="flex items-center gap-2 px-3 text-sm font-semibold text-muted-foreground">
													<ShieldCheck className="h-4 w-4" />
													Admin
												</div>
											</div>
											{adminNavItems.map((item) => {
												const Icon = item.icon;
												const route = TypedRoutes[item.href]();
												const isActive = pathname === route;

												return (
													<Link
														key={item.href}
														href={route}
														onClick={() => setMobileMenuOpen(false)}
														className={cn(
															'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
															isActive
																? 'bg-accent text-accent-foreground'
																: 'hover:bg-accent hover:text-accent-foreground',
														)}
													>
														<Icon className="h-4 w-4" />
														<div className="flex flex-col gap-0.5">
															<span className="font-medium">{item.label}</span>
															{item.description && (
																<span className="text-xs text-muted-foreground">
																	{item.description}
																</span>
															)}
														</div>
													</Link>
												);
											})}
										</>
									)}
								</nav>
							</ScrollArea>
						</SheetContent>
					</Sheet>
				</div>

				{/* Mobile: User Menu & Theme */}
				<div className="md:hidden flex items-center gap-2">
					<ThemeButton />
					<UserButton />
				</div>

				{/* Desktop: Spacer */}
				<div className="hidden md:flex flex-1" />

				{/* Desktop: Main Navigation */}
				<NavigationMenu className="hidden md:flex ml-auto">
					<NavigationMenuList>
						{navItems.map((item) => {
							const route = TypedRoutes[item.href]();
							const isActive = pathname === route;

							return (
								<NavigationMenuItem key={item.href}>
									<NavigationMenuLink asChild active={isActive}>
										<Link href={route} className={navigationMenuTriggerStyle()}>
											<span
												className={cn(
													isActive &&
														'underline decoration-primary decoration-2 underline-offset-4',
												)}
											>
												{item.label}
											</span>
										</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>
							);
						})}

						{/* Account Dropdown (Desktop) */}
						<NavigationMenuItem>
							<NavigationMenuTrigger>Account</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid w-[300px] gap-3 p-4">
									{accountNavItems.map((item) => (
										<li key={item.href}>
											<NavigationMenuLink asChild>
												<Link
													href={TypedRoutes[item.href]()}
													className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
												>
													<div className="text-sm font-medium leading-none">
														{item.label}
													</div>
													{item.description && (
														<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
															{item.description}
														</p>
													)}
												</Link>
											</NavigationMenuLink>
										</li>
									))}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>

						{/* Admin Dropdown (Desktop only) */}
						{isAdmin && (
							<NavigationMenuItem>
								<NavigationMenuTrigger>Admin</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[200px] gap-3 p-4">
										{adminNavItems.map((item) => (
											<li key={item.href}>
												<NavigationMenuLink asChild>
													<Link
														href={TypedRoutes[item.href]()}
														className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
													>
														<div className="text-sm font-medium leading-none">
															{item.label}
														</div>
														{item.description && (
															<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
																{item.description}
															</p>
														)}
													</Link>
												</NavigationMenuLink>
											</li>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						)}
					</NavigationMenuList>
				</NavigationMenu>

				{/* Desktop: User Menu & Theme */}
				<div className="hidden md:flex items-center gap-2">
					<ThemeButton />
					<UserButton />
				</div>
			</div>
		</header>
	);
}
