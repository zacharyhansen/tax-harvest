'use client';

import { PerformanceChart } from './performance-chart';

/**
 * Admin Performance page
 * Displays portfolio performance metrics and charts
 * @example
 * <PerformancePage />
 */
export default function PerformancePage() {
	return (
		<div className="container mx-auto py-6 space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">Performance</h1>
				<p className="text-muted-foreground">
					Monitor portfolio performance metrics and trends
				</p>
			</div>
			<PerformanceChart />
		</div>
	);
}