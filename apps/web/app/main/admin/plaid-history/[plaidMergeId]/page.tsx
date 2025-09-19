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
import { Label } from '@repo/ui/components/label';
import { Separator } from '@repo/ui/components/separator';
import { Switch } from '@repo/ui/components/switch';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@repo/ui/components/table';
import {
	CheckCircle2,
	Copy,
	DollarSign,
	FileText,
	GitBranch,
	XCircle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { use, useState } from 'react';
import { usePlaidMergeQuery } from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

/**
 * PlaidMerge detail page showing all related data in a clean bento UI
 */
export default function PlaidMergePage(props: {
	params: Promise<typeof TypedRoutes.plaidMerge.params>;
}) {
	const params = use(props.params);
	const theme = useTheme();
	const [showFailedOnly, setShowFailedOnly] = useState(false);
	const safeParams = TypedRoutes.plaidMerge.parse(params);

	const { data, error, loading } = usePlaidMergeQuery({
		variables: { plaidMergeId: safeParams.plaidMergeId },
	});

	if (error) {
		return <ErrorPage message={JSON.stringify(error)} />;
	}

	if (loading) {
		return <LoadingPage />;
	}

	const plaidMerge = data?.plaidMerge;

	if (!plaidMerge) {
		return <ErrorPage message="PlaidMerge not found" />;
	}

	// Calculate failed count
	const failedAssetMerges =
		plaidMerge.assetMerge?.filter(
			(assetMerge) => assetMerge.error || assetMerge.mergeError,
		) || [];
	const totalAssetMerges = plaidMerge.assetMerge?.length || 0;

	return (
		<PageWrapper
			title="PlaidMerge Details"
			description={
				<div className="flex gap-4 text-sm text-muted-foreground">
					<span>ID: {plaidMerge.id}</span>
					<span>•</span>
					<span>
						Created: {new Date(plaidMerge.createdAt).toLocaleString()}
					</span>
				</div>
			}
		>
			<div className="grid gap-6">
				{/* Overview Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">Account</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{plaidMerge.account?.name || 'N/A'}
							</div>
							<p className="text-sm text-muted-foreground mt-1">
								{plaidMerge.account?.institution} • {plaidMerge.account?.type}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">Portfolio</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{plaidMerge.portfolio?.name || 'N/A'}
							</div>
							<p className="text-sm text-muted-foreground mt-1">
								ID: {plaidMerge.portfolioId}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">
								Asset Merges
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{plaidMerge.assetMerge?.length || 0}
							</div>
							<p className="text-sm text-muted-foreground mt-1">
								Total merge operations
							</p>
						</CardContent>
					</Card>
				</div>

				{/* PlaidMerge resolveLotsInput JSON */}
				{plaidMerge.resolveLotsInput && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<span className="flex items-center gap-2">
									<FileText className="h-5 w-5" />
									Resolve Lots Input
								</span>
								<Button
									size="sm"
									variant="outline"
									onClick={() => {
										navigator.clipboard.writeText(
											JSON.stringify(plaidMerge.resolveLotsInput, null, 2),
										);
									}}
								>
									<Copy className="h-4 w-4 mr-2" />
									Copy JSON
								</Button>
							</CardTitle>
							<CardDescription>
								Input parameters used for resolving lots
							</CardDescription>
						</CardHeader>
						<CardContent>
							<details className="cursor-pointer">
								<summary className="text-sm text-muted-foreground hover:text-foreground">
									View resolve lots input data
								</summary>
								<div className="mt-4">
									<ReactJsonView
										src={plaidMerge.resolveLotsInput}
										theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
										displayDataTypes={false}
										collapsed={2}
									/>
								</div>
							</details>
						</CardContent>
					</Card>
				)}

				{/* Asset Merges Section */}
				{plaidMerge.assetMerge && plaidMerge.assetMerge.length > 0 && (
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="flex items-center gap-2">
										<GitBranch className="h-5 w-5" />
										Lot Merges
									</CardTitle>
									<CardDescription>
										Individual asset merges within this PlaidMerge operation
									</CardDescription>
								</div>
								<div className="flex items-center space-x-2">
									<Switch
										checked={showFailedOnly}
										onCheckedChange={setShowFailedOnly}
										disabled={failedAssetMerges.length === 0}
									/>
									<Label htmlFor="failed-only" className="text-sm font-medium">
										Show Failed Only
										{failedAssetMerges.length > 0 && (
											<span className="ml-2 text-xs text-destructive">
												({failedAssetMerges.length} / {totalAssetMerges})
											</span>
										)}
									</Label>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								{(() => {
									const filteredMerges = plaidMerge.assetMerge.filter(
										(assetMerge) => {
											if (!showFailedOnly) return true;
											// Show only asset merges that have errors
											return assetMerge.error || assetMerge.mergeError;
										},
									);

									if (filteredMerges.length === 0) {
										return (
											<div className="text-center py-8 text-muted-foreground">
												<CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-600" />
												<p className="text-lg font-medium">
													All merges successful!
												</p>
												<p className="text-sm mt-2">
													No failed merges to display.
												</p>
											</div>
										);
									}

									return filteredMerges.map((assetMerge) => {
										// Check if this asset merge has any errors
										const hasErrors = assetMerge.error || assetMerge.mergeError;
										const errorCount = hasErrors ? 1 : 0;
										
										// Calculate total P&L from the lot changes
										const activeLotChangeList = 
											(assetMerge.lotChangeList && assetMerge.lotChangeList.length > 0 ? assetMerge.lotChangeList[0] : null);
										
										const totalShortTermPL = activeLotChangeList?.LotChange?.reduce(
											(sum, change) => sum + Number(change.realizedProfitAndLossShortTerm || 0),
											0
										) || 0;
										
										const totalLongTermPL = activeLotChangeList?.LotChange?.reduce(
											(sum, change) => sum + Number(change.realizedProfitAndLossLongTerm || 0),
											0
										) || 0;

										return (
											<div
												key={assetMerge.id}
												className="border rounded-lg p-4 space-y-4 shadow-md"
											>
												{/* Asset Merge Header */}
												<div className="flex items-start justify-between">
													<div>
														<div className="flex items-center gap-2">
															<Badge className="font-semibold text-lg">
																{assetMerge.assetSymbol}
															</Badge>
															{hasErrors && (
																<Badge
																	variant="destructive"
																	className="text-xs"
																>
																	{errorCount} Error{errorCount > 1 ? 's' : ''}
																</Badge>
															)}
															{!hasErrors && (
																<CheckCircle2 className="h-4 w-4 text-green-600" />
															)}
														</div>
														<p className="text-sm text-muted-foreground mt-1">
															ID: {assetMerge.id}
														</p>
													</div>
													<div className="text-right space-y-1">
														<div className="text-sm">
															<span className="text-muted-foreground">
																Target Value:{' '}
															</span>
															<span className="font-medium">
																$
																{Number(assetMerge.targetValue ?? 0).toFixed(
																	2,
																) || 'N/A'}
															</span>
														</div>
														<div className="text-sm">
															<span className="text-muted-foreground">
																Target Qty:{' '}
															</span>
															<span className="font-medium">
																{Number(assetMerge.targetQuantity ?? 0).toFixed(
																	4,
																) || 'N/A'}
															</span>
														</div>
													</div>
												</div>

												<Separator />

												{/* P&L and Error Details */}
												<div className="space-y-3">
													{hasErrors ? (
														<details className="cursor-pointer">
															<summary className="text-sm font-medium text-destructive hover:text-destructive/80">
																View Error Details
															</summary>
															<div className="mt-3 space-y-3">
																<div className="bg-muted/50 rounded-lg p-3 space-y-2">
																	<div className="flex items-center justify-between">
																		<div className="flex items-center gap-2">
																			<XCircle className="h-4 w-4 text-destructive" />
																			<span className="text-sm font-medium">
																				Failed
																			</span>
																		</div>
																		{assetMerge.mergeError && (
																			<Badge variant="destructive">
																				{assetMerge.mergeError.type}
																				{assetMerge.mergeError.resolved &&
																					' (Resolved)'}
																			</Badge>
																		)}
																	</div>

																	<div className="grid grid-cols-2 gap-2 text-sm">
																		<div>
																			<span className="text-muted-foreground">
																				Short Term P&L:{' '}
																			</span>
																			<span
																				className={`font-medium ${
																					totalShortTermPL > 0
																						? 'text-green-600'
																						: totalShortTermPL < 0
																							? 'text-destructive'
																							: ''
																				}`}
																			>
																				${totalShortTermPL.toFixed(2)}
																			</span>
																		</div>
																		<div>
																			<span className="text-muted-foreground">
																				Long Term P&L:{' '}
																			</span>
																			<span
																				className={`font-medium ${
																					totalLongTermPL > 0
																						? 'text-green-600'
																						: totalLongTermPL < 0
																							? 'text-destructive'
																							: ''
																				}`}
																			>
																				${totalLongTermPL.toFixed(2)}
																			</span>
																		</div>
																	</div>

																	{assetMerge.error && (
																		<div className="mt-2">
																			<details className="cursor-pointer">
																				<summary className="text-xs text-muted-foreground hover:text-foreground">
																					View full error JSON
																				</summary>
																				<div className="mt-2">
																					<ReactJsonView
																						src={assetMerge.error}
																						theme={
																							theme.theme === 'dark'
																								? 'ashes'
																								: 'rjv-default'
																						}
																						displayDataTypes={false}
																						collapsed={2}
																					/>
																				</div>
																			</details>
																		</div>
																	)}
																</div>
															</div>
														</details>
													) : (
														// Show success details for non-error merges
														<div className="bg-muted/50 rounded-lg p-3 space-y-2">
															<div className="flex items-center justify-between">
																<div className="flex items-center gap-2">
																	<CheckCircle2 className="h-4 w-4 text-green-600" />
																	<span className="text-sm font-medium">
																		Success
																	</span>
																</div>
															</div>

															<div className="grid grid-cols-2 gap-2 text-sm">
																<div>
																	<span className="text-muted-foreground">
																		Short Term P&L:{' '}
																	</span>
																	<span
																		className={`font-medium ${
																			totalShortTermPL > 0
																				? 'text-green-600'
																				: totalShortTermPL < 0
																					? 'text-destructive'
																					: ''
																		}`}
																	>
																		${totalShortTermPL.toFixed(2)}
																	</span>
																</div>
																<div>
																	<span className="text-muted-foreground">
																		Long Term P&L:{' '}
																	</span>
																	<span
																		className={`font-medium ${
																			totalLongTermPL > 0
																				? 'text-green-600'
																				: totalLongTermPL < 0
																					? 'text-destructive'
																					: ''
																		}`}
																	>
																		${totalLongTermPL.toFixed(2)}
																	</span>
																</div>
															</div>
														</div>
													)}
												</div>

												{/* Lot Change Options - Show when multiple solutions exist */}
												{assetMerge.lotChangeList && assetMerge.lotChangeList.length > 1 && (
													<div className="space-y-3">
														<h5 className="font-medium text-sm flex items-center gap-2">
															<GitBranch className="h-4 w-4" />
															Lot Change Options ({assetMerge.lotChangeList.length} solutions available)
														</h5>
														<div className="space-y-4">
															{assetMerge.lotChangeList.map((lotChangeList, optionIndex) => {
																// Calculate totals for this option
																const totalFinalQuantity = lotChangeList.LotChange?.reduce(
																	(sum, item) => sum + Number(item.quantityFinal || 0),
																	0
																) || 0;
																
																const totalCostBasis = lotChangeList.LotChange?.reduce(
																	(sum, item) => sum + (Number(item.price || 0) * Number(item.quantityFinal || 0)),
																	0
																) || 0;
																
																// Calculate P&L for this option
																const optionShortTermPL = lotChangeList.LotChange?.reduce(
																	(sum, item) => sum + Number(item.realizedProfitAndLossShortTerm || 0),
																	0
																) || 0;
																
																const optionLongTermPL = lotChangeList.LotChange?.reduce(
																	(sum, item) => sum + Number(item.realizedProfitAndLossLongTerm || 0),
																	0
																) || 0;
																
																// Calculate deltas from targets
																const targetQuantity = Number(assetMerge.targetQuantity || 0);
																const targetValue = Number(assetMerge.targetValue || 0);
																const quantityDelta = totalFinalQuantity - targetQuantity;
																const valueDelta = totalCostBasis - targetValue;
																const quantityDeltaPercent = targetQuantity !== 0 ? (quantityDelta / targetQuantity * 100) : 0;
																const valueDeltaPercent = targetValue !== 0 ? (valueDelta / targetValue * 100) : 0;
																const isUsed = false;

																return (
																	<div 
																		key={lotChangeList.id} 
																		className={`border rounded-lg p-4 space-y-3 ${isUsed ? 'border-primary bg-primary/5' : 'border-border'}`}
																	>
																		<div className="flex items-center justify-between">
																			<div className="flex items-center gap-2">
																				<span className="text-sm font-medium">
																					Option {optionIndex + 1} of {assetMerge.lotChangeList?.length || 0}
																				</span>
																				{isUsed && (
																					<Badge variant="default" className="text-xs">
																						Applied
																					</Badge>
																				)}
																			</div>
																			<div className="text-xs text-muted-foreground">
																				{lotChangeList.LotChange?.length || 0} lot changes
																			</div>
																		</div>

																		{/* Summary Statistics */}
																		<div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg text-sm">
																			<div>
																				<p className="text-xs text-muted-foreground">Final Quantity</p>
																				<p className="font-semibold">{totalFinalQuantity.toFixed(4)}</p>
																				<p className={`text-xs ${Math.abs(quantityDelta) < 0.0001 ? 'text-green-600' : 'text-orange-600'}`}>
																					Δ: {quantityDelta >= 0 ? '+' : ''}{quantityDelta.toFixed(4)} ({quantityDeltaPercent >= 0 ? '+' : ''}{quantityDeltaPercent.toFixed(2)}%)
																				</p>
																			</div>
																			<div>
																				<p className="text-xs text-muted-foreground">Total Cost Basis</p>
																				<p className="font-semibold">
																					${totalCostBasis.toFixed(2)}
																				</p>
																				<p className={`text-xs ${Math.abs(valueDelta) < 0.01 ? 'text-green-600' : 'text-orange-600'}`}>
																					Δ: {valueDelta >= 0 ? '+' : ''}${valueDelta.toFixed(2)} ({valueDeltaPercent >= 0 ? '+' : ''}{valueDeltaPercent.toFixed(2)}%)
																				</p>
																			</div>
																		</div>
																		
																		{/* P&L Statistics for this option */}
																		{(optionShortTermPL !== 0 || optionLongTermPL !== 0) && (
																			<div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg text-sm">
																				<div>
																					<p className="text-xs text-muted-foreground">Short Term P&L</p>
																					<p className={`font-semibold ${optionShortTermPL > 0 ? 'text-green-600' : optionShortTermPL < 0 ? 'text-destructive' : ''}`}>
																						${optionShortTermPL.toFixed(2)}
																					</p>
																				</div>
																				<div>
																					<p className="text-xs text-muted-foreground">Long Term P&L</p>
																					<p className={`font-semibold ${optionLongTermPL > 0 ? 'text-green-600' : optionLongTermPL < 0 ? 'text-destructive' : ''}`}>
																						${optionLongTermPL.toFixed(2)}
																					</p>
																				</div>
																			</div>
																		)}

																		{/* Lot Changes Table */}
																		{lotChangeList.LotChange && lotChangeList.LotChange.length > 0 && (
																			<details className="cursor-pointer">
																				<summary className="text-xs text-muted-foreground hover:text-foreground">
																					View lot changes details
																				</summary>
																				<div className="mt-3 overflow-x-auto">
																					<Table>
																						<TableHeader>
																							<TableRow>
																								<TableHead className="text-xs">Lot ID</TableHead>
																								<TableHead className="text-xs">Acquired</TableHead>
																								<TableHead className="text-xs text-right">Price</TableHead>
																								<TableHead className="text-xs text-right">Qty Change</TableHead>
																								<TableHead className="text-xs text-right">Final Qty</TableHead>
																								<TableHead className="text-xs text-right">Cost Basis</TableHead>
																								<TableHead className="text-xs text-right">ST P&L</TableHead>
																								<TableHead className="text-xs text-right">LT P&L</TableHead>
																								<TableHead className="text-xs">Action</TableHead>
																							</TableRow>
																						</TableHeader>
																						<TableBody>
																							{lotChangeList.LotChange.map((change) => {
																								const costBasis = Number(change.price || 0) * Number(change.quantityFinal || 0);
																								return (
																									<TableRow key={change.id} className="text-xs">
																										<TableCell className="font-mono">
																											{change.lotId?.substring(0, 8) || 'NEW'}
																										</TableCell>
																										<TableCell>
																											{change.aquiredDate
																												? new Date(change.aquiredDate).toLocaleDateString()
																												: 'N/A'}
																										</TableCell>
																										<TableCell className="text-right">
																											${Number(change.price || 0).toFixed(4)}
																										</TableCell>
																										<TableCell className="text-right">
																											{Number(change.quantityChange || 0).toFixed(4)}
																										</TableCell>
																										<TableCell className="text-right">
																											{Number(change.quantityFinal || 0).toFixed(4)}
																										</TableCell>
																										<TableCell className="text-right font-medium">
																											${costBasis.toFixed(2)}
																										</TableCell>
																										<TableCell className={`text-right text-xs ${Number(change.realizedProfitAndLossShortTerm || 0) > 0 ? 'text-green-600' : Number(change.realizedProfitAndLossShortTerm || 0) < 0 ? 'text-destructive' : ''}`}>
																											{Number(change.realizedProfitAndLossShortTerm || 0) !== 0 ? `$${Number(change.realizedProfitAndLossShortTerm || 0).toFixed(2)}` : '-'}
																										</TableCell>
																										<TableCell className={`text-right text-xs ${Number(change.realizedProfitAndLossLongTerm || 0) > 0 ? 'text-green-600' : Number(change.realizedProfitAndLossLongTerm || 0) < 0 ? 'text-destructive' : ''}`}>
																											{Number(change.realizedProfitAndLossLongTerm || 0) !== 0 ? `$${Number(change.realizedProfitAndLossLongTerm || 0).toFixed(2)}` : '-'}
																										</TableCell>
																										<TableCell>
																											<Badge variant={change.shouldDelete ? 'destructive' : 'outline'} className="text-xs">
																												{change.operationType}
																											</Badge>
																										</TableCell>
																									</TableRow>
																								);
																							})}
																							{/* Totals Row */}
																							<TableRow className="font-semibold border-t">
																								<TableCell colSpan={4} className="text-right text-xs">
																									Totals
																								</TableCell>
																								<TableCell className="text-right text-xs">
																									{totalFinalQuantity.toFixed(4)}
																								</TableCell>
																								<TableCell className="text-right text-xs">
																									${totalCostBasis.toFixed(2)}
																								</TableCell>
																								<TableCell className={`text-right text-xs font-semibold ${optionShortTermPL > 0 ? 'text-green-600' : optionShortTermPL < 0 ? 'text-destructive' : ''}`}>
																									${optionShortTermPL.toFixed(2)}
																								</TableCell>
																								<TableCell className={`text-right text-xs font-semibold ${optionLongTermPL > 0 ? 'text-green-600' : optionLongTermPL < 0 ? 'text-destructive' : ''}`}>
																									${optionLongTermPL.toFixed(2)}
																								</TableCell>
																								<TableCell />
																							</TableRow>
																						</TableBody>
																					</Table>
																				</div>
																			</details>
																		)}
																	</div>
																);
															})}
														</div>
													</div>
												)}

												{/* Transactions */}
												{assetMerge.transactionOnAssetMerge &&
													assetMerge.transactionOnAssetMerge.length > 0 && (
														<div className="space-y-3">
															<h5 className="font-medium text-sm flex items-center gap-2">
																<FileText className="h-4 w-4" />
																New Transactions
															</h5>
															<div className="overflow-x-auto">
																<Table>
																	<TableHeader>
																		<TableRow>
																			<TableHead>Date</TableHead>
																			<TableHead>Type</TableHead>
																			<TableHead>Symbol</TableHead>
																			<TableHead className="text-right">
																				Quantity
																			</TableHead>
																			<TableHead className="text-right">
																				Price
																			</TableHead>
																			<TableHead className="text-right">
																				Amount
																			</TableHead>
																		</TableRow>
																	</TableHeader>
																	<TableBody>
																		{assetMerge.transactionOnAssetMerge.map(
																			(item) => {
																				const isSell = item.transaction.type
																					?.toLowerCase()
																					.includes('sell');
																				return (
																					<TableRow
																						key={item.transaction.id}
																						className={
																							isSell
																								? 'bg-red-50 dark:bg-red-950/20'
																								: ''
																						}
																					>
																						<TableCell className="text-sm">
																							{item.transaction.transactionDate
																								? new Date(
																										item.transaction
																											.transactionDate,
																									).toLocaleDateString()
																								: 'N/A'}
																						</TableCell>
																						<TableCell>
																							<Badge
																								variant={
																									isSell
																										? 'destructive'
																										: 'outline'
																								}
																								className="text-xs"
																							>
																								{item.transaction.type}
																							</Badge>
																						</TableCell>
																						<TableCell className="font-medium">
																							{item.transaction.assetSymbol}
																						</TableCell>
																						<TableCell className="text-right">
																							{Number(
																								item.transaction.quantity ?? 0,
																							).toFixed(4) || 'N/A'}
																						</TableCell>
																						<TableCell className="text-right">
																							$
																							{Number(
																								item.transaction.price ?? 0,
																							).toFixed(2) || 'N/A'}
																						</TableCell>
																						<TableCell className="text-right font-medium">
																							$
																							{Number(
																								item.transaction.amount ?? 0,
																							).toFixed(2) || 'N/A'}
																						</TableCell>
																					</TableRow>
																				);
																			},
																		)}
																		{/* Footer rows with separate buy/sell totals */}
																		{(() => {
																			const buyTransactions =
																				assetMerge.transactionOnAssetMerge.filter(
																					(item) =>
																						!item.transaction.type
																							?.toLowerCase()
																							.includes('sell'),
																				);
																			const sellTransactions =
																				assetMerge.transactionOnAssetMerge.filter(
																					(item) =>
																						item.transaction.type
																							?.toLowerCase()
																							.includes('sell'),
																				);

																			const buyQty = buyTransactions.reduce(
																				(sum, item) =>
																					sum +
																					Number(
																						item.transaction.quantity ?? 0,
																					),
																				0,
																			);
																			const buyAmount = buyTransactions.reduce(
																				(sum, item) =>
																					sum +
																					Number(item.transaction.amount ?? 0),
																				0,
																			);

																			const sellQty = sellTransactions.reduce(
																				(sum, item) =>
																					sum +
																					Number(
																						item.transaction.quantity ?? 0,
																					),
																				0,
																			);
																			const sellAmount =
																				sellTransactions.reduce(
																					(sum, item) =>
																						sum +
																						Number(
																							item.transaction.amount ?? 0,
																						),
																					0,
																				);

																			return (
																				<>
																					{buyTransactions.length > 0 && (
																						<TableRow className="border-t-2 font-semibold bg-green-50/50 dark:bg-green-950/10">
																							<TableCell
																								colSpan={3}
																								className="text-right"
																							>
																								Buy Total
																							</TableCell>
																							<TableCell className="text-right">
																								{buyQty.toFixed(4)}
																							</TableCell>
																							<TableCell />
																							<TableCell className="text-right">
																								${buyAmount.toFixed(2)}
																							</TableCell>
																						</TableRow>
																					)}
																					{sellTransactions.length > 0 && (
																						<TableRow
																							className={`font-semibold bg-red-50/50 dark:bg-red-950/10 ${buyTransactions.length === 0 ? 'border-t-2' : ''}`}
																						>
																							<TableCell
																								colSpan={3}
																								className="text-right"
																							>
																								Sell Total
																							</TableCell>
																							<TableCell className="text-right">
																								{sellQty.toFixed(4)}
																							</TableCell>
																							<TableCell />
																							<TableCell className="text-right">
																								${sellAmount.toFixed(2)}
																							</TableCell>
																						</TableRow>
																					)}
																					<TableRow className="border-t font-semibold bg-muted/30">
																						<TableCell
																							colSpan={3}
																							className="text-right"
																						>
																							Net Total
																						</TableCell>
																						<TableCell className="text-right">
																							{(buyQty + sellQty).toFixed(4)}
																						</TableCell>
																						<TableCell />
																						<TableCell className="text-right">
																							$
																							{(buyAmount + sellAmount).toFixed(
																								2,
																							)}
																						</TableCell>
																					</TableRow>
																				</>
																			);
																		})()}
																	</TableBody>
																</Table>
															</div>
														</div>
													)}

												{/* Lots Table */}
												{assetMerge.lotData &&
													Array.isArray(assetMerge.lotData) &&
													assetMerge.lotData.length > 0 && (
														<div className="space-y-3">
															<h5 className="font-medium text-sm flex items-center gap-2">
																<FileText className="h-4 w-4" />
																Lots
															</h5>
															<div className="overflow-x-auto">
																<Table>
																	<TableHeader>
																		<TableRow>
																			<TableHead>Acquired Date</TableHead>
																			<TableHead>Lot ID</TableHead>
																			<TableHead className="text-right">
																				Quantity
																			</TableHead>
																			<TableHead className="text-right">
																				Price
																			</TableHead>
																			<TableHead className="text-right">
																				Amount
																			</TableHead>
																		</TableRow>
																	</TableHeader>
																	<TableBody>
																		{/** biome-ignore lint/suspicious/noExplicitAny: <ok> */}
																		{[...(assetMerge.lotData as any[])]
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
																			.map((lot: any) => {
																				const amount =
																					Number(lot.quantity || 0) *
																					Number(lot.price || 0);
																				return (
																					<TableRow key={lot.lotId}>
																						<TableCell className="text-sm">
																							{lot.acquiredDate
																								? new Date(
																										lot.acquiredDate,
																									).toLocaleDateString()
																								: 'N/A'}
																						</TableCell>
																						<TableCell className="text-xs font-mono text-muted-foreground">
																							{lot.lotId?.substring(0, 8)}...
																						</TableCell>
																						<TableCell className="text-right">
																							{Number(
																								lot.quantity || 0,
																							).toFixed(4)}
																						</TableCell>
																						<TableCell className="text-right">
																							$
																							{Number(lot.price || 0).toFixed(
																								4,
																							)}
																						</TableCell>
																						<TableCell className="text-right font-medium">
																							${amount.toFixed(2)}
																						</TableCell>
																					</TableRow>
																				);
																			})}
																		{/* Footer row with totals */}
																		<TableRow className="border-t-2 font-semibold bg-muted/30">
																			<TableCell
																				colSpan={2}
																				className="text-right"
																			>
																				Total
																			</TableCell>
																			<TableCell className="text-right">
																				{/** biome-ignore lint/suspicious/noExplicitAny: <ok> */}
																				{(assetMerge.lotData as any[])
																					.reduce(
																						(sum, lot) =>
																							sum + Number(lot.quantity || 0),
																						0,
																					)
																					.toFixed(4)}
																			</TableCell>
																			<TableCell />
																			<TableCell className="text-right">
																				$
																				{/** biome-ignore lint/suspicious/noExplicitAny: <ok> */}
																				{(assetMerge.lotData as any[])
																					.reduce(
																						(sum, lot) =>
																							sum +
																							Number(lot.quantity || 0) *
																								Number(lot.price || 0),
																						0,
																					)
																					.toFixed(2)}
																			</TableCell>
																		</TableRow>
																	</TableBody>
																</Table>
															</div>
														</div>
													)}
												{/* Position Snapshot & Resolved Lot Change - Horizontal Layout */}
												{(assetMerge.targetPositionSnapshot ||
													assetMerge.resolvedLotChange) && (
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														{/* Raw Position Data */}
														{assetMerge.targetPositionSnapshot && (
															<div className="space-y-3">
																<div className="flex items-center justify-between">
																	<h5 className="font-medium text-sm flex items-center gap-2">
																		<DollarSign className="h-4 w-4" />
																		Position Snapshot
																	</h5>
																	<Button
																		size="sm"
																		variant="ghost"
																		onClick={() => {
																			navigator.clipboard.writeText(
																				JSON.stringify(
																					assetMerge.targetPositionSnapshot,
																					null,
																					2,
																				),
																			);
																		}}
																	>
																		<Copy className="h-3 w-3" />
																	</Button>
																</div>
																<details className="cursor-pointer">
																	<summary className="text-xs text-muted-foreground hover:text-foreground">
																		View position snapshot data
																	</summary>
																	<div className="mt-2">
																		<ReactJsonView
																			src={assetMerge.targetPositionSnapshot}
																			theme={
																				theme.theme === 'dark'
																					? 'ashes'
																					: 'rjv-default'
																			}
																			displayDataTypes={false}
																			collapsed={2}
																		/>
																	</div>
																</details>
															</div>
														)}

														{/* Resolved Lot Change JSON */}
														{assetMerge.resolvedLotChange && (
															<div className="space-y-3">
																<div className="flex items-center justify-between">
																	<h5 className="font-medium text-sm flex items-center gap-2">
																		<FileText className="h-4 w-4" />
																		Resolved Lot Change
																	</h5>
																	<Button
																		size="sm"
																		variant="ghost"
																		onClick={() => {
																			navigator.clipboard.writeText(
																				JSON.stringify(
																					assetMerge.resolvedLotChange,
																					null,
																					2,
																				),
																			);
																		}}
																	>
																		<Copy className="h-3 w-3" />
																	</Button>
																</div>
																<details className="cursor-pointer">
																	<summary className="text-xs text-muted-foreground hover:text-foreground">
																		View resolved lot change data
																	</summary>
																	<div className="mt-2">
																		<ReactJsonView
																			src={assetMerge.resolvedLotChange}
																			theme={
																				theme.theme === 'dark'
																					? 'ashes'
																					: 'rjv-default'
																			}
																			displayDataTypes={false}
																			collapsed={2}
																		/>
																	</div>
																</details>
															</div>
														)}
													</div>
												)}
											</div>
										);
									});
								})()}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</PageWrapper>
	);
}
