'use client';
import ReactJsonView from '@microlink/react-json-view';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@repo/ui/components/tabs';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import { useTheme } from 'next-themes';
import { LogViewerLayout } from './log-viewer-layout';
import { useCopyStates, useJsonVisibility } from './shared-log-components';

/**
 * Interface for initial lot information in PLAID_TRX_MERGE_ERROR logs
 */
interface InitialLot {
	id?: string;
	legNo?: string | null;
	price?: string;
	fileId?: string;
	gainDay?: string | null;
	orderNo?: string | null;
	adjPrice?: string | null;
	termCode?: string | null;
	accountId?: string;
	costTotal?: string | null;
	createdAt?: string;
	gainTotal?: string | null;
	shortType?: string | null;
	updatedAt?: string;
	externalId?: string | null;
	gainDayPct?: string | null;
	positionId?: string | null;
	assetSymbol?: string;
	marketValue?: string | null;
	originalQty?: string | null;
	portfolioId?: string;
	acquiredDate?: string;
	availableQty?: string | null;
	commPerShare?: string | null;
	exchangeRate?: string | null;
	feesPerShare?: string | null;
	locationCode?: string | null;
	remainingQty?: string;
	lotSourceCode?: string | null;
	paymentCurrency?: string;
	excludeFromHarvest?: number;
	settlementCurrency?: string;
	totalCostForGainPct?: string | null;
}

/**
 * Interface for transaction information in PLAID_TRX_MERGE_ERROR logs
 */
interface Transaction {
	id?: string;
	fee?: string;
	memo?: string;
	type?: string;
	price?: string;
	amount?: string;
	subtype?: string;
	postDate?: string | null;
	quantity?: string;
	accountId?: string;
	createdAt?: string;
	updatedAt?: string;
	datailsURI?: string | null;
	detailsURI?: string | null;
	externalId?: string;
	assetSymbol?: string;
	description?: string | null;
	portfolioId?: string;
	securityType?: string | null;
	appliedToLots?: boolean;
	displaySymbol?: string | null;
	settlementDate?: string | null;
	paymentCurrency?: string;
	transactionDate?: string;
	settlementCurrency?: string;
}

/**
 * Interface for final position information in PLAID_TRX_MERGE_ERROR logs
 */
interface FinalPosition {
	id?: string;
	type?: string | null;
	change?: string | null;
	feesDay?: string | null;
	gainDay?: string | null;
	quantity?: string;
	accountId?: string;
	changePCT?: string | null;
	costTotal?: string | null;
	createdAt?: string;
	feesOther?: string | null;
	gainTotal?: string | null;
	pricePaid?: string | null;
	updatedAt?: string;
	externalId?: string | null;
	assetSymbol?: string;
	marketValue?: string;
	portfolioId?: string;
	quoteStatus?: string | null;
	costPerShare?: string | null;
	dateAcquired?: string | null;
	gainTotalPCT?: string | null;
	commissionDay?: string | null;
	dateExpiration?: string | null;
	commissionTotal?: string | null;
}

/**
 * Interface for lot data in the error information
 */
interface LotData {
	lotId?: string;
	price?: number;
	isNewBuy?: boolean;
	quantity?: number;
	accountId?: string;
	acquiredDate?: string;
}

/**
 * Interface for error details in PLAID_TRX_MERGE_ERROR logs
 */
interface ErrorData {
	data?: {
		symbol?: string;
		lotsData?: LotData[];
		targetValue?: number;
		targetQuantity?: number;
		/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
		uniqueLotChanges?: any[];
	};
	name?: string;
}

/**
 * Interface for PLAID_TRX_MERGE_ERROR log data structure
 */
interface PlaidTrxMergeErrorData {
	error?: ErrorData;
	input?: {
		accountId?: string;
		portfolioId?: string;
		initialLots?: InitialLot[];
		transactions?: Transaction[];
		finalPositions?: FinalPosition[];
	};
}

interface PlaidTrxMergeErrorLogViewProps {
	/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
	data: any;
}

/**
 * Component for displaying PLAID_TRX_MERGE_ERROR log data with tabbed interface
 * @param data - The log data containing error and input information
 */
export function PlaidTrxMergeErrorLogView({
	data,
}: PlaidTrxMergeErrorLogViewProps) {
	const typedData = data as PlaidTrxMergeErrorData;
	const { copiedStates, copyToClipboard } = useCopyStates();
	const { showRawJson, toggleRawJson } = useJsonVisibility();
	const theme = useTheme();

	// Calculate summary metrics
	const totalInitialLots = typedData.input?.initialLots?.length || 0;
	const totalTransactions = typedData.input?.transactions?.length || 0;
	const totalFinalPositions = typedData.input?.finalPositions?.length || 0;
	const totalLotsData = typedData.error?.data?.lotsData?.length || 0;

	// Calculate transaction totals by type
	const transactionsByType =
		typedData.input?.transactions?.reduce(
			(acc, txn) => {
				const type = txn.type || 'unknown';
				acc[type] = (acc[type] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		) || {};

	// Calculate portfolio value from final positions
	const totalPortfolioValue =
		typedData.input?.finalPositions?.reduce(
			(sum, position) => sum + parseFloat(position.marketValue || '0'),
			0,
		) || 0;

	const _totalCostBasis =
		typedData.input?.finalPositions?.reduce(
			(sum, position) => sum + parseFloat(position.costTotal || '0'),
			0,
		) || 0;

	return (
		<LogViewerLayout data={data}>
			<Tabs defaultValue="summary" className="space-y-4">
				<TabsList className="grid grid-cols-5 w-full">
					<TabsTrigger value="summary">Summary</TabsTrigger>
					<TabsTrigger value="error-data">
						Error Data ({totalLotsData})
					</TabsTrigger>
					<TabsTrigger value="initial-lots">
						Initial Lots ({totalInitialLots})
					</TabsTrigger>
					<TabsTrigger value="transactions">
						New Transactions ({totalTransactions})
					</TabsTrigger>
					<TabsTrigger value="final-positions">
						Final Positions ({totalFinalPositions})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="summary" className="space-y-4">
					{/* Error Summary */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Error Summary</CardTitle>
							<Button
								variant="outline"
								size="sm"
								onClick={() => copyToClipboard(typedData.error, 'error')}
								className="ml-auto"
							>
								{copiedStates.error ? (
									<Check className="h-4 w-4" />
								) : (
									<Copy className="h-4 w-4" />
								)}
								<span className="ml-1">
									{copiedStates.error ? 'Copied!' : 'Copy JSON'}
								</span>
							</Button>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Error Name</p>
									<p className="font-medium text-destructive">
										{typedData.error?.name || 'Unknown Error'}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Symbol</p>
									<p className="font-medium font-mono">
										{typedData.error?.data?.symbol || 'N/A'}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Account ID</p>
									<p className="font-mono text-xs break-all">
										{typedData.input?.accountId || 'N/A'}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Portfolio ID</p>
									<p className="font-mono text-xs break-all">
										{typedData.input?.portfolioId || 'N/A'}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Target Information */}
					{typedData.error?.data && (
						<Card>
							<CardHeader>
								<CardTitle>Target Information</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div>
										<p className="text-sm text-muted-foreground">
											Target Quantity
										</p>
										<p className="font-medium font-mono">
											{typedData.error.data.targetQuantity || 0}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Target Value
										</p>
										<p className="font-medium font-mono">
											${typedData.error.data.targetValue?.toFixed(2) || '0.00'}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Lots Data Count
										</p>
										<p className="font-medium">{totalLotsData}</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Unique Lot Changes
										</p>
										<p className="font-medium">
											{typedData.error.data.uniqueLotChanges?.length || 0}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Data Overview */}
					<Card>
						<CardHeader>
							<CardTitle>Data Overview</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Initial Lots</p>
									<p className="font-medium text-lg">{totalInitialLots}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Transactions</p>
									<p className="font-medium text-lg">{totalTransactions}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Final Positions
									</p>
									<p className="font-medium text-lg">{totalFinalPositions}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Portfolio Value
									</p>
									<p className="font-medium text-lg font-mono">
										$
										{totalPortfolioValue.toLocaleString(undefined, {
											minimumFractionDigits: 2,
										})}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Transaction Types */}
					{Object.keys(transactionsByType).length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Transaction Types</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{Object.entries(transactionsByType).map(([type, count]) => (
										<div key={type}>
											<p className="text-sm text-muted-foreground capitalize">
												{type}
											</p>
											<p className="font-medium">{count} transactions</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent value="error-data" className="space-y-4">
					{/* Error Data Overview */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>
								Error Data - {typedData.error?.data?.symbol || 'Unknown Symbol'}
							</CardTitle>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => toggleRawJson('errorData')}
								>
									{showRawJson.errorData ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
									<span className="ml-1">
										{showRawJson.errorData ? 'Hide JSON' : 'Show JSON'}
									</span>
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										copyToClipboard(typedData.error?.data, 'errorData')
									}
								>
									{copiedStates.errorData ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
									<span className="ml-1">
										{copiedStates.errorData ? 'Copied!' : 'Copy JSON'}
									</span>
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							{showRawJson.errorData ? (
								<ReactJsonView
									src={typedData.error?.data || {}}
									theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
									displayDataTypes={false}
									indentWidth={6}
								/>
							) : (
								<>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
										<div>
											<p className="text-sm text-muted-foreground">Symbol</p>
											<p className="font-medium font-mono text-lg">
												{typedData.error?.data?.symbol || 'N/A'}
											</p>
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												Target Quantity
											</p>
											<p className="font-medium font-mono">
												{typedData.error?.data?.targetQuantity || 0}
											</p>
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												Target Value
											</p>
											<p className="font-medium font-mono">
												$
												{typedData.error?.data?.targetValue?.toFixed(2) ||
													'0.00'}
											</p>
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												Lot Changes
											</p>
											<p className="font-medium">
												{typedData.error?.data?.uniqueLotChanges?.length || 0}{' '}
												scenarios
											</p>
										</div>
									</div>

									{/* Lots Data */}
									{typedData.error?.data?.lotsData &&
										typedData.error.data.lotsData.length > 0 && (
											<div className="mb-6">
												<h3 className="text-lg font-semibold mb-3">
													Available Lots
												</h3>
												<div className="overflow-x-auto">
													<table className="w-full text-sm border-collapse">
														<thead>
															<tr className="border-b">
																<th className="text-left p-2 bg-muted">
																	Acquired Date
																</th>
																<th className="text-left p-2 bg-muted">
																	Price
																</th>
																<th className="text-left p-2 bg-muted">
																	Quantity
																</th>
																<th className="text-left p-2 bg-muted">Type</th>
																<th className="text-left p-2 bg-muted">
																	Lot ID
																</th>
															</tr>
														</thead>
														<tbody>
															{[...typedData.error.data.lotsData]
																.sort((a, b) => {
																	const dateA = a.acquiredDate
																		? new Date(a.acquiredDate).getTime()
																		: 0;
																	const dateB = b.acquiredDate
																		? new Date(b.acquiredDate).getTime()
																		: 0;
																	return dateA - dateB;
																})
																.map((lot, index) => (
																	<tr
																		key={lot.lotId || index}
																		className="border-b hover:bg-muted/50"
																	>
																		<td className="p-2">
																			{lot.acquiredDate
																				? new Date(
																						lot.acquiredDate,
																					).toLocaleDateString()
																				: 'N/A'}
																		</td>
																		<td className="p-2 font-mono">
																			${lot.price?.toFixed(4) || '0.0000'}
																		</td>
																		<td className="p-2 font-mono font-medium">
																			{lot.quantity}
																		</td>
																		<td className="p-2">
																			<Badge
																				variant={
																					lot.isNewBuy ? 'default' : 'secondary'
																				}
																			>
																				{lot.isNewBuy ? 'New Buy' : 'Existing'}
																			</Badge>
																		</td>
																		<td className="p-2 font-mono text-xs">
																			{lot.lotId}
																		</td>
																	</tr>
																))}
														</tbody>
													</table>
												</div>
											</div>
										)}

									{/* Unique Lot Changes - The Core Error Source */}
									{typedData.error?.data?.uniqueLotChanges &&
										typedData.error.data.uniqueLotChanges.length > 0 && (
											<div>
												<div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
													<h3 className="text-lg font-semibold text-destructive mb-2 flex items-center">
														<span className="mr-2">⚠️</span>
														Unique Lot Changes - Error Source
													</h3>
													<p className="text-destructive text-sm">
														Found {typedData.error.data.uniqueLotChanges.length}{' '}
														different scenarios for lot allocation. This
														indicates ambiguity in how to allocate the target
														quantity across lots.
													</p>
												</div>
												{typedData.error.data.uniqueLotChanges.map(
													(scenario, scenarioIndex) => {
														// Calculate average cost basis for this scenario
														const totalQuantityAfter = scenario.reduce(
															// biome-ignore lint/suspicious/noExplicitAny: <ok>
															(sum: number, change: any) =>
																sum + (change.quantityFinal || 0),
															0,
														);
														const totalCostBasisAfter = scenario.reduce(
															// biome-ignore lint/suspicious/noExplicitAny: <ok>
															(sum: number, change: any) =>
																sum +
																(change.quantityFinal || 0) *
																	(change.price || 0),
															0,
														);
														const avgCostBasisAfter =
															totalQuantityAfter > 0
																? totalCostBasisAfter / totalQuantityAfter
																: 0;

														// Calculate what the original average cost basis was
														const totalQuantityBefore = scenario.reduce(
															// biome-ignore lint/suspicious/noExplicitAny: <ok>
															(sum: number, change: any) =>
																sum + (change.quantity || 0),
															0,
														);
														const totalCostBasisBefore = scenario.reduce(
															// biome-ignore lint/suspicious/noExplicitAny: <ok>
															(sum: number, change: any) =>
																sum +
																(change.quantity || 0) * (change.price || 0),
															0,
														);
														const avgCostBasisBefore =
															totalQuantityBefore > 0
																? totalCostBasisBefore / totalQuantityBefore
																: 0;

														// Find the final position for this symbol to compare
														const symbol = typedData.error?.data?.symbol;
														const finalPosition =
															typedData.input?.finalPositions?.find(
																(pos) => pos.assetSymbol === symbol,
															);
														const finalPositionQuantity = parseFloat(
															finalPosition?.quantity || '0',
														);
														const finalPositionCostTotal = parseFloat(
															finalPosition?.costTotal || '0',
														);
														const finalPositionAvgCostBasis =
															finalPositionQuantity > 0
																? finalPositionCostTotal / finalPositionQuantity
																: 0;

														return (
															// biome-ignore lint/suspicious/noArrayIndexKey: <ok>
															<div key={scenarioIndex} className="mb-6">
																<div className="bg-muted p-3 rounded-t-lg border">
																	<div className="flex justify-between items-start">
																		<h4 className="font-semibold text-foreground">
																			Scenario {scenarioIndex + 1} of{' '}
																			{typedData.error?.data?.uniqueLotChanges
																				?.length || 0}
																		</h4>
																		<div className="text-right">
																			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																				<div>
																					<div className="text-sm text-muted-foreground">
																						Scenario Cost Basis
																					</div>
																					<div className="font-mono font-medium">
																						<span className="text-muted-foreground">
																							${avgCostBasisBefore.toFixed(4)}
																						</span>
																						<span className="mx-2">→</span>
																						<span
																							className={`font-semibold ${
																								avgCostBasisAfter >
																								avgCostBasisBefore
																									? 'text-red-600 dark:text-red-400'
																									: avgCostBasisAfter <
																											avgCostBasisBefore
																										? 'text-green-600 dark:text-green-400'
																										: 'text-foreground'
																							}`}
																						>
																							${avgCostBasisAfter.toFixed(4)}
																						</span>
																					</div>
																					<div className="text-xs text-muted-foreground">
																						{totalQuantityAfter} shares
																						remaining
																					</div>
																				</div>
																				{finalPosition && (
																					<div className="border-l border-border pl-4 md:border-l-0 md:pl-0">
																						<div className="text-sm text-muted-foreground">
																							Final Position Actual
																						</div>
																						<div className="font-mono font-medium">
																							<span className="text-foreground">
																								$
																								{finalPositionAvgCostBasis.toFixed(
																									4,
																								)}
																							</span>
																							<span className="text-xs text-muted-foreground ml-2">
																								({finalPositionQuantity} shares)
																							</span>
																						</div>
																						{Math.abs(
																							avgCostBasisAfter -
																								finalPositionAvgCostBasis,
																						) > 0.0001 && (
																							<div
																								className={`text-xs font-medium ${
																									Math.abs(
																										avgCostBasisAfter -
																											finalPositionAvgCostBasis,
																									) > 0.01
																										? 'text-destructive'
																										: 'text-orange-600 dark:text-orange-400'
																								}`}
																							>
																								⚠️ Δ $
																								{Math.abs(
																									avgCostBasisAfter -
																										finalPositionAvgCostBasis,
																								).toFixed(4)}{' '}
																								discrepancy
																							</div>
																						)}
																					</div>
																				)}
																			</div>
																		</div>
																	</div>
																</div>
																<div className="border border-t-0 rounded-b-lg overflow-hidden">
																	<div className="overflow-x-auto">
																		<table className="w-full text-sm">
																			<thead>
																				<tr className="bg-secondary">
																					<th className="text-left p-2 border-r">
																						Acquired Date
																					</th>
																					<th className="text-left p-2 border-r">
																						Initial Qty
																					</th>
																					<th className="text-left p-2 border-r">
																						Final Qty
																					</th>
																					<th className="text-left p-2 border-r">
																						Price
																					</th>
																					<th className="text-left p-2 border-r">
																						Change
																					</th>
																					<th className="text-left p-2 border-r">
																						Type
																					</th>
																					<th className="text-left p-2">
																						Lot ID
																					</th>
																				</tr>
																			</thead>
																			<tbody>
																				{[...scenario]
																					/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
																					.sort((a: any, b: any) => {
																						const dateA = a.acquiredDate
																							? new Date(
																									a.acquiredDate,
																								).getTime()
																							: 0;
																						const dateB = b.acquiredDate
																							? new Date(
																									b.acquiredDate,
																								).getTime()
																							: 0;
																						return dateA - dateB;
																					})
																					.map(
																						(
																							/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
																							change: any,
																							changeIndex: number,
																						) => {
																							const quantityChange =
																								change.quantityChange || 0;
																							return (
																								<tr
																									key={
																										change.lotId || changeIndex
																									}
																									className={`border-b hover:bg-muted/30 ${
																										quantityChange > 0
																											? 'bg-red-50 dark:bg-red-950/20'
																											: quantityChange === 0
																												? ''
																												: ''
																									}`}
																								>
																									<td className="p-2 border-r">
																										{change.acquiredDate
																											? new Date(
																													change.acquiredDate,
																												).toLocaleDateString()
																											: 'N/A'}
																									</td>
																									<td className="p-2 font-mono border-r">
																										{change.quantity}
																									</td>
																									<td className="p-2 font-mono border-r font-medium">
																										{change.quantityFinal}
																									</td>
																									<td className="p-2 font-mono border-r">
																										$
																										{change.price?.toFixed(4) ||
																											'0.0000'}
																									</td>
																									<td
																										className={`p-2 font-mono border-r font-semibold ${
																											quantityChange > 0
																												? 'text-red-600 dark:text-red-400'
																												: quantityChange === 0
																													? 'text-green-600 dark:text-green-400'
																													: 'text-muted-foreground'
																										}`}
																									>
																										{quantityChange > 0
																											? '-'
																											: ''}
																										{Math.abs(quantityChange)}
																									</td>
																									<td className="p-2 border-r">
																										<Badge
																											variant={
																												change.isNewBuy
																													? 'default'
																													: 'secondary'
																											}
																										>
																											{change.isNewBuy
																												? 'New'
																												: 'Existing'}
																										</Badge>
																									</td>
																									<td className="p-2 font-mono text-xs">
																										{change.lotId?.substring(
																											0,
																											8,
																										)}
																										...
																									</td>
																								</tr>
																							);
																						},
																					)}
																			</tbody>
																		</table>
																	</div>
																	<div className="p-3 bg-muted text-sm">
																		<strong>
																			Total quantity changes in this scenario:
																		</strong>{' '}
																		{scenario.reduce(
																			/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
																			(sum: number, change: any) =>
																				sum +
																				Math.abs(change.quantityChange || 0),
																			0,
																		)}{' '}
																		shares
																	</div>
																</div>
															</div>
														);
													},
												)}
											</div>
										)}
								</>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="initial-lots" className="space-y-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Initial Lots ({totalInitialLots})</CardTitle>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => toggleRawJson('initialLots')}
								>
									{showRawJson.initialLots ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
									<span className="ml-1">
										{showRawJson.initialLots ? 'Hide JSON' : 'Show JSON'}
									</span>
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										copyToClipboard(typedData.input?.initialLots, 'initialLots')
									}
								>
									{copiedStates.initialLots ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
									<span className="ml-1">
										{copiedStates.initialLots ? 'Copied!' : 'Copy JSON'}
									</span>
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							{showRawJson.initialLots ? (
								<ReactJsonView
									src={typedData.input?.initialLots || []}
									theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
									displayDataTypes={false}
									indentWidth={6}
								/>
							) : typedData.input?.initialLots &&
								typedData.input.initialLots.length > 0 ? (
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b">
												<th className="text-left p-2">Asset</th>
												<th className="text-left p-2">Price</th>
												<th className="text-left p-2">Remaining Qty</th>
												<th className="text-left p-2">Acquired Date</th>
												<th className="text-left p-2">Currency</th>
												<th className="text-left p-2">Exclude from Harvest</th>
											</tr>
										</thead>
										<tbody>
											{typedData.input.initialLots.map((lot, index) => (
												<tr key={lot.id || index} className="border-b">
													<td className="p-2 font-mono font-semibold">
														{lot.assetSymbol}
													</td>
													<td className="p-2 font-mono">
														${parseFloat(lot.price || '0').toFixed(4)}
													</td>
													<td className="p-2 font-mono">{lot.remainingQty}</td>
													<td className="p-2">
														{lot.acquiredDate
															? new Date(lot.acquiredDate).toLocaleDateString()
															: 'N/A'}
													</td>
													<td className="p-2">{lot.paymentCurrency}</td>
													<td className="p-2">
														<Badge
															variant={
																lot.excludeFromHarvest === 1
																	? 'destructive'
																	: 'secondary'
															}
														>
															{lot.excludeFromHarvest === 1
																? 'Excluded'
																: 'Included'}
														</Badge>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<p className="text-muted-foreground">
									No initial lots data available
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="transactions" className="space-y-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Transactions ({totalTransactions})</CardTitle>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => toggleRawJson('transactions')}
								>
									{showRawJson.transactions ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
									<span className="ml-1">
										{showRawJson.transactions ? 'Hide JSON' : 'Show JSON'}
									</span>
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										copyToClipboard(
											typedData.input?.transactions,
											'transactions',
										)
									}
								>
									{copiedStates.transactions ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
									<span className="ml-1">
										{copiedStates.transactions ? 'Copied!' : 'Copy JSON'}
									</span>
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							{showRawJson.transactions ? (
								<ReactJsonView
									src={typedData.input?.transactions || []}
									theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
									displayDataTypes={false}
									indentWidth={6}
								/>
							) : typedData.input?.transactions &&
								typedData.input.transactions.length > 0 ? (
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b">
												<th className="text-left p-2">Date</th>
												<th className="text-left p-2">Type</th>
												<th className="text-left p-2">Asset</th>
												<th className="text-left p-2">Quantity</th>
												<th className="text-left p-2">Price</th>
												<th className="text-left p-2">Amount</th>
												<th className="text-left p-2">Fee</th>
												<th className="text-left p-2">Memo</th>
											</tr>
										</thead>
										<tbody>
											{[...typedData.input.transactions]
												.sort(
													(a, b) =>
														new Date(b.transactionDate || '').getTime() -
														new Date(a.transactionDate || '').getTime(),
												)
												.slice(0, 100)
												.map((txn, index) => {
													const amount = parseFloat(txn.amount || '0');
													return (
														<tr key={txn.id || index} className="border-b">
															<td className="p-2">
																{txn.transactionDate
																	? new Date(
																			txn.transactionDate,
																		).toLocaleDateString()
																	: 'N/A'}
															</td>
															<td className="p-2">
																<Badge
																	variant={
																		txn.type === 'buy'
																			? 'default'
																			: txn.type === 'sell'
																				? 'destructive'
																				: 'secondary'
																	}
																>
																	{txn.type?.toUpperCase()}
																</Badge>
															</td>
															<td className="p-2 font-mono font-semibold">
																{txn.assetSymbol}
															</td>
															<td className="p-2 font-mono">{txn.quantity}</td>
															<td className="p-2 font-mono">
																${parseFloat(txn.price || '0').toFixed(4)}
															</td>
															<td
																className={`p-2 font-mono ${amount >= 0 ? 'text-green-600' : 'text-red-600'}`}
															>
																$
																{Math.abs(amount).toLocaleString(undefined, {
																	minimumFractionDigits: 2,
																})}
															</td>
															<td className="p-2 font-mono">
																${parseFloat(txn.fee || '0').toFixed(4)}
															</td>
															<td
																className="p-2 max-w-xs truncate"
																title={txn.memo}
															>
																{txn.memo}
															</td>
														</tr>
													);
												})}
										</tbody>
									</table>
									{typedData.input.transactions.length > 100 && (
										<p className="text-sm text-muted-foreground mt-2">
											Showing first 100 transactions of{' '}
											{typedData.input.transactions.length} total
										</p>
									)}
								</div>
							) : (
								<p className="text-muted-foreground">
									No transactions data available
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="final-positions" className="space-y-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Final Positions ({totalFinalPositions})</CardTitle>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => toggleRawJson('finalPositions')}
								>
									{showRawJson.finalPositions ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
									<span className="ml-1">
										{showRawJson.finalPositions ? 'Hide JSON' : 'Show JSON'}
									</span>
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										copyToClipboard(
											typedData.input?.finalPositions,
											'finalPositions',
										)
									}
								>
									{copiedStates.finalPositions ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
									<span className="ml-1">
										{copiedStates.finalPositions ? 'Copied!' : 'Copy JSON'}
									</span>
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							{showRawJson.finalPositions ? (
								<ReactJsonView
									src={typedData.input?.finalPositions || []}
									theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
									displayDataTypes={false}
									indentWidth={6}
								/>
							) : typedData.input?.finalPositions &&
								typedData.input.finalPositions.length > 0 ? (
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b">
												<th className="text-left p-2">Asset</th>
												<th className="text-left p-2">Quantity</th>
												<th className="text-left p-2">Market Value</th>
												<th className="text-left p-2">Cost Total</th>
												<th className="text-left p-2">P&L</th>
												<th className="text-left p-2">% Change</th>
											</tr>
										</thead>
										<tbody>
											{[...typedData.input.finalPositions]
												.sort(
													(a, b) =>
														parseFloat(b.marketValue || '0') -
														parseFloat(a.marketValue || '0'),
												)
												.map((position, index) => {
													const marketValue = parseFloat(
														position.marketValue || '0',
													);
													const costTotal = parseFloat(
														position.costTotal || '0',
													);
													const pnl = marketValue - costTotal;
													const pnlPercent =
														costTotal > 0 ? (pnl / costTotal) * 100 : 0;

													return (
														<tr key={position.id || index} className="border-b">
															<td className="p-2 font-mono font-semibold">
																{position.assetSymbol}
															</td>
															<td className="p-2 font-mono">
																{position.quantity}
															</td>
															<td className="p-2 font-mono font-medium">
																$
																{marketValue.toLocaleString(undefined, {
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2,
																})}
															</td>
															<td className="p-2 font-mono">
																$
																{costTotal.toLocaleString(undefined, {
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2,
																})}
															</td>
															<td
																className={`p-2 font-mono ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}
															>
																$
																{pnl.toLocaleString(undefined, {
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2,
																})}
															</td>
															<td
																className={`p-2 font-mono ${pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}
															>
																{pnlPercent.toFixed(2)}%
															</td>
														</tr>
													);
												})}
										</tbody>
									</table>
								</div>
							) : (
								<p className="text-muted-foreground">
									No final positions data available
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</LogViewerLayout>
	);
}
