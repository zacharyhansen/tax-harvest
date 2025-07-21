'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Badge } from '@repo/ui/components/badge';
import { LogViewerLayout } from './log-viewer-layout';
import { Format } from '~/modules/utils';

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
  symbol?: string;
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


export function PlaidTrxMergeLogView({ data, LotTransactionBatch }: PlaidTrxMergeLogViewProps) {
  const typedData = data as PlaidTrxMergeData;
  const lotBatches = LotTransactionBatch || [];

  return (
    <LogViewerLayout data={data}>
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Merge Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-sm">Initial Lots</p>
              <p className="font-medium">
                {typedData.initialLots?.length || 0}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Transactions</p>
              <p className="font-medium">
                {typedData.transactions?.length || 0}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Final Positions</p>
              <p className="font-medium">
                {typedData.finalPositions?.length || 0}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Auth Connection</p>
              <p className="font-medium">
                {typedData.authConnection ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Initial Lots */}
      {typedData.initialLots && typedData.initialLots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Initial Lots ({typedData.initialLots.length})</CardTitle>
          </CardHeader>
          <CardContent>
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
                          {lot.symbol}
                        </td>
                        <td className="p-2 font-mono">{lot.remainingQty}</td>
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
                              lot.taxGain === 'LONG' ? 'default' : 'secondary'
                            }
                          >
                            {lot.taxGain}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {lot.acquiredDate
                            ? new Date(lot.acquiredDate).toLocaleDateString()
                            : 'N/A'}
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

      {/* Transactions */}
      {typedData.transactions && typedData.transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Transactions ({typedData.transactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Symbol</th>
                    <th className="p-2 text-left">Quantity</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Fee</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Memo</th>
                  </tr>
                </thead>
                <tbody>
                  {typedData.transactions.map((transaction, index) => (
                    <tr key={transaction.id || index} className="border-b">
                      <td className="p-2">
                        <Badge
                          variant={
                            transaction.type === 'buy'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {transaction.type?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-2 font-mono">
                        {transaction.assetSymbol}
                      </td>
                      <td className="p-2 font-mono">{transaction.quantity}</td>
                      <td className="p-2 font-mono">${transaction.price}</td>
                      <td className="p-2 font-mono">${transaction.amount}</td>
                      <td className="p-2 font-mono">${transaction.fee}</td>
                      <td className="p-2">
                        {transaction.transactionDate
                          ? new Date(
                              transaction.transactionDate
                            ).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="p-2">{transaction.memo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Final Positions */}
      {typedData.finalPositions && typedData.finalPositions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Final Positions ({typedData.finalPositions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Symbol</th>
                    <th className="p-2 text-left">Quantity</th>
                    <th className="p-2 text-left">Cost Total</th>
                    <th className="p-2 text-left">Market Value</th>
                  </tr>
                </thead>
                <tbody>
                  {typedData.finalPositions.map((position, index) => {
                    const totalValue =
                      position.quantity && position.averageCost
                        ? (
                            parseFloat(position.quantity) *
                            parseFloat(position.averageCost)
                          ).toFixed(2)
                        : 'N/A';

                    return (
                      <tr key={position.id || index} className="border-b">
                        <td className="p-2 font-mono">
                          {position.assetSymbol}
                        </td>
                        <td className="p-2 font-mono">{position.quantity}</td>
                        <td className="p-2 font-mono">
                          {Format.money(position.costTotal)}
                        </td>
                        <td className="p-2 font-mono">
                          {Format.money(position.marketValue)}
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

      {/* Auth Connection Details */}
      {typedData.authConnection && (
        <Card>
          <CardHeader>
            <CardTitle>Authentication Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Object.entries(typedData.authConnection).map(([key, value]) => (
                <div key={key}>
                  <p className="text-muted-foreground text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="font-mono text-sm">
                    {typeof value === 'object'
                      ? JSON.stringify(value)
                      : String(value)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lot Transaction Batches */}
      {lotBatches && lotBatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lot Transaction Batches ({lotBatches.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {lotBatches.map((batch, batchIndex) => (
              <div key={batch.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">Batch {batchIndex + 1}</h4>
                    <p className="text-sm text-muted-foreground">
                      ID: {batch.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Account: {batch.account.name || batch.account.type} ({batch.account.externalId})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm font-mono">
                      {new Date(batch.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Batch Summary */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 bg-muted/50 p-3 rounded">
                  <div>
                    <p className="text-sm text-muted-foreground">Lot Changes</p>
                    <p className="font-medium">{batch.lotChangeLog.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Realized P&L</p>
                    <p className="font-medium font-mono">
                      {batch.realizedProfitAndLoss ? Format.money(batch.realizedProfitAndLoss) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">New Transactions</p>
                    <p className="font-medium">
                      {batch.newTransactions ? (() => {
                        try {
                          return JSON.parse(batch.newTransactions).length;
                        } catch {
                          return 'Invalid';
                        }
                      })() : 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Processed</p>
                    <p className="font-medium">
                      {batch.lotChangeLog.filter(log => log.processed).length} / {batch.lotChangeLog.length}
                    </p>
                  </div>
                </div>

                {/* Lot Change Log */}
                {batch.lotChangeLog && batch.lotChangeLog.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="font-medium">Lot Change Log ({batch.lotChangeLog.length})</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="p-2 text-left">Operation</th>
                            <th className="p-2 text-left">Asset</th>
                            <th className="p-2 text-left">Quantity Change</th>
                            <th className="p-2 text-left">Source</th>
                            <th className="p-2 text-left">Processed</th>
                            <th className="p-2 text-left">Lot Details</th>
                            <th className="p-2 text-left">Transaction</th>
                            <th className="p-2 text-left">Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {batch.lotChangeLog.map((changeLog, logIndex) => (
                            <tr key={changeLog.id} className="border-b">
                              <td className="p-2">
                                <Badge
                                  variant={
                                    changeLog.operationType === 'create'
                                      ? 'default'
                                      : changeLog.operationType === 'update'
                                      ? 'secondary'
                                      : 'destructive'
                                  }
                                >
                                  {changeLog.operationType.toUpperCase()}
                                </Badge>
                              </td>
                              <td className="p-2 font-mono">
                                {changeLog.lot?.assetSymbol || changeLog.transaction?.assetSymbol || 'N/A'}
                              </td>
                              <td className="p-2 font-mono">
                                {changeLog.quantityChange || 'N/A'}
                              </td>
                              <td className="p-2">{changeLog.source || 'N/A'}</td>
                              <td className="p-2">
                                <Badge variant={changeLog.processed ? 'default' : 'secondary'}>
                                  {changeLog.processed ? 'Yes' : 'No'}
                                </Badge>
                              </td>
                              <td className="p-2">
                                {changeLog.lot && (
                                  <div className="space-y-1">
                                    <p className="text-xs">
                                      <span className="text-muted-foreground">Remaining:</span>{' '}
                                      {changeLog.lot.remainingQty}
                                    </p>
                                    <p className="text-xs">
                                      <span className="text-muted-foreground">Price:</span>{' '}
                                      {Format.money(changeLog.lot.price)}
                                    </p>
                                    <p className="text-xs">
                                      <span className="text-muted-foreground">Acquired:</span>{' '}
                                      {new Date(changeLog.lot.acquiredDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                )}
                              </td>
                              <td className="p-2">
                                {changeLog.transaction && (
                                  <div className="space-y-1">
                                    <p className="text-xs">
                                      <span className="text-muted-foreground">Type:</span>{' '}
                                      {changeLog.transaction.type}
                                    </p>
                                    <p className="text-xs">
                                      <span className="text-muted-foreground">Qty:</span>{' '}
                                      {changeLog.transaction.quantity || 'N/A'}
                                    </p>
                                    <p className="text-xs">
                                      <span className="text-muted-foreground">Price:</span>{' '}
                                      {changeLog.transaction.price ? Format.money(changeLog.transaction.price) : 'N/A'}
                                    </p>
                                  </div>
                                )}
                              </td>
                              <td className="p-2 text-xs">
                                {new Date(changeLog.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))}
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
                      {batch.newBuys && (() => {
                        try {
                          const buys = JSON.parse(batch.newBuys);
                          return (
                            <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded">
                              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                New Buys ({buys.length})
                              </p>
                              <pre className="text-xs mt-2 overflow-auto max-h-32">
                                {JSON.stringify(buys, null, 2)}
                              </pre>
                            </div>
                          );
                        } catch {
                          return (
                            <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded">
                              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                New Buys (Invalid JSON)
                              </p>
                              <pre className="text-xs mt-2 overflow-auto max-h-32">
                                {batch.newBuys}
                              </pre>
                            </div>
                          );
                        }
                      })()}
                      {batch.newSells && (() => {
                        try {
                          const sells = JSON.parse(batch.newSells);
                          return (
                            <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded">
                              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                                New Sells ({sells.length})
                              </p>
                              <pre className="text-xs mt-2 overflow-auto max-h-32">
                                {JSON.stringify(sells, null, 2)}
                              </pre>
                            </div>
                          );
                        } catch {
                          return (
                            <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded">
                              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                                New Sells (Invalid JSON)
                              </p>
                              <pre className="text-xs mt-2 overflow-auto max-h-32">
                                {batch.newSells}
                              </pre>
                            </div>
                          );
                        }
                      })()}
                      {batch.deletedLots && (() => {
                        try {
                          const lots = JSON.parse(batch.deletedLots);
                          return (
                            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded">
                              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                                Deleted Lots ({lots.length})
                              </p>
                              <pre className="text-xs mt-2 overflow-auto max-h-32">
                                {JSON.stringify(lots, null, 2)}
                              </pre>
                            </div>
                          );
                        } catch {
                          return (
                            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded">
                              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                                Deleted Lots (Invalid JSON)
                              </p>
                              <pre className="text-xs mt-2 overflow-auto max-h-32">
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
      )}
    </LogViewerLayout>
  );
}
