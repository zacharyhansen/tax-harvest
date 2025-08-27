'use client';
import { Badge } from '@repo/ui/components/badge';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import { LogViewerLayout } from './log-viewer-layout';

/**
 * Interface for investment account information
 */
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

/**
 * Interface for investment holding information
 */
interface Holding {
	quantity?: number;
	account_id?: string;
	cost_basis?: number | null;
	security_id?: string;
	vested_value?: number | null;
	vested_quantity?: number | null;
	institution_price?: number;
	institution_value?: number;
	iso_currency_code?: string;
	institution_price_as_of?: string;
	unofficial_currency_code?: string | null;
	institution_price_datetime?: string | null;
}

/**
 * Interface for security information
 */
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
	subtype?: string | null;
}

/**
 * Interface for investments holdings data structure
 */
interface InvestmentsHoldingsData {
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
	holdings?: Holding[];
	securities?: Security[];
	request_id?: string;
}

interface InvestmentsHoldingsLogViewProps {
	/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
	data: any;
}

/**
 * Component for displaying investments holdings log data
 * @param data - The log data containing holdings information
 */
export function InvestmentsHoldingsLogView({
	data,
}: InvestmentsHoldingsLogViewProps) {
	const typedData = data as InvestmentsHoldingsData;

	// Calculate portfolio metrics
	const totalPortfolioValue =
		typedData.holdings?.reduce(
			(sum, holding) => sum + (holding.institution_value || 0),
			0,
		) || 0;

	const totalCostBasis =
		typedData.holdings?.reduce(
			(sum, holding) => sum + (holding.cost_basis || 0),
			0,
		) || 0;

	const unrealizedGainLoss = totalPortfolioValue - totalCostBasis;
	const gainLossPercentage =
		totalCostBasis > 0 ? (unrealizedGainLoss / totalCostBasis) * 100 : 0;

	// Group holdings by security type
	const holdingsBySector =
		typedData.securities?.reduce(
			(acc, security) => {
				const sector = security.sector || 'Unknown';
				const holding = typedData.holdings?.find(
					(h) => h.security_id === security.security_id,
				);
				if (holding) {
					acc[sector] = (acc[sector] || 0) + (holding.institution_value || 0);
				}
				return acc;
			},
			{} as Record<string, number>,
		) || {};

	// Group securities by type
	const securitiesByType =
		typedData.securities?.reduce(
			(acc, security) => {
				const type = security.type || 'unknown';
				acc[type] = (acc[type] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		) || {};

	return (
		<LogViewerLayout data={data}>
			{/* Portfolio Summary */}
			<Card>
				<CardHeader>
					<CardTitle>Portfolio Summary</CardTitle>
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
							<p className="text-sm text-muted-foreground">Total Holdings</p>
							<p className="font-medium">{typedData.holdings?.length || 0}</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Portfolio Value</p>
							<p className="font-medium text-lg font-mono">
								$
								{totalPortfolioValue.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Unrealized P&L</p>
							<p
								className={`font-medium font-mono ${unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}
							>
								$
								{unrealizedGainLoss.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
								({gainLossPercentage.toFixed(2)}%)
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

			{/* Holdings by Sector */}
			{Object.keys(holdingsBySector).length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Holdings by Sector</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							{Object.entries(holdingsBySector)
								.sort(([, a], [, b]) => b - a)
								.map(([sector, value]) => (
									<div key={sector}>
										<p className="text-sm text-muted-foreground">{sector}</p>
										<p className="font-medium font-mono">
											$
											{value.toLocaleString(undefined, {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</p>
										<p className="text-xs text-muted-foreground">
											{totalPortfolioValue > 0
												? ((value / totalPortfolioValue) * 100).toFixed(1)
												: '0.0'}
											%
										</p>
									</div>
								))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Securities by Type */}
			{Object.keys(securitiesByType).length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Securities by Type</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{Object.entries(securitiesByType).map(([type, count]) => (
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

			{/* Holdings Detail */}
			{typedData.holdings && typedData.holdings.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Holdings Detail ({typedData.holdings.length})</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b">
										<th className="text-left p-2">Security</th>
										<th className="text-left p-2">Quantity</th>
										<th className="text-left p-2">Price</th>
										<th className="text-left p-2">Market Value</th>
										<th className="text-left p-2">Cost Basis</th>
										<th className="text-left p-2">P&L</th>
										<th className="text-left p-2">% Change</th>
									</tr>
								</thead>
								<tbody>
									{[...typedData.holdings]
										.sort(
											(a, b) =>
												(b.institution_value || 0) - (a.institution_value || 0),
										)
										.map((holding, index) => {
											const security = typedData.securities?.find(
												(s) => s.security_id === holding.security_id,
											);
											const pnl =
												(holding.institution_value || 0) -
												(holding.cost_basis || 0);
											const pnlPercent =
												holding.cost_basis && holding.cost_basis > 0
													? (pnl / holding.cost_basis) * 100
													: 0;

											return (
												<tr
													key={holding.security_id || index}
													className="border-b"
												>
													<td className="p-2">
														<div>
															<p className="font-mono font-semibold">
																{security?.ticker_symbol || 'N/A'}
															</p>
															<p
																className="text-xs text-muted-foreground max-w-xs truncate"
																title={security?.name}
															>
																{security?.name || 'Unknown Security'}
															</p>
														</div>
													</td>
													<td className="p-2 font-mono">{holding.quantity}</td>
													<td className="p-2 font-mono">
														${holding.institution_price?.toFixed(2) || '0.00'}
													</td>
													<td className="p-2 font-mono font-medium">
														$
														{holding.institution_value?.toLocaleString(
															undefined,
															{
																minimumFractionDigits: 2,
																maximumFractionDigits: 2,
															},
														) || '0.00'}
													</td>
													<td className="p-2 font-mono">
														$
														{holding.cost_basis?.toLocaleString(undefined, {
															minimumFractionDigits: 2,
															maximumFractionDigits: 2,
														}) || '0.00'}
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
					</CardContent>
				</Card>
			)}

			{/* Securities Detail */}
			{typedData.securities && typedData.securities.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>
							Securities Detail ({typedData.securities.length})
						</CardTitle>
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
										<th className="text-left p-2">Industry</th>
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
											<td
												className="p-2 max-w-xs truncate"
												title={security.industry || undefined}
											>
												{security.industry || 'N/A'}
											</td>
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
