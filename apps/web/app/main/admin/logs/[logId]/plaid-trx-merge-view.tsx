'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card'
import { Badge } from '@repo/ui/components/badge'
import { LogViewerLayout } from './log-viewer-layout'

interface Transaction {
  id?: string
  fee?: string
  memo?: string
  type?: string
  price?: string
  amount?: string
  subtype?: string
  quantity?: string
  accountId?: string
  externalId?: string
  assetSymbol?: string
  description?: string
  portfolioId?: string
  securityType?: string
  transactionDate?: string
  paymentCurrency?: string
  settlementCurrency?: string
  settlementDate?: string
  appliedToLots?: boolean
}

interface Lot {
  id?: string
  accountId?: string
  acquiredDate?: string
  costBasis?: string
  gainTotal?: string
  gainTotalPct?: string
  lastPrice?: string
  price?: string
  remainingQty?: string
  symbol?: string
  value?: string
  dollarPerSharePnL?: string
  taxGain?: string
  originalQty?: number
  processQty?: number
}

interface Position {
  id?: string
  quantity?: string
  assetSymbol?: string
  averageCost?: string
}

interface PlaidTrxMergeData {
  initialLots?: Lot[]
  transactions?: Transaction[]
  authConnection?: any
  finalPositions?: Position[]
}

interface PlaidTrxMergeLogViewProps {
  data: any
}

export function PlaidTrxMergeLogView({ data }: PlaidTrxMergeLogViewProps) {
  const typedData = data as PlaidTrxMergeData

  return (
    <LogViewerLayout data={data}>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Merge Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Initial Lots</p>
              <p className="font-medium">{typedData.initialLots?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="font-medium">{typedData.transactions?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Final Positions</p>
              <p className="font-medium">{typedData.finalPositions?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Auth Connection</p>
              <p className="font-medium">{typedData.authConnection ? 'Yes' : 'No'}</p>
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
                    <th className="text-left p-2">Symbol</th>
                    <th className="text-left p-2">Quantity</th>
                    <th className="text-left p-2">Cost Basis</th>
                    <th className="text-left p-2">Current Value</th>
                    <th className="text-left p-2">Gain/Loss</th>
                    <th className="text-left p-2">Gain %</th>
                    <th className="text-left p-2">Tax Status</th>
                    <th className="text-left p-2">Acquired Date</th>
                  </tr>
                </thead>
                <tbody>
                  {typedData.initialLots.map((lot, index) => {
                    const gainLoss = lot.gainTotal ? parseFloat(lot.gainTotal) : 0
                    const gainPct = lot.gainTotalPct ? parseFloat(lot.gainTotalPct) : 0
                    
                    return (
                      <tr key={lot.id || index} className="border-b">
                        <td className="p-2 font-mono font-semibold">{lot.symbol}</td>
                        <td className="p-2 font-mono">{lot.remainingQty}</td>
                        <td className="p-2 font-mono">${lot.costBasis}</td>
                        <td className="p-2 font-mono">${lot.value}</td>
                        <td className={`p-2 font-mono ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${lot.gainTotal}
                        </td>
                        <td className={`p-2 font-mono ${gainPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {gainPct.toFixed(2)}%
                        </td>
                        <td className="p-2">
                          <Badge variant={lot.taxGain === 'LONG' ? 'default' : 'secondary'}>
                            {lot.taxGain}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {lot.acquiredDate 
                            ? new Date(lot.acquiredDate).toLocaleDateString()
                            : 'N/A'
                          }
                        </td>
                      </tr>
                    )
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
            <CardTitle>Transactions ({typedData.transactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Symbol</th>
                    <th className="text-left p-2">Quantity</th>
                    <th className="text-left p-2">Price</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Fee</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Memo</th>
                  </tr>
                </thead>
                <tbody>
                  {typedData.transactions.map((transaction, index) => (
                    <tr key={transaction.id || index} className="border-b">
                      <td className="p-2">
                        <Badge variant={transaction.type === 'buy' ? 'default' : 'destructive'}>
                          {transaction.type?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-2 font-mono">{transaction.assetSymbol}</td>
                      <td className="p-2 font-mono">{transaction.quantity}</td>
                      <td className="p-2 font-mono">${transaction.price}</td>
                      <td className="p-2 font-mono">${transaction.amount}</td>
                      <td className="p-2 font-mono">${transaction.fee}</td>
                      <td className="p-2">
                        {transaction.transactionDate 
                          ? new Date(transaction.transactionDate).toLocaleDateString()
                          : 'N/A'
                        }
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
            <CardTitle>Final Positions ({typedData.finalPositions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Symbol</th>
                    <th className="text-left p-2">Quantity</th>
                    <th className="text-left p-2">Average Cost</th>
                    <th className="text-left p-2">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {typedData.finalPositions.map((position, index) => {
                    const totalValue = position.quantity && position.averageCost 
                      ? (parseFloat(position.quantity) * parseFloat(position.averageCost)).toFixed(2)
                      : 'N/A'
                    
                    return (
                      <tr key={position.id || index} className="border-b">
                        <td className="p-2 font-mono">{position.assetSymbol}</td>
                        <td className="p-2 font-mono">{position.quantity}</td>
                        <td className="p-2 font-mono">${position.averageCost}</td>
                        <td className="p-2 font-mono">${totalValue}</td>
                      </tr>
                    )
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(typedData.authConnection).map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="font-mono text-sm">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </LogViewerLayout>
  )
}