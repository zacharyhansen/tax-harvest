'use client';
import { Badge } from '@repo/ui/components/badge';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import { LogViewerLayout } from './log-viewer-layout';

interface Account {
	mask?: string;
	name?: string;
	type?: string;
	subtype?: string;
	account_id?: string;
	official_name?: string;
	balances?: {
		limit?: number | null;
		current?: number;
		available?: number;
		iso_currency_code?: string;
		unofficial_currency_code?: string | null;
	};
}

interface Security {
	isin?: string | null;
	name?: string;
	type?: string;
	cusip?: string | null;
	sedol?: string | null;
	sector?: string | null;
	industry?: string | null;
	close_price?: number | null;
	security_id?: string;
	/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
	fixed_income?: any;
	ticker_symbol?: string;
	institution_id?: string | null;
	/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
	option_contract?: any;
	update_datetime?: string | null;
	close_price_as_of?: string | null;
	iso_currency_code?: string;
	proxy_security_id?: string | null;
	is_cash_equivalent?: boolean;
	market_identifier_code?: string | null;
	institution_security_id?: string | null;
	unofficial_currency_code?: string | null;
}

interface InvestmentTransaction {
	date?: string;
	fees?: number;
	name?: string;
	type?: string;
	price?: number;
	amount?: number;
	subtype?: string;
	quantity?: number;
	account_id?: string;
	security_id?: string | null;
	iso_currency_code?: string;
	cancel_transaction_id?: string | null;
	unofficial_currency_code?: string | null;
	investment_transaction_id?: string;
}

interface ExternalSyncData {
	item?: {
		/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
		error?: any;
		item_id?: string;
		webhook?: string;
		products?: string[];
		update_type?: string;
		institution_id?: string;
		billed_products?: string[];
		institution_name?: string;
		available_products?: string[];
		consented_products?: string[];
		consent_expiration_time?: string | null;
	};
	accounts?: Account[];
	request_id?: string;
	securities?: Security[];
	investment_transactions?: InvestmentTransaction[];
	total_investment_transactions?: number;
}

interface ExternalSyncLogViewProps {
	/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
	data: any;
}

export function ExternalSyncLogView({ data }: ExternalSyncLogViewProps) {
	const typedData = data as ExternalSyncData;

	// Group transactions by type for summary
	const transactionsByType =
		typedData.investment_transactions?.reduce(
			(acc, txn) => {
				const type = txn.type || 'unknown';
				acc[type] = (acc[type] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		) || {};

	// Group securities by sector
	const securitiesBySector =
		typedData.securities?.reduce(
			(acc, security) => {
				const sector = security.sector || 'Unknown';
				acc[sector] = (acc[sector] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		) || {};

	return (
		<LogViewerLayout data={data}>
			{/* Summary */}
			<Card>
				<CardHeader>
					<CardTitle>External Sync Summary</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div>
							<p className="text-sm text-muted-foreground">Institution</p>
							<p className="font-medium">
								{typedData.item?.institution_name || 'N/A'}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Accounts</p>
							<p className="font-medium">{typedData.accounts?.length || 0}</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Securities</p>
							<p className="font-medium">{typedData.securities?.length || 0}</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Transactions</p>
							<p className="font-medium">
								{typedData.total_investment_transactions || 0}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Institution Info */}
			{typedData.item && (
				<Card>
					<CardHeader>
						<CardTitle>Institution Details</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">
									Institution Name
								</p>
								<p className="font-medium">{typedData.item.institution_name}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Institution ID</p>
								<p className="font-mono text-sm">
									{typedData.item.institution_id}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Update Type</p>
								<Badge variant="secondary">{typedData.item.update_type}</Badge>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Products</p>
								<div className="flex gap-1 flex-wrap">
									{typedData.item.products?.map((product, index) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: <ok>
										<Badge key={index} variant="outline">
											{product}
										</Badge>
									))}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Accounts */}
			{typedData.accounts && typedData.accounts.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Accounts ({typedData.accounts.length})</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b">
										<th className="text-left p-2">Name</th>
										<th className="text-left p-2">Type</th>
										<th className="text-left p-2">Mask</th>
										<th className="text-left p-2">Current Balance</th>
										<th className="text-left p-2">Available</th>
										<th className="text-left p-2">Currency</th>
									</tr>
								</thead>
								<tbody>
									{typedData.accounts.map((account, index) => (
										<tr key={account.account_id || index} className="border-b">
											<td className="p-2 font-medium">{account.name}</td>
											<td className="p-2">
												<Badge variant="outline">
													{account.type} / {account.subtype}
												</Badge>
											</td>
											<td className="p-2 font-mono">{account.mask}</td>
											<td className="p-2 font-mono">
												${account.balances?.current?.toLocaleString()}
											</td>
											<td className="p-2 font-mono">
												${account.balances?.available?.toLocaleString()}
											</td>
											<td className="p-2">
												{account.balances?.iso_currency_code}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Transaction Summary by Type */}
			{Object.keys(transactionsByType).length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Transaction Summary by Type</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{Object.entries(transactionsByType).map(([type, count]) => (
								<div key={type}>
									<p className="text-sm text-muted-foreground capitalize">
										{type}
									</p>
									<p className="font-medium text-lg">{count}</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Investment Transactions */}
			{typedData.investment_transactions &&
				typedData.investment_transactions.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>
								Investment Transactions (
								{typedData.investment_transactions.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b">
											<th className="text-left p-2">Date</th>
											<th className="text-left p-2">Type</th>
											<th className="text-left p-2">Name</th>
											<th className="text-left p-2">Quantity</th>
											<th className="text-left p-2">Price</th>
											<th className="text-left p-2">Amount</th>
											<th className="text-left p-2">Fees</th>
										</tr>
									</thead>
									<tbody>
										{typedData.investment_transactions
											.slice(0, 50)
											.map((transaction, index) => (
												<tr
													key={transaction.investment_transaction_id || index}
													className="border-b"
												>
													<td className="p-2">
														{transaction.date
															? new Date(transaction.date).toLocaleDateString()
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
													<td
														className="p-2 max-w-xs truncate"
														title={transaction.name}
													>
														{transaction.name}
													</td>
													<td className="p-2 font-mono">
														{transaction.quantity}
													</td>
													<td className="p-2 font-mono">
														${transaction.price}
													</td>
													<td
														className={`p-2 font-mono ${(transaction.amount || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
													>
														${transaction.amount?.toLocaleString()}
													</td>
													<td className="p-2 font-mono">${transaction.fees}</td>
												</tr>
											))}
									</tbody>
								</table>
								{typedData.investment_transactions.length > 50 && (
									<p className="text-sm text-muted-foreground mt-2">
										Showing first 50 transactions of{' '}
										{typedData.investment_transactions.length} total
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				)}

			{/* Securities by Sector */}
			{Object.keys(securitiesBySector).length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Securities by Sector</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							{Object.entries(securitiesBySector).map(([sector, count]) => (
								<div key={sector}>
									<p className="text-sm text-muted-foreground">{sector}</p>
									<p className="font-medium">{count} securities</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Securities Detail */}
			{typedData.securities && typedData.securities.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Securities ({typedData.securities.length})</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b">
										<th className="text-left p-2">Symbol</th>
										<th className="text-left p-2">Name</th>
										<th className="text-left p-2">Type</th>
										<th className="text-left p-2">Sector</th>
										<th className="text-left p-2">Close Price</th>
										<th className="text-left p-2">Market</th>
									</tr>
								</thead>
								<tbody>
									{typedData.securities.map((security, index) => (
										<tr
											key={security.security_id || index}
											className="border-b"
										>
											<td className="p-2 font-mono font-semibold">
												{security.ticker_symbol}
											</td>
											<td
												className="p-2 max-w-xs truncate"
												title={security.name}
											>
												{security.name}
											</td>
											<td className="p-2">
												<Badge variant="outline">{security.type}</Badge>
											</td>
											<td className="p-2">{security.sector || 'N/A'}</td>
											<td className="p-2 font-mono">
												{security.close_price
													? `$${security.close_price}`
													: 'N/A'}
											</td>
											<td className="p-2">
												{security.market_identifier_code || 'N/A'}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			)}
		</LogViewerLayout>
	);
}
