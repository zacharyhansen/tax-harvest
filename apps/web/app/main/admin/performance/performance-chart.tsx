'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
} from '@repo/ui/components/chart';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@repo/ui/components/select';
import { Skeleton } from '@repo/ui/components/skeleton';
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
	PerformanceTimeSpan,
	usePortfolioPerformanceByAccountQuery,
	usePortfolioPerformanceByPositionQuery,
} from '~/generated/gql';

export const description = 'Portfolio performance over time';

type TDataPoint = {
	// biome-ignore lint/suspicious/noExplicitAny: <type conflict>
	date: any; // this is date string
	portfolioTotal: number;
} & Record<string, number>;
/**
 * Map API time spans to display labels
 */
const timeSpanLabels: Record<PerformanceTimeSpan, string> = {
	[PerformanceTimeSpan.Ytd]: 'Year to Date',
	[PerformanceTimeSpan.SixMonths]: 'Last 6 Months',
	[PerformanceTimeSpan.OneYear]: 'Last Year',
	[PerformanceTimeSpan.TwoYears]: 'Last 2 Years',
	[PerformanceTimeSpan.All]: 'All Time',
};

/**
 * Performance view types
 */
type PerformanceViewType = 'position' | 'portfolioValue' | 'profitAndLoss';

/**
 * Map performance types to display labels
 */
const performanceTypeLabels: Record<PerformanceViewType, string> = {
	portfolioValue: 'Portfolio Value',
	profitAndLoss: 'Profit And Loss',
	position: 'By Position',
};

// const chartConfig = {
// 	portfolioTotal: {
// 		label: 'Portfolio Value',
// 		color: 'var(--chart-1)',
// 	},
// } satisfies ChartConfig;

/**
 * Generate dynamic chart colors
 */
const generateChartColors = (count: number) => {
	const colors = [
		'var(--chart-1)',
		'var(--chart-2)',
		'var(--chart-3)',
		'var(--chart-4)',
		'var(--chart-5)',
	];
	return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

/**
 * Interactive portfolio performance chart component
 * Displays portfolio value over time with configurable time ranges and data types
 * @example
 * <PerformanceChart />
 */
export function PerformanceChart() {
	const [timeSpan, setTimeSpan] = React.useState<PerformanceTimeSpan>(
		PerformanceTimeSpan.SixMonths,
	);
	const [performanceType, setPerformanceType] =
		React.useState<PerformanceViewType>('portfolioValue');

	// Use account query for account view
	const {
		data: accountData,
		loading: accountLoading,
		error: accountError,
	} = usePortfolioPerformanceByAccountQuery({
		variables: { timeSpan },
		skip: performanceType === 'position',
	});

	// Use position query for position view
	const {
		data: positionData,
		loading: positionLoading,
		error: positionError,
	} = usePortfolioPerformanceByPositionQuery({
		variables: { timeSpan },
		skip: performanceType !== 'position',
	});

	const loading = accountLoading || positionLoading;
	const error = accountError || positionError;

	// Generate config for dynamic series
	const dynamicChartConfig = React.useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: <ok>
		(points: Record<string, any>[]): [ChartConfig, string[]] => {
			if (points.length === 0) return [{}, [] as string[]];
			const keys = new Set<string>();
			points.forEach((point) => {
				Object.keys(point).forEach((key) => {
					if (key !== 'date' && key !== 'portfolioTotal') {
						keys.add(key);
					}
				});
			});
			const seriesKeys = Array.from(keys);

			const config: ChartConfig = {};
			const colors = generateChartColors(seriesKeys.length);
			seriesKeys.forEach((key, index) => {
				config[key] = {
					label: key,
					color: colors[index],
				};
			});
			return [config, seriesKeys];
		},
		[],
	);

	const chartDataPosition = React.useMemo(() => {
		const data =
			positionData?.portfolioPerformanceByPosition.map((point) => {
				const dataPoint: TDataPoint = {
					// biome-ignore lint/suspicious/noExplicitAny: <type conflict>
					date: point.date as any,
					portfolioTotal: point.portfolioTotal,
				};
				// Add position values
				point.positions?.forEach((position) => {
					dataPoint[position.symbol] = position.value;
				});
				return dataPoint;
			}) || [];
		return data;
	}, [positionData]);

	const [dataPortfolioValue, dataProfitAndLoss] = React.useMemo(() => {
		const dataPortfolioValue: TDataPoint[] = [];
		const dataProfitAndLoss: TDataPoint[] = [];

		accountData?.portfolioPerformanceByAccount.forEach((point) => {
			const baseDataPoint: TDataPoint = {
				// biome-ignore lint/suspicious/noExplicitAny: <type conflict>
				date: point.date as any,
				portfolioTotal: point.portfolioTotal,
			};
			dataPortfolioValue.push({
				...baseDataPoint,
				Cash: point.accounts.reduce(
					(acc, account) => acc + account.valueCash,
					0,
				),
				Investments: point.accounts.reduce(
					(acc, account) => acc + account.valueAssets,
					0,
				),
				Total: point.accounts.reduce(
					(acc, account) => acc + account.valueTotal,
					0,
				),
			});
			dataProfitAndLoss.push({
				...baseDataPoint,
				'Unrealized Profit': point.accounts.reduce(
					(acc, account) => acc + account.unrealizedProfit,
					0,
				),
				'Unrealized Loss': point.accounts.reduce(
					(acc, account) => acc + account.unrealizedLoss,
					0,
				),
				'Realized Profit And Loss Short Term': point.accounts.reduce(
					(acc, account) => acc + account.realizedPAndLShortTerm,
					0,
				),
				'Realized Profit And Loss Long Term': point.accounts.reduce(
					(acc, account) => acc + account.realizedPAndLLongTerm,
					0,
				),
			});
		}) || [];

		return [dataPortfolioValue, dataProfitAndLoss];
	}, [accountData]);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);
	};

	const hasData = dataPortfolioValue.length > 0 || chartDataPosition.length > 0;

	const [chartConfig, seriesKeys] = React.useMemo(() => {
		return dynamicChartConfig(
			performanceType === 'position'
				? chartDataPosition
				: performanceType === 'portfolioValue'
					? dataPortfolioValue
					: dataProfitAndLoss,
		);
	}, [
		performanceType,
		chartDataPosition,
		dataPortfolioValue,
		dataProfitAndLoss,
		dynamicChartConfig,
	]);

	if (error) {
		return (
			<Card className="pt-0">
				<CardHeader className="border-b py-5">
					<CardTitle>Portfolio Performance</CardTitle>
					<CardDescription className="text-destructive">
						Unable to load performance data. Please try again later.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	if (!hasData && !loading) {
		return (
			<Card className="pt-0">
				<CardHeader className="border-b py-5">
					<CardTitle>Portfolio Performance</CardTitle>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className="pt-0 z-50">
			<CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
				<div className="grid flex-1 gap-1">
					<CardTitle>Portfolio Performance</CardTitle>
					<CardDescription>
						{loading
							? 'Loading performance data...'
							: `${performanceTypeLabels[performanceType]} - ${timeSpanLabels[timeSpan]}`}
					</CardDescription>
				</div>
				<div className="flex gap-2">
					<Select
						value={performanceType}
						onValueChange={(value) =>
							setPerformanceType(value as PerformanceViewType)
						}
					>
						<SelectTrigger
							className="hidden w-[200px] rounded-lg sm:flex"
							aria-label="Select data type"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value="portfolioValue" className="rounded-lg">
								{performanceTypeLabels.portfolioValue}
							</SelectItem>
							<SelectItem value="profitAndLoss" className="rounded-lg">
								{performanceTypeLabels.profitAndLoss}
							</SelectItem>
							<SelectItem value="position" className="rounded-lg">
								{performanceTypeLabels.position}
							</SelectItem>
						</SelectContent>
					</Select>
					<Select
						value={timeSpan}
						onValueChange={(value) => setTimeSpan(value as PerformanceTimeSpan)}
					>
						<SelectTrigger
							className="hidden w-[160px] rounded-lg sm:flex"
							aria-label="Select time range"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem
								value={PerformanceTimeSpan.Ytd}
								className="rounded-lg"
							>
								{timeSpanLabels[PerformanceTimeSpan.Ytd]}
							</SelectItem>
							<SelectItem
								value={PerformanceTimeSpan.SixMonths}
								className="rounded-lg"
							>
								{timeSpanLabels[PerformanceTimeSpan.SixMonths]}
							</SelectItem>
							<SelectItem
								value={PerformanceTimeSpan.OneYear}
								className="rounded-lg"
							>
								{timeSpanLabels[PerformanceTimeSpan.OneYear]}
							</SelectItem>
							<SelectItem
								value={PerformanceTimeSpan.TwoYears}
								className="rounded-lg"
							>
								{timeSpanLabels[PerformanceTimeSpan.TwoYears]}
							</SelectItem>
							<SelectItem
								value={PerformanceTimeSpan.All}
								className="rounded-lg"
							>
								{timeSpanLabels[PerformanceTimeSpan.All]}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				{loading ? (
					<div className="relative aspect-auto h-[350px] w-full">
						{/* Chart area skeleton with gradient effect */}
						<div className="absolute inset-x-0 top-0 bottom-8 mx-2 sm:mx-6">
							{/* Grid lines */}
							<div className="absolute inset-0 flex flex-col justify-between opacity-20">
								{[...Array(5)].map((_, i) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: <ok>
										key={i}
										className="h-px bg-border"
										style={{ strokeDasharray: '3 3' }}
									/>
								))}
							</div>
							{/* Animated wave effect for chart area */}
							<div className="absolute inset-0 overflow-hidden">
								<div
									className="absolute inset-0 bg-gradient-to-t from-chart-1/10 to-chart-1/5 animate-pulse"
									style={{
										clipPath:
											'polygon(0% 60%, 15% 55%, 30% 58%, 45% 52%, 60% 48%, 75% 45%, 90% 40%, 100% 35%, 100% 100%, 0% 100%)',
									}}
								/>
								<div
									className="absolute inset-0 bg-gradient-to-t from-chart-2/10 to-chart-2/5 animate-pulse delay-75"
									style={{
										clipPath:
											'polygon(0% 75%, 15% 72%, 30% 70%, 45% 68%, 60% 65%, 75% 62%, 90% 58%, 100% 55%, 100% 100%, 0% 100%)',
									}}
								/>
							</div>
						</div>
						{/* Y-axis skeleton */}
						<div className="absolute left-2 sm:left-6 top-0 bottom-8 flex flex-col justify-between w-12">
							{[...Array(5)].map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <ok>
								<Skeleton key={i} className="h-3 w-full" />
							))}
						</div>
						{/* X-axis skeleton */}
						<div className="absolute bottom-0 left-16 right-2 sm:right-6 flex justify-between">
							{[...Array(6)].map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <ok>
								<Skeleton key={i} className="h-3 w-10" />
							))}
						</div>
					</div>
				) : hasData ? (
					<ChartContainer
						config={chartConfig}
						className="aspect-auto h-[350px] w-full"
					>
						<AreaChart
							data={
								performanceType === 'position'
									? chartDataPosition
									: performanceType === 'portfolioValue'
										? dataPortfolioValue
										: dataProfitAndLoss
							}
							margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
						>
							<defs>
								{/* Create gradients for each series */}
								{seriesKeys.map((key) => (
									<linearGradient
										key={key}
										id={`${key.replaceAll(' ', '-')}`}
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop
											offset="5%"
											stopColor={chartConfig[key]?.color || 'var(--chart-1)'}
											stopOpacity={0.8}
										/>
										<stop
											offset="95%"
											stopColor={chartConfig[key]?.color || 'var(--chart-1)'}
											stopOpacity={0.1}
										/>
									</linearGradient>
								))}
							</defs>
							<CartesianGrid vertical={false} strokeDasharray="3 3" />
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={32}
								tickFormatter={(value) => {
									const date = new Date(value);
									return date.toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
									});
								}}
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={formatCurrency}
							/>
							<ChartTooltip
								content={(props) => {
									if (!props.active || !props.payload || !props.label)
										return null;
									return (
										<div className="rounded-lg bg-background p-3 shadow-md border z-50">
											<div className="text-xs text-muted-foreground mb-2">
												{new Date(props.label).toLocaleDateString('en-US', {
													weekday: 'short',
													month: 'long',
													day: 'numeric',
													year: 'numeric',
												})}
											</div>
											{props.payload
												.filter(
													(entry) =>
														entry.value !== null && entry.value !== undefined,
												)
												.sort((a, b) => {
													// Sort to show portfolio total first
													if (a.dataKey === 'portfolioTotal') return -1;
													if (b.dataKey === 'portfolioTotal') return 1;
													return (b.value || 0) - (a.value || 0);
												})
												.map((entry) => (
													<div
														key={entry.dataKey}
														className="flex justify-between items-center gap-4 text-sm"
													>
														<span
															className={`${
																entry.dataKey === 'portfolioTotal'
																	? 'font-semibold'
																	: 'text-muted-foreground'
															}`}
														>
															{entry.dataKey === 'portfolioTotal'
																? 'Total'
																: entry.dataKey}
														</span>
														<span className="font-medium">
															{formatCurrency(entry.value)}
														</span>
													</div>
												))}
										</div>
									);
								}}
							/>
							{/* Render area for each series */}
							{seriesKeys.map((key) => (
								<Area
									key={key}
									dataKey={key}
									type="monotone"
									stackId="1"
									fill={`url(#${key.replaceAll(' ', '-')})`}
									stroke={chartConfig[key]?.color || 'var(--chart-1)'}
									strokeWidth={1.5}
								/>
							))}
						</AreaChart>
					</ChartContainer>
				) : (
					<div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
						No performance data available for the selected period
					</div>
				)}
			</CardContent>
		</Card>
	);
}
