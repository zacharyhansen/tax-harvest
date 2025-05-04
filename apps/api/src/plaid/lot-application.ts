import { Prisma } from '@prisma/client'
import Decimal from 'decimal.js'

import { findAllMatchingSubsetsBottomUp } from './lot-application.bottom-up'
import { findGreedySubset } from './lot-application.greedy'

/**
 * A lot's quantity and average price.
 */
export interface LotData {
  quantity: Decimal
  price: Decimal
  lotId: string
  accountId: string
  acquiredDate: Date
  isNewBuy?: boolean
}

export interface LotChange extends LotData {
  quantityFinal: Decimal
  quantityChange: Decimal
  upsert: Prisma.LotCreateInput
  symbol: string
}

interface FindSubsetHybridArgs {
  lotsData: LotData[]
  targetQuantity?: Decimal
  targetValue?: Decimal
  maxResults?: number
  time?: boolean
  symbol: string
}

/**
 * Find a subset of lots that matches the target quantity and value.
 *
 * This is a hybrid approach that first tries to find a greedy match, and if that
 * fails, it then tries to find all matching subsets using a bottom-up approach.
 *
 * @param tuples - The list of lot tuples to search through.
 * @param targetQuantity - The total quantity of the final lots. A falsy value is assumed ot be 0 (all of it is to be sold)
 * @param targetValue - The total cost basis of the final lots
 * @param maxResults - The maximum number of results to return.
 * @returns A list of lot tuples that match the target quantity and value.
 */
export function findSubsetHybrid({
  lotsData: tuples,
  targetQuantity = new Decimal(0),
  targetValue = new Decimal(0),
  maxResults = 5,
  time = true,
}: FindSubsetHybridArgs): LotData[][] {
  const greedyResultFIFO = findGreedySubset({
    tuples,
    targetQuantity,
    targetValue,
    time,
  })

  if (greedyResultFIFO)
    return [greedyResultFIFO]

  const greedyResultLIFO = findGreedySubset({
    tuples: [...tuples].reverse(),
    targetQuantity,
    targetValue,
    time,
  })

  if (greedyResultLIFO)
    return [greedyResultLIFO]

  console.info('Greedy failed, trying bottom-up approach')

  const allResults = findAllMatchingSubsetsBottomUp({
    tuples,
    targetQuantity,
    targetValue,
    maxResults,
    time,
  })

  // Deduplicate equivalent solutions
  if (allResults.length === 0) {
    console.error(
      `No results found: ${JSON.stringify(
        {
          targetQuantity: targetQuantity.toString(),
          targetValue: targetValue.toString(),
        },
        null,
        2,
      )} lots: ${tuples.map(t => JSON.stringify({ ...t, lotId: t.lotId }, null, 2)).join(', ')}`,
    )
    throw new Error('No results found')
  }
  else {
    return allResults
  }
}

export function findLotChangeSets(params: FindSubsetHybridArgs): { lotChanges: LotChange[] } {
  const results = findSubsetHybrid(params)

  const lotChanges: LotChange[][] = []

  for (const result of results) {
    const lotChangesForResult: LotChange[] = []

    for (const [index, resultLot] of result.entries()) {
      const originalLot = params.lotsData[index]
      const lotChange: LotChange = {
        ...originalLot,
        quantityChange: originalLot.quantity.minus(resultLot.quantity),
        quantityFinal: resultLot.quantity,
        symbol: params.symbol,
        upsert: {
          id: resultLot.lotId,
          account: {
            connect: {
              id: resultLot.accountId,
            },
          },
          remainingQty: resultLot.quantity,
          asset: {
            connect: {
              symbol: params.symbol,
            },
          },
          price: resultLot.price,
          acquiredDate: resultLot.acquiredDate,
        },
      }

      lotChangesForResult.push(lotChange)
    }

    lotChanges.push(lotChangesForResult)
  }

  // Deduplicate the lot changes based on the signature of changes
  const uniqueLotChangeSolutions = deduplicateEquivalentChangeSets(lotChanges)

  if (uniqueLotChangeSolutions.length > 1) {
    const err = new Error('Multiple results found')
    err.name = 'MultipleResultsFound'
    // @ts-expect-error - This is a custom error
    err.data = {
      ...params,
      uniqueLotChanges: uniqueLotChangeSolutions,
    }
    throw err
  }

  return { lotChanges: uniqueLotChangeSolutions[0] }
}

/**
 * Deduplicates changesets that are functionally equivalent (same total quantities sold for the same price/date)
 * @param changeSets Array of lot change sets
 * @returns Deduplicated change sets
 */
function deduplicateEquivalentChangeSets(
  changeSets: LotChange[][],
): LotChange[][] {
  if (changeSets.length <= 1)
    return changeSets

  const changeSetMap = new Map<string, LotChange[]>()

  for (const changeSet of changeSets) {
    // Group changes by price and acquisition date
    const priceAndDateGroups = new Map<string, Decimal>()

    for (const change of changeSet) {
      const date = change.acquiredDate.toISOString()
      const key = `${change.price.toString()}:${date}`

      // Sum up the quantityChange for each price/date combination
      const currentSum = priceAndDateGroups.get(key) ?? new Decimal(0)
      priceAndDateGroups.set(key, currentSum.plus(change.quantityChange))
    }

    // Create a signature based on the aggregated changes per price/date
    const signature = Array.from(priceAndDateGroups.entries())
      .map(([key, totalChange]) => `${key}:${totalChange.toString()}`)
      .sort()
      .join('|')

    // Only store the first change set with this signature
    if (!changeSetMap.has(signature)) {
      changeSetMap.set(signature, changeSet)
    }
  }

  return Array.from(changeSetMap.values())
}
