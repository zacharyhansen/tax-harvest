'use client';

import ReactJsonView from '@microlink/react-json-view';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@repo/ui/components/table';
import {
	AlertCircle,
	Building2,
	CheckCircle2,
	Copy,
	DollarSign,
	FileText,
	TrendingUp,
	XCircle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { use } from 'react';
import { useTransactionDetailQuery } from '~/generated/gql';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

/**
 * Transaction detail page showing all transaction data and relationships
 * @param props - Component props including transaction ID params
 * @returns Transaction detail page component
 * @example
 * <TransactionDetailPage params={{ transactionId: '123' }} />
 */
export default function TransactionDetailPage(props: {
	params: Promise<{ transactionId: string }>;
}) {
	const params = use(props.params);
	const theme = useTheme();

	const { data, error, loading } = useTransactionDetailQuery({
		variables: { transactionId: params.transactionId },
	});

	if (error) {
		return (
			<ErrorPage message={`Failed to load transaction: ${error.message}`} />
		);
	}

	if (loading) {
		return <LoadingPage />;
	}

	const transaction = data?.transaction;

	if (!transaction) {
		return <ErrorPage message="Transaction not found" />;
	}

	// Helper function to format currency
	const formatCurrency = (value: string | number | null | undefined) => {
		if (value == null) return 'N/A';
		const numValue = typeof value === 'string' ? parseFloat(value) : value;
		if (Number.isNaN(numValue)) return 'N/A';
		const isNegative = numValue < 0;
		const formattedValue = `$${Math.abs(numValue).toFixed(2)}`;
		return isNegative ? `(${formattedValue})` : formattedValue;
	};

	// Helper function to format quantity
	const formatQuantity = (value: string | number | null | undefined) => {
		if (value == null) return 'N/A';
		const numValue = typeof value === 'string' ? parseFloat(value) : value;
		return !Number.isNaN(numValue) ? numValue.toFixed(4) : 'N/A';
	};

	// Determine transaction type styling
	const isBuy = transaction.type?.toLowerCase() === 'buy';
	const isSell = transaction.type?.toLowerCase() === 'sell';

	// Create full payload object for JSON view
	const fullPayload = {
		id: transaction.id,
		externalId: transaction.externalId,
		type: transaction.type,
		subtype: transaction.subtype,
		assetSymbol: transaction.assetSymbol,
		displaySymbol: transaction.displaySymbol,
		quantity: transaction.quantity,
		price: transaction.price,
		amount: transaction.amount,
		fee: transaction.fee,
		transactionDate: transaction.transactionDate,
		settlementDate: transaction.settlementDate,
		postDate: transaction.postDate,
		securityType: transaction.securityType,
		description: transaction.description,
		memo: transaction.memo,
		paymentCurrency: transaction.paymentCurrency,
		settlementCurrency: transaction.settlementCurrency,
		detailsURI: transaction.detailsURI,
		createdAt: transaction.createdAt,
		updatedAt: transaction.updatedAt,
		account: {
			id: transaction.account?.id,
			name: transaction.account?.name,
			institution: transaction.account?.institution,
			type: transaction.account?.type,
			source: transaction.account?.authConnection?.source,
		},
		asset: transaction.asset
			? {
					symbol: transaction.asset.symbol,
					name: transaction.asset.name,
					type:
						transaction.asset.assetType?.description ||
						transaction.asset.assetType?.code ||
						null,
				}
			: null,
		portfolio: transaction.portfolio
			? {
					id: transaction.portfolio.id,
					name: transaction.portfolio.name,
				}
			: null,
	};

	return (
		<PageWrapper
			title="Transaction Details"
			description={
				<div className="flex gap-4 text-sm text-muted-foreground">
					<span>ID: {transaction.id}</span>
					<span>•</span>
					<span>External ID: {transaction.externalId}</span>
				</div>
			}
		>
			<div className="grid gap-6">
				{/* Overview Cards - Expanded with all transaction details */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					{/* Transaction & Asset Card */}
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium flex items-center gap-2">
								<TrendingUp className="h-4 w-4" />
								Transaction
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<div className="flex items-center gap-2 mb-1">
									<Badge
										variant={
											isSell ? 'destructive' : isBuy ? 'default' : 'outline'
										}
										className={`${isBuy ? 'bg-green-500 hover:bg-green-600' : ''}`}
									>
										{transaction.type}
									</Badge>
									{transaction.subtype && (
										<Badge variant="outline" className="text-xs">
											{transaction.subtype}
										</Badge>
									)}
								</div>
								<div className="text-xl font-bold">
									{transaction.assetSymbol ||
										transaction.displaySymbol ||
										'N/A'}
								</div>
								{transaction.asset && (
									<p className="text-xs text-muted-foreground">
										{transaction.asset.name}
									</p>
								)}
							</div>
							<div className="pt-2 border-t">
								<p className="text-xs text-muted-foreground">Date</p>
								<p className="text-sm font-medium">
									{transaction.transactionDate
										? new Date(transaction.transactionDate).toLocaleDateString()
										: 'N/A'}
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Amount & Quantity Card */}
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium flex items-center gap-2">
								<DollarSign className="h-4 w-4" />
								Financials
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<p className="text-xs text-muted-foreground">Amount</p>
								<div
									className={`text-xl font-bold ${isSell ? 'text-destructive' : isBuy ? 'text-green-600' : ''}`}
								>
									{formatCurrency(transaction.amount)}
								</div>
							</div>
							<div className="grid grid-cols-2 gap-2 pt-2 border-t">
								<div>
									<p className="text-xs text-muted-foreground">Quantity</p>
									<p className="text-sm font-medium">
										{formatQuantity(transaction.quantity)}
									</p>
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Price</p>
									<p className="text-sm font-medium">
										{formatCurrency(transaction.price)}
									</p>
								</div>
							</div>
							{transaction.fee && parseFloat(transaction.fee) !== 0 && (
								<div className="pt-2 border-t">
									<p className="text-xs text-muted-foreground">Fee</p>
									<p className="text-sm font-medium">
										{formatCurrency(transaction.fee)}
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Account Card */}
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium flex items-center gap-2">
								<Building2 className="h-4 w-4" />
								Account
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<p className="text-sm font-bold">
									{transaction.account?.name || 'N/A'}
								</p>
								{transaction.account && (
									<p className="text-xs text-muted-foreground">
										{transaction.account.type} •{' '}
										{transaction.account.authConnection?.source}
									</p>
								)}
							</div>
							{transaction.portfolio && (
								<div className="pt-2 border-t">
									<p className="text-xs text-muted-foreground">Portfolio</p>
									<p className="text-sm font-medium">
										{transaction.portfolio.name}
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Status & Memo Card */}
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium flex items-center gap-2">
								<AlertCircle className="h-4 w-4" />
								Status
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center gap-2">
								{transaction.merged ? (
									<>
										<CheckCircle2 className="h-4 w-4 text-green-600" />
										<span className="text-sm font-medium">Merged</span>
									</>
								) : (
									<>
										<XCircle className="h-4 w-4 text-destructive" />
										<span className="text-sm font-medium">Not Merged</span>
									</>
								)}
							</div>
							{transaction.memo && (
								<div className="pt-2 border-t">
									<p className="text-xs text-muted-foreground">Memo</p>
									<p className="text-xs line-clamp-3" title={transaction.memo}>
										{transaction.memo}
									</p>
								</div>
							)}
							{transaction.settlementDate && (
								<div className="pt-2 border-t">
									<p className="text-xs text-muted-foreground">Settlement</p>
									<p className="text-xs">
										{new Date(transaction.settlementDate).toLocaleDateString()}
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Asset Merge Information */}
				{transaction.transactionOnAssetMerge &&
					transaction.transactionOnAssetMerge.length > 0 && (
						<div className="space-y-4">
							{transaction.transactionOnAssetMerge.map((item) => (
								<Card key={item.assetMerge.id}>
									<CardHeader>
										<CardTitle className="flex items-center justify-between">
											<div className="flex items-center gap-4">
												<div className="flex items-center gap-2">
													<FileText className="h-5 w-5" />
													<span>
														Asset Merge: {item.assetMerge.assetSymbol}
													</span>
												</div>
												<div className="flex items-center gap-3 text-sm">
													<div className="flex items-center gap-1">
														<span className="text-muted-foreground font-normal">
															Target Value:
														</span>
														<span className="font-semibold">
															{formatCurrency(item.assetMerge.targetValue)}
														</span>
													</div>
													<div className="flex items-center gap-1">
														<span className="text-muted-foreground font-normal">
															Target Qty:
														</span>
														<span className="font-semibold">
															{formatQuantity(item.assetMerge.targetQuantity)}
														</span>
													</div>
												</div>
											</div>
											{item.assetMerge.error || item.assetMerge.mergeError ? (
												<Badge variant="destructive">
													{item.assetMerge.mergeError?.type || 'Error'}
													{item.assetMerge.mergeError?.resolved &&
														' (Resolved)'}
												</Badge>
											) : (
												<Badge variant="default" className="bg-green-500">
													Success
												</Badge>
											)}
										</CardTitle>
									</CardHeader>
									<CardContent>
										{item.assetMerge.lotChangeList &&
										item.assetMerge.lotChangeList.length > 0 ? (
											<div className="space-y-4">
												{item.assetMerge.lotChangeList.map((changeList) => (
													<div
														key={changeList.id}
														className="border rounded-lg p-4"
													>
														<div className="flex items-center justify-between mb-3">
															<h4 className="font-semibold text-sm">
																Lot Change List
															</h4>
															<div className="flex items-center gap-2">
																{(!changeList.AccountRealizedPAndLHistory ||
																	changeList.AccountRealizedPAndLHistory
																		.length === 0) && (
																	<Badge
																		variant="destructive"
																		className="text-xs"
																	>
																		<AlertCircle className="h-3 w-3 mr-1" />
																		No P&L History
																	</Badge>
																)}
																{changeList.AccountRealizedPAndLHistory &&
																	changeList.AccountRealizedPAndLHistory
																		.length > 0 && (
																		<Badge
																			variant="secondary"
																			className="text-xs"
																		>
																			{
																				changeList.AccountRealizedPAndLHistory
																					.length
																			}{' '}
																			P&L Record
																			{changeList.AccountRealizedPAndLHistory
																				.length > 1
																				? 's'
																				: ''}
																		</Badge>
																	)}
																<Badge
																	variant={
																		changeList.appliedToAccount
																			? 'default'
																			: 'outline'
																	}
																>
																	{changeList.appliedToAccount
																		? 'Applied'
																		: 'Not Applied'}
																</Badge>
															</div>
														</div>
														{changeList.AccountRealizedPAndLHistory &&
															changeList.AccountRealizedPAndLHistory.length >
																0 && (
																<div className="mb-4">
																	<h5 className="text-xs font-medium mb-2">
																		Realized P&L History
																	</h5>
																	<Table>
																		<TableHeader>
																			<TableRow>
																				<TableHead className="text-xs">
																					Type
																				</TableHead>
																				<TableHead className="text-xs text-right">
																					Value
																				</TableHead>
																			</TableRow>
																		</TableHeader>
																		<TableBody>
																			{changeList.AccountRealizedPAndLHistory.map(
																				(pnl) => (
																					<TableRow key={pnl.id}>
																						<TableCell className="py-1">
																							<Badge className="text-xs">
																								{pnl.profitAndLossType}
																							</Badge>
																						</TableCell>
																						<TableCell className="text-right py-1">
																							<span
																								className={
																									parseFloat(
																										pnl.value || '0',
																									) >= 0
																										? 'text-green-600 font-medium'
																										: 'text-destructive font-medium'
																								}
																							>
																								{formatCurrency(pnl.value)}
																							</span>
																						</TableCell>
																					</TableRow>
																				),
																			)}
																		</TableBody>
																	</Table>
																</div>
															)}
														{changeList.LotChange &&
															changeList.LotChange.length > 0 && (
																<div>
																	<h5 className="text-xs font-medium mb-2">
																		Lot Changes
																	</h5>
																	<Table>
																		<TableHeader>
																			<TableRow>
																				<TableHead>Asset</TableHead>
																				<TableHead>Acquired</TableHead>
																				<TableHead className="text-right">
																					Lot Price
																				</TableHead>
																				<TableHead className="text-right">
																					Price
																				</TableHead>
																				<TableHead className="text-right">
																					Initial Quantity
																				</TableHead>
																				<TableHead className="text-right">
																					Final Qty
																				</TableHead>
																				<TableHead className="text-right">
																					Qty Change
																				</TableHead>
																				<TableHead className="text-right">
																					Realized P&L
																				</TableHead>
																			</TableRow>
																		</TableHeader>
																		<TableBody>
																			{changeList.LotChange.map((change) => (
																				<TableRow key={change.id}>
																					<TableCell>
																						<span className="font-medium">
																							{change.assetSymbol}
																						</span>
																					</TableCell>
																					<TableCell>
																						<span className="text-xs">
																							{new Date(
																								change.aquiredDate,
																							).toLocaleDateString()}
																						</span>
																					</TableCell>
																					<TableCell className="text-right">
																						{change.lot && (
																							<span className="text-xs">
																								{formatCurrency(
																									change.lot.price,
																								)}
																							</span>
																						)}
																					</TableCell>
																					<TableCell className="text-right">
																						{formatCurrency(change.price)}
																					</TableCell>
																					<TableCell className="text-right">
																						{change.lot && (
																							<span className="text-xs">
																								{formatQuantity(
																									change.lot.remainingQty,
																								)}
																							</span>
																						)}
																					</TableCell>
																					<TableCell className="text-right">
																						{formatQuantity(
																							change.quantityFinal,
																						)}
																					</TableCell>
																					<TableCell className="text-right">
																						<span
																							className={
																								parseFloat(
																									change.quantityChange,
																								) < 0
																									? 'text-destructive'
																									: 'text-green-600'
																							}
																						>
																							{formatQuantity(
																								change.quantityChange,
																							)}
																						</span>
																					</TableCell>
																					<TableCell className="text-right">
																						<div className="space-y-1">
																							{change.realizedProfitAndLossShortTerm &&
																								parseFloat(
																									change.realizedProfitAndLossShortTerm,
																								) !== 0 && (
																									<div className="text-xs">
																										<span className="text-muted-foreground">
																											ST:{' '}
																										</span>
																										<span
																											className={
																												parseFloat(
																													change.realizedProfitAndLossShortTerm,
																												) >= 0
																													? 'text-green-600'
																													: 'text-destructive'
																											}
																										>
																											{formatCurrency(
																												change.realizedProfitAndLossShortTerm,
																											)}
																										</span>
																									</div>
																								)}
																							{change.realizedProfitAndLossLongTerm &&
																								parseFloat(
																									change.realizedProfitAndLossLongTerm,
																								) !== 0 && (
																									<div className="text-xs">
																										<span className="text-muted-foreground">
																											LT:{' '}
																										</span>
																										<span
																											className={
																												parseFloat(
																													change.realizedProfitAndLossLongTerm,
																												) >= 0
																													? 'text-green-600'
																													: 'text-destructive'
																											}
																										>
																											{formatCurrency(
																												change.realizedProfitAndLossLongTerm,
																											)}
																										</span>
																									</div>
																								)}
																						</div>
																					</TableCell>
																				</TableRow>
																			))}
																		</TableBody>
																	</Table>
																</div>
															)}
													</div>
												))}
											</div>
										) : (
											<p className="text-muted-foreground text-sm">
												No lot changes available
											</p>
										)}
										{/* Transactions Table for this Asset Merge */}
										{item.assetMerge.transactionOnAssetMerge &&
											item.assetMerge.transactionOnAssetMerge.length > 0 && (
												<div className="mt-4">
													<h5 className="text-sm font-semibold mb-2">
														New Transactions in this Asset Merge
													</h5>
													<Table>
														<TableHeader>
															<TableRow>
																<TableHead>Type</TableHead>
																<TableHead>Symbol</TableHead>
																<TableHead>Description</TableHead>
																<TableHead>Date</TableHead>
																<TableHead className="text-right">
																	Quantity
																</TableHead>
																<TableHead className="text-right">
																	Price
																</TableHead>
																<TableHead className="text-right">
																	Amount
																</TableHead>
																<TableHead className="text-right">
																	Fee
																</TableHead>
															</TableRow>
														</TableHeader>
														<TableBody>
															{item.assetMerge.transactionOnAssetMerge
																.slice()
																.sort((a, b) => {
																	const dateA = a.transaction.transactionDate
																		? new Date(
																				a.transaction.transactionDate,
																			).getTime()
																		: 0;
																	const dateB = b.transaction.transactionDate
																		? new Date(
																				b.transaction.transactionDate,
																			).getTime()
																		: 0;
																	return dateB - dateA; // Sort descending (newest first)
																})
																.map((mergeItem) => {
																	const t = mergeItem.transaction;
																	return (
																		<TableRow
																			key={t.id}
																			className={
																				t.id === transaction.id
																					? 'bg-muted/50'
																					: ''
																			}
																		>
																			<TableCell>
																				<Badge
																					variant={
																						t.type?.toLowerCase() === 'sell'
																							? 'destructive'
																							: t.type?.toLowerCase() === 'buy'
																								? 'default'
																								: 'outline'
																					}
																					className={`${t.type?.toLowerCase() === 'buy' ? 'bg-green-500 hover:bg-green-600' : ''}`}
																				>
																					{t.type}
																				</Badge>
																			</TableCell>
																			<TableCell className="font-medium">
																				{t.assetSymbol}
																			</TableCell>
																			<TableCell className="max-w-[200px] truncate">
																				{t.description}
																			</TableCell>
																			<TableCell>
																				{t.transactionDate
																					? new Date(
																							t.transactionDate,
																						).toLocaleDateString()
																					: 'N/A'}
																			</TableCell>
																			<TableCell className="text-right">
																				{formatQuantity(t.quantity)}
																			</TableCell>
																			<TableCell className="text-right">
																				{formatCurrency(t.price)}
																			</TableCell>
																			<TableCell className="text-right">
																				<span
																					className={
																						t.type?.toLowerCase() === 'sell'
																							? 'text-destructive'
																							: t.type?.toLowerCase() === 'buy'
																								? 'text-green-600'
																								: ''
																					}
																				>
																					{formatCurrency(t.amount)}
																				</span>
																			</TableCell>
																			<TableCell className="text-right">
																				{formatCurrency(t.fee)}
																			</TableCell>
																		</TableRow>
																	);
																})}
														</TableBody>
													</Table>
												</div>
											)}
										{/* Initial Lots Table from lotData */}
										{item.assetMerge.lotData &&
											Array.isArray(item.assetMerge.lotData) &&
											item.assetMerge.lotData.length > 0 && (
												<div className="mt-4">
													<h5 className="text-sm font-semibold mb-2">
														Initial Lots Before Merge
													</h5>
													<Table>
														<TableHeader>
															<TableRow>
																<TableHead>Symbol</TableHead>
																<TableHead>Acquired Date</TableHead>
																<TableHead className="text-right">
																	Price
																</TableHead>
																<TableHead className="text-right">
																	Remaining Qty
																</TableHead>
																<TableHead className="text-right">
																	Total Cost
																</TableHead>
																<TableHead>Payment Currency</TableHead>
															</TableRow>
														</TableHeader>
														<TableBody>
															{/* biome-ignore lint/suspicious/noExplicitAny: <ok> */}
															{(item.assetMerge.lotData as any[])
																.sort((a, b) => {
																	const dateA = a.acquiredDate
																		? new Date(a.acquiredDate).getTime()
																		: 0;
																	const dateB = b.acquiredDate
																		? new Date(b.acquiredDate).getTime()
																		: 0;
																	return dateB - dateA; // Sort descending (newest first)
																})
																// biome-ignore lint/suspicious/noExplicitAny: <ok>
																.map((lot: any, index: number) => (
																	<TableRow key={lot.id || index}>
																		<TableCell className="font-medium">
																			{lot.assetSymbol}
																		</TableCell>
																		<TableCell>
																			{lot.acquiredDate
																				? new Date(
																						lot.acquiredDate,
																					).toLocaleDateString()
																				: 'N/A'}
																		</TableCell>
																		<TableCell className="text-right">
																			{formatCurrency(lot.price)}
																		</TableCell>
																		<TableCell className="text-right">
																			{formatQuantity(lot.remainingQty)}
																		</TableCell>
																		<TableCell className="text-right">
																			{formatCurrency(
																				parseFloat(lot.price || '0') *
																					parseFloat(lot.remainingQty || '0'),
																			)}
																		</TableCell>
																		<TableCell>
																			{lot.paymentCurrency || 'USD'}
																		</TableCell>
																	</TableRow>
																))}
														</TableBody>
													</Table>
												</div>
											)}
									</CardContent>
								</Card>
							))}
						</div>
					)}

				{/* Account Realized P&L History */}
				{transaction.accountRealizedPAndLHistory &&
					transaction.accountRealizedPAndLHistory.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<TrendingUp className="h-5 w-5" />
									Account Realized P&L History
								</CardTitle>
								<CardDescription>
									Realized gains and losses associated with this transaction
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Date</TableHead>
											<TableHead>Type</TableHead>
											<TableHead className="text-right">Value</TableHead>
											<TableHead className="text-right">
												Short Term Gain
											</TableHead>
											<TableHead className="text-right">
												Long Term Gain
											</TableHead>
											<TableHead className="text-right">
												Unrealized P&L
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{transaction.accountRealizedPAndLHistory.map((record) => (
											<TableRow key={record.id}>
												<TableCell>
													{new Date(record.createdAt).toLocaleDateString()}
												</TableCell>
												<TableCell>
													<Badge>{record.profitAndLossType}</Badge>
												</TableCell>
												<TableCell className="text-right">
													<span
														className={
															parseFloat(record.value || '0') >= 0
																? 'text-green-600'
																: 'text-destructive'
														}
													>
														{formatCurrency(record.value)}
													</span>
												</TableCell>
												<TableCell className="text-right">
													{record.realizedPAndL && (
														<span className="text-green-600">
															{formatCurrency(
																record.realizedPAndL.shortTermCapitalGain,
															)}
														</span>
													)}
												</TableCell>
												<TableCell className="text-right">
													{record.realizedPAndL && (
														<span className="text-green-600">
															{formatCurrency(
																record.realizedPAndL.longTermCapitalGain,
															)}
														</span>
													)}
												</TableCell>
												<TableCell className="text-right">
													{record.realizedPAndL && (
														<span
															className={
																parseFloat(
																	record.realizedPAndL.unrealizedProfit || '0',
																) -
																	parseFloat(
																		record.realizedPAndL.unrealizedLoss || '0',
																	) >=
																0
																	? 'text-green-600'
																	: 'text-destructive'
															}
														>
															{formatCurrency(
																parseFloat(
																	record.realizedPAndL.unrealizedProfit || '0',
																) -
																	parseFloat(
																		record.realizedPAndL.unrealizedLoss || '0',
																	),
															)}
														</span>
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					)}

				{/* Full Payload JSON */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Full Transaction Payload
							</span>
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									navigator.clipboard.writeText(
										JSON.stringify(fullPayload, null, 2),
									);
								}}
							>
								<Copy className="h-4 w-4 mr-2" />
								Copy JSON
							</Button>
						</CardTitle>
						<CardDescription>
							Complete transaction data in JSON format
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ReactJsonView
							src={fullPayload}
							theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
							displayDataTypes={false}
							collapsed={1}
						/>
					</CardContent>
				</Card>

				{/* Metadata Section */}
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium">Metadata</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-muted-foreground">Created At: </span>
								<span className="font-medium">
									{new Date(transaction.createdAt).toLocaleString()}
								</span>
							</div>
							<div>
								<span className="text-muted-foreground">Updated At: </span>
								<span className="font-medium">
									{new Date(transaction.updatedAt).toLocaleString()}
								</span>
							</div>
							{transaction.detailsURI && (
								<div className="col-span-2">
									<span className="text-muted-foreground">Details URI: </span>
									<span className="font-mono text-xs">
										{transaction.detailsURI}
									</span>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</PageWrapper>
	);
}
