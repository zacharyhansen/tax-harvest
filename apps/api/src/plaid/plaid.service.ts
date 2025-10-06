import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
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
	ProfitAndLossType,
	type User,
} from '@prisma/client';
import type { InputJsonValue } from '@prisma/client/runtime/library';
import Decimal from 'decimal.js';
import { Insertable, Selectable, Transaction } from 'kysely';
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
	Asset,
	DB,
	Account as KyselyAccount,
	Transaction as KyselyTransaction,
	Position,
	PositionSnapshot,
	TransactionOnAssetMerge,
} from '~/database/db.d';
import { AccountsLotResetEvent } from '~/events/accounts-lot-reset';
import { AccountsSyncedEvent } from '~/events/accounts-synced';
import { EventId } from '~/events/event-id';
import { PositionService } from '~/position/position.service';
import {
	LotApplicationService,
	LotChangeKysely,
} from '../lot-application/lot-application.service';
import { PrismaService } from '../prisma/prisma.service';
import { TimeMethod } from '../utilities/time-method';
import type {
	PlaidLinkOnSuccessMetadata,
	PlaidWebhook,
} from './constants/plaid.dto';
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
		readonly db: Database,
		private eventEmitter: EventEmitter2,
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
		private readonly positionService: PositionService,
		private readonly lotApplicationService: LotApplicationService,
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
		this.dbBatchSize = this.configService.get<number>('DB_BATCH_SIZE') ?? 50;
		this.logger.log(`Database batch size set to: ${this.dbBatchSize}`);
	}

	@OnEvent(EventId.ACCOUNTS_LOT_RESET)
	async handleAccountLotReset(event: AccountsLotResetEvent) {
		this.logger.log(`Accounts ${event.accountId} lot reset`);

		const account = await this.prismaService
			.rlsBypassClient()
			.account.findUniqueOrThrow({
				where: {
					id: event.accountId,
				},
				select: {
					authConnection: true,
				},
			});

		if (account.authConnection) {
			await this.syncPlaidItem({
				plaidAuthConnection: account.authConnection,
			});
		} else {
			this.logger.error(
				`No auth connection found for account: ${event.accountId}`,
			);
		}
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
	}): Promise<Selectable<KyselyAccount>[]> {
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
			token: publicToken,
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
	}): Promise<Selectable<KyselyAccount>[]> {
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
					.rlsPortfolioClient(plaidAuthConnection.portfolioId)
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

		// Create the position snapshot and positions
		await executeWithRLS(
			this.db,
			plaidAuthConnection.portfolioId,
			async (trx) => {
				const { position, positionSnapshot } =
					PlaidService.convertPlaidHoldings({
						holdingsResponse: plaidResponse.data,
						accounts,
						portfolioId: plaidAuthConnection.portfolioId,
						authConnectionId: plaidAuthConnection.id,
					});

				await trx
					.insertInto('PositionSnapshot')
					.values(positionSnapshot)
					.execute();

				return trx.insertInto('Position').values(position).execute();
			},
		);

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
			this.positionService.currentAccountPositions({
				accountId,
				portfolioId,
			}),
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
					.where('merged', '=', false)
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

		// Create the top level plaid merge and process non-lot changes first based on transactions
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

		// Set up the lot data and transactions with their bucketed types
		const {
			resolvedLotChanges,
			nonLotAccountRealizedPAndLHistory,
			nonLotTransactions,
			unknownTransactions,
		} = this.lotApplicationService.processLotsAndTransactions({
			lots: initialLots,
			transactions,
			finalPositions,
			plaidMergeId: plaidMerge.id,
		});

		this.logger.error(JSON.stringify(unknownTransactions, null, 2));

		// Insert nonLotAccountRealizedPAndLHistory
		if (nonLotAccountRealizedPAndLHistory.length > 0) {
			await executeWithRLS(this.db, portfolioId, (trx) =>
				trx
					.insertInto('AccountRealizedPAndLHistory')
					.values(nonLotAccountRealizedPAndLHistory)
					.execute(),
			);
		}

		// Mark these transactions as applied
		await executeWithRLS(this.db, portfolioId, (trx) =>
			trx
				.updateTable('Transaction')
				.set({ merged: true })
				.where(
					'id',
					'in',
					nonLotTransactions.map((trx) => trx.id),
				)
				.execute(),
		);

		// Process each of the asset changes
		for (const resolvedLotChange of resolvedLotChanges) {
			await executeWithRLS(this.db, portfolioId, async (trx) => {
				let mergeErrorId: { id: string } | undefined;
				const relevantTransactions = [
					...resolvedLotChange.transactionBuys,
					...resolvedLotChange.transactionSells,
				];
				// Insert the merge attempt record
				const assetMerge = await trx
					.insertInto('AssetMerge')
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
						positionSnapshotId: resolvedLotChange.position.positionSnapshotId,
						lotData: JSON.stringify(
							initialLots.filter(
								(lot) =>
									lot.assetSymbol === resolvedLotChange.position.assetSymbol,
							),
						),
						resolvedLotChange: JSON.stringify(resolvedLotChange),
						error: resolvedLotChange.error
							? JSON.stringify(resolvedLotChange.error)
							: null,
					})
					.returning('id')
					.executeTakeFirstOrThrow();

				// Insert all possible lot changes for the asset merge that we got from the algorithm and the chosen lot change
				// if there is one
				for (const [
					index,
					lotChangeList,
				] of resolvedLotChange.lotChanges.entries()) {
					await this.insertLotChangeList({
						trx,
						lotChanges: lotChangeList,
						portfolioId,
						accountId,
						assetMergeId: assetMerge.id,
						plaidMergeId: plaidMerge.id,
						assetSymbol: resolvedLotChange.position.assetSymbol,
						transactionIds: relevantTransactions.map(
							(transaction) => transaction.id,
						),
						// Must always apply the first lot change list to the account so the lots exists for other change set relations
						applyToAccount: index === 0,
					});
				}

				// Insert transaction relations
				const transactions: Insertable<TransactionOnAssetMerge>[] =
					relevantTransactions.map((transaction) => ({
						portfolioId,
						accountId,
						transactionId: transaction.id,
						assetMergeId: assetMerge.id,
					}));
				if (transactions.length > 0) {
					await trx
						.insertInto('TransactionOnAssetMerge')
						.values(transactions)
						.execute();
				}

				// Handle merge error if we found one
				// Importantly merge errro can still exist for multi solution even if we have chosenLotChangeIndex
				const mergeError =
					resolvedLotChange.lotChanges.length > 1
						? MergeErrorType.PLAID_MULTI_LOT_SOLUTION
						: resolvedLotChange.error
							? MergeErrorType.UNKNOWN
							: resolvedLotChange.lotChanges.length === 0
								? MergeErrorType.PLAID_NO_SOLUTION
								: undefined;

				if (mergeError) {
					mergeErrorId = await trx
						.insertInto('MergeError')
						.values({
							type: mergeError,
							portfolioId,
							assetSymbol: resolvedLotChange.position.assetSymbol,
							lotsData: JSON.stringify(resolvedLotChange.lotData),
							targetValue: resolvedLotChange.position.costTotal?.toString(),
							targetQuantity: resolvedLotChange.position.quantity.toString(),
							accountId,
						})
						.returning('id')
						.executeTakeFirstOrThrow();

					// Connect the asset merge to the merge error if we found one
					if (mergeErrorId) {
						await trx
							.updateTable('AssetMerge')
							.set({
								mergeErrorId: mergeErrorId.id,
							})
							.where('id', '=', assetMerge.id)
							.execute();
					}
				}
			});
		}
		// Once done produce an event of the successful accounts
		this.eventEmitter.emit(
			EventId.ACCOUNTS_SYNCED,
			new AccountsSyncedEvent(portfolioId, [accountId]),
		);
	}

	@TimeMethod()
	async insertLotChangeList({
		trx,
		lotChanges,
		portfolioId,
		accountId,
		plaidMergeId,
		assetMergeId,
		assetSymbol,
		usedByAssetMergeId,
		transactionIds,
		applyToAccount,
	}: {
		trx: Transaction<DB>;
		lotChanges: LotChangeKysely[];
		portfolioId: string;
		accountId: string;
		plaidMergeId: string;
		assetMergeId: string;
		assetSymbol: string;
		usedByAssetMergeId?: string;
		transactionIds: string[];
		applyToAccount: boolean;
	}): Promise<string> {
		const insertedLotChangeList = await trx
			.insertInto('LotChangeList')
			.values({
				portfolioId,
				accountId,
				assetMergeId,
				usedByAssetMergeId,
			})
			.returning('id')
			.executeTakeFirstOrThrow();

		// If we were actually able to get chosenLotChangeIndex we can apply the lot changes to the account
		if (applyToAccount === true) {
			await this.applyLotChangesToAccounts({
				trx,
				portfolioId,
				accountId,
				lotChanges,
				transactionIds,
				lotChangeListId: insertedLotChangeList.id,
				plaidMergeId,
			});
		}

		if (lotChanges.length > 0) {
			await trx
				.insertInto('LotChange')
				.values(
					lotChanges.map((lotChange) => ({
						accountId,
						portfolioId,
						assetSymbol,
						quantityFinal: lotChange.quantityFinal.toString(),
						quantityChange: lotChange.quantityChange.toString(),
						price: lotChange.price.toString(),
						aquiredDate: lotChange.acquiredDate,
						upsert: JSON.stringify(lotChange.upsert),
						operationType: OperationType.upsert,
						lotChangeListId: insertedLotChangeList.id,
						lotId: lotChange.lotId,
					})),
				)
				.execute();
		}

		return insertedLotChangeList.id;
	}

	@TimeMethod()
	async applyLotChangesToAccounts({
		trx,
		portfolioId,
		accountId,
		lotChanges,
		transactionIds,
		lotChangeListId,
		plaidMergeId,
	}: {
		trx: Transaction<DB>;
		lotChanges: LotChangeKysely[];
		portfolioId: string;
		accountId: string;
		transactionIds: string[];
		lotChangeListId: string;
		plaidMergeId: string;
	}) {
		// Mark the lot change list as applied
		await trx
			.updateTable('LotChangeList')
			.set({ appliedToAccount: true })
			.where('id', '=', lotChangeListId)
			.execute();

		// Upsert the lots
		const upserts = lotChanges.map((lotChange) => lotChange.upsert);

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

		await trx
			.insertInto('AccountRealizedPAndLHistory')
			.values([
				{
					lotChangeListId,
					profitAndLossType: ProfitAndLossType.SHORT_TERM_CAPITAL_GAIN,
					portfolioId,
					accountId,
					plaidMergeId,
					value: lotChanges
						.reduce(
							(sum, change) => sum.plus(change.realizedProfitAndLossShortTerm),
							new Decimal(0),
						)
						.toString(),
				},
				{
					lotChangeListId,
					profitAndLossType: ProfitAndLossType.LONG_TERM_CAPITAL_GAIN,
					plaidMergeId,
					portfolioId,
					accountId,
					value: lotChanges
						.reduce(
							(sum, change) => sum.plus(change.realizedProfitAndLossLongTerm),
							new Decimal(0),
						)
						.toString(),
				},
			])
			.execute();

		// Mark the transactions as applied
		if (transactionIds.length > 0) {
			await trx
				.updateTable('Transaction')
				.set({ merged: true })
				.where('id', 'in', transactionIds)
				.execute();
		}
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
	@TimeMethod()
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
			.rlsPortfolioClient(plaidAuthConnection.portfolioId)
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
			.rlsPortfolioClient(plaidAuthConnection.portfolioId)
			.account.findMany({
				where: {
					externalId: {
						in: plaidResponse.data.accounts.map((a) => a.account_id ?? ''),
					},
				},
			});

		const lastTransOfPage = plaidResponse.data.investment_transactions.at(-1);

		const accountId = accounts.find(
			(a) => a.externalId === lastTransOfPage?.account_id,
		)?.id;
		if (!accountId) {
			throw new Error('Account not found');
		}
		// Only fetch more pages if the last transaction of the current page is not already in the DB
		const currentTransactionsAreNew = !(await this.prismaService
			.rlsPortfolioClient(plaidAuthConnection.portfolioId)
			.transaction.findUnique({
				where: {
					accountId_externalId: {
						accountId,
						externalId: lastTransOfPage?.investment_transaction_id ?? '',
					},
				},
			}));

		const transactionsToUpsert = this.convertPlaidTransactions({
			investmentsTransactionsGetResponse: plaidResponse.data,
			accounts,
			plaidAuthConnection,
			accountId,
		});

		await processBatch(
			transactionsToUpsert,
			this.dbBatchSize,
			async (input) => {
				return executeWithRLS(this.db, plaidAuthConnection.portfolioId, (trx) =>
					trx
						.insertInto('Transaction')
						.values(input)
						.onConflict((oc) =>
							// !IMPORANT: DO NOT UPDATE THE appliedToLots ELSE IT WILL TRY TO INSERTE ON THE NEXT SYNC AGAIN
							oc
								.columns(['accountId', 'externalId'])
								.doUpdateSet({
									amount: (eb) => eb.ref('excluded.amount'),
									assetSymbol: (eb) => eb.ref('excluded.assetSymbol'),
									fee: (eb) => eb.ref('excluded.fee'),
									memo: (eb) => eb.ref('excluded.memo'),
									paymentCurrency: (eb) => eb.ref('excluded.paymentCurrency'),
									price: (eb) => eb.ref('excluded.price'),
									quantity: (eb) => eb.ref('excluded.quantity'),
									settlementCurrency: (eb) =>
										eb.ref('excluded.settlementCurrency'),
									subtype: (eb) => eb.ref('excluded.subtype'),
									transactionDate: (eb) => eb.ref('excluded.transactionDate'),
									type: (eb) => eb.ref('excluded.type'),
									profitAndLossType: (eb) =>
										eb.ref('excluded.profitAndLossType'),
								}),
						)
						.execute(),
				);
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

	@TimeMethod()
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

		return executeWithRLS(this.db, portfolioId, async (trx) => {
			return trx
				.insertInto('Asset')
				.values(assetsToUpsert)
				.onConflict((oc) =>
					oc.columns(['symbol']).doUpdateSet({
						plaid_security_id: (eb) => eb.ref('excluded.plaid_security_id'),
						type: (eb) => eb.ref('excluded.type'),
					}),
				)
				.execute();
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
	}): Promise<Selectable<KyselyAccount>[]> {
		const accounts = PlaidService.convertPlaidAccounts({
			plaidAccounts,
			plaidAuthConnection,
		});

		return executeWithRLS(
			this.db,
			plaidAuthConnection.portfolioId,
			async (trx) => {
				// Not pretty but if a user has set up their account  via onboarding and has not connected plaid yet
				// we need to update/connect the account with the plaid account data before upserting by adding the plaidAccountMask
				if (existingAccountId && accounts[0]) {
					await trx
						.updateTable('Account')
						// @ts-expect-error not sure
						.set(accounts[0])
						.where('id', '=', existingAccountId)
						.execute();
				}

				return await trx
					.insertInto('Account')
					.values(accounts)
					.onConflict((oc) =>
						oc
							.columns(['authConnectionId', 'plaidAccountMask', 'type'])
							.doUpdateSet({
								name: (eb) => eb.ref('excluded.name'),
								description: (eb) => eb.ref('excluded.description'),
								institution: (eb) => eb.ref('excluded.institution'),
								type: (eb) => eb.ref('excluded.type'),
								subType: (eb) => eb.ref('excluded.subType'),
								mode: (eb) => eb.ref('excluded.mode'),
								status: (eb) => eb.ref('excluded.status'),
								createdById: (eb) => eb.ref('excluded.createdById'),
								portfolioId: (eb) => eb.ref('excluded.portfolioId'),
							}),
					)
					.returningAll()
					.execute();
			},
		);
	}

	private async handleHoldingsUpdate(webhookData: PlaidWebhook): Promise<void> {
		const authConnection = await this.prismaService
			.rlsBypassClient()
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
			.rlsPortfolioClient(authConnection.portfolioId)
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
	}): Insertable<Asset>[] {
		return securities.map((security) => {
			const symbol =
				security.ticker_symbol ??
				security.name ??
				security.market_identifier_code;
			// Only upsert minimum here - polygon should be source of other data
			const input: Insertable<Asset> = {
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
	}): Insertable<KyselyAccount>[] {
		return plaidAccounts.map((plaidAccount) => {
			const upsertAccount: Insertable<KyselyAccount> = {
				name: plaidAccount.name,
				available: new Decimal(plaidAccount.balances.available ?? 0).toString(),
				current: new Decimal(plaidAccount.balances.current ?? 0).toString(),
				externalId: plaidAccount.account_id,
				institution: AccountInstitution.BROKERAGE,
				plaidAccountMask: plaidAccount.mask,
				provider: AccountProvider.PLAID,
				skipSetup: taxAdvantadedSubTypes.has(plaidAccount.subtype ?? ''),
				subType: plaidAccount.subtype,
				type: plaidAccount.type,
				authConnectionId: plaidAuthConnection.id,
				createdById: plaidAuthConnection.userId,
				// !IMPORTANT - This changes if you reauth to the same account - we never weant to be recreating links to an account in a portfolio
				portfolioId: plaidAuthConnection.portfolioId,
			};
			return upsertAccount;
		});
	}

	convertPlaidTransactions({
		investmentsTransactionsGetResponse,
		accounts,
		plaidAuthConnection,
		accountId,
	}: {
		investmentsTransactionsGetResponse: InvestmentsTransactionsGetResponse;
		accounts: (Account | Prisma.AccountCreateInput)[];
		plaidAuthConnection: AuthConnection;
		accountId: string;
	}): Insertable<KyselyTransaction>[] {
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

					const input: Insertable<KyselyTransaction> = {
						accountId,
						portfolioId: plaidAuthConnection.portfolioId,
						amount: transaction.amount,
						// Consider the transaction applied if its after the account was seeded
						merged: Boolean(
							account.lotSeededDate &&
								new Date(account.lotSeededDate) >= new Date(transaction.date),
						),
						assetSymbol:
							securityMap.get(transaction.security_id ?? '') ?? 'UNKNOWN',
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
						profitAndLossType:
							this.lotApplicationService.categorizeTransactionPAndL(
								transaction.type,
								transaction.subtype,
							),
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
		authConnectionId,
	}: {
		holdingsResponse: InvestmentsHoldingsGetResponse;
		accounts: Selectable<KyselyAccount>[];
		portfolioId: string;
		authConnectionId: string;
	}): {
		positionSnapshot: Insertable<PositionSnapshot>;
		position: Insertable<Position>[];
	} {
		const securityMap = new Map<string, string>();
		for (const security of holdingsResponse.securities) {
			securityMap.set(
				security.security_id,
				security.ticker_symbol ?? 'UNKNOWN',
			);
		}
		const positionSnapshot: Insertable<PositionSnapshot> = {
			id: crypto.randomUUID(),
			portfolioId,
			authConnectionId,
		};

		return {
			positionSnapshot,
			position: holdingsResponse.holdings.map((holding) => {
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
					// biome-ignore lint/style/noNonNullAssertion: <it exists above>
					positionSnapshotId: positionSnapshot.id!,
				};
			}),
		};
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
