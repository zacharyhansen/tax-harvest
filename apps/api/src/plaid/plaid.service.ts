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
  PlaidApi,
  Products,
  Security,
} from 'plaid'
import { PrismaService } from '../prisma/prisma.service'
import { findLotChangeSets, LotChange, LotData } from './lot-application'
import { PlaidLinkOnSuccessMetadata, PlaidWebhook } from './plaid.dto'
import { taxAdvantadedSubTypes } from './plaid.utils'

const plaidTransactionsPerPage = 500

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

    const response = await this.client.linkTokenCreate({
      client_id: this.configService.get('PLAID_CLIENT_ID'),
      client_name: 'TaxHarvest',
      country_codes: [CountryCode.Us],
      // enable_multi_item_link: true,
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
    })

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
  }: {
    userId: string
    publicToken: string
    portfolioId: string
    metaData: PlaidLinkOnSuccessMetadata
  }): Promise<Account[]> {
    const existingAccounts = await this.prismaService
      .$extends(PrismaService.forPortfolio(portfolioId))
      .account
      .findMany({
        include: {
          authConnection: true,
        },
        where: {
          AND: [
            {
              portfolioId: {
                equals: portfolioId,
              },
            },
            {
              OR: metaData.accounts.map(account => ({
                plaidAccountMask: {
                  equals: account.mask,
                },
                name: {
                  equals: account.name,
                },
              })),
            },
          ],
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
          source_userId_portfolioId_externalId: {
            externalId: itemId,
            portfolioId,
            source: AuthSource.PLAID,
            userId,
          },
        },
      })

    // Transfer existing accounts to new link before sync and clean up old link
    if (existingAccounts.length > 0) {
      await this.prismaService
        .$extends(PrismaService.forPortfolio(portfolioId))
        .$transaction(async (trx) => {
          // Move accounts to new link to persist their data
          await trx.account.updateMany({
            data: {
              authConnectionId: plaidAuthConnection.id,
            },
            where: {
              id: {
                in: existingAccounts.map(a => a.id),
              },
            },
          })
          // Update accounts so that external id is set up correctly for upserts
          let plaidAccounts = [...metaData.accounts]
          await Promise.all(
            existingAccounts.map((account) => {
              const plaidAccount = plaidAccounts.find(
                ma =>
                  ma.mask === account.plaidAccountMask
                  && ma.name === account.name,
              )

              if (!plaidAccount) {
                throw new Error(
                  `'Unable to locate plaid account for an existing account when it should exist - mask: ${account.plaidAccountMask}  name: ${account.name}`,
                )
              }
              // remove for next selection in case of duplicates (should never happen but we will fail FK contraints if so)
              plaidAccounts = plaidAccounts.filter(
                a => a.id !== plaidAccount.id,
              )

              return trx.account.update({
                data: {
                  externalId: plaidAccount.id,
                },
                where: {
                  id: account.id,
                },
              })
            }),
          )

          // Delete the plaid connections in plaid
          await Promise.all(
            [...existingAuthConnections.values()].map(auth =>
              this.client
                .itemRemove({
                  access_token: auth?.secret ?? '',
                  client_id: this.configService.get('PLAID_CLIENT_ID'),
                  secret: this.configService.get('PLAID_SECRET_KEY'),
                })
                .catch((error: unknown) => {
                  this.logger.error(error)
                  throw new Error(error as string)
                }),
            ),
          )

          // Delete our records of it
          await trx.authConnection.deleteMany({
            where: {
              id: {
                // @ts-expect-error - this should exist
                in: [...existingAuthConnections.keys()],
              },
            },
          })
        })
    }

    return this.syncPlaidItem({
      plaidAuthConnection,
    })
  }

  async syncPlaidItem({
    plaidAuthConnection,
  }: {
    plaidAuthConnection: AuthConnection
    asReversableOperations?: boolean
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
      this.assertPlaidAccountsExist({
        plaidAccounts: plaidResponse.data.accounts,
        plaidAuthConnection,
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

    const intitialLotMap = new Map<string, Lot>()
    for (const lot of initialLots) {
      intitialLotMap.set(lot.id, lot)
    }

    const { lotTupleMap, newBuys, newSells, newTransactions }
      = PlaidService.lotDataMapFromLotsAndTransactions({
        lots: initialLots,
        transactions,
      })

    let lotResults: LotChange[] = []
    let realizedProfitAndLoss = new Decimal(0)

    try {
      await this.prismaService
        .$extends(PrismaService.forPortfolio(authConnection.portfolioId))
        .log
        .create({
          data: {
            data: JSON.parse(
              JSON.stringify({
                lotTupleMap: Array.from(lotTupleMap.entries()),
                initialLots,
                newTransactions,
                finalPositions,
              }),
            ),
            description: 'Attempting trx merge with lotTupleMap',
            source: AuthSource.PLAID,
            type: LogType.PLAID_TRX_MERGE,
            portfolioId: authConnection.portfolioId,
          },
        })
      lotResults = Array.from(lotTupleMap.entries()).flatMap(
        ([symbol, lotTuples]) => {
          const position = finalPositions.find(p => p.assetSymbol === symbol)
          const targetQuantity = position?.quantity
            ? position.quantity
            : undefined
          const targetValue = position?.costTotal
            ? position.costTotal
            : undefined
          return findLotChangeSets(
            {
              lotsData: lotTuples,
              targetQuantity,
              targetValue,
              symbol,
            },
            authConnection.portfolioId,
          ).lotChanges
        },
      )

      const totalSaleDollars = newSells.reduce((acc, sell) => {
        return acc.plus(sell.amount ?? 0)
      }, new Decimal(0))

      const totalSaleCostBasis = lotResults.reduce((acc, lot) => {
        return acc.plus(lot.quantityChange.mul(lot.price))
      }, new Decimal(0))

      realizedProfitAndLoss = totalSaleDollars.minus(totalSaleCostBasis)
    }
    catch (error) {
      console.error(error)
      await this.prismaService
        .$extends(PrismaService.forPortfolio(authConnection.portfolioId))
        .log
        .create({
          data: {
            data: error as InputJsonValue,
            description: `Trx merge failed with error: ${JSON.stringify(error)}`,
            source: AuthSource.PLAID,
            type: LogType.PLAID_TRX_MERGE_ERROR,
            portfolioId: authConnection.portfolioId,
          },
        })
      throw error
    }

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
              lotResults.filter(result =>
                result.upsert.remainingQty === new Decimal(0),
              ),
            )),
          },
        })

        const lotUpsertResults: Prisma.LotCreateInput[] = lotResults.map(
          (assetResult) => {
            return assetResult.upsert
          },
        )

        // Only upsert lots that have remaining quantity
        const lotsToUpsert = lotUpsertResults.filter(
          upsert => upsert.remainingQty !== new Decimal(0),
        )

        await Promise.all(
          lotsToUpsert.map(upsert =>
            trx.lot.upsert({
              where: {
                id: upsert.id,
              },
              create: upsert,
              update: upsert,
            }),
          ),
        )

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
              data: JSON.parse(JSON.stringify({ lotResults })),
              description: 'Trx merge results',
              source: AuthSource.PLAID,
              type: LogType.PLAID_TRX_MERGE_SUCCESS,
              portfolioId: authConnection.portfolioId,
            },
          }),
          trx.lotChangeLog.createMany({
            data: lotUpsertResults.map((upsert, index) => {
              const isZeroQuantity = upsert.remainingQty === new Decimal(0)
              return {
                lotTransactionBatchId: lotTransactionBatch.id,
                lotId: upsert.id,
                quantityChange: (
                  intitialLotMap.get(upsert.id ?? '')?.remainingQty
                  ?? new Decimal(0)
                ).minus(upsert.remainingQty as Decimal),
                accountId: upsert.account.connect?.id ?? '',
                portfolioId: authConnection.portfolioId,
                lotBefore: intitialLotMap.get(upsert.id ?? ''),
                lotAfter: JSON.parse(JSON.stringify(upsert)),
                operationType: lotResults[index].isNewBuy
                  ? OperationType.create
                  : isZeroQuantity
                    ? OperationType.delete
                    : OperationType.update,
              }
            }),
          }),
        ])
      })
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
      this.assertPlaidAccountsExist({
        plaidAccounts: plaidResponse.data.accounts,
        plaidAuthConnection,
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
        portfolioId: plaidAuthConnection.portfolioId,
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
                    a.externalId
                    === input.account.connect?.provider_externalId?.externalId,
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

  async assertPlaidAccountsExist({
    plaidAccounts,
    plaidAuthConnection,
  }: {
    plaidAccounts: AccountBase[]
    plaidAuthConnection: AuthConnection
  }) {
    return this.prismaService
      .$extends(PrismaService.forPortfolio(plaidAuthConnection.portfolioId))
      .$transaction(
        PlaidService.convertPlaidAccounts({
          plaidAccounts,
          plaidAuthConnection,
        }).map((input) => {
          return this.prismaService.account.upsert({
            create: input,
            update: input,
            where: {
              provider_externalId: {
                externalId: input.externalId!,
                provider: AccountProvider.PLAID,
              },
            },
          })
        }),
      )
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
    portfolioId,
  }: {
    investmentsTransactionsGetResponse: InvestmentsTransactionsGetResponse
    accounts: (Account | Prisma.AccountCreateInput)[]
    portfolioId: string
  }): Prisma.TransactionCreateInput[] {
    const securityMap = new Map<string, string>()
    for (const security of investmentsTransactionsGetResponse.securities) {
      securityMap.set(
        security.security_id,
        security.ticker_symbol ?? 'UNKNOWN',
      )
    }
    return investmentsTransactionsGetResponse.investment_transactions.map(
      (transaction) => {
        const account = accounts.find(
          a => a.externalId === transaction.account_id,
        )
        if (!account) {
          throw new Error(
            'convertPlaidTransactions: Could not find account from upsert.',
          )
        }

        const input: Prisma.TransactionCreateInput = {
          account: {
            connect: {
              provider_externalId: {
                externalId: transaction.account_id,
                provider: AccountProvider.PLAID,
              },
            },
          },
          portfolio: {
            connect: {
              id: portfolioId,
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
