'use client';

import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import { motion } from 'framer-motion';
import {
	AlertCircle,
	Bell,
	BellOff,
	Settings,
	TrendingDown,
	TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { TypedRoutes } from '~/lib/routes';
import { usePortfolio } from '~/modules/portfolio';

type ScenarioType = 'positive' | 'negative' | 'zero';

function getScenario(totalPnL: number): ScenarioType {
	if (totalPnL > 0) return 'positive';
	if (totalPnL < 0) return 'negative';
	return 'zero';
}

const scenarios = {
	positive: {
		icon: TrendingUp,
		title: "You're doing great!",
		subtitle: 'No opportunities available right now',
		badgeText: 'Profitable Year',
		badgeVariant: 'default' as const,
		description:
			"You've had an excellent investing year! Tax-loss harvesting opportunities occur when some investments decline while others gain. Since your portfolio is performing well overall, there aren't any current opportunities.",
		actionText: "We'll notify you when opportunities arise",
		iconColor: 'text-green-500',
		bgColor: 'bg-green-50 dark:bg-green-950/20',
	},
	negative: {
		icon: TrendingDown,
		title: 'Building Future Tax Savings',
		subtitle: "Your losses today become tomorrow's tax-free gains",
		badgeText: 'Accumulating Losses',
		badgeVariant: 'secondary' as const,
		description:
			"While this year has been challenging, you're building valuable tax assets. When your investments recover and show gains, you'll be able to harvest those gains tax-free using your current losses.",
		actionText: "We'll alert you when profitable harvesting becomes available",
		iconColor: 'text-orange-500',
		bgColor: 'bg-orange-50 dark:bg-orange-950/20',
	},
	zero: {
		icon: AlertCircle,
		title: 'Missing Portfolio Information',
		subtitle: 'Connect your accounts to discover opportunities',
		badgeText: 'No Data',
		badgeVariant: 'outline' as const,
		description:
			"We're missing investment data from your connected accounts. This could mean no investments have been added yet, or there may be connection issues with your brokerage accounts.",
		actionText: 'Add investments or check account connections',
		iconColor: 'text-muted-foreground',
		bgColor: 'bg-muted/20',
	},
};

export default function NoOpportunities({
	realizedPAndL,
	unrealizedPAndL,
}: {
	realizedPAndL: number;
	unrealizedPAndL: number;
}) {
	const totalPnL = realizedPAndL + unrealizedPAndL;
	const scenarioType = getScenario(totalPnL);
	const scenario = scenarios[scenarioType];
	const IconComponent = scenario.icon;
	const { portfolio } = usePortfolio();

	// Check if notifications are enabled
	const hasNotificationFrequency =
		portfolio?.notificationFrequency &&
		portfolio.notificationFrequency !== 'NEVER';
	const hasEndOfYearNotifications =
		portfolio?.endOfYearTaxOpportunityNotification;
	const hasAnyNotifications =
		hasNotificationFrequency || hasEndOfYearNotifications;

	// Create notification-specific messaging based on scenario
	const getNotificationContent = () => {
		// Check which notifications are missing
		const missingNotifications = [];
		if (!hasNotificationFrequency)
			missingNotifications.push('real-time alerts');
		if (!hasEndOfYearNotifications)
			missingNotifications.push('end-of-year summaries');

		if (missingNotifications.length === 2) {
			// No notifications enabled - encourage enabling them
			const reasonMap = {
				positive:
					'to be alerted when your successful investments create new tax-loss harvesting opportunities',
				negative:
					'to be notified when your current losses can be used to harvest tax-free gains',
				zero: 'to receive alerts once your portfolio data is connected and opportunities are identified',
			};

			return {
				icon: BellOff,
				title: 'Enable Smart Notifications',
				description: `Turn on notifications ${reasonMap[scenarioType]}. We'll monitor your portfolio 24/7 and only alert you when actionable opportunities arise.`,
				buttonText: 'Enable Notifications',
				buttonHref: '/main/settings/notifications',
				variant: 'default' as const,
				isPartiallyEnabled: false,
			};
		} else if (missingNotifications.length === 1) {
			// Partially enabled - encourage completing the setup
			const enabledTypes = [];
			if (hasNotificationFrequency) {
				const frequency = portfolio?.notificationFrequency
					?.toLowerCase()
					.replace('_', ' ');
				enabledTypes.push(`Real-time alerts (${frequency})`);
			}
			if (hasEndOfYearNotifications) enabledTypes.push('End-of-year summaries');

			const missingType = missingNotifications[0] as keyof typeof actionMap;
			const actionMap = {
				'real-time alerts': 'immediate opportunities as they arise',
				'end-of-year summaries': 'comprehensive tax planning at year-end',
			};

			return {
				icon: Bell,
				title: 'Complete Your Notification Setup',
				description: `${enabledTypes.join(' and ')} are enabled. Enable ${missingType} to receive alerts for ${actionMap[missingType]} and maximize your tax savings potential.`,
				buttonText: `Enable ${missingType === 'real-time alerts' ? 'Real-time Alerts' : 'Year-end Summaries'}`,
				buttonHref: '/main/settings/notifications',
				variant: 'default' as const,
				isPartiallyEnabled: true,
			};
		} else {
			// All notifications are enabled - show current status and settings access
			const enabledTypes = [];
			if (hasNotificationFrequency) {
				const frequency = portfolio?.notificationFrequency
					?.toLowerCase()
					.replace('_', ' ');
				enabledTypes.push(`Real-time alerts (${frequency})`);
			}
			if (hasEndOfYearNotifications) enabledTypes.push('End-of-year summaries');

			return {
				icon: Bell,
				title: 'Smart Notifications Active',
				description: `${enabledTypes.join(' and ')} are enabled. ${scenario.actionText}. We monitor your portfolio 24/7 and will send you alerts when tax-loss harvesting opportunities become available.`,
				buttonText: 'Manage Notifications',
				buttonHref: '/main/settings/notifications',
				variant: 'outline' as const,
				isPartiallyEnabled: false,
			};
		}
	};

	const notificationContent = getNotificationContent();

	return (
		<div className="space-y-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Card className="overflow-hidden">
					<CardHeader className={`border-b`}>
						<div className="flex items-center gap-3">
							<div className="bg-background rounded-full p-2">
								<IconComponent className={`${scenario.iconColor} size-5`} />
							</div>
							<div className="flex-1">
								<div className="mb-1 flex items-center gap-3">
									<CardTitle className="text-lg">{scenario.title}</CardTitle>
									<Badge variant={scenario.badgeVariant}>
										{scenario.badgeText}
									</Badge>
								</div>
								<CardDescription>{scenario.subtitle}</CardDescription>
							</div>
						</div>
					</CardHeader>

					<CardContent className="space-y-6 pt-4">
						{/* Description */}
						<div>
							<p className="text-muted-foreground leading-relaxed">
								{scenario.description}
							</p>
						</div>

						{/* Notification Section */}
						<Alert
							className={
								!hasAnyNotifications
									? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20'
									: ''
							}
						>
							<notificationContent.icon
								className={!hasAnyNotifications ? 'text-orange-600' : ''}
							/>
							<AlertTitle
								className={
									!hasAnyNotifications
										? 'text-orange-900 dark:text-orange-100'
										: ''
								}
							>
								{notificationContent.title}
							</AlertTitle>
							<AlertDescription
								className={
									!hasAnyNotifications
										? 'text-orange-700 dark:text-orange-200'
										: ''
								}
							>
								{notificationContent.description}
							</AlertDescription>
						</Alert>
					</CardContent>

					<CardFooter className="flex flex-col gap-3 sm:flex-row">
						<Link href={TypedRoutes.home()} className="flex-1">
							<Button variant="outline" className="w-full">
								View Portfolio
							</Button>
						</Link>
						<Link href={notificationContent.buttonHref} className="flex-1">
							<Button variant={notificationContent.variant} className="w-full">
								<Settings className="mr-2 size-4" />
								{notificationContent.buttonText}
							</Button>
						</Link>
						{scenarioType === 'zero' && (
							<Link href="/onboarding" className="flex-1">
								<Button className="w-full">Add Investments</Button>
							</Link>
						)}
					</CardFooter>
				</Card>
			</motion.div>
		</div>
	);
}
