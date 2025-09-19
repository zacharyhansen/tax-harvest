'use client';

import { AiAdvisor } from './ai-advisor';

/**
 * AI Advisor admin page
 * Provides AI-powered insights and recommendations for tax harvesting strategies
 * @example
 * <AiAdvisorPage />
 */
export default function AiAdvisorPage() {
	return (
		<div className="container mx-auto py-6 space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">AI Advisor</h1>
				<p className="text-muted-foreground">
					Get AI-powered insights and recommendations for tax harvesting strategies
				</p>
			</div>
			<AiAdvisor />
		</div>
	);
}