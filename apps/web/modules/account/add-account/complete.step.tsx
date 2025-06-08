import NumberFlow from '@number-flow/react'
import { useEffect, useState } from 'react'

export function CompleteStep() {
  const [taxSavings, setTaxSavings] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTaxSavings(156.78)
    }, 250)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-8">
      <div className="py-8 text-center">
        <h2 className="mb-4 text-xl font-semibold">Tax Savings Calculated</h2>
        <p className="mb-8 text-gray-400">
          Based on your portfolio, we think we could save you at least
        </p>

        <div className="mb-8 text-5xl font-bold text-green-500">
          <NumberFlow
            value={taxSavings}
            format={{ currency: 'USD', style: 'currency' }}
          />
        </div>

        {/* Sample Tax Lots Display */}
        <div className="mb-8">
          <h3 className="mb-4 text-left text-lg font-semibold">Sample Tax Lots You Could Harvest:</h3>
          <div className="space-y-3">
            {[
              {
                id: 1,
                symbol: 'AAPL',
                quantity: 100,
                potentialLoss: 5000,
                potentialTaxSavings: 1250,
              },
              {
                id: 2,
                symbol: 'TSLA',
                quantity: 50,
                potentialLoss: 8000,
                potentialTaxSavings: 2000,
              },
              {
                id: 3,
                symbol: 'MSFT',
                quantity: 75,
                potentialLoss: 3500,
                potentialTaxSavings: 875,
              },
            ].map(opportunity => (
              <div key={opportunity.id} className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900/50 p-4">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold ">{opportunity.symbol}</span>
                    <span className="text-sm text-gray-400">
                      {opportunity.quantity}
                      {' '}
                      shares
                    </span>
                  </div>
                  <div className="text-sm text-red-400">
                    $
                    {opportunity.potentialLoss.toLocaleString()}
                    {' '}
                    potential loss
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-400">
                    $
                    {opportunity.potentialTaxSavings.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Tax Savings</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
