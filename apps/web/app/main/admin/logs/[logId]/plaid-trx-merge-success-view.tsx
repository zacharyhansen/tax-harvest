'use client';
import { Badge } from '@repo/ui/components/badge';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import { LogViewerLayout } from './log-viewer-layout';

interface LotData {
	id?: string;
	accountId?: string;
	acquiredDate?: string;
	costBasis?: string;
	gainTotal?: string;
	gainTotalPct?: string;
	lastPrice?: string;
	price?: string;
	remainingQty?: string;
	symbol?: string;
	value?: string;
	dollarPerSharePnL?: string;
	taxGain?: string;
	originalQty?: number;
	processQty?: number;
}

interface PlaidTrxMergeSuccessData {
	lotTupleMap: Record<string, LotData[]> | Map<string, LotData[]>;
}

interface PlaidTrxMergeSuccessLogViewProps {
	/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
	data: any;
}

/**
 * Component for displaying PLAID_TRX_MERGE_SUCCESS log data
 *
 * @example
 * ```tsx
 * <PlaidTrxMergeSuccessLogView data={{
 *   lotTupleMap: {
 *     "AAPL": [{ symbol: "AAPL", remainingQty: "100", costBasis: "150.00" }],
 *     "MSFT": [{ symbol: "MSFT", remainingQty: "50", costBasis: "300.00" }]
 *   }
 * }} />
 * ```
 */
export function PlaidTrxMergeSuccessLogView({
	data,
}: PlaidTrxMergeSuccessLogViewProps) {
	const typedData = data as PlaidTrxMergeSuccessData;

	// Convert Map to object if needed for easier iteration
	const lotTupleMap =
		typedData.lotTupleMap instanceof Map
			? Object.fromEntries(typedData.lotTupleMap)
			: typedData.lotTupleMap || {};

	const symbols = Object.keys(lotTupleMap);
	const totalLots = symbols.reduce(
		(sum, symbol) => sum + (lotTupleMap[symbol]?.length || 0),
		0,
	);
	const totalValue = symbols.reduce((sum, symbol) => {
		const symbolLots = lotTupleMap[symbol] || [];
		return (
			sum +
			symbolLots.reduce((lotSum, lot) => {
				return lotSum + (lot.value ? parseFloat(lot.value) : 0);
			}, 0)
		);
	}, 0);

	return (
		<LogViewerLayout data={data}>
			{/* Summary */}
			<Card>
				<CardHeader>
					<CardTitle>Transaction Merge Success Summary</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div>
							<p className="text-sm text-muted-foreground">Symbols</p>
							<p className="font-medium">{symbols.length}</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Total Lots</p>
							<p className="font-medium">{totalLots}</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Total Value</p>
							<p className="font-medium">${totalValue.toFixed(2)}</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Has Data</p>
							<p className="font-medium">{symbols.length > 0 ? 'Yes' : 'No'}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Empty State */}
			{symbols.length === 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Lot Tuple Map</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-center py-8 text-muted-foreground">
							<p>No lot data available</p>
							<p className="text-sm mt-2">The lotTupleMap is empty</p>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Lot Data by Symbol */}
			{symbols.map((symbol) => {
				const lots = lotTupleMap[symbol] || [];

				return (
					<Card key={symbol}>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<span className="font-mono font-bold">{symbol}</span>
								<Badge variant="secondary">
									{lots.length} lot{lots.length !== 1 ? 's' : ''}
								</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{lots.length === 0 ? (
								<div className="text-center py-4 text-muted-foreground">
									<p>No lots available for {symbol}</p>
								</div>
							) : (
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b">
												<th className="text-left p-2">ID</th>
												<th className="text-left p-2">Quantity</th>
												<th className="text-left p-2">Cost Basis</th>
												<th className="text-left p-2">Current Value</th>
												<th className="text-left p-2">Gain/Loss</th>
												<th className="text-left p-2">Gain %</th>
												<th className="text-left p-2">Tax Status</th>
												<th className="text-left p-2">Acquired Date</th>
												<th className="text-left p-2">P&L per Share</th>
											</tr>
										</thead>
										<tbody>
											{lots.map((lot, index) => {
												const gainLoss = lot.gainTotal
													? parseFloat(lot.gainTotal)
													: 0;
												const gainPct = lot.gainTotalPct
													? parseFloat(lot.gainTotalPct)
													: 0;

												return (
													<tr key={lot.id || index} className="border-b">
														<td className="p-2 font-mono text-xs">
															{lot.id || `lot-${index}`}
														</td>
														<td className="p-2 font-mono">
															{lot.remainingQty || lot.originalQty}
														</td>
														<td className="p-2 font-mono">
															${lot.costBasis || 'N/A'}
														</td>
														<td className="p-2 font-mono">
															${lot.value || 'N/A'}
														</td>
														<td
															className={`p-2 font-mono ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}
														>
															${lot.gainTotal || 'N/A'}
														</td>
														<td
															className={`p-2 font-mono ${gainPct >= 0 ? 'text-green-600' : 'text-red-600'}`}
														>
															{lot.gainTotalPct
																? `${gainPct.toFixed(2)}%`
																: 'N/A'}
														</td>
														<td className="p-2">
															{lot.taxGain && (
																<Badge
																	variant={
																		lot.taxGain === 'LONG'
																			? 'default'
																			: 'secondary'
																	}
																>
																	{lot.taxGain}
																</Badge>
															)}
														</td>
														<td className="p-2">
															{lot.acquiredDate
																? new Date(
																		lot.acquiredDate,
																	).toLocaleDateString()
																: 'N/A'}
														</td>
														<td
															className={`p-2 font-mono ${
																lot.dollarPerSharePnL
																	? parseFloat(lot.dollarPerSharePnL) >= 0
																		? 'text-green-600'
																		: 'text-red-600'
																	: ''
															}`}
														>
															${lot.dollarPerSharePnL || 'N/A'}
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							)}
						</CardContent>
					</Card>
				);
			})}
		</LogViewerLayout>
	);
}
