/** biome-ignore-all lint/suspicious/noExplicitAny: <ok> */
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
import { Format } from '~/modules/utils';
import { LogViewerLayout } from './log-viewer-layout';
import { useCopyStates, useJsonVisibility } from './shared-log-components';

interface Transaction {
	id?: string;
	fee?: string;
	memo?: string;
	type?: string;
	price?: string;
	amount?: string;
	subtype?: string;
	quantity?: string;
	accountId?: string;
	externalId?: string;
	assetSymbol?: string;
	description?: string;
	portfolioId?: string;
	securityType?: string;
	transactionDate?: string;
	paymentCurrency?: string;
	settlementCurrency?: string;
	settlementDate?: string;
	appliedToLots?: boolean;
}

interface Lot {
	id?: string;
	accountId?: string;
	acquiredDate?: string;
	costBasis?: string;
	gainTotal?: string;
	gainTotalPct?: string;
	lastPrice?: string;
	price?: string;
	remainingQty?: string;
	assetSymbol?: string;
	value?: string;
	dollarPerSharePnL?: string;
	taxGain?: string;
	originalQty?: number;
	processQty?: number;
}

interface Position {
	id?: string;
	quantity?: string;
	assetSymbol?: string;
	averageCost?: string;
	costTotal?: string;
	marketValue?: string;
}

interface LotChangeLog {
	id: string;
	createdAt: string;
	operationType: string;
	lotId?: string;
	accountId: string;
	portfolioId: string;
	lotBefore?: any;
	lotAfter?: any;
	quantityChange?: string;
	source?: string;
	processed: boolean;
	transactionId?: string;
	lot?: {
		id: string;
		assetSymbol: string;
		remainingQty: string;
		price: string;
		acquiredDate: string;
		marketValue?: string;
		costTotal?: string;
		gainTotal?: string;
		originalQty?: string;
		availableQty?: string;
	};
	transaction?: {
		id: string;
		externalId: string;
		type?: string;
		subtype?: string;
		transactionDate?: string;
		description?: string;
		assetSymbol: string;
		quantity?: string;
		price?: string;
		amount?: string;
		fee?: string;
	};
}

interface LotTransactionBatch {
	id: string;
	createdAt: string;
	updatedAt: string;
	accountId: string;
	portfolioId: string;
	positionsBefore?: any;
	positionsAfter?: any;
	holdingsPayload?: any;
	lotTupleMap?: any;
	initialLots?: any;
	newTransactions?: any;
	newBuys?: any;
	newSells?: any;
	realizedProfitAndLoss?: string;
	deletedLots?: any;
	lotChangeLog: LotChangeLog[];
	account: {
		id: string;
		name?: string;
		type: string;
		externalId?: string;
	};
}

interface PlaidTrxMergeData {
	initialLots?: Lot[];
	transactions?: Transaction[];
	authConnection?: any;
	finalPositions?: Position[];
}

interface PlaidTrxMergeLogViewProps {
	data: any;
	LotTransactionBatch?: LotTransactionBatch[];
}

/**
 * Component for displaying PLAID_TRX_MERGE log data with tabbed interface
 * @param data - The merge data containing lots, transactions, and positions
 * @param LotTransactionBatch - Optional batch data for lot transactions
 */
export function PlaidTrxMergeLogView({
	data,
	LotTransactionBatch,
}: PlaidTrxMergeLogViewProps) {
	const typedData = data as PlaidTrxMergeData;
	const lotBatches = LotTransactionBatch || [];
	const { copiedStates, copyToClipboard } = useCopyStates();
	const { showRawJson, toggleRawJson } = useJsonVisibility();
	const theme = useTheme();

	// Calculate summary metrics
	const totalInitialLots = typedData.initialLots?.length || 0;
	const totalTransactions = typedData.transactions?.length || 0;
	const totalFinalPositions = typedData.finalPositions?.length || 0;
	const totalBatches = lotBatches.length;

	// Calculate transaction totals by type
	const transactionsByType =
		typedData.transactions?.reduce(
			(acc, txn) => {
				const type = txn.type || 'unknown';
				acc[type] = (acc[type] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		) || {};

	// Calculate portfolio value from final positions
	const totalPortfolioValue =
		typedData.finalPositions?.reduce(
			(sum, position) => sum + parseFloat(position.marketValue || '0'),
			0,
		) || 0;

	const totalCostBasis =
		typedData.finalPositions?.reduce(
			(sum, position) => sum + parseFloat(position.costTotal || '0'),
			0,
		) || 0;

	// Calculate total P&L
	const totalPnL = totalPortfolioValue - totalCostBasis;
	const totalPnLPercent =
		totalCostBasis > 0 ? (totalPnL / totalCostBasis) * 100 : 0;

	return (
		<LogViewerLayout data={data}>
			<Tabs defaultValue="summary" className="space-y-4">
				<TabsList
					className="grid w-full"
					style={{
						gridTemplateColumns: `repeat(${totalBatches > 0 ? 6 : 5}, 1fr)`,
					}}
				>
					<TabsTrigger value="summary">Summary</TabsTrigger>
					<TabsTrigger value="initial-lots">
						Initial Lots ({totalInitialLots})
					</TabsTrigger>
					<TabsTrigger value="transactions">
						Transactions ({totalTransactions})
					</TabsTrigger>
					<TabsTrigger value="final-positions">
						Final Positions ({totalFinalPositions})
					</TabsTrigger>
					<TabsTrigger value="auth">Auth Connection</TabsTrigger>
					{totalBatches > 0 && (
						<TabsTrigger value="batches">Batches ({totalBatches})</TabsTrigger>
					)}
				</TabsList>

				<TabsContent value="summary" className="space-y-4">
					{/* Summary Overview */}
					<Card>
						<CardHeader>
							<CardTitle>Transaction Merge Summary</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
								<div>
									<p className="text-sm text-muted-foreground">Initial Lots</p>
									<p className="text-lg font-medium">{totalInitialLots}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Transactions</p>
									<p className="text-lg font-medium">{totalTransactions}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Final Positions
									</p>
									<p className="text-lg font-medium">{totalFinalPositions}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Auth Connection
									</p>
									<p className="text-lg font-medium">
										{typedData.authConnection ? 'Yes' : 'No'}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Portfolio Metrics */}
					<Card>
						<CardHeader>
							<CardTitle>Plaid Portfolio Metrics</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
								<div>
									<p className="text-sm text-muted-foreground">
										Total Market Value
									</p>
									<p className="text-lg font-medium font-mono">
										$
										{totalPortfolioValue.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Total Cost Basis
									</p>
									<p className="text-lg font-medium font-mono">
										$
										{totalCostBasis.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Total P&L</p>
									<p
										className={`text-lg font-medium font-mono ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}
									>
										$
										{totalPnL.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Total P&L %</p>
									<p
										className={`text-lg font-medium font-mono ${totalPnLPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}
									>
										{totalPnLPercent.toFixed(2)}%
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
										copyToClipboard(typedData.initialLots, 'initialLots')
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
									src={typedData.initialLots || []}
									theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
									displayDataTypes={false}
									indentWidth={6}
								/>
							) : typedData.initialLots && typedData.initialLots.length > 0 ? (
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b">
												<th className="p-2 text-left">Symbol</th>
												<th className="p-2 text-left">Quantity</th>
												<th className="p-2 text-left">Cost Basis</th>
												<th className="p-2 text-left">Current Value</th>
												<th className="p-2 text-left">Gain/Loss</th>
												<th className="p-2 text-left">Gain %</th>
												<th className="p-2 text-left">Tax Status</th>
												<th className="p-2 text-left">Acquired Date</th>
											</tr>
										</thead>
										<tbody>
											{typedData.initialLots.map((lot, index) => {
												const gainLoss = lot.gainTotal
													? parseFloat(lot.gainTotal)
													: 0;
												const gainPct = lot.gainTotalPct
													? parseFloat(lot.gainTotalPct)
													: 0;

												return (
													<tr key={lot.id || index} className="border-b">
														<td className="p-2 font-mono font-semibold">
															{lot.assetSymbol}
														</td>
														<td className="p-2 font-mono">
															{lot.remainingQty}
														</td>
														<td className="p-2 font-mono">${lot.costBasis}</td>
														<td className="p-2 font-mono">${lot.value}</td>
														<td
															className={`p-2 font-mono ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}
														>
															${lot.gainTotal}
														</td>
														<td
															className={`p-2 font-mono ${gainPct >= 0 ? 'text-green-600' : 'text-red-600'}`}
														>
															{gainPct.toFixed(2)}%
														</td>
														<td className="p-2">
															<Badge
																variant={
																	lot.taxGain === 'LONG'
																		? 'default'
																		: 'secondary'
																}
															>
																{lot.taxGain}
															</Badge>
														</td>
														<td className="p-2">
															{lot.acquiredDate
																? new Date(
																		lot.acquiredDate,
																	).toLocaleDateString()
																: 'N/A'}
														</td>
													</tr>
												);
											})}
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
										copyToClipboard(typedData.transactions, 'transactions')
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
									src={typedData.transactions || []}
									theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
									displayDataTypes={false}
									indentWidth={6}
								/>
							) : typedData.transactions &&
								typedData.transactions.length > 0 ? (
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b">
												<th className="p-2 text-left">Date</th>
												<th className="p-2 text-left">Type</th>
												<th className="p-2 text-left">Symbol</th>
												<th className="p-2 text-left">Quantity</th>
												<th className="p-2 text-left">Price</th>
												<th className="p-2 text-left">Amount</th>
												<th className="p-2 text-left">Fee</th>
												<th className="p-2 text-left">Memo</th>
											</tr>
										</thead>
										<tbody>
											{[...typedData.transactions]
												.sort(
													(a, b) =>
														new Date(b.transactionDate || '').getTime() -
														new Date(a.transactionDate || '').getTime(),
												)
												.slice(0, 100)
												.map((transaction, index) => {
													const amount = parseFloat(transaction.amount || '0');
													return (
														<tr
															key={transaction.id || index}
															className="border-b"
														>
															<td className="p-2">
																{transaction.transactionDate
																	? new Date(
																			transaction.transactionDate,
																		).toLocaleDateString()
																	: 'N/A'}
															</td>
															<td className="p-2">
																<Badge
																	variant={
																		transaction.type === 'buy'
																			? 'default'
																			: transaction.type === 'sell'
																				? 'destructive'
																				: 'secondary'
																	}
																>
																	{transaction.type?.toUpperCase()}
																</Badge>
															</td>
															<td className="p-2 font-mono font-semibold">
																{transaction.assetSymbol}
															</td>
															<td className="p-2 font-mono">
																{transaction.quantity}
															</td>
															<td className="p-2 font-mono">
																$
																{parseFloat(transaction.price || '0').toFixed(
																	4,
																)}
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
																${parseFloat(transaction.fee || '0').toFixed(4)}
															</td>
															<td
																className="p-2 max-w-xs truncate"
																title={transaction.memo}
															>
																{transaction.memo}
															</td>
														</tr>
													);
												})}
										</tbody>
									</table>
									{typedData.transactions.length > 100 && (
										<p className="text-sm text-muted-foreground mt-2">
											Showing first 100 transactions of{' '}
											{typedData.transactions.length} total
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
										copyToClipboard(typedData.finalPositions, 'finalPositions')
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
									src={typedData.finalPositions || []}
									theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
									displayDataTypes={false}
									indentWidth={6}
								/>
							) : typedData.finalPositions &&
								typedData.finalPositions.length > 0 ? (
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b">
												<th className="p-2 text-left">Symbol</th>
												<th className="p-2 text-left">Quantity</th>
												<th className="p-2 text-left">Average Cost</th>
												<th className="p-2 text-left">Cost Total</th>
												<th className="p-2 text-left">Market Value</th>
												<th className="p-2 text-left">P&L</th>
												<th className="p-2 text-left">P&L %</th>
											</tr>
										</thead>
										<tbody>
											{[...typedData.finalPositions]
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
															<td className="p-2 font-mono">
																{position.averageCost
																	? `$${parseFloat(position.averageCost).toFixed(4)}`
																	: 'N/A'}
															</td>
															<td className="p-2 font-mono">
																{Format.money(position.costTotal)}
															</td>
															<td className="p-2 font-mono font-medium">
																{Format.money(position.marketValue)}
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

				<TabsContent value="auth" className="space-y-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Authentication Connection</CardTitle>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => toggleRawJson('authConnection')}
								>
									{showRawJson.authConnection ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
									<span className="ml-1">
										{showRawJson.authConnection ? 'Hide JSON' : 'Show JSON'}
									</span>
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										copyToClipboard(typedData.authConnection, 'authConnection')
									}
								>
									{copiedStates.authConnection ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
									<span className="ml-1">
										{copiedStates.authConnection ? 'Copied!' : 'Copy JSON'}
									</span>
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							{showRawJson.authConnection ? (
								<ReactJsonView
									src={typedData.authConnection || {}}
									theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
									displayDataTypes={false}
									indentWidth={6}
								/>
							) : typedData.authConnection ? (
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									{Object.entries(typedData.authConnection).map(
										([key, value]) => (
											<div key={key}>
												<p className="text-sm text-muted-foreground capitalize">
													{key.replace(/([A-Z])/g, ' $1').trim()}
												</p>
												<p className="font-mono text-sm">
													{typeof value === 'object'
														? JSON.stringify(value)
														: String(value)}
												</p>
											</div>
										),
									)}
								</div>
							) : (
								<p className="text-muted-foreground">
									No authentication connection data available
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Lot Transaction Batches Tab */}
				{lotBatches && lotBatches.length > 0 && (
					<TabsContent value="batches" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>
									Lot Transaction Batches ({lotBatches.length})
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								{lotBatches.map((batch, batchIndex) => (
									<div
										key={batch.id}
										className="space-y-4 rounded-lg border p-4"
									>
										<div className="flex items-start justify-between">
											<div>
												<h4 className="font-semibold">
													Batch {batchIndex + 1}
												</h4>
												<p className="text-sm text-muted-foreground">
													ID: {batch.id}
												</p>
												<p className="text-sm text-muted-foreground">
													Account: {batch.account.name || batch.account.type} (
													{batch.account.externalId})
												</p>
											</div>
											<div className="text-right">
												<p className="text-sm text-muted-foreground">Created</p>
												<p className="font-mono text-sm">
													{new Date(batch.createdAt).toLocaleString()}
												</p>
											</div>
										</div>

										{/* Batch Summary */}
										<div className="grid grid-cols-2 gap-4 rounded bg-muted/50 p-3 md:grid-cols-4">
											<div>
												<p className="text-sm text-muted-foreground">
													Lot Changes
												</p>
												<p className="font-medium">
													{batch.lotChangeLog.length}
												</p>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">
													Realized P&L
												</p>
												<p className="font-mono font-medium">
													{batch.realizedProfitAndLoss
														? Format.money(batch.realizedProfitAndLoss)
														: 'N/A'}
												</p>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">
													New Transactions
												</p>
												<p className="font-medium">
													{batch.newTransactions
														? (() => {
																try {
																	// @ts-expect-errorjust for logs
																	return JSON.parse(batch.newTransactions)
																		.length;
																} catch {
																	return 'Invalid';
																}
															})()
														: 0}
												</p>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">
													Processed
												</p>
												<p className="font-medium">
													{
														batch.lotChangeLog.filter((log) => log.processed)
															.length
													}{' '}
													/ {batch.lotChangeLog.length}
												</p>
											</div>
										</div>

										{/* Lot Change Log */}
										{batch.lotChangeLog && batch.lotChangeLog.length > 0 && (
											<div className="space-y-3">
												<h5 className="font-medium">
													Lot Change Log ({batch.lotChangeLog.length})
												</h5>
												<div className="overflow-x-auto">
													<table className="w-full text-sm">
														<thead>
															<tr className="border-b">
																<th className="p-2 text-left">Operation</th>
																<th className="p-2 text-left">Asset</th>
																<th className="p-2 text-left">
																	Quantity Change
																</th>
																<th className="p-2 text-left">Source</th>
																<th className="p-2 text-left">Processed</th>
																<th className="p-2 text-left">Lot Details</th>
																<th className="p-2 text-left">Transaction</th>
																<th className="p-2 text-left">Created</th>
															</tr>
														</thead>
														<tbody>
															{batch.lotChangeLog.map(
																(changeLog, _logIndex) => (
																	<tr key={changeLog.id} className="border-b">
																		<td className="p-2">
																			<Badge
																				variant={
																					changeLog.operationType === 'create'
																						? 'default'
																						: changeLog.operationType ===
																								'update'
																							? 'secondary'
																							: 'destructive'
																				}
																			>
																				{changeLog.operationType.toUpperCase()}
																			</Badge>
																		</td>
																		<td className="p-2 font-mono">
																			{changeLog.lot?.assetSymbol ||
																				changeLog.transaction?.assetSymbol ||
																				'N/A'}
																		</td>
																		<td className="p-2 font-mono">
																			{changeLog.quantityChange || 'N/A'}
																		</td>
																		<td className="p-2">
																			{changeLog.source || 'N/A'}
																		</td>
																		<td className="p-2">
																			<Badge
																				variant={
																					changeLog.processed
																						? 'default'
																						: 'secondary'
																				}
																			>
																				{changeLog.processed ? 'Yes' : 'No'}
																			</Badge>
																		</td>
																		<td className="p-2">
																			{changeLog.lot && (
																				<div className="space-y-1">
																					<p className="text-xs">
																						<span className="text-muted-foreground">
																							Remaining:
																						</span>{' '}
																						{changeLog.lot.remainingQty}
																					</p>
																					<p className="text-xs">
																						<span className="text-muted-foreground">
																							Price:
																						</span>{' '}
																						{Format.money(changeLog.lot.price)}
																					</p>
																					<p className="text-xs">
																						<span className="text-muted-foreground">
																							Acquired:
																						</span>{' '}
																						{new Date(
																							changeLog.lot.acquiredDate,
																						).toLocaleDateString()}
																					</p>
																				</div>
																			)}
																		</td>
																		<td className="p-2">
																			{changeLog.transaction && (
																				<div className="space-y-1">
																					<p className="text-xs">
																						<span className="text-muted-foreground">
																							Type:
																						</span>{' '}
																						{changeLog.transaction.type}
																					</p>
																					<p className="text-xs">
																						<span className="text-muted-foreground">
																							Qty:
																						</span>{' '}
																						{changeLog.transaction.quantity ||
																							'N/A'}
																					</p>
																					<p className="text-xs">
																						<span className="text-muted-foreground">
																							Price:
																						</span>{' '}
																						{changeLog.transaction.price
																							? Format.money(
																									changeLog.transaction.price,
																								)
																							: 'N/A'}
																					</p>
																				</div>
																			)}
																		</td>
																		<td className="p-2 text-xs">
																			{new Date(
																				changeLog.createdAt,
																			).toLocaleString()}
																		</td>
																	</tr>
																),
															)}
														</tbody>
													</table>
												</div>
											</div>
										)}

										{/* Additional Batch Data */}
										{(batch.newBuys || batch.newSells || batch.deletedLots) && (
											<div className="space-y-3">
												<h5 className="font-medium">Additional Batch Data</h5>
												<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
													{batch.newBuys &&
														(() => {
															try {
																const buys = JSON.parse(batch.newBuys);
																return (
																	<div className="rounded bg-green-50 p-3 dark:bg-green-950/20">
																		<p className="text-sm font-medium text-green-700 dark:text-green-300">
																			{/* @ts-expect-errorjust for logs */}
																			New Buys ({buys.length})
																		</p>
																		<pre className="mt-2 max-h-32 overflow-auto text-xs">
																			{JSON.stringify(buys, null, 2)}
																		</pre>
																	</div>
																);
															} catch {
																return (
																	<div className="rounded bg-green-50 p-3 dark:bg-green-950/20">
																		<p className="text-sm font-medium text-green-700 dark:text-green-300">
																			New Buys (Invalid JSON)
																		</p>
																		<pre className="mt-2 max-h-32 overflow-auto text-xs">
																			{batch.newBuys}
																		</pre>
																	</div>
																);
															}
														})()}
													{batch.newSells &&
														(() => {
															try {
																const sells = JSON.parse(batch.newSells);
																return (
																	<div className="rounded bg-red-50 p-3 dark:bg-red-950/20">
																		<p className="text-sm font-medium text-red-700 dark:text-red-300">
																			{/* @ts-expect-error just for logs */}
																			New Sells ({sells.length})
																		</p>
																		<pre className="mt-2 max-h-32 overflow-auto text-xs">
																			{JSON.stringify(sells, null, 2)}
																		</pre>
																	</div>
																);
															} catch {
																return (
																	<div className="rounded bg-red-50 p-3 dark:bg-red-950/20">
																		<p className="text-sm font-medium text-red-700 dark:text-red-300">
																			New Sells (Invalid JSON)
																		</p>
																		<pre className="mt-2 max-h-32 overflow-auto text-xs">
																			{batch.newSells}
																		</pre>
																	</div>
																);
															}
														})()}
													{batch.deletedLots &&
														(() => {
															try {
																const lots = JSON.parse(batch.deletedLots);
																return (
																	<div className="rounded bg-yellow-50 p-3 dark:bg-yellow-950/20">
																		<p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
																			{/* @ts-expect-errorjust for logs */}
																			Deleted Lots ({lots.length})
																		</p>
																		<pre className="mt-2 max-h-32 overflow-auto text-xs">
																			{JSON.stringify(lots, null, 2)}
																		</pre>
																	</div>
																);
															} catch {
																return (
																	<div className="rounded bg-yellow-50 p-3 dark:bg-yellow-950/20">
																		<p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
																			Deleted Lots (Invalid JSON)
																		</p>
																		<pre className="mt-2 max-h-32 overflow-auto text-xs">
																			{batch.deletedLots}
																		</pre>
																	</div>
																);
															}
														})()}
												</div>
											</div>
										)}
									</div>
								))}
							</CardContent>
						</Card>
					</TabsContent>
				)}
			</Tabs>
		</LogViewerLayout>
	);
}
