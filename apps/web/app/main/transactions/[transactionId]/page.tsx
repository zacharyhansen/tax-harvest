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
import { Separator } from '@repo/ui/components/separator';
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
	Calendar,
	CheckCircle2,
	Copy,
	DollarSign,
	FileText,
	Hash,
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
		return <ErrorPage message={`Failed to load transaction: ${error.message}`} />;
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
		asset: transaction.asset ? {
			symbol: transaction.asset.symbol,
			name: transaction.asset.name,
			type: transaction.asset.assetType?.description || transaction.asset.assetType?.code || null,
		} : null,
		portfolio: transaction.portfolio ? {
			id: transaction.portfolio.id,
			name: transaction.portfolio.name,
		} : null,
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
										variant={isSell ? 'destructive' : isBuy ? 'default' : 'outline'}
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
									{transaction.assetSymbol || transaction.displaySymbol || 'N/A'}
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
								<div className={`text-xl font-bold ${isSell ? 'text-destructive' : isBuy ? 'text-green-600' : ''}`}>
									{formatCurrency(transaction.amount)}
								</div>
							</div>
							<div className="grid grid-cols-2 gap-2 pt-2 border-t">
								<div>
									<p className="text-xs text-muted-foreground">Quantity</p>
									<p className="text-sm font-medium">{formatQuantity(transaction.quantity)}</p>
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Price</p>
									<p className="text-sm font-medium">{formatCurrency(transaction.price)}</p>
								</div>
							</div>
							{transaction.fee && parseFloat(transaction.fee) !== 0 && (
								<div className="pt-2 border-t">
									<p className="text-xs text-muted-foreground">Fee</p>
									<p className="text-sm font-medium">{formatCurrency(transaction.fee)}</p>
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
										{transaction.account.type} • {transaction.account.authConnection?.source}
									</p>
								)}
							</div>
							{transaction.portfolio && (
								<div className="pt-2 border-t">
									<p className="text-xs text-muted-foreground">Portfolio</p>
									<p className="text-sm font-medium">{transaction.portfolio.name}</p>
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
				{transaction.transactionOnAssetMerge && transaction.transactionOnAssetMerge.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Related Asset Merges
							</CardTitle>
							<CardDescription>
								Asset merges associated with this transaction
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Asset Symbol</TableHead>
										<TableHead className="text-right">Target Value</TableHead>
										<TableHead className="text-right">Target Quantity</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{transaction.transactionOnAssetMerge.map((item) => (
										<TableRow key={item.assetMerge.id}>
											<TableCell className="font-medium">
												<Badge>{item.assetMerge.assetSymbol}</Badge>
											</TableCell>
											<TableCell className="text-right">
												{formatCurrency(item.assetMerge.targetValue)}
											</TableCell>
											<TableCell className="text-right">
												{formatQuantity(item.assetMerge.targetQuantity)}
											</TableCell>
											<TableCell>
												{item.assetMerge.error || item.assetMerge.mergeError ? (
													<div className="flex items-center gap-2">
														<XCircle className="h-4 w-4 text-destructive" />
														<span className="text-sm text-destructive">
															{item.assetMerge.mergeError?.type || 'Error'}
															{item.assetMerge.mergeError?.resolved && ' (Resolved)'}
														</span>
													</div>
												) : (
													<div className="flex items-center gap-2">
														<CheckCircle2 className="h-4 w-4 text-green-600" />
														<span className="text-sm text-green-600">Success</span>
													</div>
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
										JSON.stringify(fullPayload, null, 2)
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
									<span className="font-mono text-xs">{transaction.detailsURI}</span>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</PageWrapper>
	);
}