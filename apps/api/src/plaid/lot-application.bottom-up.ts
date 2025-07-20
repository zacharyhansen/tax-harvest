import Decimal from 'decimal.js'

import { LotData } from './lot-application'

export function findAllMatchingSubsetsBottomUp({
  tuples,
  targetQuantity,
  targetValue,
  maxResults,
  epsilonValue = new Decimal(0.01),
  epsilonQty = new Decimal(0.01),
  time = true,
}: {
  tuples: LotData[]
  targetQuantity: Decimal
  targetValue: Decimal
  maxResults: number
  epsilonValue?: Decimal
  epsilonQty?: Decimal
  time?: boolean
}): LotData[][] {
  const startTime = Date.now()
  const timeoutMs = 60000 // 60 seconds

  const checkTimeout = () => {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error('findAllMatchingSubsetsBottomUp timed out after 60 seconds')
    }
  }

  if (time) {
    console.time('findAllMatchingSubsetsBottomUp:total')
  }

  // Calculate the total quantity and value of all lots
  const totalQuantity = tuples.reduce(
    (sum, lot) => sum.plus(lot.quantity),
    new Decimal(0),
  )
  const totalValue = tuples.reduce(
    (sum, lot) => sum.plus(lot.quantity.mul(lot.price)),
    new Decimal(0),
  )

  // If target quantity equals total quantity, return all lots at their full quantity
  if (totalQuantity.eq(targetQuantity)) {
    console.info(
      'Target quantity matches total quantity - using all lots as is',
    )
    if (time) {
      console.timeEnd('findAllMatchingSubsetsBottomUp:total')
    }
    return [tuples.map(lot => ({ ...lot }))]
  }

  // If the total available is less than what we need, return empty
  if (totalQuantity.lt(targetQuantity) || totalValue.lt(targetValue)) {
    if (time) {
      console.timeEnd('findAllMatchingSubsetsBottomUp:total')
    }
    return []
  }

  // If we need exact match for both quantity and value, return them all at full quantity
  if (totalQuantity.eq(targetQuantity) && totalValue.eq(targetValue)) {
    if (time) {
      console.timeEnd('findAllMatchingSubsetsBottomUp:total')
    }
    return [tuples.map(lot => ({ ...lot }))]
  }

  const dp: Map<string, LotData[][]>[] = []

  const key = (qty: Decimal, val: Decimal) =>
    `${qty.toString()}-${val.toString()}`

  // Initialize DP table with full quantities of all lots
  dp[0] = new Map()
  dp[0].set(key(totalQuantity, totalValue), [
    tuples.map(lot => ({ ...lot })),
  ])

  if (time) {
    console.time('findAllMatchingSubsetsBottomUp:mainLoop')
  }
  for (let i = 0; i < tuples.length; i++) {
    checkTimeout() // Check timeout at start of each iteration
    
    const { quantity: _, price: val } = tuples[i]
    dp[i + 1] = new Map()

    // Copy over all states from previous stage first
    for (const [stateKey, combinations] of dp[i].entries()) {
      dp[i + 1].set(stateKey, [...combinations])
    }

    for (const [stateKey, combinations] of dp[i].entries()) {
      const [currQtyStr, currValStr] = stateKey.split('-')
      const currQty = new Decimal(currQtyStr)
      const currVal = new Decimal(currValStr)

      // Consider reducing each lot's quantity from its current value
      for (const combination of combinations) {
        const currentLot = combination[i] // The lot we're modifying in this pass
        const currentQuantity = currentLot.quantity

        // Try each possible reduction of quantity for this lot
        for (
          let reducedQty = new Decimal(1);
          reducedQty.lte(currentQuantity);
          reducedQty = reducedQty.plus(1)
        ) {
          checkTimeout() // Check timeout in inner loop
          const newQty = currQty.minus(reducedQty)
          const newVal = currVal.minus(reducedQty.mul(val))

          // Skip if the remaining quantity is less than target
          if (newQty.lt(targetQuantity) || newVal.lt(targetValue))
            continue

          // Create a new combination with the reduced quantity
          const newCombination = combination.map((lot, index) => {
            if (index === i) {
              return {
                ...lot,
                quantity: lot.quantity.minus(reducedQty),
              }
            }
            return { ...lot }
          })

          const newKey = key(newQty, newVal)

          if (!dp[i + 1].has(newKey)) {
            dp[i + 1].set(newKey, [])
          }

          const existingCombinations = dp[i + 1].get(newKey) ?? []
          if (existingCombinations.length < maxResults) {
            const spaceLeft = maxResults - existingCombinations.length
            dp[i + 1].set(newKey, [
              ...existingCombinations,
              ...[newCombination].slice(0, spaceLeft),
            ])
          }
        }
      }
    }
  }
  if (time) {
    console.timeEnd('findAllMatchingSubsetsBottomUp:mainLoop')
  }

  // Instead of looking for an exact match, collect all results within epsilon range
  if (time) {
    console.time('findAllMatchingSubsetsBottomUp:epsilonMatching')
  }
  let result: LotData[][] = []

  // Check all states in the final dp table
  for (const [stateKey, combinations] of dp[tuples.length].entries()) {
    const [qtyStr, valStr] = stateKey.split('-')
    const qty = new Decimal(qtyStr)
    const val = new Decimal(valStr)

    // Check if this state is within acceptable epsilon range of target
    const qtyDifference = targetQuantity.minus(qty).abs()
    const valDifference = targetValue.minus(val).abs()

    if (qtyDifference.lte(epsilonQty) && valDifference.lte(epsilonValue)) {
      // Add these combinations to our results, up to maxResults
      const spaceLeft = maxResults - result.length
      if (spaceLeft <= 0)
        break

      result = [...result, ...combinations.slice(0, spaceLeft)]

      if (result.length >= maxResults)
        break
    }
  }
  if (time) {
    console.timeEnd('findAllMatchingSubsetsBottomUp:epsilonMatching')
  }

  if (time) {
    console.timeEnd('findAllMatchingSubsetsBottomUp:total')
  }
  return result
}
