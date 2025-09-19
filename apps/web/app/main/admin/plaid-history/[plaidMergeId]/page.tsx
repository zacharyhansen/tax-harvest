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
	const failedLotMerges =
		plaidMerge.lotMerge?.filter((lotMerge) =>
			lotMerge.resolvedLotMerge?.some(
				(resolved) => resolved.error || resolved.mergeError,
			),
		) || [];
	const totalLotMerges = plaidMerge.lotMerge?.length || 0;

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
							<CardTitle className="text-sm font-medium">Lot Merges</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{plaidMerge.lotMerge?.length || 0}
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
											JSON.stringify(plaidMerge.resolveLotsInput, null, 2)
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
							<ReactJsonView
								src={plaidMerge.resolveLotsInput}
								theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
								displayDataTypes={false}
								collapsed={2}
							/>
						</CardContent>
					</Card>
				)}

				{/* Lot Merges Section */}
				{plaidMerge.lotMerge && plaidMerge.lotMerge.length > 0 && (
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
										disabled={failedLotMerges.length === 0}
									/>
									<Label htmlFor="failed-only" className="text-sm font-medium">
										Show Failed Only
										{failedLotMerges.length > 0 && (
											<span className="ml-2 text-xs text-destructive">
												({failedLotMerges.length} / {totalLotMerges})
											</span>
										)}
									</Label>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								{(() => {
									const filteredMerges = plaidMerge.lotMerge.filter(
										(lotMerge) => {
											if (!showFailedOnly) return true;
											// Show only lot merges that have errors
											return lotMerge.resolvedLotMerge?.some(
												(resolved) => resolved.error || resolved.mergeError,
											);
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

									return filteredMerges.map((lotMerge) => (
										<div
											key={lotMerge.id}
											className="border rounded-lg p-4 space-y-4 shadow-md"
										>
											{/* Lot Merge Header */}
											<div className="flex items-start justify-between">
												<div>
													<div className="flex items-center gap-2">
														<Badge className="font-semibold text-lg">
															{lotMerge.assetSymbol}
														</Badge>
													</div>
													<p className="text-sm text-muted-foreground mt-1">
														ID: {lotMerge.id}
													</p>
												</div>
												<div className="text-right space-y-1">
													<div className="text-sm">
														<span className="text-muted-foreground">
															Target Value:{' '}
														</span>
														<span className="font-medium">
															$
															{Number(lotMerge.targetValue ?? 0).toFixed(2) ||
																'N/A'}
														</span>
													</div>
													<div className="text-sm">
														<span className="text-muted-foreground">
															Target Qty:{' '}
														</span>
														<span className="font-medium">
															{Number(lotMerge.targetQuantity ?? 0).toFixed(
																4,
															) || 'N/A'}
														</span>
													</div>
												</div>
											</div>

											<Separator />

											{/* Resolved Lot Merges */}
											{lotMerge.resolvedLotMerge &&
												lotMerge.resolvedLotMerge.length > 0 && (
													<div className="space-y-3">
														{lotMerge.resolvedLotMerge.map((resolved) => (
															<div
																key={resolved.id}
																className="bg-muted/50 rounded-lg p-3 space-y-2"
															>
																<div className="flex items-center justify-between">
																	<div className="flex items-center gap-2">
																		{resolved.error ? (
																			<XCircle className="h-4 w-4 text-destructive" />
																		) : (
																			<CheckCircle2 className="h-4 w-4 text-green-600" />
																		)}
																		<span className="text-sm font-medium">
																			{resolved.error ? 'Failed' : 'Success'}
																		</span>
																	</div>
																	{resolved.mergeError && (
																		<Badge variant="destructive">
																			{resolved.mergeError.type}
																			{resolved.mergeError.resolved &&
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
																				Number(
																					resolved.realizedProfitAndLossShortTerm,
																				) > 0
																					? 'text-green-600'
																					: Number(
																								resolved.realizedProfitAndLossShortTerm,
																							) < 0
																						? 'text-destructive'
																						: ''
																			}`}
																		>
																			$
																			{Number(
																				resolved.realizedProfitAndLossShortTerm,
																			).toFixed(2)}
																		</span>
																	</div>
																	<div>
																		<span className="text-muted-foreground">
																			Long Term P&L:{' '}
																		</span>
																		<span
																			className={`font-medium ${
																				Number(
																					resolved.realizedProfitAndLossLongTerm,
																				) > 0
																					? 'text-green-600'
																					: Number(
																								resolved.realizedProfitAndLossLongTerm,
																							) < 0
																						? 'text-destructive'
																						: ''
																			}`}
																		>
																			$
																			{Number(
																				resolved.realizedProfitAndLossLongTerm,
																			).toFixed(2)}
																		</span>
																	</div>
																</div>

																{resolved.error && (
																	<div className="mt-2">
																		<details className="cursor-pointer">
																			<summary className="text-sm font-medium text-destructive">
																				View Error Details
																			</summary>
																			<div className="mt-2">
																				<ReactJsonView
																					src={resolved.error}
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
														))}
													</div>
												)}

											{/* Transactions */}
											{lotMerge.TransactionOnLotMerge &&
												lotMerge.TransactionOnLotMerge.length > 0 && (
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
																	{lotMerge.TransactionOnLotMerge.map(
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
																			lotMerge.TransactionOnLotMerge.filter(
																				(item) =>
																					!item.transaction.type
																						?.toLowerCase()
																						.includes('sell'),
																			);
																		const sellTransactions =
																			lotMerge.TransactionOnLotMerge.filter(
																				(item) =>
																					item.transaction.type
																						?.toLowerCase()
																						.includes('sell'),
																			);

																		const buyQty = buyTransactions.reduce(
																			(sum, item) =>
																				sum +
																				Number(item.transaction.quantity ?? 0),
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
																				Number(item.transaction.quantity ?? 0),
																			0,
																		);
																		const sellAmount = sellTransactions.reduce(
																			(sum, item) =>
																				sum +
																				Number(item.transaction.amount ?? 0),
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
											{lotMerge.lotData &&
												Array.isArray(lotMerge.lotData) &&
												lotMerge.lotData.length > 0 && (
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
																	{[...(lotMerge.lotData as any[])]
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
																						{Number(lot.quantity || 0).toFixed(
																							4,
																						)}
																					</TableCell>
																					<TableCell className="text-right">
																						${Number(lot.price || 0).toFixed(4)}
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
																			{(lotMerge.lotData as any[])
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
																			{(lotMerge.lotData as any[])
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
											{/* Raw Position Data */}
											{lotMerge.targetPositionSnapshot && (
												<div className="space-y-3">
													<h5 className="font-medium text-sm flex items-center gap-2">
														<DollarSign className="h-4 w-4" />
														Position Snapshot
													</h5>
													<details className="cursor-pointer">
														<summary className="text-xs text-muted-foreground hover:text-foreground">
															View position snapshot data
														</summary>
														<div className="mt-2">
															<ReactJsonView
																src={lotMerge.targetPositionSnapshot}
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
											{lotMerge.resolvedLotChange && (
												<div className="space-y-3">
													<h5 className="font-medium text-sm flex items-center justify-between">
														<span className="flex items-center gap-2">
															<FileText className="h-4 w-4" />
															Resolved Lot Change
														</span>
														<Button
															size="sm"
															variant="outline"
															onClick={() => {
																navigator.clipboard.writeText(
																	JSON.stringify(lotMerge.resolvedLotChange, null, 2)
																);
															}}
														>
															<Copy className="h-4 w-4 mr-2" />
															Copy JSON
														</Button>
													</h5>
													<div className="bg-muted/50 rounded-lg p-3">
														<ReactJsonView
															src={lotMerge.resolvedLotChange}
															theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
															displayDataTypes={false}
															collapsed={2}
														/>
													</div>
												</div>
											)}
										</div>
									));
								})()}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</PageWrapper>
	);
}
