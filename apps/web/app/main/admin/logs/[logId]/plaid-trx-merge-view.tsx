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

interface PlaidTrxMergeData {
  initialLots?: Lot[];
  transactions?: Transaction[];
  authConnection?: any;
  finalPositions?: Position[];
}

interface PlaidTrxMergeLogViewProps {
  data: any;
}

export function PlaidTrxMergeLogView({ data }: PlaidTrxMergeLogViewProps) {
  const typedData = data as PlaidTrxMergeData;

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
    </LogViewerLayout>
  );
}
