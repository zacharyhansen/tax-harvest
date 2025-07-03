import { Injectable } from '@nestjs/common'
import {
  Harvest,
  HarvestStep,
  HarvestType,
  OrderType,
  Prisma,
} from '@prisma/client'
import Decimal from 'decimal.js'

import { LotService } from '../lot/lot.service'
import { DirectedHarvestLot } from '../portfolio/portfolio.dto'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class HarvestService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly lotService: LotService,
  ) { }

  async createHarvest({
    createdById,
    date,
    harvestLots,
    harvestType,
    portfolioId,
    select,
  }: {
    harvestLots: DirectedHarvestLot[]
    select: Prisma.HarvestSelect
    harvestType: HarvestType
    createdById: string
    portfolioId: string
    date?: Date
  }): Promise<Harvest> {
    const harvestlotMap = new Map(harvestLots.map(lot => [lot.lotId, lot]))

    const currentLotsWithReplacement = await this.lotService
      .lotCurrent({
        lotIds: harvestLots.map(lot => lot.lotId),
        portfolioId,
      })
      .then(async (resultLots) => {
        // generate the replacement transaction and add the selected quanty to our result records
        return Promise.all(
          resultLots.map(async (lot) => {
            const originalLot = harvestlotMap.get(lot.id)
            if (!originalLot) {
              throw new Error(`Original lot not found for ${lot.id}`)
            }
            const replacementAsset
              = await this.prismaService.asset.findUniqueOrThrow({
                where: {
                  symbol: 'AAPL',
                },
              })

            const saleValue = new Decimal(lot.lastPrice ?? 0).times(
              originalLot.quantity,
            )

            const replacementHarvestTransactionItem: Omit<Prisma.HarvestTransactionItemCreateManyInput, 'harvestId'>
              = {
              assetSymbol: 'AAPL',
              orderType: OrderType.BUY,
              price: replacementAsset.lastPrice,
              quantity:
                saleValue
                  .div(replacementAsset.lastPrice)
                  .floor()
                  .toNumber() || 0,
              portfolioId,
              lotAcquiredDate: lot.acquiredDate,
              lotPricePaid: lot.price,
              lotPriceAtHarvest: lot.lastPrice,
            }

            return {
              ...lot,
              counterTransaction: originalLot.counterTransaction,
              replacementHarvestTransactionItem,
              selectedQuantity: originalLot.quantity,
            }
          }),
        )
      })

    return this.prismaService.$extends(PrismaService.forPortfolio(portfolioId)).$transaction(async (tx) => {
      // Create entry transaction items (sales based on selection)

      const dateOfHarvest = new Date()

      const harvest = await tx.harvest.create({
        data: {
          amount: currentLotsWithReplacement
            .reduce((acc, curr) => {
              return acc.add(
                new Decimal(curr.dollarPerSharePnL ?? 0).times(
                  curr.selectedQuantity,
                ),
              )
            }, new Decimal(0))
            .absoluteValue()
            .toString(),
          createdById,
          date,
          portfolioId,
          type: harvestType,
          afterWashRevertDate: this.getPostWashSaleDate(new Date()),
          label: `${new Date().toLocaleDateString('en-US')} ${currentLotsWithReplacement.map(item => `${item.selectedQuantity} x ${item.symbol}`).join(', ')} for ${currentLotsWithReplacement.map(item => `${item.replacementHarvestTransactionItem.quantity} x ${item.replacementHarvestTransactionItem.assetSymbol}`).join(', ')}`,
        },
      })

      /**
       * The entry transcations that start the harvest
       */
      const entryTransactionItems
        = await tx.harvestTransactionItem.createManyAndReturn({
          data: currentLotsWithReplacement.map((currentLot) => {
            return {
              assetSymbol: currentLot.symbol ?? '',
              lotId: currentLot.id,
              orderType: OrderType.SELL,
              price: currentLot.lastPrice ?? 0,
              quantity: currentLot.selectedQuantity,
              portfolioId,
              lotAcquiredDate: currentLot.acquiredDate,
              lotPricePaid: currentLot.price,
              lotPriceAtHarvest: currentLot.lastPrice,
              date: dateOfHarvest,
              harvestId: harvest.id,
            }
          }),
        })

      /**
       * The transactions that will replace the entry ones during thew wash window
       */
      const replacementTransactionItems
        = harvestType === HarvestType.SELL
          ? []
          : await tx.harvestTransactionItem.createManyAndReturn({
            data: currentLotsWithReplacement.map((currentLot) => {
              return {
                ...currentLot.replacementHarvestTransactionItem,
                harvestId: harvest.id,
              }
            }),
          })

      // Create/select the top level harvest with our transaction items attached
      return tx.harvest.update({
        where: {
          id: harvest.id,
        },
        data: {
          harvestTransactions: {
            createMany: {
              data: entryTransactionItems.map((entryTransactionItem, i) => {
                return {
                  counterTransaction:
                    currentLotsWithReplacement[i].counterTransaction,
                  harvestTransactionItemId: entryTransactionItem.id,
                  replacementTransactionItemId:
                    replacementTransactionItems[i]?.id,
                  revert: replacementTransactionItems.length > 0,
                  portfolioId,
                }
              }),
            },
          },
        },
        select,
      })
    })
  }

  private getPostWashSaleDate(startDate: Date, daysToAdd = 32) {
    const date = new Date(startDate) // Start from the current date
    date.setDate(date.getDate() + daysToAdd) // Add 32 days

    // If the resulting date is Saturday (6), add 2 days to move to Monday
    // If it's Sunday (0), add 1 day to move to Monday
    if (date.getDay() === 6) {
      // Saturday
      date.setDate(date.getDate() + 2)
    }
    else if (date.getDay() === 0) {
      // Sunday
      date.setDate(date.getDate() + 1)
    }

    return date
  }

  /**
   * Calculates 2 stock trading days (effectively 16 hours of active trading time) from the given date.
   * Skips weekends (Saturday, Sunday) and US market holidays.
   * 
   * @param fromDate - The starting date
   * @returns The date that represents 2 trading days after the given date
   */
  calculateTwoTradingDaysFrom(fromDate: Date): Date {
    // US Market holidays for 2024-2026 (covers most use cases)
    const marketHolidays = new Set([
      // 2024 holidays
      '2024-01-01', // New Year's Day
      '2024-01-15', // Martin Luther King Jr. Day
      '2024-02-19', // Presidents' Day
      '2024-03-29', // Good Friday
      '2024-05-27', // Memorial Day
      '2024-06-19', // Juneteenth
      '2024-07-04', // Independence Day
      '2024-09-02', // Labor Day
      '2024-11-28', // Thanksgiving Day
      '2024-12-25', // Christmas Day

      // 2025 holidays
      '2025-01-01', // New Year's Day
      '2025-01-20', // Martin Luther King Jr. Day
      '2025-02-17', // Presidents' Day
      '2025-04-18', // Good Friday
      '2025-05-26', // Memorial Day
      '2025-06-19', // Juneteenth
      '2025-07-04', // Independence Day
      '2025-09-01', // Labor Day
      '2025-11-27', // Thanksgiving Day
      '2025-12-25', // Christmas Day

      // 2026 holidays (common dates, may need updating based on actual calendar)
      '2026-01-01', // New Year's Day
      '2026-01-19', // Martin Luther King Jr. Day (3rd Monday in January)
      '2026-02-16', // Presidents' Day (3rd Monday in February)
      '2026-04-03', // Good Friday (varies based on Easter)
      '2026-05-25', // Memorial Day (last Monday in May)
      '2026-06-19', // Juneteenth
      '2026-07-04', // Independence Day (observed on 7/3 if falls on Saturday)
      '2026-09-07', // Labor Day (1st Monday in September)
      '2026-11-26', // Thanksgiving Day (4th Thursday in November)
      '2026-12-25', // Christmas Day
    ])

    const isMarketHoliday = (date: Date): boolean => {
      const dateString = date.toISOString().split('T')[0]
      return marketHolidays.has(dateString)
    }

    const isWeekend = (date: Date): boolean => {
      const dayOfWeek = date.getDay()
      return dayOfWeek === 0 || dayOfWeek === 6 // Sunday or Saturday
    }

    const isTradingDay = (date: Date): boolean => {
      return !isWeekend(date) && !isMarketHoliday(date)
    }

    let currentDate = new Date(fromDate)
    let tradingDaysCount = 0

    // Move to the next day to start counting from the day after the input date
    currentDate.setDate(currentDate.getDate() + 1)

    // Keep adding days until we've found 2 trading days
    while (tradingDaysCount < 2) {
      if (isTradingDay(currentDate)) {
        tradingDaysCount++
      }

      // If we haven't reached 2 trading days yet, move to the next day
      if (tradingDaysCount < 2) {
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }

    return currentDate
  }

  async finalizeHarvest({
    harvestId,
    select,
    portfolioId,
  }: {
    harvestId: string
    select: Prisma.HarvestSelect
    portfolioId: string
  }) {
    const transactions = await this.prismaService.$extends(PrismaService.forPortfolio(portfolioId)).harvestTransaction.findMany({
      include: {
        harvestTransactionItem: true,
        replacementTransactionItem: true,
      },
      where: {
        harvestId,
      },
    })

    const revertTransactionItems: Prisma.HarvestTransactionItemCreateManyInput[]
      = []

    // Tracks which revertTransactionItem index is the one we want to save to either theharvest or replacment revert transactionItem
    const indexMap: Record<string, { harvest?: number, replacement?: number }>
      = {}

    // Build/Collect the opposite transactions required
    for (const transaction of transactions) {
      if (transaction.revert) {
        indexMap[transaction.id] = { harvest: revertTransactionItems.length }
        revertTransactionItems.push({
          assetSymbol: transaction.harvestTransactionItem.assetSymbol,
          orderType: OrderType.BUY,
          price: transaction.harvestTransactionItem.price,
          quantity: transaction.harvestTransactionItem.quantity,
          portfolioId,
          lotAcquiredDate: transaction.harvestTransactionItem.lotAcquiredDate,
          lotPricePaid: transaction.harvestTransactionItem.lotPricePaid,
          lotPriceAtHarvest: transaction.harvestTransactionItem.lotPriceAtHarvest,
          harvestId,
        })
        if (transaction.replacementTransactionItem) {
          indexMap[transaction.id].replacement = revertTransactionItems.length
          revertTransactionItems.push({
            assetSymbol: transaction.replacementTransactionItem.assetSymbol,
            orderType: OrderType.SELL,
            price: transaction.replacementTransactionItem.price,
            quantity: transaction.replacementTransactionItem.quantity,
            portfolioId,
            lotAcquiredDate: transaction.replacementTransactionItem.lotAcquiredDate,
            lotPricePaid: transaction.replacementTransactionItem.lotPricePaid,
            lotPriceAtHarvest: transaction.replacementTransactionItem.lotPriceAtHarvest,
            harvestId,
          })
        }
      }
    }

    // Insert them
    return this.prismaService.$extends(PrismaService.forPortfolio(portfolioId)).$transaction(async (tx) => {
      const createdItems = await tx.harvestTransactionItem.createManyAndReturn({
        data: revertTransactionItems,
      })

      await Promise.all(
        Object.keys(indexMap).map((transactionId) => {
          return tx.harvestTransaction.update({
            data: {
              revertHarvestTransactionItemId:
                indexMap[transactionId].harvest === undefined
                  ? undefined
                  : createdItems[indexMap[transactionId].harvest ?? -1].id,
              revertReplacementTransactionItemId:
                indexMap[transactionId].replacement === undefined
                  ? undefined
                  : createdItems[indexMap[transactionId].replacement ?? -1].id,
            },
            where: {
              id: transactionId,
            },
          })
        }),
      )
      return tx.harvest.update({
        data: {
          step: {
            set: HarvestStep.REVIEW,
          },
        },
        select,
        where: {
          id: harvestId,
        },
      })
    })
  }
}
