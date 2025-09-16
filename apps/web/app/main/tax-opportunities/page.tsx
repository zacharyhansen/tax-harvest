'use client';

import NumberFlow from '@number-flow/react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@repo/ui/components/collapsible';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@repo/ui/components/tooltip';
import { cn } from '@repo/ui/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, ChevronDown, Info } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useHarvestEvalResultQuery } from '~/generated/gql';
import { useOpenHarvests } from '~/modules/hooks/use-open-harvests';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { MoneyUtil } from '~/modules/utils';
import { FilterForm, type FilterFormData } from './filter-form';
import { HarvestContent } from './harvest-content';
import { OpenHarvestsBanner } from './open-harvests-banner';

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: {
		opacity: 0,
	},
	show: {
		opacity: 1,
	},
};

export default function TaxOpportunitiesPage() {
	const { openHarvestCount } = useOpenHarvests();
	const router = useRouter();
	const searchParams = useSearchParams();
	const portfolioBannerRef = useRef<HTMLDivElement>(null);
	const [searchQuery, setSearchQuery] = useState<FilterFormData>({
		minPAndL: searchParams.get('minPAndL')
			? Number(searchParams.get('minPAndL'))
			: 0,
		excludeAssetSymbols: searchParams.get('excludeSymbols')
			? searchParams.get('excludeSymbols')?.split(',').filter(Boolean)
			: [],
		purchaseDateBefore: searchParams.get('purchaseDateBefore')
			? // biome-ignore lint/style/noNonNullAssertion: <ok>
				new Date(searchParams.get('purchaseDateBefore')!)
			: null,
		purchaseDateAfter: searchParams.get('purchaseDateAfter')
			? // biome-ignore lint/style/noNonNullAssertion: <ok>
				new Date(searchParams.get('purchaseDateAfter')!)
			: null,
	});
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const { data, error, loading } = useHarvestEvalResultQuery({
		variables: { filters: searchQuery },
	});

	// Update URL when filters change
	const handleFiltersSubmit = (newFilters: FilterFormData) => {
		const params = new URLSearchParams();
		setSearchQuery(newFilters);

		if (newFilters.minPAndL) {
			params.set('minPAndL', newFilters.minPAndL.toString());
		}

		if (newFilters.excludeAssetSymbols?.length) {
			params.set('excludeSymbols', newFilters.excludeAssetSymbols.join(','));
		}

		if (newFilters.purchaseDateBefore) {
			params.set(
				'purchaseDateBefore',
				newFilters.purchaseDateBefore.toISOString(),
			);
		}

		if (newFilters.purchaseDateAfter) {
			params.set(
				'purchaseDateAfter',
				newFilters.purchaseDateAfter.toISOString(),
			);
		}

		const queryString = params.toString();
		router.replace(
			queryString ? `?${queryString}` : '/main/tax-opportunities',
			{ scroll: false },
		);
	};

	const clearAllFilters = () => {
		setSearchQuery({
			minPAndL: 0,
			excludeAssetSymbols: [],
			purchaseDateBefore: null,
			purchaseDateAfter: null,
		});
		router.replace(pathname, { scroll: false });
	};

	const numberOfActiveFilters: number = Object.values(searchQuery).filter(
		(value) => value && (!Array.isArray(value) || value.length > 0),
	).length;

	if (error) {
		return <ErrorPage />;
	}

	if (!data) {
		return <LoadingPage />;
	}

	const harvestEvalResult = data.harvestEvalResult;

	return (
		<motion.div
			ref={containerRef}
			className="container mx-auto max-w-6xl space-y-4 px-4 py-8"
			variants={containerVariants}
			initial="hidden"
			animate="show"
		>
			{/* Page Header */}
			<motion.div
				className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
				variants={itemVariants}
			>
				<div>
					<motion.h1
						className="text-3xl font-bold tracking-tight"
						variants={itemVariants}
					>
						Tax Loss Harvesting
					</motion.h1>
					<motion.p className="text-muted-foreground" variants={itemVariants}>
						Optimize your portfolio for tax efficiency
					</motion.p>
				</div>
			</motion.div>

			{/* Portfolio Status */}
			<motion.div
				ref={portfolioBannerRef}
				className="bg-background top-0 z-20 flex flex-col items-start md:sticky"
				variants={itemVariants}
			>
				<Collapsible
					open={!isCollapsed}
					onOpenChange={(open) => setIsCollapsed(!open)}
					className="w-full"
				>
					<div className="bg-muted/70 w-full overflow-hidden rounded-xl border-0">
						<div className="bg-muted flex items-center justify-between border-b p-3 sm:p-4">
							<div className="flex items-center space-x-2">
								<BarChart3 className="text-primary size-4 sm:size-5" />
								<h2 className="mr-4 text-base font-semibold sm:text-lg">
									Portfolio Tax Status
								</h2>
								{isCollapsed && (
									<div className="bg-muted/30 flex items-center justify-between text-xs">
										<div className="flex items-center space-x-4">
											<div>
												<span className="text-muted-foreground text-xs">
													Net Position
												</span>
												<div
													className={cn(
														'font-semibold',
														MoneyUtil.colored(
															harvestEvalResult.summary.realized.gainTotal ?? 0,
														),
													)}
												>
													<NumberFlow
														value={
															harvestEvalResult.summary.realized.gainTotal ?? 0
														}
														format={{ currency: 'USD', style: 'currency' }}
													/>
												</div>
											</div>
											<div>
												<span className="text-muted-foreground">
													Unrealized Gain
												</span>
												<div className="flex items-center space-x-2">
													<span
														className={cn(
															'font-semibold',
															MoneyUtil.colored(
																harvestEvalResult.summary.unrealized
																	.gainTotal ?? 0,
															),
														)}
													>
														<NumberFlow
															value={
																harvestEvalResult.summary.unrealized
																	.gainTotal ?? 0
															}
															format={{ currency: 'USD', style: 'currency' }}
														/>
													</span>
												</div>
											</div>
											<div>
												<span className="text-muted-foreground text-xs">
													Unrealized Loss
												</span>
												<div className="flex items-center space-x-2">
													<span
														className={cn(
															'font-semibold',
															MoneyUtil.colored(
																harvestEvalResult.summary.unrealized
																	.lossTotal ?? 0,
															),
														)}
													>
														<NumberFlow
															defaultValue={0}
															value={
																harvestEvalResult.summary.unrealized
																	.lossTotal ?? 0
															}
															format={{ currency: 'USD', style: 'currency' }}
														/>
													</span>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
							<div className="flex items-center space-x-2">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Info className="size-4 cursor-help" />
										</TooltipTrigger>
										<TooltipContent>
											<p>
												Net Realized Gain/Loss shows your current year tax
												position.
											</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<CollapsibleTrigger asChild>
									<button
										type="button"
										className="hover:bg-muted-foreground/10 rounded-full p-1 transition-colors"
									>
										<ChevronDown
											className={cn(
												'size-4 transition-transform duration-200',
												!isCollapsed && 'rotate-180',
											)}
										/>
									</button>
								</CollapsibleTrigger>
							</div>
						</div>

						{/* Expanded View */}
						<CollapsibleContent>
							<motion.div
								className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0"
								variants={itemVariants}
							>
								<motion.div
									className="px-4 pt-2 sm:px-6"
									variants={itemVariants}
								>
									<div className="flex flex-col">
										<span className="text-muted-foreground text-xs sm:text-sm">
											Net Position (Realized P & L)
										</span>
										<span
											className={cn(
												'mt-1 text-2xl font-semibold sm:text-3xl',
												MoneyUtil.colored(
													harvestEvalResult.summary.realized.gainTotal ?? 0,
												),
											)}
										>
											<NumberFlow
												value={
													harvestEvalResult.summary.realized.gainTotal ?? 0
												}
												format={{ currency: 'USD', style: 'currency' }}
											/>
										</span>
									</div>
								</motion.div>

								<motion.div
									className="px-4 pt-2 sm:px-6"
									variants={itemVariants}
								>
									<div className="flex flex-col">
										<span className="text-muted-foreground text-xs sm:text-sm">
											Unrealized Gain
										</span>
										<span
											className={cn(
												'mt-1 text-2xl font-semibold sm:text-3xl',
												MoneyUtil.colored(
													harvestEvalResult.summary.unrealized.gainTotal ?? 0,
												),
											)}
										>
											<NumberFlow
												value={
													harvestEvalResult.summary.unrealized.gainTotal ?? 0
												}
												format={{ currency: 'USD', style: 'currency' }}
											/>
										</span>
									</div>
								</motion.div>

								<motion.div
									className="px-4 pt-2 sm:px-6"
									variants={itemVariants}
								>
									<div className="flex flex-col">
										<span className="text-muted-foreground text-xs sm:text-sm">
											Unrealized Loss
										</span>
										<span
											className={cn(
												'mt-1 text-2xl font-semibold sm:text-3xl',
												MoneyUtil.colored(
													harvestEvalResult.summary.unrealized.lossTotal ?? 0,
												),
											)}
										>
											<NumberFlow
												defaultValue={0}
												value={
													harvestEvalResult.summary.unrealized.lossTotal ?? 0
												}
												format={{ currency: 'USD', style: 'currency' }}
											/>
										</span>
									</div>
								</motion.div>
							</motion.div>

							{openHarvestCount > 0 && (
								<motion.div
									className="bg-muted/30 grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0"
									variants={itemVariants}
								>
									<motion.div
										className="px-4 py-2 sm:px-6 sm:py-3"
										variants={itemVariants}
									>
										<div className="flex flex-col">
											<span className="text-muted-foreground text-[10px] sm:text-xs">
												after current harvest
											</span>
											<span
												className={cn(
													'mt-0.5 text-sm font-semibold sm:text-base',
													MoneyUtil.colored(
														harvestEvalResult.summary.includingCurrentHarvest
															.realized.gainTotal ?? 0,
													),
												)}
											>
												<NumberFlow
													value={
														harvestEvalResult.summary.includingCurrentHarvest
															.realized.gainTotal ?? 0
													}
													format={{ currency: 'USD', style: 'currency' }}
												/>
											</span>
										</div>
									</motion.div>

									<motion.div
										className="px-4 py-2 sm:px-6 sm:py-3"
										variants={itemVariants}
									>
										<div className="flex flex-col">
											<span className="text-muted-foreground text-[10px] sm:text-xs">
												after current harvest
											</span>
											<span
												className={cn(
													'mt-0.5 text-sm font-semibold sm:text-base',
													MoneyUtil.colored(
														harvestEvalResult.summary.includingCurrentHarvest
															.unrealized.gainTotal ?? 0,
													),
												)}
											>
												<NumberFlow
													value={
														harvestEvalResult.summary.includingCurrentHarvest
															.unrealized.gainTotal ?? 0
													}
													format={{ currency: 'USD', style: 'currency' }}
												/>
											</span>
										</div>
									</motion.div>

									<motion.div
										className="px-4 py-2 sm:px-6 sm:py-3"
										variants={itemVariants}
									>
										<div className="flex flex-col">
											<span className="text-muted-foreground text-[10px] sm:text-xs">
												after current harvest
											</span>
											<span
												className={cn(
													'mt-0.5 text-sm font-semibold sm:text-base',
													MoneyUtil.colored(
														harvestEvalResult.summary.includingCurrentHarvest
															.unrealized.lossTotal ?? 0,
													),
												)}
											>
												<NumberFlow
													defaultValue={0}
													value={
														harvestEvalResult.summary.includingCurrentHarvest
															.unrealized.lossTotal ?? 0
													}
													format={{ currency: 'USD', style: 'currency' }}
												/>
											</span>
										</div>
									</motion.div>
								</motion.div>
							)}
						</CollapsibleContent>
					</div>
				</Collapsible>
			</motion.div>

			{/* Open Harvests Banner */}
			<motion.div variants={itemVariants}>
				<OpenHarvestsBanner />
			</motion.div>

			{/* Filters Section */}
			<FilterForm
				onFiltersSubmit={handleFiltersSubmit}
				initialValues={searchQuery}
				numberOfActiveFilters={numberOfActiveFilters}
				onClearFilters={clearAllFilters}
				uniqueAssetSymbols={harvestEvalResult.uniqueAssetSymbols}
			/>

			{loading ? (
				<LoadingPage />
			) : (
				<AnimatePresence>
					<HarvestContent harvestEvalResult={harvestEvalResult} />
				</AnimatePresence>
			)}
		</motion.div>
	);
}
