'use client';

import { Protect } from '@clerk/nextjs';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import { Bot, Calendar, TrendingUp, Zap } from 'lucide-react';
import { SeePaymentPlans } from '../settings/payment/see-payment-plans';

/**
 * Auto Investing page - allows users to configure automatic investment strategies
 * Protected by email_notifications feature flag
 *
 * @example
 * ```tsx
 * <AutoInvestingPage />
 * ```
 */
export default function AutoInvestingPage() {
	return (
		<Protect feature="auto_invest" fallback={<SeePaymentPlans />}>
			<AutoInvestingContent />
		</Protect>
	);
}

/**
 * Auto Investing content component that displays the main UI
 */
function AutoInvestingContent() {
	return (
		<div className="container mx-auto max-w-6xl space-y-6 p-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Auto Investing</h1>
				<p className="text-muted-foreground">
					Automate your investment strategy with intelligent, tax-optimized
					portfolio management.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
								<Zap className="text-primary h-5 w-5" />
							</div>
							<div>
								<CardTitle>Automatic Rebalancing</CardTitle>
								<CardDescription>
									Keep your portfolio balanced automatically
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm">
							Set up automatic rebalancing rules to maintain your target asset
							allocation while maximizing tax efficiency through strategic
							harvesting.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
								<TrendingUp className="text-primary h-5 w-5" />
							</div>
							<div>
								<CardTitle>Tax-Loss Harvesting</CardTitle>
								<CardDescription>
									Automated tax-loss harvesting strategies
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm">
							Automatically identify and execute tax-loss harvesting
							opportunities while avoiding wash sales and maintaining your
							investment strategy.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
								<Calendar className="text-primary h-5 w-5" />
							</div>
							<div>
								<CardTitle>Scheduled Investments</CardTitle>
								<CardDescription>
									Set up recurring investment schedules
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm">
							Configure automatic investment schedules with dollar-cost
							averaging to reduce timing risk and build wealth consistently over
							time.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
								<Bot className="text-primary h-5 w-5" />
							</div>
							<div>
								<CardTitle>AI-Powered Optimization</CardTitle>
								<CardDescription>
									Intelligent portfolio optimization
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm">
							Leverage AI to analyze market conditions, tax implications, and
							your investment goals to make optimal decisions automatically.
						</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Coming Soon</CardTitle>
					<CardDescription>
						Auto Investing features are currently in development
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						We're working hard to bring you powerful automated investment tools.
						Stay tuned for updates as we roll out these features to help you
						optimize your portfolio with minimal effort.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
