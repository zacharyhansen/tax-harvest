import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  Account,
  AccountInstitution,
  AccountProvider,
  AuthConnection,
  AuthSource,
  AuthType,
  LogType,
  Lot,
  OperationType,
  Position,
  Prisma,
  Transaction,
  User,
} from '@prisma/client'
import { InputJsonValue } from '@prisma/client/runtime/library'
import Decimal from 'decimal.js'
import {
  AccountBase,
  Configuration,
  CountryCode,
  Holding,
  InvestmentsHoldingsGetResponse,
  InvestmentsTransactionsGetResponse,
  LinkTokenCreateRequest,
  PlaidApi,
  Products,
  Security,
} from 'plaid'
import { PrismaService } from '../prisma/prisma.service'
import { findLotChangeSets, LotChange, LotData } from './lot-application'
import { PlaidLinkOnSuccessMetadata, PlaidWebhook } from './plaid.dto'
import { taxAdvantadedSubTypes } from './plaid.utils'

const plaidTransactionsPerPage = 500

interface ResolvedLotChangeResults {
  realizedProfitAndLoss: Decimal
  lotUpserts: LotChange[]
  lotDeletes: LotChange[]
  newBuys: Transaction[]
  newSells: Transaction[]
  newTransactions: Transaction[]
  lotTupleMap: Map<string, LotData[]>
  intitialLotMap: Map<string, Lot>
}

@Injectable()
export class PlaidService {
  private readonly logger = new Logger(PlaidService.name)
  private readonly client: PlaidApi
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.client = new PlaidApi(
      new Configuration({
        baseOptions: {
          headers: {
            'PLAID-CLIENT-ID': this.configService.get('PLAID_CLIENT_ID'),
            'PLAID-SECRET': this.configService.get('PLAID_SECRET_KEY'),
          },
        },
        basePath: this.configService.get('PLAID_ENV'),
      }),
    )
  }

  async linkToken({
    userId,
    portfolioId,
  }: {
    userId: string
    portfolioId: string
  }) {
    const user = await this.assertUserIsCreatedInPlaid({ userId, portfolioId })

    // We want to open plaid link as update if user already has one for portfolio
    const existingAuthConnection = await this.prismaService
      .$extends(PrismaService.forPortfolio(portfolioId))
      .authConnection
      .findUnique({
        where: {
          source_userId_portfolioId_plaidInstitutionId: {
            userId,
            portfolioId,
            source: AuthSource.PLAID,
            plaidInstitutionId: '',
          },
        },
      })

    const baseLinkTokenCreate: LinkTokenCreateRequest = {
      client_id: this.configService.get('PLAID_CLIENT_ID'),
      client_name: 'TaxHarvest',
      country_codes: [CountryCode.Us],
      enable_multi_item_link: true,
      language: 'en',
      products: [Products.Investments],
      // redirect_uri: `${this.configService.get('CLIENT_ORIGIN')}${this.configService.get('CLIENT_HOME_PAGE_PATH')}`,
      secret: this.configService.get('PLAID_SECRET_KEY'),
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: userId,
        email_address: user.email ?? undefined,
        phone_number: user.phoneNumber ?? undefined,
      },
      // user_token: user.plaidUserToken!,
      webhook: `${this.configService.get<string>('ORIGIN')}/plaid/webhook`,
    }

    if (existingAuthConnection?.secret) {
      this.logger.log(`Updating existing plaid link. existingAuthConnectionId: ${existingAuthConnection.id}`)
      baseLinkTokenCreate.access_token = existingAuthConnection.secret
      baseLinkTokenCreate.update = {
        account_selection_enabled: true,
      }
    }

    const response = await this.client.linkTokenCreate(baseLinkTokenCreate)

    return response
  }

  /**
   * Its very important to understand that we NEVER want an external account to exist for 2 separate plaid items in a portfolio
   * Plaid creates as many "items" as you request and even if its the same account they will have different account ids in each item.
   *
   * Thus we detect duplicate plaid items by mask and name. If there are duplicates we must
   * delete the old plaid link and move the old oens over to the new. This breaks down is the old has more
   * items than in the new (for now we throw an error)
   */
  async setAccessToken({
    metaData,
    portfolioId,
    publicToken,
    userId,
    existingAccountId,
  }: {
    userId: string
    publicToken: string
    portfolioId: string
    metaData: PlaidLinkOnSuccessMetadata
    existingAccountId?: string
  }): Promise<Account[]> {
    const existingAccounts = await this.prismaService
      .$extends(PrismaService.forPortfolio(portfolioId))
      .account
      .findMany({
        include: {
          authConnection: true,
        },
        where: {
          OR: metaData.accounts.map(account => ({
            plaidAccountMask: {
              equals: account.mask,
            },
            name: {
              equals: account.name,
            },
          })),
        },
      })

    const existingAuthConnections = new Map(
      existingAccounts.map(a => [a.authConnectionId, a.authConnection]),
    )

    const allExistingAccountsForAuthConnections = await this.prismaService
      .$extends(PrismaService.forPortfolio(portfolioId))
      .account
      .findMany({
        where: {
          authConnectionId: {
            // @ts-expect-error - this should exist
            in: [...existingAuthConnections.keys()],
          },
          portfolioId: {
            equals: portfolioId,
          },
        },
      })

    // Ensure the new connection has every existing account for the existing connections
    // this means we can delete the old one and use the new without account loss
    const noDanglingAccounts = allExistingAccountsForAuthConnections.every(
      existingAuthAccount =>
        existingAccounts.find(a => a.id === existingAuthAccount.id)
        !== undefined,
    )

    if (!noDanglingAccounts) {
      throw new Error(
        'New Plaid link coveres existing account links but not all.',
      )
    }

    const response = await this.client.itemPublicTokenExchange({
      public_token: publicToken,
    })

    // These values should be saved to a persistent database and
    // associated with the currently signed-in user
    const accessToken = response.data.access_token
    const itemId = response.data.item_id

    const payload: Prisma.AuthConnectionCreateInput = {
      externalId: itemId,
      portfolio: {
        connect: {
          id: portfolioId,
        },
      },
      secret: accessToken,
      source: AuthSource.PLAID,
      type: AuthType.PLAID_LINK,
      plaidInstitutionId: metaData.institution?.institution_id,
      user: {
        connect: {
          id: userId,
        },
      },
    }

    const plaidAuthConnection = await this.prismaService
      .$extends(PrismaService.forPortfolio(portfolioId))
      .authConnection
      .upsert({
        create: payload,
        update: payload,
        where: {
          source_userId_portfolioId_plaidInstitutionId: {
            portfolioId,
            source: AuthSource.PLAID,
            userId,
            plaidInstitutionId: metaData.institution?.institution_id ?? '',
          },
        },
      })

    return this.syncPlaidItem({
      plaidAuthConnection,
      existingAccountId,
    })
  }

  async syncPlaidItem({
    plaidAuthConnection,
    existingAccountId,
  }: {
    plaidAuthConnection: AuthConnection
    asReversableOperations?: boolean
    existingAccountId?: string
  }): Promise<Account[]> {
    this.logger.log('Syncing Plaid item: ', plaidAuthConnection.id)
    if (plaidAuthConnection.type !== AuthType.PLAID_LINK) {
      throw new Error('This is not a plaid auth connection')
    }
    if (!plaidAuthConnection.secret) {
      throw new Error('Missing access token.')
    }

    const plaidResponse = await this.client
      .investmentsHoldingsGet({
        access_token: plaidAuthConnection.secret,
        client_id: this.configService.get('PLAID_CLIENT_ID'),
        secret: this.configService.get('PLAID_SECRET_KEY'),
      })
      .catch(async (error: unknown) => {
        await this.prismaService
          .$extends(PrismaService.forPortfolio(plaidAuthConnection.portfolioId))
          .log
          .create({
            data: {
              data: error as InputJsonValue,
              description: '/investmentsHoldingsGet',
              responseStatus: (error as { status: number }).status,
              source: AuthSource.PLAID,
              type: LogType.EXTERNAL_SYNC,
              portfolioId: plaidAuthConnection.portfolioId,
            },
          })
        throw new Error('Sync failed.')
      })

    // Set up create of positions
    const [accounts] = await Promise.all([
      this.resetPlaidAccounts({
        plaidAccounts: plaidResponse.data.accounts,
        plaidAuthConnection,
        existingAccountId,
      }),
      this.assertPlaidSecuritiesExist({
        securities: plaidResponse.data.securities,
        portfolioId: plaidAuthConnection.portfolioId,
      }),
      this.prismaService
        .$extends(PrismaService.forPortfolio(plaidAuthConnection.portfolioId))
        .log
        .create({
          data: {
            data: plaidResponse.data as unknown as InputJsonValue,
            description: '/investmentsHoldingsGet',
            responseStatus: plaidResponse.status,
            source: AuthSource.PLAID,
            type: LogType.EXTERNAL_SYNC,
            portfolioId: plaidAuthConnection.portfolioId,
          },
        }),
    ])

    // Remove all the positions we are syncing (cant know which have been deleted or not)
    // Then create them - return the created positions and the unapplied transactions
    await Promise.all([
      this.prismaService
        .$extends(PrismaService.forPortfolio(plaidAuthConnection.portfolioId))
        .$transaction([
          this.prismaService.position.deleteMany({
            where: {
              account: {
                authConnectionId: {
                  in: accounts.map(a => a.authConnectionId ?? ''),
                },
              },
            },
          }),
          this.prismaService.position.createMany({
            data: PlaidService.convertPlaidHoldings({
              holdingsResponse: plaidResponse.data,
              accounts,
              portfolioId: plaidAuthConnection.portfolioId,
            }),
          }),
        ]),
      this.syncPlaidTransactions({
        plaidAuthConnection,
      }),
    ])

    // Now we attempt to process the unapplied transactions based on initialLots and initialPositions
    await this.applyNewTransactions({
      authConnection: plaidAuthConnection,
    })

    return accounts
  }

  async applyNewTransactions({
    authConnection,
  }: {
    authConnection: AuthConnection
  }): Promise<void> {
    this.logger.log('Applying new transactions')
    const [finalPositions, initialLots, transactions] = await Promise.all([
      this.prismaService
        .$extends(PrismaService.forPortfolio(authConnection.portfolioId))
        .position
        .findMany({
          where: {
            account: {
              authConnectionId: {
                equals: authConnection.id,
              },
            },
          },
        }),
      this.prismaService
        .$extends(PrismaService.forPortfolio(authConnection.portfolioId))
        .lot
        .findMany({
          where: {
            account: {
              authConnectionId: {
                equals: authConnection.id,
              },
            },
          },
        }),
      this.prismaService
        .$extends(PrismaService.forPortfolio(authConnection.portfolioId))
        .transaction
        .findMany({
          where: {
            account: {
              authConnectionId: {
                equals: authConnection.id,
              },
            },
            appliedToLots: false,
          },
          // Important to order by transaction date descending since greedy FIFO assume newest first
          orderBy: {
            transactionDate: 'desc',
          },
        }),
    ])

    let resolvedResults: ResolvedLotChangeResults = {
      realizedProfitAndLoss: new Decimal(0),
      lotUpserts: [],
      lotDeletes: [],
      newBuys: [],
      newSells: [],
      newTransactions: [],
      lotTupleMap: new Map<string, LotData[]>(),
      intitialLotMap: new Map<string, Lot>(),
    }

    const resolveInput = {
      finalPositions,
      transactions,
      initialLots,
      authConnection,
    }

    await this.prismaService
      .$extends(PrismaService.forPortfolio(authConnection.portfolioId))
      .log
      .create({
        data: {
          data: JSON.parse(
            JSON.stringify(resolveInput),
          ),
          description: 'Attempting trx merge',
          source: AuthSource.PLAID,
          type: LogType.PLAID_TRX_MERGE,
          portfolioId: authConnection.portfolioId,
        },
      })

    try {
      resolvedResults = PlaidService.resolveLotChanges(resolveInput)
    }
    catch (error) {
      console.error(error)
      await this.prismaService
        .$extends(PrismaService.forPortfolio(authConnection.portfolioId))
        .log
        .create({
          data: {
            data: {
              error: error as InputJsonValue,
              input: JSON.parse(
                JSON.stringify(resolveInput),
              ),
            },
            description: `Trx merge failed with error: ${JSON.stringify(error)}`,
            source: AuthSource.PLAID,
            type: LogType.PLAID_TRX_MERGE_ERROR,
            portfolioId: authConnection.portfolioId,
          },
        })
      throw error
    }

    const { realizedProfitAndLoss, lotUpserts, lotDeletes, newBuys, newSells, newTransactions, lotTupleMap, intitialLotMap } = resolvedResults

    await this.prismaService
      .$extends(PrismaService.forPortfolio(authConnection.portfolioId))
      .$transaction(async (trx) => {
        const lotTransactionBatch = await trx.lotTransactionBatch.create({
          data: {
            authConnectionId: authConnection.id,
            portfolioId: authConnection.portfolioId,
            positionsAfter: finalPositions,
            lotTupleMap: JSON.parse(
              JSON.stringify(Array.from(lotTupleMap.entries())),
            ),
            initialLots,
            newTransactions,
            newBuys,
            newSells,
            realizedProfitAndLoss,
            // Store lots that were completely sold (zero quantity remaining)
            deletedLots: JSON.parse(JSON.stringify(
              lotDeletes,
            )),
          },
        })

        // Upsert lots that have remaining quantity
        await Promise.all(
          lotUpserts.map(({ upsert }) =>
            trx.lot.upsert({
              where: {
                id: upsert.id,
              },
              create: upsert,
              update: upsert,
            }),
          ),
        )

        // Delete lots that have no remaining quantity
        await Promise.all([
          trx.lot.deleteMany({
            where: {
              id: {
                in: lotDeletes.map(({ upsert }) => upsert.id ?? ''),
              },
            },
          }),
        ])

        await Promise.all([
          // update lotSeededDate to the date of the newest transaction so we know we do not need to fetch these again
          trx.account.updateMany({
            where: {
              authConnection: {
                id: authConnection.id,
              },
            },
            data: {
              lotSeededDate: transactions[0]?.transactionDate ?? undefined,
            },
          }),
          // update appliedToLots to true so we know we do not need to process these again
          trx.transaction.updateMany({
            where: {
              account: {
                authConnectionId: authConnection.id,
              },
            },
            data: {
              appliedToLots: true,
            },
          }),
          trx.log.create({
            data: {
              data: JSON.parse(JSON.stringify({ lotTupleMap })),
              description: 'Trx merge results',
              source: AuthSource.PLAID,
              type: LogType.PLAID_TRX_MERGE_SUCCESS,
              portfolioId: authConnection.portfolioId,
            },
          }),
          trx.lotChangeLog.createMany({
            data: lotUpserts.map(({ upsert, isNewBuy }) => {
              const isZeroQuantity = (upsert.remainingQty as Decimal).lte(0)
              const operationType = isNewBuy
                ? OperationType.create
                : isZeroQuantity
                  ? OperationType.delete
                  : OperationType.update
              return {
                lotTransactionBatchId: lotTransactionBatch.id,
                lotId: operationType === OperationType.delete
                  ? undefined
                  : upsert.id,
                quantityChange: (
                  intitialLotMap.get(upsert.id ?? '')?.remainingQty
                  ?? new Decimal(0)
                ).minus(upsert.remainingQty as Decimal),
                accountId: upsert.account.connect?.id ?? '',
                portfolioId: authConnection.portfolioId,
                lotBefore: intitialLotMap.get(upsert.id ?? ''),
                lotAfter: JSON.parse(JSON.stringify(upsert)),
                operationType,
              }
            }),
          }),
          trx.lotChangeLog.createMany({
            data: lotDeletes.map(({ upsert, isNewBuy }) => {
              const isZeroQuantity = (upsert.remainingQty as Decimal).lte(0)
              const operationType = isNewBuy
                ? OperationType.create
                : isZeroQuantity
                  ? OperationType.delete
                  : OperationType.update
              return {
                lotTransactionBatchId: lotTransactionBatch.id,
                quantityChange: (
                  intitialLotMap.get(upsert.id ?? '')?.remainingQty
                  ?? new Decimal(0)
                ).minus(upsert.remainingQty as Decimal),
                accountId: upsert.account.connect?.id ?? '',
                portfolioId: authConnection.portfolioId,
                lotBefore: intitialLotMap.get(upsert.id ?? ''),
                lotAfter: JSON.parse(JSON.stringify(upsert)),
                operationType,
              }
            }),
          }),
        ])
      })
  }

  static resolveLotChanges({
    finalPositions,
    transactions,
    initialLots,
    authConnection,
  }: {
    finalPositions: Position[]
    transactions: Transaction[]
    initialLots: Lot[]
    authConnection: AuthConnection
  }): ResolvedLotChangeResults {
    const intitialLotMap = new Map<string, Lot>()
    for (const lot of initialLots) {
      intitialLotMap.set(lot.id, lot)
    }

    const { lotTupleMap, newBuys, newSells, newTransactions }
      = PlaidService.lotDataMapFromLotsAndTransactions({
        lots: initialLots,
        transactions,
      })

    // console.log({ lotTupleMap, newBuys, newSells })

    // Attempt to generate the change set for each asset
    const lotResults = ((Array.from(lotTupleMap.entries()).map(
      ([symbol, lotTuples]) => {
        const position = finalPositions.find(p => p.assetSymbol === symbol)
        const targetQuantity = position?.quantity
          ? position.quantity
          : undefined
        const targetValue = position?.costTotal
          ? position.costTotal
          : undefined

        const changeAlgoParams = {
          lotsData: lotTuples,
          targetQuantity,
          targetValue,
          symbol,
        }
        return findLotChangeSets(changeAlgoParams, authConnection.portfolioId).lotChanges
      },
    ))).flat()

    // Calculate the realized profit and loss - we dont need to actually know per share - just total sold and total cost basis

    // Total Sale Dollars
    const totalSaleDollars = newSells.reduce((acc, sell) => {
      return acc.plus(sell.amount ?? 0)
    }, new Decimal(0))

    // Total Sale Cost Basis
    const totalSaleCostBasis = lotResults.reduce((acc, lot) => {
      return acc.plus(lot.quantityChange.mul(lot.price))
    }, new Decimal(0))

    const realizedProfitAndLoss = totalSaleDollars.minus(totalSaleCostBasis)

    /**
     * Need to return a few things:
     * 1. realizedProfitAndLoss - so we can adjust realized P&L
     * 2. LotUpserts - so we can upsert the lots
     * 3. LotDeletes - (Those lots that are completely sold)
     * 4. lotTupleMap - this is just for logging purposes
     * 5. newTransactions - so we can mark them as applied to lots
     */

    return {
      realizedProfitAndLoss,
      lotUpserts: lotResults.filter(result =>
        (result.upsert.remainingQty as Decimal).gt(0),
      ),
      lotDeletes: lotResults.filter(result =>
        (result.upsert.remainingQty as Decimal).lte(0),
      ),
      newBuys,
      newSells,
      newTransactions,
      lotTupleMap,
      intitialLotMap,
    }
  }

  static lotDataMapFromLotsAndTransactions({
    lots,
    transactions,
    useTestLotId = false,
  }: {
    lots: Lot[]
    transactions: Transaction[]
    useTestLotId?: boolean
  }): {
    lotTupleMap: Map<string, LotData[]>
    newBuys: Transaction[]
    newSells: Transaction[]
    newTransactions: Transaction[]
  } {
    const lotTupleMap = new Map<string, LotData[]>()
    const newTransactions = transactions.filter(trx => !trx.appliedToLots)
    const newBuys = newTransactions.filter(
      t => t.type === 'buy' && t.subtype === 'buy',
    )
    const newSells = newTransactions.filter(
      t => t.type === 'sell' && t.subtype === 'sell',
    )

    // Create map of tuple for each lot
    for (const lot of lots) {
      if (lotTupleMap.has(lot.assetSymbol)) {
        lotTupleMap.get(lot.assetSymbol)?.push({
          quantity: new Decimal(lot.remainingQty.toString()),
          price: new Decimal(lot.price.toString()),
          lotId: lot.id,
          accountId: lot.accountId,
          acquiredDate: lot.acquiredDate,
          isNewBuy: false,
        })
      }
      else {
        lotTupleMap.set(lot.assetSymbol, [
          {
            quantity: new Decimal(lot.remainingQty.toString()),
            price: new Decimal(lot.price.toString()),
            lotId: lot.id,
            accountId: lot.accountId,
            acquiredDate: lot.acquiredDate,
            isNewBuy: false,
          },
        ])
      }
    }

    // Add buy transactions with new uuid as lots
    for (const trx of newBuys) {
      if (
        trx.assetSymbol
        && trx.type === 'buy'
        && trx.subtype === 'buy'
        && trx.quantity
        && trx.price
      ) {
        if (!trx.transactionDate) {
          throw new Error('Transaction date is required for new buys')
        }
        if (lotTupleMap.has(trx.assetSymbol)) {
          lotTupleMap.get(trx.assetSymbol)?.push({
            quantity: new Decimal(trx.quantity),
            price: new Decimal(trx.price),
            lotId: !useTestLotId
              ? (crypto.randomUUID() as string)
              : 'test lot id',
            accountId: trx.accountId,
            acquiredDate: trx.transactionDate,
            isNewBuy: true,
          })
        }
        else {
          lotTupleMap.set(trx.assetSymbol, [
            {
              quantity: new Decimal(trx.quantity),
              price: new Decimal(trx.price),
              lotId: !useTestLotId
                ? (crypto.randomUUID() as string)
                : 'test lot id',
              accountId: trx.accountId,
              acquiredDate: trx.transactionDate,
              isNewBuy: true,
            },
          ])
        }
      }
    }

    return {
      lotTupleMap,
      newBuys,
      newSells,
      newTransactions,
    }
  }

  async assertUserIsCreatedInPlaid({
    userId,
    portfolioId,
  }: {
    userId: string
    portfolioId: string
  }): Promise<User> {
    const user = await this.prismaService
      .$extends(PrismaService.forPortfolio(portfolioId))
      .user
      .findUniqueOrThrow({
        where: {
          id: userId,
        },
      })

    if (!user.plaidUserToken) {
      const plaidUser = await this.plaidCreateUser({
        userId: user.id,
      })
      return this.prismaService
        .$extends(PrismaService.forPortfolio(portfolioId))
        .user
        .update({
          data: {
            plaidCustomerId: plaidUser.data.user_id,
            plaidUserToken: plaidUser.data.user_token,
          },
          where: {
            id: user.id,
          },
        })
    }
    return user
  }

  async plaidCreateUser({ userId }: { userId: string }) {
    return this.client
      .userCreate({
        client_id: this.configService.get('PLAID_CLIENT_ID'),
        client_user_id: userId,
        secret: this.configService.get('PLAID_SECRET_KEY'),
      })
      .catch((error: unknown) => {
        this.logger.error({
          'Plaid Error': (error as { response: { data: unknown } }).response.data,
        })
        // This errros when the user already exists - there doesnt seem to be an API for getting a userId...
        // so going to assume this never fails
        return {
          data: {
            user_id: 'NOT FOUND',
            user_token: 'NOT FOUND',
          },
        }
      })
  }

  async mostRecentTransaction({
    authConnectionId,
  }: {
    authConnectionId: string
  }) {
    return this.prismaService
      .$extends(PrismaService.forPortfolio(authConnectionId))
      .transaction
      .findFirst({
        where: {
          account: {
            authConnectionId: {
              equals: authConnectionId,
            },
          },
        },
        orderBy: {
          transactionDate: 'desc',
        },
        select: {
          transactionDate: true,
        },
      })
  }

  /**
   * Updates and records plaid transactions but DOES NOT affect lots
   *
   * @param {object} params - The parameters object
   * @param {AuthConnection} params.plaidAuthConnection - The plaid auth connection to use
   * @param {Date} [params.startDate] - The earliest/earlier date (i.e. 2 years ago)
   * @param {Date} [params.endDate] - The latest/later date (i.e. today)
   * @param {number} [params.page] - The page number to fetch
   * @returns {Promise<void>}
   */
  async syncPlaidTransactions({
    endDate,
    page = 1,
    plaidAuthConnection,
    startDate,
  }: {
    plaidAuthConnection: AuthConnection
    startDate?: Date
    endDate?: Date // the later date (i,e today)
    page?: number
  }): Promise<void> {
    if (!plaidAuthConnection.secret) {
      throw new Error('Missing plaid access token for auth connection.')
    }
    const end_date = endDate ?? new Date()

    // Only need to get from most recent transaction if we are not providing a start date
    const mostRecentTransaction = await this.mostRecentTransaction({
      authConnectionId: plaidAuthConnection.id,
    })

    const plaidResponse = await this.client.investmentsTransactionsGet({
      access_token: plaidAuthConnection.secret,
      client_id: this.configService.get('PLAID_CLIENT_ID'),
      end_date: new Intl.DateTimeFormat('en-CA').format(end_date),
      options: {
        count: plaidTransactionsPerPage,
        offset: (page - 1) * plaidTransactionsPerPage,
      },
      secret: this.configService.get('PLAID_SECRET_KEY'),
      start_date: mostRecentTransaction?.transactionDate
        ? new Intl.DateTimeFormat('en-CA').format(
          mostRecentTransaction.transactionDate,
        )
        : new Intl.DateTimeFormat('en-CA').format(
          startDate ?? new Date().setFullYear(end_date.getFullYear() - 2),
        ),
    })

    this.logger.log(
      'Plaid transactions length:',
      plaidResponse.data.investment_transactions.length,
    )

    // Set up the upsert
    const [accounts] = await Promise.all([
      this.prismaService
        .$extends(PrismaService.forPortfolio(plaidAuthConnection.portfolioId))
        .account
        .findMany({
          where: {
            externalId: {
              in: plaidResponse.data.accounts.map(a => a.account_id ?? ''),
            },
          },
        }),
      this.assertPlaidSecuritiesExist({
        securities: plaidResponse.data.securities,
        portfolioId: plaidAuthConnection.portfolioId,
      }),
      this.prismaService
        .$extends(PrismaService.forPortfolio(plaidAuthConnection.portfolioId))
        .log
        .create({
          data: {
            data: plaidResponse.data as unknown as InputJsonValue,
            description: '/investmentsTransactionsGet',
            responseStatus: plaidResponse.status,
            source: AuthSource.PLAID,
            type: LogType.EXTERNAL_SYNC,
            portfolioId: plaidAuthConnection.portfolioId,
          },
        }),
    ])

    const lastTransOfPage = plaidResponse.data.investment_transactions.at(-1)

    // Only fetch more pages if the last transaction of the current page is not already in the DB
    const currentTransactionsAreNew = !(await this.prismaService
      .$extends(PrismaService.forPortfolio(plaidAuthConnection.portfolioId))
      .transaction
      .findUnique({
        where: {
          accountId_externalId: {
            accountId: accounts.find(
              a => a.externalId === lastTransOfPage?.account_id,
            )!.id,
            externalId: lastTransOfPage?.investment_transaction_id ?? '',
          },
        },
      }))

    await Promise.all(
      PlaidService.convertPlaidTransactions({
        investmentsTransactionsGetResponse: plaidResponse.data,
        accounts,
        plaidAuthConnection,
      }).map((input) => {
        return this.prismaService
          .$extends(PrismaService.forPortfolio(plaidAuthConnection.portfolioId))
          .transaction
          .upsert({
            create: input,
            update: input,
            where: {
              accountId_externalId: {
                accountId: accounts.find(
                  a =>
                    a.plaidAccountMask
                    === input.account.connect?.authConnectionId_plaidAccountMask_type?.plaidAccountMask
                    && a.type
                    === input.account.connect?.authConnectionId_plaidAccountMask_type?.type,
                )!.id,
                externalId: input.externalId,
              },
            },
          })
      }),
    )

    // If these are new transactions and the page is full we need to fetch more pages
    if (
      currentTransactionsAreNew
      && plaidResponse.data.investment_transactions.length
      >= plaidTransactionsPerPage
    ) {
      await this.syncPlaidTransactions({
        endDate,
        page: page + 1,
        plaidAuthConnection,
        startDate,
      })
    }
  }

  async assertPlaidSecuritiesExist({
    securities,
    portfolioId,
  }: {
    securities: Security[]
    portfolioId: string
  }) {
    return Promise.all(
      PlaidService.convertPlaidAssets({
        securities: securities.filter(
          security =>
            security.ticker_symbol
            ?? security.name
            ?? security.market_identifier_code,
        ),
      }).map((input) => {
        return this.prismaService
          .$extends(PrismaService.forPortfolio(portfolioId))
          .asset
          .upsert({
            create: input,
            update: input,
            where: {
              symbol: input.symbol,
            },
          })
      }),
    )
  }

  async resetPlaidAccounts({
    plaidAccounts,
    plaidAuthConnection,
    existingAccountId,
  }: {
    plaidAccounts: AccountBase[]
    plaidAuthConnection: AuthConnection
    existingAccountId?: string
  }): Promise<Account[]> {
    const accounts = PlaidService.convertPlaidAccounts({
      plaidAccounts,
      plaidAuthConnection,
    })
    return this.prismaService
      .$extends(PrismaService.forPortfolio(plaidAuthConnection.portfolioId))
      .$transaction(async (trx) => {
        /// Need to delete all existing accounts first to avoid conflicts (user is effectively re-linking/replacing these accounts)
        for (const input of accounts) {
          await trx.account.delete({
            where: {
              authConnectionId_plaidAccountMask_type: {
                authConnectionId: plaidAuthConnection.id,
                plaidAccountMask: input.plaidAccountMask ?? '',
                type: input.type ?? '',
              },
            },
          })
        }

        const upsertedAccounts = []
        for (let i = 0; i < accounts.length; i++) {
          const input = accounts[i]
          // Not pretty but we want to tie the account created in the upload file step to once of the linekd ones
          if (existingAccountId && i === 0) {
            const account = await trx.account.update({
              where: { id: existingAccountId },
              data: input,
            })
            upsertedAccounts.push(account)
          }
          else {
            const account = await trx.account.upsert({
              create: input,
              update: input,
              where: {
                authConnectionId_plaidAccountMask_type: {
                  authConnectionId: plaidAuthConnection.id,
                  plaidAccountMask: input.plaidAccountMask ?? '',
                  type: input.type ?? '',
                },
              },
            })
            upsertedAccounts.push(account)
          }
        }
        return upsertedAccounts
      })
  }

  private async handleHoldingsUpdate(webhookData: PlaidWebhook): Promise<void> {
    const authConnection = await this.prismaService
      .$extends(PrismaService.bypassRLS())
      .authConnection
      .findUniqueOrThrow({
        where: { externalId: webhookData.item_id },
        include: {
          accounts: {
            select: {
              lotSeededDate: true,
            },
          },
        },
      })
    switch (webhookData.webhook_code) {
      case 'DEFAULT_UPDATE': {
        this.logger.log('Processing Plaid holdings DEFAULT_UPDATE')

        await this.syncPlaidItem({
          plaidAuthConnection: authConnection,
        })

        break
      }
      default: {
        await this.prismaService
          .$extends(PrismaService.forPortfolio(authConnection.portfolioId))
          .log
          .create({
            data: {
              data: webhookData as unknown as InputJsonValue,
              description: `/${webhookData.webhook_code}`,
              source: AuthSource.PLAID,
              type: LogType.EXTERNAL_SYNC,
              portfolioId: authConnection.portfolioId,
            },
          })
        this.logger.warn(`Unhandled webhook code: ${webhookData.webhook_code}`)
      }
    }
  }

  async processWebhook(webhookData: PlaidWebhook): Promise<void> {
    switch (webhookData.webhook_type) {
      case 'HOLDINGS': {
        this.logger.log('Processing Plaid holdings update')
        await this.handleHoldingsUpdate(webhookData)
        break
      }
      default: {
        this.logger.error(
          `Unhandled webhook type: ${webhookData.webhook_type}`,
        )
      }
    }
  }

  static convertPlaidAssets({
    securities,
  }: {
    securities: Security[]
  }): Prisma.AssetCreateInput[] {
    return securities.map((security) => {
      const symbol
        = security.ticker_symbol
        ?? security.name
        ?? security.market_identifier_code
      // Only upsert minimum here - polygon should be source of other data
      const input: Prisma.AssetCreateInput = {
        plaid_security_id: security.security_id,
        symbol: symbol ?? '',
        type: security.type ?? undefined,
      }
      return input
    })
  }

  static convertPlaidAccounts({
    plaidAccounts,
    plaidAuthConnection,
  }: {
    plaidAccounts: AccountBase[]
    plaidAuthConnection: AuthConnection
  }): Prisma.AccountCreateInput[] {
    return plaidAccounts.map((plaidAccount) => {
      const upsertAccount: Prisma.AccountCreateInput = {
        accountValueTotal: plaidAccount.balances.current,
        authConnection: {
          connect: {
            id: plaidAuthConnection.id,
          },
        },
        balanceMoneyMarket: plaidAccount.balances.available,
        cashAvailableForInvestment: plaidAccount.balances.available,
        createdBy: {
          connect: {
            id: plaidAuthConnection.userId,
          },
        },
        // !IMPORTANT - This changes if you reauth to the same account - we never weant to be recreating links to an account in a portfolio
        externalId: plaidAccount.account_id,
        institution: AccountInstitution.BROKERAGE,
        plaidAccountMask: plaidAccount.mask,
        name: plaidAccount.name,
        portfolio: {
          connect: {
            id: plaidAuthConnection.portfolioId,
          },
        },
        provider: AccountProvider.PLAID,
        skipSetup: taxAdvantadedSubTypes.has(plaidAccount.subtype ?? ''),
        subType: plaidAccount.subtype,
        type: plaidAccount.type,
      }
      return upsertAccount
    })
  }

  static convertPlaidTransactions({
    investmentsTransactionsGetResponse,
    accounts,
    plaidAuthConnection,
  }: {
    investmentsTransactionsGetResponse: InvestmentsTransactionsGetResponse
    accounts: (Account | Prisma.AccountCreateInput)[]
    plaidAuthConnection: AuthConnection
  }): Prisma.TransactionCreateInput[] {
    const securityMap = new Map<string, string>()
    for (const security of investmentsTransactionsGetResponse.securities) {
      securityMap.set(
        security.security_id,
        security.ticker_symbol ?? 'UNKNOWN',
      )
    }

    const output = investmentsTransactionsGetResponse.investment_transactions.map(
      (transaction) => {
        const account = accounts.find(
          a => a.externalId === transaction.account_id,
        )
        if (!account || !account.plaidAccountMask || !account.type) {
          throw new Error(
            'convertPlaidTransactions: Could not find account from upsert.',
          )
        }

        const input: Prisma.TransactionCreateInput = {
          account: {
            connect: {
              authConnectionId_plaidAccountMask_type: {
                authConnectionId: plaidAuthConnection.id,
                plaidAccountMask: account.plaidAccountMask,
                type: account.type,
              },
              // provider_externalId: {
              //   externalId: transaction.account_id,
              //   provider: AccountProvider.PLAID,
              // },
            },
          },
          portfolio: {
            connect: {
              id: plaidAuthConnection.portfolioId,
            },
          },
          amount: transaction.amount,
          // Consider the transaction applied if its after the account was seeded
          appliedToLots: Boolean(
            account.lotSeededDate
            && account.lotSeededDate >= new Date(transaction.date),
          ),
          asset: {
            // these should already exist due to the assert
            connect: {
              symbol:
                securityMap.get(transaction.security_id ?? '') ?? 'UNKNOWN',
            },
          },
          externalId: transaction.investment_transaction_id,
          fee: transaction.fees,
          memo: transaction.name,
          paymentCurrency: transaction.iso_currency_code,
          price: transaction.price,
          quantity: transaction.quantity,
          settlementCurrency: transaction.iso_currency_code,
          subtype: transaction.subtype,
          transactionDate: new Date(transaction.date),
          type: transaction.type,
        }

        return input
      },
    )

    return output
  }

  static convertPlaidHoldings({
    holdingsResponse,
    accounts,
    portfolioId,
  }: {
    holdingsResponse: InvestmentsHoldingsGetResponse
    accounts: Account[]
    portfolioId: string
  }): Prisma.PositionCreateManyInput[] {
    const securityMap = new Map<string, string>()
    for (const security of holdingsResponse.securities) {
      securityMap.set(
        security.security_id,
        security.ticker_symbol ?? 'UNKNOWN',
      )
    }
    return holdingsResponse.holdings.map((holding) => {
      const account = accounts.find(
        account => account.externalId === holding.account_id,
      )

      if (!account) {
        throw new Error(
          'convertPlaidHoldings: Could not find account from upsert.',
        )
      }
      return {
        accountId: account.id,
        assetSymbol: securityMap.get(holding.security_id) ?? 'UNKNOWN',
        costTotal: holding.cost_basis,
        marketValue: holding.institution_value,
        quantity: holding.quantity,
        portfolioId,
      }
    })
  }

  static holdingsTotals({
    holdings,
  }: {
    holdings: Holding[]
  }): Record<string, { costBasisTotal: Decimal, qtyTotal: Decimal }> {
    return holdings.reduce<
      Record<string, { costBasisTotal: Decimal, qtyTotal: Decimal }>
    >((acc, holding) => {
      acc[holding.security_id] = {
        costBasisTotal: new Decimal(holding.cost_basis ?? 0),
        qtyTotal: new Decimal(holding.quantity),
      }
      return acc
    }, {})
  }
}
