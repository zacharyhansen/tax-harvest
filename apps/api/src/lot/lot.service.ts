import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Decimal } from 'decimal.js'

import { SelectExpression } from 'kysely'

import { taxAdvantadedSubTypes } from '~/plaid/plaid.utils'
import { Database } from '../database/database'
import { DB } from '../database/db.d'
import { PrismaService } from '../prisma/prisma.service'
import { LotCurrent, LotValueType } from './lot.dto'

@Injectable()
export class LotService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly db: Database,
  ) {}

  upsertLotsForAccount({
    lotSeededDate,
    accountId,
    lots,
    replace,
    portfolioId,
  }: {
    accountId: string
    lots: Prisma.LotCreateManyInput[]
    replace: boolean
    lotSeededDate?: Date
    portfolioId: string
  }) {
    return this.prismaService.$extends(this.prismaService.forPortfolio(portfolioId)).$transaction(async (trx) => {
      await trx.account.update({
        data: {
          uploadedPositions: true,
          lotSeededDate,
        },
        where: {
          id: accountId,
        },
      })

      const assets = new Set(lots.map(lot => lot.assetSymbol))
      await Promise.all(
        [...assets].map((asset) => {
          return trx.asset.upsert({
            create: {
              symbol: asset,
            },
            update: {
              symbol: asset,
            },
            where: {
              symbol: asset,
            },
          })
        }),
      )

      if (replace) {
        await trx.lot.deleteMany({
          where: {
            accountId,
          },
        })
      }

      return trx.lot.createMany({
        data: lots.map(lot => ({
          ...lot,
          accountId,
        })),
      })
    })
  }

  lotCurrent({
    lotIds,
    lotValueType,
    portfolioId,
    /**
     * The minimum total P&L for the lot as an absolute value - should be used in conjuction with lotValueType
     */
    minTotalPAndL,
  }: {
    portfolioId: string
    lotIds?: string[]
    lotValueType?: LotValueType
    minTotalPAndL?: Decimal
  }): Promise<LotCurrent[]> {
    let query = this.db
      .selectFrom('LotCurrent')
      .innerJoin('Account', 'Account.id', 'LotCurrent.accountId')
      .select(LotService.lotCurrentFields)
      .where('Account.portfolioId', '=', portfolioId)
      // remove tax advantaged accounts
      .where('Account.subType', 'not in', [...taxAdvantadedSubTypes])
      // Filter out fractional shares
      .where('LotCurrent.remainingQty', '>=', '1')
    // Order is important  here - biggest winners at top, biggest losers at bottom by per share $

    if (lotIds) {
      query = query.where('LotCurrent.id', 'in', lotIds)
    }

    if (lotValueType === LotValueType.GAIN) {
      query = query.where('LotCurrent.gainTotal', '>', '0')
      if (minTotalPAndL) {
        query = query.where(
          'LotCurrent.gainTotal',
          '>=',
          minTotalPAndL.abs().toString(),
        )
      }
    }
    else if (lotValueType === LotValueType.LOSS) {
      query = query.where('LotCurrent.gainTotal', '<', '0')
      if (minTotalPAndL) {
        query = query.where(
          'LotCurrent.gainTotal',
          '<=',
          minTotalPAndL.abs().neg().toString(),
        )
      }
    }

    return query.orderBy('dollarPerSharePnL', 'desc').execute() as Promise<
      LotCurrent[]
    >
  }

  private static lotCurrentFields: SelectExpression<
    DB,
    'LotCurrent' | 'Account'
  >[] = [
      'accountId',
      'acquiredDate',
      'costBasis',
      'gainTotal',
      'gainTotalPct',
      'LotCurrent.id',
      'lastPrice',
      'price',
      'remainingQty',
      'symbol',
      'value',
      'dollarPerSharePnL',
      'taxGain',
    ]
}
