import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
	type Account,
	AccountInstitution,
	AccountProvider,
	type AuthConnection,
	AuthSource,
	AuthType,
	LogType,
	MergeErrorType,
	OperationType,
	type Prisma,
	type User,
} from '@prisma/client';
import type { InputJsonValue } from '@prisma/client/runtime/library';
import Decimal from 'decimal.js';
import { Insertable, Selectable } from 'kysely';
import {
	type AccountBase,
	Configuration,
	CountryCode,
	type Holding,
	type InvestmentsHoldingsGetResponse,
	type InvestmentsTransactionsGetResponse,
	type LinkTokenCreateRequest,
	PlaidApi,
	Products,
	type Security,
} from 'plaid';
import { Database, executeWithRLS } from '~/database/database';
import type {
	Lot as KyselyLot,
	Position as KyselyPosition,
	Transaction as KyselyTransaction,
	TransactionOnLotMerge,
} from '~/database/db.d';
import { AccountsSyncedEvent } from '~/events/accounts-synced';
import { EventId } from '~/events/event-id';
import { PrismaService } from '../prisma/prisma.service';
import { TimeMethod } from '../utilities/time-method';
import {
	organizeAssets,
	ResolvedLotChange,
	resolveLotChange,
} from './lot-application/lot-application';
import type { PlaidLinkOnSuccessMetadata, PlaidWebhook } from './plaid.dto';
import { taxAdvantadedSubTypes } from './plaid.utils';

const plaidTransactionsPerPage = 500;

/**
 * Process an array in batches with sequential batch processing
 * @param items Array of items to process
 * @param batchSize Size of each batch
 * @param processor Function to process each item
 * @returns Promise that resolves when all batches are processed
 * @example
 * await processBatch(items, 10, async (item) => {
 *   await processItem(item)
 * })
 */
async function processBatch<T, R>(
	items: T[],
	batchSize: number,
	processor: (item: T) => Promise<R>,
): Promise<R[]> {
	const results: R[] = [];

	for (let i = 0; i < items.length; i += batchSize) {
		const batch = items.slice(i, i + batchSize);
		const batchResults = await Promise.all(batch.map(processor));
		results.push(...batchResults);
	}

	return results;
}

@Injectable()
export class PlaidService {
	private readonly logger = new Logger(PlaidService.name);
	private readonly client: PlaidApi;
	private readonly dbBatchSize: number;

	constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
		private eventEmitter: EventEmitter2,
		readonly db: Database,
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
		);
		// Default to 5 for connection pool limit
		this.dbBatchSize = this.configService.get<number>('DB_BATCH_SIZE') ?? 5;
		this.logger.log(`Database batch size set to: ${this.dbBatchSize}`);
	}

	async linkToken({
		userId,
		portfolioId,
		authConnectionId,
	}: {
		userId: string;
		portfolioId: string;
		authConnectionId?: string;
	}) {
		const user = await this.assertUserIsCreatedInPlaid({ userId, portfolioId });

		const baseLinkTokenCreate: LinkTokenCreateRequest = {
			client_id: this.configService.get('PLAID_CLIENT_ID'),
			client_name: 'TaxHarvest',
			country_codes: [CountryCode.Us],
			enable_multi_item_link:
				!!user.plaidUserToken && user.plaidUserToken !== 'NOT_FOUND',
			language: 'en',
			products: [Products.Investments],
			user_token:
				user.plaidUserToken && user.plaidUserToken !== 'NOT_FOUND'
					? user.plaidUserToken
					: undefined,
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
		};

		if (authConnectionId) {
			// update mode does not support multi item link
			delete baseLinkTokenCreate.enable_multi_item_link;
			// We want to open plaid link as update if user already has one for portfolio
			const existingAuthConnection = await this.prismaService
				.rlsPortfolioClient(portfolioId)
				.authConnection.findUniqueOrThrow({
					where: {
						id: authConnectionId,
					},
				});

			this.logger.log(
				`Updating existing plaid link. existingAuthConnectionId: ${existingAuthConnection.id}`,
			);
			baseLinkTokenCreate.access_token = existingAuthConnection.secret;
			baseLinkTokenCreate.update = {
				account_selection_enabled: true,
			};
		}

		const response = await this.client.linkTokenCreate(baseLinkTokenCreate);

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
		existingAccountId,
	}: {
		userId: string;
		publicToken: string;
		portfolioId: string;
		metaData: PlaidLinkOnSuccessMetadata;
		existingAccountId?: string;
	}): Promise<Account[]> {
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
			plaidInstitutionId: metaData.institution?.institution_id,
			user: {
				connect: {
					id: userId,
				},
			},
		};

		// Remove old Plaid items if we have existing auth connections that will be replaced
		// if (existingAuthConnections.size > 0) {
		//   const oldAuthConnectionsToRemove = [...existingAuthConnections.values()]
		//     .filter(authConn => authConn && authConn.secret)

		//   for (const oldAuthConnection of oldAuthConnectionsToRemove) {
		//     if (oldAuthConnection?.secret) {
		//       try {
		//         await this.removeItem(oldAuthConnection.secret)
		//         this.logger.log(`Removed old Plaid item for auth connection: ${oldAuthConnection.id}`)
		//       }
		//       catch (error) {
		//         this.logger.warn(`Failed to remove old Plaid item for auth connection ${oldAuthConnection.id}:`, error)
		//         // Continue processing even if removal fails
		//       }
		//     }
		//   }
		// }

		const plaidAuthConnection = await this.prismaService
			.rlsPortfolioClient(portfolioId)
			.authConnection.upsert({
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
			});

		return this.syncPlaidItem({
			plaidAuthConnection,
			existingAccountId,
		});
	}

	@TimeMethod()
	async syncPlaidItem({
		plaidAuthConnection,
		existingAccountId,
	}: {
		plaidAuthConnection: AuthConnection;
		asReversableOperations?: boolean;
		existingAccountId?: string;
	}): Promise<Account[]> {
		this.logger.log(`Syncing Plaid item: ${plaidAuthConnection.id}`);
		if (plaidAuthConnection.type !== AuthType.PLAID_LINK) {
			throw new Error('This is not a plaid auth connection');
		}
		if (!plaidAuthConnection.secret) {
			throw new Error('Missing access token.');
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
					.log.create({
						data: {
							data: error as InputJsonValue,
							description: '/investmentsHoldingsGet',
							responseStatus: (error as { status: number }).status,
							source: AuthSource.PLAID,
							type: LogType.EXTERNAL_SYNC,
							portfolioId: plaidAuthConnection.portfolioId,
						},
					});
				throw new Error('Sync failed.');
			});

		// Set up create of positions
		// Run these sequentially to avoid connection pool exhaustion
		const accounts = await this.resetPlaidAccounts({
			plaidAccounts: plaidResponse.data.accounts,
			plaidAuthConnection,
			existingAccountId,
		});

		await this.assertPlaidSecuritiesExist({
			securities: plaidResponse.data.securities,
			portfolioId: plaidAuthConnection.portfolioId,
		});

		await this.prismaService
			.rlsPortfolioClient(plaidAuthConnection.portfolioId)
			.log.create({
				data: {
					data: plaidResponse.data as unknown as InputJsonValue,
					description: '/investmentsHoldingsGet',
					responseStatus: plaidResponse.status,
					source: AuthSource.PLAID,
					type: LogType.EXTERNAL_SYNC,
					portfolioId: plaidAuthConnection.portfolioId,
				},
			});

		// Remove all the positions we are syncing (cant know which have been deleted or not)
		// Then create them - return the created positions and the unapplied transactions

		await this.prismaService
			.rlsPortfolioClient(plaidAuthConnection.portfolioId)
			.$transaction(async (trx) => {
				await trx.position.deleteMany({
					where: {
						account: {
							authConnectionId: {
								in: accounts.map((a) => a.authConnectionId ?? ''),
							},
						},
					},
				});

				return trx.position.createMany({
					data: PlaidService.convertPlaidHoldings({
						holdingsResponse: plaidResponse.data,
						accounts,
						portfolioId: plaidAuthConnection.portfolioId,
					}),
				});
			});

		await this.syncPlaidTransactions({
			plaidAuthConnection,
		});

		for (const account of accounts) {
			// Now we attempt to process the unapplied transactions based on initialLots and initialPositions
			await this.applyNewPlaidTransactions({
				accountId: account.id,
				portfolioId: plaidAuthConnection.portfolioId,
			});
		}

		return accounts;
	}

	async applyNewPlaidTransactions({
		accountId,
		portfolioId,
	}: {
		accountId: string;
		portfolioId: string;
	}): Promise<void> {
		this.logger.log(`Applying new transactions for account: ${accountId}`);
		const [finalPositions, initialLots, transactions] = await Promise.all([
			executeWithRLS(this.db, portfolioId, (trx) =>
				trx
					.selectFrom('Position')
					.where('accountId', '=', accountId)
					.selectAll()
					.execute(),
			),
			executeWithRLS(this.db, portfolioId, (trx) =>
				trx
					.selectFrom('Lot')
					.where('accountId', '=', accountId)
					.selectAll()
					.execute(),
			),
			executeWithRLS(this.db, portfolioId, (trx) =>
				trx
					.selectFrom('Transaction')
					.where('accountId', '=', accountId)
					.where('appliedToLots', '=', false)
					.orderBy('transactionDate', 'desc')
					.selectAll()
					.execute(),
			),
		]);

		const resolveLotsInput = {
			finalPositions,
			transactions,
			initialLots,
			portfolioId,
		};

		const resolvedLotChanges = PlaidService.resolveLots(resolveLotsInput);

		// Create the top level plaid merge
		const plaidMerge = await executeWithRLS(this.db, portfolioId, (trx) =>
			trx
				.insertInto('PlaidMerge')
				.values({
					portfolioId,
					accountId,
					resolveLotsInput: JSON.stringify(resolveLotsInput),
				})
				.returning('id')
				.executeTakeFirstOrThrow(),
		);

		// Process each of the asset changes
		for (const resolvedLotChange of resolvedLotChanges) {
			await executeWithRLS(this.db, portfolioId, async (trx) => {
				// Insert the merge attempt record
				const lotMerge = await trx
					.insertInto('LotMerge')
					.values({
						portfolioId,
						accountId,
						plaidMergeId: plaidMerge.id,
						assetSymbol: resolvedLotChange.position.assetSymbol,
						targetValue: resolvedLotChange.position.costTotal
							? resolvedLotChange.position.costTotal.toString()
							: null,
						targetQuantity: resolvedLotChange.position.quantity
							? resolvedLotChange.position.quantity.toString()
							: null,
						targetPositionSnapshot: JSON.stringify(resolvedLotChange.position),
						lotData: JSON.stringify(resolvedLotChange.lotData),
						resolvedLotChange: JSON.stringify(resolvedLotChange),
					})
					.returning('id')
					.executeTakeFirstOrThrow();

				// Insert transaction relations
				const transactions: Insertable<TransactionOnLotMerge>[] = [
					...resolvedLotChange.transactionBuys,
					...resolvedLotChange.transactionSells,
				].map((transaction) => ({
					portfolioId,
					accountId,
					transactionId: transaction.id,
					lotMergeId: lotMerge.id,
				}));
				if (transactions.length > 0) {
					await trx
						.insertInto('TransactionOnLotMerge')
						.values(transactions)
						.execute();
				}
				// Insert the result
				const resolvedLotMerge = await trx
					.insertInto('ResolvedLotMerge')
					.values({
						lotMergeId: lotMerge.id,
						lotChanges: JSON.stringify(resolvedLotChange.lotChanges),
						chosenLotChange: resolvedLotChange.chosenLotChange
							? JSON.stringify(resolvedLotChange.chosenLotChange)
							: null,
						error: resolvedLotChange.error
							? JSON.stringify(resolvedLotChange.error)
							: null,
						realizedProfitAndLossShortTerm:
							resolvedLotChange.realizedProfitAndLossShortTerm.toString(),
						realizedProfitAndLossLongTerm:
							resolvedLotChange.realizedProfitAndLossLongTerm.toString(),
						accountId,
						portfolioId,
					})
					.returning('id')
					.executeTakeFirstOrThrow();

				// Handle multiple lot changes error if we found more than 1 solution
				if (resolvedLotChange.lotChanges.length > 1) {
					await trx
						.insertInto('MergeError')
						.values({
							type: MergeErrorType.PLAID_MULTI_LOT_SOLUTION,
							portfolioId,
							assetSymbol: resolvedLotChange.position.assetSymbol,
							lotsData: JSON.stringify(resolvedLotChange.lotData),
							targetValue: resolvedLotChange.position.costTotal?.toString(),
							targetQuantity: resolvedLotChange.position.quantity.toString(),
							accountId,
						})
						.executeTakeFirstOrThrow();
				}

				if (resolvedLotChange.error) {
					// Handle any unknown errors
					await trx
						.insertInto('MergeError')
						.values({
							type: MergeErrorType.UNKNOWN,
							portfolioId,
							assetSymbol: resolvedLotChange.position.assetSymbol,
							lotsData: JSON.stringify(resolvedLotChange.lotData),
							targetValue: resolvedLotChange.position.costTotal?.toString(),
							targetQuantity: resolvedLotChange.position.quantity.toString(),
							accountId,
						})
						.executeTakeFirstOrThrow();
				} else if (!resolvedLotChange.chosenLotChange) {
					// Handle no solution found
					await trx
						.insertInto('MergeError')
						.values({
							type: MergeErrorType.PLAID_NO_SOLUTION,
							portfolioId,
							assetSymbol: resolvedLotChange.position.assetSymbol,
							lotsData: JSON.stringify(resolvedLotChange.lotData),
							targetValue: resolvedLotChange.position.costTotal?.toString(),
							targetQuantity: resolvedLotChange.position.quantity.toString(),
							accountId,
						})
						.executeTakeFirstOrThrow();
				} else {
					// We successfully found a lot change! Insert the changes and apply the result to the portfolio
					// Insert the lot changes
					await trx
						.insertInto('LotChange')
						.values(
							resolvedLotChange.chosenLotChange.map((lotChange) => ({
								accountId,
								portfolioId,
								resolvedLotMergeId: resolvedLotMerge.id,
								assetSymbol: resolvedLotChange.position.assetSymbol,
								quantityFinal: lotChange.quantityFinal.toString(),
								quantityChange: lotChange.quantityChange.toString(),
								shouldDelete: lotChange.shouldDelete,
								upsert: JSON.stringify(lotChange.upsert),
								operationType: lotChange.shouldDelete
									? OperationType.delete
									: OperationType.upsert,
							})),
						)
						.execute();

					// Upsert the lots
					const upserts = resolvedLotChange.chosenLotChange
						.filter((change) => !change.shouldDelete)
						.map((lotChange) => lotChange.upsert);
					if (upserts.length > 0) {
						await trx
							.insertInto('Lot')
							.values(upserts)
							.onConflict((oc) =>
								oc.columns(['id']).doUpdateSet({
									remainingQty: (eb) => eb.ref('excluded.remainingQty'),
								}),
							)
							.execute();
					}
					// Delete the lots with none left
					const deletes = resolvedLotChange.chosenLotChange
						.filter((change) => change.shouldDelete)
						.map((lotChange) => lotChange.lotId);
					if (deletes.length > 0) {
						await trx
							.deleteFrom('Lot')
							.where('id', 'in', deletes)
							.where('accountId', '=', accountId)
							.where('portfolioId', '=', portfolioId)
							.execute();
					}

					// Update the account
					const currentYear = new Date().getFullYear();
					const currentProfitAndLoss = await trx
						.selectFrom('RealizedPAndL')
						.where('accountId', '=', accountId)
						.where('year', '=', currentYear)
						.selectAll()
						.executeTakeFirst();

					await trx
						.insertInto('RealizedPAndL')
						.values({
							accountId,
							portfolioId,
							year: currentYear,
							shortTerm: new Decimal(currentProfitAndLoss?.shortTerm ?? '0')
								.plus(resolvedLotChange.realizedProfitAndLossShortTerm)
								.toString(),
							longTerm: new Decimal(currentProfitAndLoss?.longTerm ?? '0')
								.plus(resolvedLotChange.realizedProfitAndLossLongTerm)
								.toString(),
						})
						.onConflict((oc) =>
							oc.columns(['accountId', 'year']).doUpdateSet({
								shortTerm: (eb) => eb.ref('excluded.shortTerm'),
								longTerm: (eb) => eb.ref('excluded.longTerm'),
							}),
						)
						.execute();

					// Mark the transactions as applied to lots
					await trx
						.updateTable('Transaction')
						.set({
							appliedToLots: true,
						})
						.where('accountId', '=', accountId)
						.where('id', 'in', [
							...resolvedLotChange.transactionBuys.map(
								(transaction) => transaction.id,
							),
							...resolvedLotChange.transactionSells.map(
								(transaction) => transaction.id,
							),
						])
						.execute();
				}
			});
		}
		// Once done produce an event of the successful accounts
		this.eventEmitter.emit(
			EventId.ACCOUNTS_SYNCED,
			new AccountsSyncedEvent(portfolioId, [accountId]),
		);
	}

	/**
	 *
	 * @param input
	 * @param input.portfolioId - Portfolio id
	 * @param input.initialLots - Initial lots (the ucrrent state of the portfolio)
	 * @param input.finalPositions - End state positions we are geting from plaid that we need to figure out how to get to
	 * @param input.transactions - New transactions we are getting from plaid that we need to apply to the lots
	 * (we apply the buys we see then use our algo to determine sales as we need to figure out cost basis which plaid does not have)
	 */
	static resolveLots({
		finalPositions,
		transactions,
		initialLots,
	}: {
		finalPositions: Selectable<KyselyPosition>[];
		transactions: Selectable<KyselyTransaction>[];
		initialLots: Selectable<KyselyLot>[];
		portfolioId: string;
	}): ResolvedLotChange[] {
		/**
		 * Organize lots and new transactions into a lotTupleMap which is unique Asset sympbol -> list of lots for that asset
		 */
		const assetLots = organizeAssets({
			lots: initialLots,
			transactions,
			finalPositions,
		});

		// Attempt to generate the change set for each asset in the lotTupleMap
		return Array.from(assetLots.entries()).map(([_symbol, data]) => {
			return resolveLotChange(data);
		});
	}

	async assertUserIsCreatedInPlaid({
		userId,
		portfolioId,
	}: {
		userId: string;
		portfolioId: string;
	}): Promise<User> {
		const user = await this.prismaService
			.rlsPortfolioClient(portfolioId)
			.user.findUniqueOrThrow({
				where: {
					id: userId,
				},
			});

		if (!user.plaidUserToken) {
			const plaidUser = await this.plaidCreateUser({
				userId: user.id,
			});
			return this.prismaService.rlsPortfolioClient(portfolioId).user.update({
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
				client_id: this.configService.get('PLAID_CLIENT_ID'),
				client_user_id: userId,
				secret: this.configService.get('PLAID_SECRET_KEY'),
			})
			.catch((error: unknown) => {
				this.logger.error({
					'Plaid Error': (error as { response: { data: unknown } }).response
						.data,
				});
				// This errros when the user already exists - there doesnt seem to be an API for getting a userId...
				// so going to assume this never fails
				return {
					data: {
						user_id: 'NOT_FOUND',
						user_token: 'NOT_FOUND',
					},
				};
			});
	}

	async mostRecentTransaction({
		authConnectionId,
	}: {
		authConnectionId: string;
	}) {
		return this.prismaService
			.$extends(PrismaService.forPortfolio(authConnectionId))
			.transaction.findFirst({
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
			});
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
		plaidAuthConnection: AuthConnection;
		startDate?: Date;
		endDate?: Date; // the later date (i,e today)
		page?: number;
	}): Promise<void> {
		if (!plaidAuthConnection.secret) {
			throw new Error('Missing plaid access token for auth connection.');
		}

		const end_date = endDate ?? new Date();

		// Only need to get from most recent transaction if we are not providing a start date
		const mostRecentTransaction = await this.mostRecentTransaction({
			authConnectionId: plaidAuthConnection.id,
		});

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
		});

		this.logger.log(
			`Plaid transactions length: ${plaidResponse.data.investment_transactions.length}`,
		);

		// Set up the upsert
		await this.assertPlaidSecuritiesExist({
			securities: plaidResponse.data.securities,
			portfolioId: plaidAuthConnection.portfolioId,
		});

		await this.prismaService
			.$extends(PrismaService.forPortfolio(plaidAuthConnection.portfolioId))
			.log.create({
				data: {
					data: plaidResponse.data as unknown as InputJsonValue,
					description: '/investmentsTransactionsGet',
					responseStatus: plaidResponse.status,
					source: AuthSource.PLAID,
					type: LogType.EXTERNAL_SYNC,
					portfolioId: plaidAuthConnection.portfolioId,
				},
			});

		const accounts = await this.prismaService
			.$extends(PrismaService.forPortfolio(plaidAuthConnection.portfolioId))
			.account.findMany({
				where: {
					externalId: {
						in: plaidResponse.data.accounts.map((a) => a.account_id ?? ''),
					},
				},
			});

		const lastTransOfPage = plaidResponse.data.investment_transactions.at(-1);

		// Only fetch more pages if the last transaction of the current page is not already in the DB
		const currentTransactionsAreNew = !(await this.prismaService
			.$extends(PrismaService.forPortfolio(plaidAuthConnection.portfolioId))
			.transaction.findUnique({
				where: {
					accountId_externalId: {
						// biome-ignore lint/style/noNonNullAssertion: <ok>
						accountId: accounts.find(
							(a) => a.externalId === lastTransOfPage?.account_id,
						)?.id!,
						externalId: lastTransOfPage?.investment_transaction_id ?? '',
					},
				},
			}));

		const transactionsToUpsert = PlaidService.convertPlaidTransactions({
			investmentsTransactionsGetResponse: plaidResponse.data,
			accounts,
			plaidAuthConnection,
		});

		await processBatch(
			transactionsToUpsert,
			this.dbBatchSize,
			async (input) => {
				return this.prismaService
					.$extends(PrismaService.forPortfolio(plaidAuthConnection.portfolioId))
					.transaction.upsert({
						create: input,
						update: input,
						where: {
							accountId_externalId: {
								// biome-ignore lint/style/noNonNullAssertion: <ok>
								accountId: accounts.find(
									(a) =>
										a.plaidAccountMask ===
											input.account.connect
												?.authConnectionId_plaidAccountMask_type
												?.plaidAccountMask &&
										a.type ===
											input.account.connect
												?.authConnectionId_plaidAccountMask_type?.type,
								)?.id!,
								externalId: input.externalId,
							},
						},
					});
			},
		);

		// If these are new transactions and the page is full we need to fetch more pages
		if (
			currentTransactionsAreNew &&
			plaidResponse.data.investment_transactions.length >=
				plaidTransactionsPerPage
		) {
			await this.syncPlaidTransactions({
				endDate,
				page: page + 1,
				plaidAuthConnection,
				startDate,
			});
		}
	}

	async assertPlaidSecuritiesExist({
		securities,
		portfolioId,
	}: {
		securities: Security[];
		portfolioId: string;
	}) {
		const assetsToUpsert = PlaidService.convertPlaidAssets({
			securities: securities.filter(
				(security) =>
					security.ticker_symbol ??
					security.name ??
					security.market_identifier_code,
			),
		});

		return processBatch(assetsToUpsert, this.dbBatchSize, async (input) => {
			return this.prismaService.rlsPortfolioClient(portfolioId).asset.upsert({
				create: input,
				update: input,
				where: {
					symbol: input.symbol,
				},
			});
		});
	}

	async resetPlaidAccounts({
		plaidAccounts,
		plaidAuthConnection,
		existingAccountId,
	}: {
		plaidAccounts: AccountBase[];
		plaidAuthConnection: AuthConnection;
		existingAccountId?: string;
	}): Promise<Account[]> {
		const accounts = PlaidService.convertPlaidAccounts({
			plaidAccounts,
			plaidAuthConnection,
		});
		return this.prismaService
			.$extends(PrismaService.forPortfolio(plaidAuthConnection.portfolioId))
			.$transaction(async (trx) => {
				const upsertedAccounts = [];
				for (let i = 0; i < accounts.length; i++) {
					const input = accounts[i];
					// Not pretty but we want to tie the account created in the upload file step to one of the linekd ones
					// existingAccountId is th eone that came from the onbaording flow of uploading a csv file
					if (
						existingAccountId &&
						i === 0 &&
						(await trx.account.findUnique({
							where: { id: existingAccountId },
						}))
					) {
						const account = await trx.account.update({
							where: { id: existingAccountId },
							data: input,
						});
						upsertedAccounts.push(account);
					} else {
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
						});
						upsertedAccounts.push(account);
					}
				}

				return upsertedAccounts;
			});
	}

	private async handleHoldingsUpdate(webhookData: PlaidWebhook): Promise<void> {
		const authConnection = await this.prismaService
			.$extends(PrismaService.bypassRLS())
			.authConnection.findUniqueOrThrow({
				where: { externalId: webhookData.item_id },
				include: {
					accounts: {
						select: {
							lotSeededDate: true,
						},
					},
				},
			});
		await this.prismaService
			.$extends(PrismaService.forPortfolio(authConnection.portfolioId))
			.log.create({
				data: {
					data: webhookData as unknown as InputJsonValue,
					description: `/${webhookData.webhook_code}`,
					source: AuthSource.PLAID,
					type: LogType.PLAID_WEBHOOK,
					portfolioId: authConnection.portfolioId,
				},
			});
		switch (webhookData.webhook_code) {
			case 'DEFAULT_UPDATE': {
				this.logger.log('Processing Plaid holdings DEFAULT_UPDATE');

				await this.syncPlaidItem({
					plaidAuthConnection: authConnection,
				});

				break;
			}
			default: {
				this.logger.warn(`Unhandled webhook code: ${webhookData.webhook_code}`);
			}
		}
	}

	async processWebhook(webhookData: PlaidWebhook): Promise<void> {
		switch (webhookData.webhook_type) {
			case 'HOLDINGS': {
				this.logger.log('Processing Plaid holdings update');
				await this.handleHoldingsUpdate(webhookData);
				break;
			}
			default: {
				this.logger.error(
					`Unhandled webhook type: ${webhookData.webhook_type}`,
				);
			}
		}
	}

	static convertPlaidAssets({
		securities,
	}: {
		securities: Security[];
	}): Prisma.AssetCreateInput[] {
		return securities.map((security) => {
			const symbol =
				security.ticker_symbol ??
				security.name ??
				security.market_identifier_code;
			// Only upsert minimum here - polygon should be source of other data
			const input: Prisma.AssetCreateInput = {
				plaid_security_id: security.security_id,
				symbol: symbol ?? '',
				type: security.type ?? undefined,
			};
			return input;
		});
	}

	static convertPlaidAccounts({
		plaidAccounts,
		plaidAuthConnection,
	}: {
		plaidAccounts: AccountBase[];
		plaidAuthConnection: AuthConnection;
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
			};
			return upsertAccount;
		});
	}

	static convertPlaidTransactions({
		investmentsTransactionsGetResponse,
		accounts,
		plaidAuthConnection,
	}: {
		investmentsTransactionsGetResponse: InvestmentsTransactionsGetResponse;
		accounts: (Account | Prisma.AccountCreateInput)[];
		plaidAuthConnection: AuthConnection;
	}): Prisma.TransactionCreateInput[] {
		const securityMap = new Map<string, string>();
		for (const security of investmentsTransactionsGetResponse.securities) {
			securityMap.set(
				security.security_id,
				security.ticker_symbol ?? 'UNKNOWN',
			);
		}

		const output =
			investmentsTransactionsGetResponse.investment_transactions.map(
				(transaction) => {
					const account = accounts.find(
						(a) => a.externalId === transaction.account_id,
					);
					if (!account || !account.plaidAccountMask || !account.type) {
						throw new Error(
							'convertPlaidTransactions: Could not find account from upsert.',
						);
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
							account.lotSeededDate &&
								account.lotSeededDate >= new Date(transaction.date),
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
					};

					return input;
				},
			);

		return output;
	}

	static convertPlaidHoldings({
		holdingsResponse,
		accounts,
		portfolioId,
	}: {
		holdingsResponse: InvestmentsHoldingsGetResponse;
		accounts: Account[];
		portfolioId: string;
	}): Prisma.PositionCreateManyInput[] {
		const securityMap = new Map<string, string>();
		for (const security of holdingsResponse.securities) {
			securityMap.set(
				security.security_id,
				security.ticker_symbol ?? 'UNKNOWN',
			);
		}
		return holdingsResponse.holdings.map((holding) => {
			const account = accounts.find(
				(account) => account.externalId === holding.account_id,
			);

			if (!account) {
				throw new Error(
					'convertPlaidHoldings: Could not find account from upsert.',
				);
			}
			return {
				accountId: account.id,
				assetSymbol: securityMap.get(holding.security_id) ?? 'UNKNOWN',
				costTotal: holding.cost_basis,
				marketValue: holding.institution_value,
				quantity: holding.quantity,
				portfolioId,
			};
		});
	}

	static holdingsTotals({
		holdings,
	}: {
		holdings: Holding[];
	}): Record<string, { costBasisTotal: Decimal; qtyTotal: Decimal }> {
		return holdings.reduce<
			Record<string, { costBasisTotal: Decimal; qtyTotal: Decimal }>
		>((acc, holding) => {
			acc[holding.security_id] = {
				costBasisTotal: new Decimal(holding.cost_basis ?? 0),
				qtyTotal: new Decimal(holding.quantity),
			};
			return acc;
		}, {});
	}

	/**
	 * Remove a Plaid item, invalidating the access token
	 * @param accessToken - The access token for the Item being removed
	 * @returns Promise that resolves when the item is successfully removed
	 * @example
	 * await plaidService.removeItem(authConnection.secret)
	 */
	async removeItem(accessToken: string): Promise<void> {
		try {
			await this.client.itemRemove({
				access_token: accessToken,
				client_id: this.configService.get('PLAID_CLIENT_ID'),
				secret: this.configService.get('PLAID_SECRET_KEY'),
			});

			this.logger.log(
				`Successfully removed Plaid item with access token: ${accessToken.substring(0, 10)}...`,
			);
		} catch (error) {
			this.logger.error(`Failed to remove Plaid item:`, error);
			// dont throw as this is not critical
		}
	}

	/**
	 * Get institution information from Plaid
	 * @param institutionId - The Plaid institution ID
	 * @returns Institution information including name, logo, colors, etc.
	 * @example
	 * const institution = await plaidService.getInstitution('ins_3')
	 */
	async getInstitution(institutionId: string) {
		try {
			const response = await this.client.institutionsGetById({
				country_codes: [CountryCode.Us],
				institution_id: institutionId,
			});

			return response.data.institution;
		} catch (error) {
			this.logger.error(`Failed to fetch institution ${institutionId}:`, error);
			throw error;
		}
	}
}
