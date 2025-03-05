import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  Account,
  AccountInstitution,
  AccountProvider,
  AuthConnection,
  AuthSource,
  AuthType,
  LogType,
  Prisma,
  User,
} from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import {
  AccountBase,
  Configuration,
  CountryCode,
  PlaidApi,
  Products,
  Security,
} from "plaid";

import { Database } from "../database/database";
import { PrismaService } from "../prisma/prisma.service";
import { PlaidLinkOnSuccessMetadata } from "./plaid.dto";

const plaidTransactionsPerPage = 500;

@Injectable()
export class PlaidService {
  private readonly logger = new Logger(PlaidService.name);
  private readonly client: PlaidApi;
  constructor(
    private readonly configService: ConfigService,
    private readonly db: Database,
    private readonly prismaService: PrismaService,
  ) {
    this.client = new PlaidApi(
      new Configuration({
        baseOptions: {
          headers: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            "PLAID-CLIENT-ID": this.configService.get("PLAID_CLIENT_ID"),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            "PLAID-SECRET": this.configService.get("PLAID_SECRET_KEY"),
          },
        },
        basePath: this.configService.get("PLAID_ENV"),
      }),
    );
  }

  async linkToken({ userId }: { userId: string }) {
    const user = await this.assertUserIsCreatedInPlaid({ userId });

    const response = await this.client.linkTokenCreate({
      client_id: this.configService.get("PLAID_CLIENT_ID"),
      client_name: "TaxHarvest",
      country_codes: [CountryCode.Us],
      // enable_multi_item_link: true,
      language: "en",
      products: [Products.Investments],
      // redirect_uri: `${this.configService.get('CLIENT_ORIGIN')}${this.configService.get('CLIENT_HOME_PAGE_PATH')}`,
      secret: this.configService.get("PLAID_SECRET_KEY"),
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: userId,
        email_address: user.email ?? undefined,
        phone_number: user.phoneNumber ?? undefined,
      },
      // user_token: user.plaidUserToken!,
      webhook: `${this.configService.get<string>("ORIGIN")}/plaid/webhook`,
    });

    return response;
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
    userId: string;
    publicToken: string;
    portfolioId: string;
    metaData: PlaidLinkOnSuccessMetadata;
  }): Promise<Account[]> {
    const existingAccounts = await this.prismaService.account.findMany({
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
              plaidAccountName: {
                equals: account.name,
              },
            })),
          },
        ],
      },
    });

    const existingAuthConnections = new Map(
      existingAccounts.map(a => [a.authConnectionId, a.authConnection]),
    );

    const allExistingAccountsForAuthConnections =
      await this.prismaService.account.findMany({
        where: {
          authConnectionId: {
            in: [...existingAuthConnections.keys()],
          },
          portfolioId: {
            equals: portfolioId,
          },
        },
      });

    // Ensure the new connection has every existing account for the existing connections
    // this means we can delete the old one and use the new without account losss
    const noDanglingAccounts = allExistingAccountsForAuthConnections.every(
      existingAuthAccount =>
        // eslint-disable-next-line unicorn/prefer-array-some
        existingAccounts.find(a => a.id === existingAuthAccount.id) !==
        undefined,
    );

    if (!noDanglingAccounts) {
      throw new Error(
        "New Plaid link coveres existing account links but not all.",
      );
    }

    const response = await this.client.itemPublicTokenExchange({
      public_token: publicToken,
    });

    // These values should be saved to a persistent database and
    // associated with the currently signed-in user
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

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
    };

    const plaidAuthConnection = await this.prismaService.authConnection.upsert({
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
    });

    // Transfer existing accounts to new link before sync and clean up old link
    if (existingAccounts.length > 0) {
      await this.prismaService.$transaction(async trx => {
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
        });
        // Update accounts so that external id is set up correctly for upserts
        let plaidAccounts = [...metaData.accounts];
        await Promise.all(
          existingAccounts.map(account => {
            const plaidAccount = plaidAccounts.find(
              ma =>
                ma.mask === account.plaidAccountMask &&
                ma.name === account.plaidAccountName,
            );

            if (!plaidAccount) {
              throw new Error(
                `'Unable to locate plaid account for an existing account when it should exist - mask: ${account.plaidAccountMask}  name: ${account.plaidAccountName}`,
              );
            }
            // remove for next selection in case of duplicates (should never happen but we will fail FK contraints if so)
            plaidAccounts = plaidAccounts.filter(a => a.id !== plaidAccount.id);

            return trx.account.update({
              data: {
                externalId: plaidAccount.id,
              },
              where: {
                id: account.id,
              },
            });
          }),
        );

        // Delete the plaid connections in plaid
        await Promise.all(
          [...existingAuthConnections.values()].map(auth =>
            this.client
              .itemRemove({
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                access_token: auth.secret!,
                client_id: this.configService.get("PLAID_CLIENT_ID"),
                secret: this.configService.get("PLAID_SECRET_KEY"),
              })
              .catch((error: unknown) => {
                this.logger.error(error);
                throw new Error(error as string);
              }),
          ),
        );

        // Delete our records of it
        await trx.authConnection.deleteMany({
          where: {
            id: {
              in: [...existingAuthConnections.keys()],
            },
          },
        });
      });
    }

    return this.syncPlaidItem({
      plaidAuthConnection,
    });
  }

  async syncPlaidItem({
    plaidAuthConnection,
  }: {
    plaidAuthConnection: AuthConnection;
  }): Promise<Account[]> {
    if (plaidAuthConnection.type !== AuthType.PLAID_LINK) {
      throw new Error("This is not a plaid auth connection");
    }
    if (!plaidAuthConnection.secret) {
      throw new Error("Missing access token.");
    }

    const plaidResponse = await this.client
      .investmentsHoldingsGet({
        access_token: plaidAuthConnection.secret,
        client_id: this.configService.get("PLAID_CLIENT_ID"),
        secret: this.configService.get("PLAID_SECRET_KEY"),
      })
      .catch(async (error: unknown) => {
        await this.prismaService.log.create({
          data: {
            data: error as InputJsonValue,
            description: "/investmentsHoldingsGet",
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            responseStatus: (error as { status: number }).status,
            source: AuthSource.PLAID,
            type: LogType.EXTERNAL_SYNC,
          },
        });
        throw new Error("Sync failed.");
      });

    // Set up create of positions
    const [accounts, assets] = await Promise.all([
      this.assertPlaidAccountsExist({
        plaidAccounts: plaidResponse.data.accounts,
        plaidAuthConnection,
      }),
      this.assertPlaidSecuritiesExist({
        securities: plaidResponse.data.securities,
      }),
      this.prismaService.log.create({
        data: {
          data: plaidResponse.data as unknown as InputJsonValue,
          description: "/investmentsHoldingsGet",
          responseStatus: plaidResponse.status,
          source: AuthSource.PLAID,
          type: LogType.EXTERNAL_SYNC,
        },
      }),
    ]);

    // Remove all the positions we are syncing (cant know which have been deleted or not)
    // Then create them
    await Promise.all([
      this.prismaService.$transaction([
        this.prismaService.position.deleteMany({
          where: {
            account: {
              authConnectionId: {
                in: accounts.map(a => a.authConnectionId),
              },
            },
          },
        }),
        this.prismaService.position.createMany({
          data: plaidResponse.data.holdings.map(holding => {
            const account = accounts.find(
              account => account.externalId === holding.account_id,
            );

            if (!account) {
              throw new Error("Could not find account from upsert.");
            }
            return {
              accountId: account.id,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              assetSymbol: assets.find(
                ticker => ticker.plaid_security_id === holding.security_id,
              )!.symbol,
              costTotal: holding.cost_basis,
              marketValue: holding.institution_value,
              pricePaid: holding.cost_basis,
              quantity: holding.quantity,
            };
          }),
        }),
      ]),
      this.syncPlaidTransactions({
        plaidAuthConnection,
      }),
    ]);

    return accounts;
  }

  async assertUserIsCreatedInPlaid({
    userId,
  }: {
    userId: string;
  }): Promise<User> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    if (!user.plaidUserToken) {
      const plaidUser = await this.plaidCreateUser({
        userId: user.id,
      });
      return this.prismaService.user.update({
        data: {
          plaidCustomerId: plaidUser.data.user_id,
          plaidUserToken: plaidUser.data.user_token,
        },
        where: {
          id: user.id,
        },
      });
    }
    return user;
  }

  async plaidCreateUser({ userId }: { userId: string }) {
    return this.client
      .userCreate({
        client_id: this.configService.get("PLAID_CLIENT_ID"),
        client_user_id: userId,
        secret: this.configService.get("PLAID_SECRET_KEY"),
      })
      .catch((error: unknown) => {
        this.logger.error({
          "Plaid Error": (error as { response: { data: unknown } }).response
            .data,
        });
        // This errros when the user already exists - there doesnt seem to be an API for getting a userId...
        // so going to assume this never fails
        return {
          data: {
            user_id: "NOT FOUND",
            user_token: "NOT FOUND",
          },
        };
      });
  }

  async syncPlaidTransactions({
    endDate,
    page = 1,
    plaidAuthConnection,
    startDate,
  }: {
    plaidAuthConnection: AuthConnection;
    startDate?: Date;
    endDate?: Date; // the later date (i,e today)
    page?: number;
  }) {
    if (!plaidAuthConnection.secret) {
      throw new Error("Missing plaid access token for auth connection.");
    }

    const end_date = endDate ?? new Date();

    const plaidResponse = await this.client.investmentsTransactionsGet({
      access_token: plaidAuthConnection.secret,
      client_id: this.configService.get("PLAID_CLIENT_ID"),
      end_date: new Intl.DateTimeFormat("en-CA").format(end_date),
      options: {
        count: plaidTransactionsPerPage,
        offset: (page - 1) * plaidTransactionsPerPage,
      },
      secret: this.configService.get("PLAID_SECRET_KEY"),
      start_date: new Intl.DateTimeFormat("en-CA").format(
        startDate ?? new Date().setFullYear(end_date.getFullYear() - 2),
      ),
    });

    // Set up the upsert
    const [accounts] = await Promise.all([
      this.assertPlaidAccountsExist({
        plaidAccounts: plaidResponse.data.accounts,
        plaidAuthConnection,
      }),
      this.assertPlaidSecuritiesExist({
        securities: plaidResponse.data.securities,
      }),
      this.prismaService.log.create({
        data: {
          data: plaidResponse.data as unknown as InputJsonValue,
          description: "/investmentsTransactionsGet",
          responseStatus: plaidResponse.status,
          source: AuthSource.PLAID,
          type: LogType.EXTERNAL_SYNC,
        },
      }),
    ]);

    const lastTransOfPage = plaidResponse.data.investment_transactions.at(-1);

    // Only fetch more pages if the last transaction of the current page is not already in the DB
    const currentTransactionsAreNew =
      !(await this.prismaService.transaction.findUnique({
        where: {
          accountId_externalId: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            accountId: accounts.find(
              a => a.externalId === lastTransOfPage?.account_id,
            )!.id,
            externalId: lastTransOfPage?.investment_transaction_id ?? "",
          },
        },
      }));

    // If these are new transactioins and the page is full we need to fetch more pages
    // We only await the first page call for the user flow
    if (
      currentTransactionsAreNew &&
      plaidResponse.data.investment_transactions.length >=
        plaidTransactionsPerPage
    ) {
      void this.syncPlaidTransactions({
        endDate,
        page: page + 1,
        plaidAuthConnection,
        startDate,
      });
    }

    return Promise.all(
      plaidResponse.data.investment_transactions.map(transaction => {
        const input: Prisma.TransactionCreateInput = {
          account: {
            connect: {
              provider_externalId: {
                externalId: transaction.account_id,
                provider: AccountProvider.PLAID,
              },
            },
          },
          amount: transaction.amount,
          asset: {
            connect: {
              symbol: "UNKNOWN",
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
        };
        return this.prismaService.transaction.upsert({
          create: input,
          update: input,
          where: {
            accountId_externalId: {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              accountId: accounts.find(
                a => a.externalId === transaction.account_id,
              )!.id,
              externalId: transaction.investment_transaction_id,
            },
          },
        });
      }),
    );
  }

  async assertPlaidSecuritiesExist({ securities }: { securities: Security[] }) {
    return Promise.all(
      securities
        .filter(
          security =>
            security.ticker_symbol ??
            security.name ??
            security.market_identifier_code,
        )
        .map(security => {
          const symbol =
            security.ticker_symbol ??
            security.name ??
            security.market_identifier_code;
          // Only upsert minimum here - polygon should be source of other data
          const input: Prisma.AssetCreateInput = {
            plaid_security_id: security.security_id,
            symbol: symbol ?? "",
            type: security.type ?? undefined,
          };
          return this.prismaService.asset.upsert({
            create: input,
            update: input,
            where: {
              symbol: symbol ?? "",
            },
          });
        }),
    );
  }

  async assertPlaidAccountsExist({
    plaidAccounts,
    plaidAuthConnection,
  }: {
    plaidAccounts: AccountBase[];
    plaidAuthConnection: AuthConnection;
  }) {
    return this.prismaService.$transaction(
      plaidAccounts.map(plaidAccount => {
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
          displayName: plaidAccount.name,
          // !IMPORTANT - This changes if you reauth to the same account - we never weant to be recreating links to an account in a portfolio
          externalId: plaidAccount.account_id,
          institution: AccountInstitution.BROKERAGE,
          plaidAccountMask: plaidAccount.mask,
          plaidAccountName: plaidAccount.name,
          portfolio: {
            connect: {
              id: plaidAuthConnection.portfolioId,
            },
          },
          provider: AccountProvider.PLAID,
          subType: plaidAccount.subtype,
          type: plaidAccount.type,
        };
        return this.prismaService.account.upsert({
          create: upsertAccount,
          update: upsertAccount,
          where: {
            provider_externalId: {
              externalId: plaidAccount.account_id,
              provider: AccountProvider.PLAID,
            },
          },
        });
      }),
    );
  }
}
