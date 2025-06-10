import type { ClerkClaims } from '~/auth/types'

import { writeFileSync } from 'node:fs'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Portfolio, PortfolioRole, Prisma } from '@prisma/client'

import Decimal from 'decimal.js'

import { sql } from 'kysely'
import { LotCurrent, LotValueType } from '~/lot/lot.dto'
import { taxAdvantadedSubTypes } from '~/plaid/plaid.utils'
import { AccountService } from '../account/account.service'
import { ClerkService } from '../clerk/clerk.service'
import { Database } from '../database/database'
import { HarvestType } from '../generated/graphql'
import { HarvestService } from '../harvest/harvest.service'
import { LotService } from '../lot/lot.service'
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from '../user/user.service'
import {
  DirectedHarvestLot,
  FiniteHarvestResult,
  HarvestLotOrder,
  HarvestResult,
  PortfolioSummary,
  PortfolioSummaryRealized,
  PortfolioSummaryUnrealized,
  SetUpStatus,
} from './portfolio.dto'
import Harvest, { LotHarvestInput } from './portfolio.harvest'

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name)

  constructor(
    private readonly db: Database,
    private readonly prismaService: PrismaService,
    private readonly clerkService: ClerkService,
    private readonly userService: UserService,
    private readonly lotService: LotService,
    private readonly harvestService: HarvestService,
    private readonly accountService: AccountService,
    private readonly configService: ConfigService,
  ) {}

  getPortfoliosByUserId(userId: string, args: Prisma.PortfolioFindManyArgs) {
    return this.prismaService.$extends(PrismaService.bypassRLS()).portfolio.findMany({
      ...args,
      select: undefined, // dont allow nested seelct due to RLS bypass
      where: {
        usersOnPortfolios: {
          some: {
            userId,
          },
        },
      },
    })
  }

  async switchPortfolio(clerkContext: ClerkClaims, portfolioId: string) {
    const portfolio = await this.getPortfolioById(portfolioId)

    await this.clerkService.updatePublicMetaData(clerkContext.sub, {
      ...clerkContext.metadata,
      portfolioId: portfolio.id,
    })

    return portfolio
  }

  /**
   * Special portfolio query that will create or reset a users portfolio
   * in clerk if they do not have a default portfolio
   * i.e. a user logs in for the first time or their default protfolio has been deleted
   */
  async getPortfolioAndAssertUserExistsAndHasPortfolio(
    userId: string,
    portfolioId?: string,
  ) {
    const user = await this.userService.asserUserExists(userId)
    return this.prismaService.$extends(PrismaService.bypassRLS()).portfolio.findUniqueOrThrow({
      where: {
        id: portfolioId,
        usersOnPortfolios: {
          some: {
            userId: user.id,
          },
        },
      },
    })

    // .catch(() => this.assertUserHasDefaultPortfolio(user.id, portfolioId))
  }

  getPortfolioByPortfolioId(
    userId: string,
    portfolioId: string,
    select: Prisma.PortfolioSelect,
  ) {
    return this.prismaService.$extends(PrismaService.forPortfolio(portfolioId)).portfolio.findFirstOrThrow({
      select,
      where: {
        id: portfolioId,
        // Enforce user has access to the portfolio
        usersOnPortfolios: {
          some: {
            userId,
          },
        },
      },
    })
  }

  getPortfolioById(portfolioId: string) {
    return this.db
      .selectFrom('Portfolio')
      .selectAll()
      .where('Portfolio.id', '=', portfolioId)
      .executeTakeFirstOrThrow()
  }

  getPortfolioByIdWithUserId(
    id: string,
    userId: string,
    select: Prisma.PortfolioSelect,
  ) {
    return this.prismaService.$extends(PrismaService.forPortfolio(id)).portfolio.findUniqueOrThrow({
      select,
      where: {
        id,
        usersOnPortfolios: {
          some: {
            userId,
          },
        },
      },
    })
  }

  async createPortfolio(
    clerkContext: ClerkClaims,
    portfolioCreateInput: Prisma.PortfolioCreateInput,
    role?: PortfolioRole,
  ) {
    const portfolio = await this.prismaService.$extends(PrismaService.bypassRLS()).portfolio.create({
      data: {
        ...portfolioCreateInput,
        usersOnPortfolios: {
          create: {
            role,
            userId: clerkContext.sub,
          },
        },
      },
    })

    await this.clerkService.updatePublicMetaData(clerkContext.sub, {
      ...clerkContext.metadata,
      portfolioId: portfolio.id,
    })

    return portfolio
  }

  /**
   * Ensures that a clerk user exists in the DB and has at least one portfolio
   * Creates the portfolio if needed
   * @param userId
   * @param portfolioId
   * @returns Portfolio
   */
  async assertUserHasDefaultPortfolio(
    userId: string,
    portfolioId?: string,
  ): Promise<Portfolio> {
    const portfolio = await this.prismaService.$extends(PrismaService.bypassRLS()).portfolio.findFirst({
      where: {
        usersOnPortfolios: {
          some: {
            portfolioId: {
              equals: portfolioId,
            },
            userId: {
              equals: userId,
            },
          },
        },
      },
    })

    let authedPortfolio = portfolio
    // If the user does not have at least 1 portfolio we create it and connect them to it as an admin
    if (!portfolio) {
      authedPortfolio = await this.prismaService.$extends(PrismaService.bypassRLS()).portfolio.create({
        data: {
          createdById: userId,
          id: portfolioId,
          usersOnPortfolios: {
            create: {
              role: 'ADMIN',
              userId,
            },
          },
        },
      }).catch(() => {
        throw new Error('Unauthorized access to portfolio')
      })
    }

    if (!authedPortfolio) {
      throw new Error('Unauthorized access to portfolio')
    }

    const clerkUser = await this.clerkService.user(userId)
    // Set the portfolio on the clerk meta data so they are authed for it
    await this.clerkService.updatePublicMetaData(userId, {
      ...clerkUser.publicMetadata,
      portfolioId: authedPortfolio.id,
    })

    return authedPortfolio
  }

  async summary({ id }: { id: string }): Promise<PortfolioSummary> {
    const [realized, unrealized, accounts, setupAccounts] = await Promise.all([
      this.summaryRealized({ id }),
      this.summaryUnrealized({ id }),
      this.prismaService.$extends(PrismaService.forPortfolio(id)).account.count({
        where: {
          ...PortfolioService.RELEVANT_HARVEST_ACCOUNTS_WHERE({
            portfolioId: id,
          }),
        },
      }),
      this.accountService.setupAccounts({
        id,
        select: {
          id: true,
        },
      }),
    ])

    return {
      ...PortfolioService.calculateHarvest({
        realized,
        unrealized,
      }),
      setUpStatus:
        accounts === 0
          ? SetUpStatus.NO_ACCOUNTS
          : setupAccounts.length > 0
            ? SetUpStatus.ACCOUNT_SETUP_REQUIRED
            : SetUpStatus.COMPLETE,
    }
  }

  static calculateHarvest({
    realized,
    unrealized,
  }: {
    realized: PortfolioSummaryRealized
    unrealized: PortfolioSummaryUnrealized
  }): Omit<PortfolioSummary, 'setUpStatus'> {
    let gainTotalUnrealized = new Decimal(unrealized.gainTotal)
    let lossTotalUnrealized = new Decimal(unrealized.lossTotal)
    const gainTotalRealized = new Decimal(realized.gainTotal)

    const realizedSign = Math.sign(gainTotalRealized.toNumber())

    const harvest = {
      realized: new Decimal(0),
      total: new Decimal(0),
      unrealized: new Decimal(0),
    }

    // Figure out the realized amount and reset unrealized for that amount
    if (realizedSign === -1) {
      if (
        gainTotalRealized.absoluteValue().toNumber()
        > gainTotalUnrealized.absoluteValue().toNumber()
      ) {
        harvest.realized = gainTotalUnrealized
        gainTotalUnrealized = new Decimal(0)
      }
      else {
        harvest.realized = gainTotalRealized.times(-1)
        gainTotalUnrealized = gainTotalUnrealized.plus(gainTotalRealized)
      }
    }
    else if (realizedSign === 1) {
      if (
        gainTotalRealized.absoluteValue().toNumber()
        > lossTotalUnrealized.absoluteValue().toNumber()
      ) {
        harvest.realized = lossTotalUnrealized
        lossTotalUnrealized = new Decimal(0)
      }
      else {
        harvest.realized = gainTotalRealized.times(-1)
        lossTotalUnrealized = lossTotalUnrealized.plus(gainTotalRealized)
      }
    }

    harvest.unrealized = gainTotalUnrealized.greaterThan(
      lossTotalUnrealized.absoluteValue(),
    )
      ? lossTotalUnrealized
      : gainTotalUnrealized

    harvest.total = harvest.realized
      .absoluteValue()
      .add(harvest.unrealized.absoluteValue())

    const summary = {
      harvest: {
        realized: harvest.realized.toNumber(),
        total: harvest.total.toNumber(),
        unrealized: harvest.unrealized.toNumber(),
      },
      realized,
      unrealized,
    }

    return {
      ...summary,
    }
  }

  async summaryUnrealized({
    id,
  }: {
    id: string
  }): Promise<PortfolioSummaryUnrealized> {
    const result = await this.db.transaction().execute(async (trx) => {
      await sql`SELECT set_config('app.current_portfolio_id', ${id}::text, TRUE)`.execute(trx)

      return await trx
        .selectFrom('LotCurrent')
        .innerJoin('Account', 'Account.id', 'LotCurrent.accountId')
        .select([
          sql<
            number | null
          >`SUM(CASE WHEN "LotCurrent"."gainTotal" < 0 THEN "LotCurrent"."gainTotal" ELSE 0 END)`.as(
            'lossTotal',
          ),
          sql<
            number | null
          >`SUM(CASE WHEN "LotCurrent"."gainTotal" >= 0 THEN "LotCurrent"."gainTotal" ELSE 0 END)`.as(
            'gainTotal',
          ),
          sql<number>`COUNT(DISTINCT "Account"."id")`.as('accountCount'),
          sql<number>`COUNT("LotCurrent"."id")`.as('lotCount'),
        ])
        .where('Account.portfolioId', '=', id)
        .where('Account.subType', 'not in', [...taxAdvantadedSubTypes])
        .executeTakeFirst()
    })

    if (result) {
      const gainTotal = new Decimal(result.gainTotal ?? 0)
      const lossTotal = new Decimal(result.lossTotal ?? 0)
      return {
        accountCount: Number(result.accountCount),
        gainTotal: gainTotal.toNumber(),
        lossTotal: lossTotal.toNumber(),
        positionCount: Number(result.lotCount),
        total: gainTotal.plus(lossTotal).toNumber(),
      }
    }

    return {
      accountCount: 0,
      gainTotal: 0,
      lossTotal: 0,
      positionCount: 0,
      total: 0,
    }
  }

  async summaryRealized({
    id,
  }: {
    id: string
  }): Promise<PortfolioSummaryRealized> {
    const pAndL = await this.prismaService.$extends(PrismaService.forPortfolio(id)).realizedPAndL.findMany({
      where: {
        account: {
          ...PortfolioService.RELEVANT_HARVEST_ACCOUNTS_WHERE({
            portfolioId: id,
          }),
        },
        year: {
          equals: new Date().getFullYear(),
        },
      },
    })

    const gainShortTerm = pAndL.reduce((acc, curr) => {
      return (acc += Number(curr.shortTerm))
    }, 0)

    const gainLongTerm = pAndL.reduce((acc, curr) => {
      return (acc += Number(curr.longTerm))
    }, 0)

    const dividend = pAndL.reduce((acc, curr) => {
      return (acc += Number(curr.dividend))
    }, 0)

    return {
      accountCount: pAndL.length,
      dividend,
      gainLongTerm,
      gainShortTerm,
      gainTotal: gainLongTerm + gainShortTerm + dividend,
    }
  }

  /**
   * General Portfolio Harvest
   *
   * Looks over all lots in a portoflio and tries to harvest all possible realized and unrealized gains
   */
  async harvest({
    portfolioId,
  }: {
    portfolioId: string
  }): Promise<HarvestResult> {
    const [portfolioSummary, lots, portfolio] = await Promise.all([
      this.summary({
        id: portfolioId,
      }),
      this.lotService.lotCurrent({ portfolioId }),
      this.prismaService.$extends(PrismaService.forPortfolio(portfolioId)).portfolio.findUniqueOrThrow({
        where: {
          id: portfolioId,
        },
      }),
    ])

    const harvest = new Harvest({
      lots: lots.map(
        lot =>
          ({
            ...lot,
            accountId: lot.accountId,
            originalQty: lot.remainingQty,
            processQty: lot.remainingQty,
          }) as LotHarvestInput,
      ),
      portfolio,
      targetRealized: portfolioSummary.harvest.realized,
      targetUnrealized: portfolioSummary.harvest.unrealized,
    })

    harvest.process()

    return {
      allOrders: harvest.allOrders,
      portfolioSummary,
      realizedOrders: harvest.realizedOrders,
      unrealizedOrders: harvest.unrealizedOrders,
    }
  }

  async directedHarvest({
    directedLots,
    portfolioId,
    targetRealized,
    targetUnrealized,
  }: {
    portfolioId: string
    directedLots: DirectedHarvestLot[]
    targetRealized: number
    targetUnrealized: number
  }) {
    const [portfolio, lots] = await Promise.all([
      this.prismaService.$extends(PrismaService.forPortfolio(portfolioId)).portfolio.findUniqueOrThrow({
        where: {
          id: portfolioId,
        },
      }),
      this.lotService.lotCurrent({
        lotIds: directedLots.map(lot => lot.lotId),
        portfolioId,
      }),
    ])

    const harvest = new Harvest({
      lots: lots.map((lot) => {
        const qty
          = directedLots.find(dl => dl.lotId === lot.id)?.quantity ?? '0'
        return {
          ...lot,
          accountId: lot.accountId,
          originalQty: qty,
          processQty: qty,
        } as LotHarvestInput
      }),
      portfolio,
      targetRealized,
      targetUnrealized,
    })

    harvest.process()

    return {
      allOrders: harvest.allOrders,
      realizedOrders: harvest.realizedOrders,
      unrealizedOrders: harvest.unrealizedOrders,
    }
  }

  async finiteHarvest({
    portfolioId,
  }: {
    portfolioId: string
  }): Promise<FiniteHarvestResult> {
    const portfolio = await this.prismaService.$extends(PrismaService.forPortfolio(portfolioId)).portfolio.findUniqueOrThrow({
      where: {
        id: portfolioId,
      },
    })

    const [summary, lots] = await Promise.all([
      this.summary({
        id: portfolioId,
      }),
      this.lotService.lotCurrent({
        portfolioId,
        minTotalPAndL: new Decimal(portfolio.minimumLotPAndL),
      }),
      this.prismaService.$extends(PrismaService.forPortfolio(portfolioId)).portfolio.findUniqueOrThrow({
        where: {
          id: portfolioId,
        },
      }),
    ])

    const harvestType
      = Math.abs(summary.realized.gainTotal)
        <= Math.abs(this.configService.get('NUETRAL_HARVEST_THRESHOLD')!)
        ? HarvestType.REDUCE_COST_BASIS
        : summary.realized.gainTotal > 0
          ? HarvestType.REDUCE_TAXES
          : HarvestType.CAPTURE_GAINS_TAX_FREE

    switch (harvestType) {
      case HarvestType.REDUCE_COST_BASIS: {
        // Netrual realized gain or loss so we want to match lots (unrelaized) by gain and loss to offset each other
        const sourceLots: LotCurrent[] = []
        const matchingLots: LotCurrent[] = []

        // Organize the lots depending on the unrealized gain and loss
        for (const lot of lots) {
          if (summary.unrealized.gainTotal > summary.unrealized.lossTotal) {
            // more gain than loss so losers are the source
            if (lot.remainingQty > '0') {
              if (Number(lot.gainTotal) < 0) {
                sourceLots.push(lot)
              }
              else {
                matchingLots.push(lot)
              }
            }
          }
          else {
            // more loss than gain so winners are the source
            if (lot.remainingQty > '0') {
              if (Number(lot.gainTotal) > 0) {
                sourceLots.push(lot)
              }
              else {
                matchingLots.push(lot)
              }
            }
          }
        }
        writeFileSync('sourceLots.json', JSON.stringify(sourceLots, null, 2))
        writeFileSync(
          'matchingLots.json',
          JSON.stringify(matchingLots, null, 2),
        )

        const unrealizedHarvestMatchResults: {
          sourceLot: LotCurrent
          matchedLotOrders: HarvestLotOrder[]
        }[] = []

        const harvest = new Harvest({
          lots: matchingLots.map((lot) => {
            return {
              ...lot,
              originalQty: lot.remainingQty,
              processQty: lot.remainingQty,
            } satisfies LotHarvestInput
          }),
          portfolio,
          targetRealized: 0,
          targetUnrealized: 0,
        })

        for (const sourceLot of sourceLots) {
          harvest.targetUnrealized = new Decimal(sourceLot.gainTotal).mul(-1)
          harvest.process()
          unrealizedHarvestMatchResults.push({
            sourceLot,
            matchedLotOrders: harvest.allOrders,
          })
        }

        // write results to file

        return {
          harvestType,
          unrealizedHarvestMatchResults,
          summary,
        }
      }
      case HarvestType.REDUCE_TAXES: // High realized gain or loss so we want to reduce that numberas much as possible by selling losses
      case HarvestType.CAPTURE_GAINS_TAX_FREE: {
        // High realized gain or loss so we want to reduce that numberas much as possible by selling losses
        const directedLots = await this.lotService.lotCurrent({
          portfolioId,
          lotValueType:
            HarvestType.REDUCE_TAXES === harvestType
              ? LotValueType.LOSS
              : LotValueType.GAIN,
          minTotalPAndL: new Decimal(portfolio.minimumLotPAndL),
        })

        return {
          summary,
          lotsCurrent: directedLots,
          harvestType,
        }
      }
    }
  }

  public static RELEVANT_HARVEST_ACCOUNTS_WHERE({
    portfolioId,
  }: {
    portfolioId: string
  }): Prisma.AccountWhereInput {
    return {
      portfolioId,
      subType: {
        notIn: [...taxAdvantadedSubTypes],
      },
    }
  }
}
