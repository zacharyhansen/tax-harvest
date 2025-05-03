import type { Prisma } from '@prisma/client'
import type { HarvestLotOrder } from './portfolio.dto'
import { OrderType } from '@prisma/client'

import Decimal from 'decimal.js'
import { LotValueType } from '../lot/lot.dto'
import { TaxGain } from './portfolio.dto'

interface PortfolioHarvestInput {
  id: string
  harvestShareDollarThreshold: Prisma.Decimal
  harvestTickerBucketDollarSizeLong: Prisma.Decimal
  harvestTickerBucketLowerLimitLong: Prisma.Decimal
  harvestTickerBucketDollarSizeShort: Prisma.Decimal
  harvestTickerBucketLowerLimitShort: Prisma.Decimal
}

export interface LotHarvestInput {
  accountId: string
  costBasis: string
  gainTotal: string
  id: string
  lastPrice: string
  price: string
  remainingQty: string
  // Copied from the starting remainingQty
  originalQty: string
  // Copied from the starting remainingQty but reset after every harvest process (i.e. realized runs then unrealized)
  processQty: string
  symbol: string
  value: string
  dollarPerSharePnL: string
  acquiredDate: Date
  taxGain: TaxGain
}

type TickerMap = Map<
  string,
  {
    LONG: Decimal
    SHORT: Decimal
    LONG_LOTS: LotHarvestInput[]
    SHORT_LOTS: LotHarvestInput[]
  }
>

type TickerLotsByValue = Record<
  LotValueType,
  Record<
    TaxGain,
    {
      lots: Record<string, LotHarvestInput[]>
      buckets: string[]
    }
  >
>

/**
 * Generates lot transactions to capture realized and unrelaized harvest targets.
 *
 * @param targetRealized The amount or gain or loss we should produce for capture realized gains. i.e. if the portfolio is up $1K the targetRealized should be -1000
 * @param targetUnrealized The amount or gain or loss we should produce for capture realized gains. i.e. if the portfolio is up $1K the targetRealized should be -1000
 */
export default class Harvest {
  portfolio: PortfolioHarvestInput
  lots: LotHarvestInput[]
  allLots: LotHarvestInput[]
  targetRealized: Decimal
  targetUnrealized: Decimal
  gainPerTicker: TickerMap = new Map()
  lossPerTicker: TickerMap = new Map()
  assetLotsByValue: TickerLotsByValue = {
    GAIN: {
      LONG: {
        buckets: [],
        lots: {},
      },
      SHORT: {
        buckets: [],
        lots: {},
      },
    },
    LOSS: {
      LONG: {
        buckets: [],
        lots: {},
      },
      SHORT: {
        buckets: [],
        lots: {},
      },
    },
  }

  realizedOrders: HarvestLotOrder[] = []
  unrealizedOrders: HarvestLotOrder[] = []
  allOrders: HarvestLotOrder[] = []

  constructor({
    lots,
    portfolio,
    targetRealized,
    targetUnrealized,
  }: {
    lots: LotHarvestInput[]
    targetRealized: number
    targetUnrealized: number
    portfolio: PortfolioHarvestInput
  }) {
    this.portfolio = portfolio
    this.targetRealized = new Decimal(targetRealized)
    this.targetUnrealized = new Decimal(targetUnrealized)
    this.allLots = structuredClone(lots)

    // Filter out lots that are too small to matter
    this.lots = this.allLots.filter((lot) => {
      return new Decimal(lot.dollarPerSharePnL || '0')
        .absoluteValue()
        .greaterThanOrEqualTo(
          new Decimal(portfolio.harvestShareDollarThreshold),
        )
    })

    // Get the gain and loss totals per asset
    // Its important to understand that losses and gains may be hidden within a single asset so we track them separately
    // i.e loss 15k on AAPL but up 45k for net 30K but the 15k loss can still be used to harvest
    for (const lot of this.lots) {
      const valueType: LotValueType = new Decimal(
        lot.gainTotal || 0,
      ).greaterThanOrEqualTo(0)
        ? LotValueType.GAIN
        : LotValueType.LOSS

      const currentLots: LotHarvestInput[]
        = this.assetLotsByValue[valueType][lot.taxGain].lots[lot.symbol] || []
      this.assetLotsByValue[valueType][lot.taxGain].lots[lot.symbol] = [
        ...currentLots,
        lot,
      ]
    }

    // Set up all the bucket ordering for us to iterate through
    this.setupBuckets()
  }

  setupBuckets() {
    this.assetLotsByValue.GAIN[TaxGain.SHORT].buckets = this.createBucketOrder({
      assetMap: this.assetLotsByValue.GAIN[TaxGain.SHORT].lots,
      lowerLimit: new Decimal(
        this.portfolio.harvestTickerBucketLowerLimitShort,
      ),
    })
    this.assetLotsByValue.GAIN.LONG.buckets = this.createBucketOrder({
      assetMap: this.assetLotsByValue.GAIN[TaxGain.LONG].lots,
      lowerLimit: new Decimal(this.portfolio.harvestTickerBucketLowerLimitLong),
    })
    this.assetLotsByValue.LOSS[TaxGain.SHORT].buckets = this.createBucketOrder({
      assetMap: this.assetLotsByValue.LOSS[TaxGain.SHORT].lots,
      lowerLimit: new Decimal(
        this.portfolio.harvestTickerBucketLowerLimitShort,
      ),
    })
    this.assetLotsByValue.LOSS[TaxGain.LONG].buckets = this.createBucketOrder({
      assetMap: this.assetLotsByValue.LOSS[TaxGain.LONG].lots,
      lowerLimit: new Decimal(this.portfolio.harvestTickerBucketLowerLimitLong),
    })
  }

  createBucketOrder({
    assetMap,
    lowerLimit,
  }: {
    lowerLimit: Prisma.Decimal
    assetMap: TickerLotsByValue[LotValueType][TaxGain]['lots']
  }) {
    const result: string[] = []
    const assetAndTotal = Object.entries(assetMap).reduce(
      (acc: [string, Decimal][], curr) => {
        const [asset, lots] = curr
        const total = lots.reduce(
          (acc, lot) => new Decimal(lot.gainTotal || 0).add(acc),
          new Decimal(0),
        )
        acc.push([asset, total])
        return acc
      },
      [],
    )
    for (const [asset, value] of assetAndTotal.sort(
      (a, b) =>
        b[1].absoluteValue().toNumber() - a[1].absoluteValue().toNumber(),
    )) {
      if (
        value.absoluteValue().greaterThanOrEqualTo(lowerLimit.absoluteValue())
      ) {
        result.push(asset)
      }
    }
    return result
  }

  processTarget({ target, taxGain }: { taxGain: TaxGain, target: Decimal }): {
    remainingTarget: Decimal
    resultOrders: LotHarvestInput[]
  } {
    let remainingTarget = new Decimal(target).absoluteValue()
    /**
     * Do we want to use GAIN or LOSS lots to reach the target
     */
    const lotValueType: LotValueType = new Decimal(target).greaterThanOrEqualTo(
      0,
    )
      ? LotValueType.GAIN
      : LotValueType.LOSS
    /**
     * The assets that represent the bucket order to try and follow (biggest PnL tickets show first)
     */
    const bucketOrder = this.assetLotsByValue[lotValueType][taxGain].buckets
    /**
     * The running list of whether a ticket is exhausted for the context (we should only continue looping through buckets if at least 1 is not exhausted)
     */
    const isBucketExhausted: boolean[] = Array.from({
      length: bucketOrder.length,
    }).fill(false) as boolean[]
    const lotMap = this.assetLotsByValue[lotValueType][taxGain].lots

    // Try to fill with short term lots first according to bucket order and bucket size
    let bucketIndex = 0

    while (isBucketExhausted.includes(false)) {
      // make sure we move to a bucket that is not exhausted
      while (isBucketExhausted[bucketIndex]) {
        bucketIndex = (bucketIndex + 1) % bucketOrder.length
      }

      let remainingBucketValue = new Decimal(
        this.portfolio.harvestTickerBucketDollarSizeShort,
      ).absoluteValue()

      // The possible lots we can use for the asset
      const lots
        = lotMap[bucketOrder[bucketIndex]].filter(lot =>
          new Decimal(lot.remainingQty).greaterThanOrEqualTo(1),
        ) || []

      if (lots.length === 0) {
        isBucketExhausted[bucketIndex] = true
        continue
      }

      // Loops over lots (this should be in desc ordering from the sql query)
      for (let i = 0; i < lots.length; i++) {
        const lot = lots[i]
        const lotAmountPerShare = new Decimal(
          lot.dollarPerSharePnL,
        ).absoluteValue()
        // Try to use of each qty of lot to paydown the target while honoring bucket size
        // We only use qty size of 1 (no fractional)
        while (
          remainingBucketValue.greaterThan(lot.dollarPerSharePnL) // While the per share change is within the remaining bucket size
          && new Decimal(lot.remainingQty).greaterThanOrEqualTo(1) // and we actually have shares left to use in the lot
          && remainingTarget
            .absoluteValue()
            .greaterThanOrEqualTo(lotAmountPerShare) // and were are within the target still
        ) {
          remainingBucketValue = remainingBucketValue.minus(lotAmountPerShare)
          remainingTarget = remainingTarget.minus(lotAmountPerShare)
          lot.remainingQty = new Decimal(lot.remainingQty).minus(1).toString()
        }

        // If we at the end of lots and the target is smaller than the lot dollarPerSharePnL
        // or we have none left then this bucket is exhausted
        if (
          i === lots.length - 1
          && (new Decimal(lot.remainingQty).lessThan(1)
            || remainingTarget
              .absoluteValue()
              .lessThan(new Decimal(lot.dollarPerSharePnL).absoluteValue()))
        ) {
          isBucketExhausted[bucketIndex] = true
        }
      }

      // After working though all lots for a given asset bucket lets move to the next bucket
      bucketIndex = (bucketIndex + 1) % bucketOrder.length
    }

    const resultOrders = Object.values(lotMap).reduce(
      (acc: LotHarvestInput[], curr) => {
        const resultLots = curr.filter(
          lot => lot.processQty !== lot.remainingQty,
        )
        return acc.concat(resultLots)
      },
      [],
    )

    return {
      remainingTarget: remainingTarget.times(Math.sign(target.toNumber())),
      resultOrders,
    }
  }

  convertLotChangeToOrderAndResetProcessQty({
    lots,
  }: {
    lots: LotHarvestInput[]
  }): HarvestLotOrder[] {
    return lots
      .map((lot) => {
        // Get change
        const quantity = new Decimal(lot.processQty).minus(lot.remainingQty)

        // construct order
        const result = {
          accountId: lot.accountId,
          acquiredDate: lot.acquiredDate,
          assetSymbol: lot.symbol,
          costBasis: quantity.times(lot.price).toString(),
          dollarPerSharePnL: lot.dollarPerSharePnL,
          gainTotal: quantity
            .times(lot.lastPrice)
            .minus(quantity.times(lot.price))
            .toString(),
          id: crypto.randomUUID(),
          lastPrice: lot.lastPrice,
          lotId: lot.id,
          orderType: OrderType.SELL_TO_CLOSE,
          pricePaid: lot.price,
          quantity: quantity.toString(),
          taxGain: lot.taxGain,
          valueTotal: quantity.times(lot.lastPrice).toString(),
        }

        // reset the processQty for the next process so new orders calculate correctly
        lot.processQty = lot.remainingQty
        return result
      })
      .filter(lot => Number(lot.quantity) !== 0)
  }

  process() {
    const {
      remainingTarget: remainingTargetShort,
      resultOrders: resultOrdersRealizedShort,
    } = this.processTarget({
      target: this.targetRealized,
      taxGain: TaxGain.SHORT,
    })
    this.targetRealized = remainingTargetShort
    this.realizedOrders.push(
      ...this.convertLotChangeToOrderAndResetProcessQty({
        lots: resultOrdersRealizedShort,
      }),
    )

    const {
      remainingTarget: remainingTargetLong,
      resultOrders: resultOrdersRealizedLong,
    } = this.processTarget({
      target: this.targetRealized,
      taxGain: TaxGain.LONG,
    })
    this.targetRealized = remainingTargetLong
    this.realizedOrders.push(
      ...this.convertLotChangeToOrderAndResetProcessQty({
        lots: resultOrdersRealizedLong,
      }),
    )

    const {
      remainingTarget: remainingTargetShortUnrealized,
      resultOrders: resultOrdersUnrealizedShort,
    } = this.processTarget({
      target: this.targetUnrealized,
      taxGain: TaxGain.SHORT,
    })
    this.targetUnrealized = remainingTargetShortUnrealized
    this.unrealizedOrders.push(
      ...this.convertLotChangeToOrderAndResetProcessQty({
        lots: resultOrdersUnrealizedShort,
      }),
    )

    const {
      remainingTarget: remainingTargetLongUnrealized,
      resultOrders: resultOrdersUnrealizedLong,
    } = this.processTarget({
      target: this.targetUnrealized,
      taxGain: TaxGain.LONG,
    })
    this.targetUnrealized = remainingTargetLongUnrealized
    this.unrealizedOrders.push(
      ...this.convertLotChangeToOrderAndResetProcessQty({
        lots: resultOrdersUnrealizedLong,
      }),
    )

    this.allOrders = this.convertLotChangeToOrderAndResetProcessQty({
      lots: this.lots.map(lot => ({ ...lot, processQty: lot.originalQty })),
    })
  }
}
