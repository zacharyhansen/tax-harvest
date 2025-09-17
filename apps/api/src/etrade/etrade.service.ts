/** biome-ignore-all lint/suspicious/noExplicitAny: <pull from exmaple app> */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	type Account,
	type AccountInstitution,
	type AuthConnection,
	AuthSource,
	AuthType,
	type OptionLevel,
	type Prisma,
	type PrismaClient,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { OAuth } from 'oauth';

import { PrismaService } from '../prisma/prisma.service';
import type ConnectionProvider from '../utilities/abstractClass/ConnectionProvider';
import { dateOrNull } from '../utilities/dateLoad';
import type {
	EtradeAccountListResponse,
	EtradeBalanceResponse,
	EtradePortfolioResponse,
	LotDetailResponse,
	TransactionListResponse,
} from './types';

interface UrlData {
	pageOrQuery?: Record<string, string>;
	path: string;
}

@Injectable()
export class EtradeService implements ConnectionProvider {
	private readonly oauthClient: OAuth;
	private readonly logger = new Logger(EtradeService.name);
	private readonly accountListUri = '/v1/accounts/list';
	private readonly renewUri = '/oauth/renew_access_token';
	private readonly accountsUri = '/v1/accounts/';

	constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
	) {
		this.oauthClient = new OAuth(
			`https://${this.configService.get('ETRADE_HOSTNAME')}/oauth/request_token`,
			`https://${this.configService.get('ETRADE_HOSTNAME')}/oauth/access_token`,
			this.configService.get('ETRADE_API_KEY') ?? '',
			this.configService.get('ETRADE_API_SECRET') ?? '',
			'1.0',
			'oob',
			'HMAC-SHA1',
		);
	}

	async renewOauthConnection({
		secret,
		token,
	}: {
		token: string;
		secret: string;
	}) {
		return new Promise((res, rej) => {
			const handler = this.createResponseHandler(
				res,
				rej,
				'/renewOauthConnection',
			);
			return this.oauthClient.post(
				`https://${this.configService.get('ETRADE_HOSTNAME')}${this.renewUri}`,
				token,
				secret,
				undefined,
				undefined,
				handler,
			);
		});
	}

	/**
	 * Get the URL for etrade verification where the user can get their verifier code
	 */
	async requestOauthConnection({
		portfolioId,
		userId,
	}: {
		userId: string;
		portfolioId: string;
	}) {
		try {
			// If we already have a request auth and its valid lets return that
			const existingRequestAuth = await this.prismaService
				.rlsPortfolioClient(portfolioId)
				.authConnection.findFirst({
					where: {
						source: 'ETRADE_REQUEST',
						userId,
					},
				});
			if (
				existingRequestAuth &&
				this.assertVerificationUrlValid(existingRequestAuth)
			) {
				this.logger.log('Using existing verification url');

				return existingRequestAuth;
			}
			this.logger.log('Getting new verification url');
			// Otherwise we need to go get one and upsert it to the DB
			const { token, tokenSecret } = await this.getRequestToken();
			const verificationUrl = this.getAuthorizeUrl(token);
			const existing = await this.prismaService
				.rlsPortfolioClient(portfolioId)
				.authConnection.findFirst({
					where: {
						portfolioId,
						source: AuthSource.ETRADE_REQUEST,
						userId,
					},
				});
			const requestAuth = await this.prismaService
				.rlsPortfolioClient(portfolioId)
				.authConnection.upsert({
					create: {
						externalId: crypto.randomUUID(),
						portfolioId,
						secret: tokenSecret,
						source: AuthSource.ETRADE_REQUEST,
						token,
						type: AuthType.OAUTH_1,
						userId,
						verificationUrl,
					},
					update: {
						secret: tokenSecret,
						token,
						verificationUrl,
					},
					where: {
						id: existing?.id,
					},
				});
			return requestAuth;
		} catch (error) {
			this.logger.error(
				`Failed to get oauth connection: ${JSON.stringify(error)}`,
			);
			throw new Error(JSON.stringify(error));
		}
	}

	async accessOauthConnection({
		portfolioId,
		select,
		userId,
		verifier,
	}: {
		userId: string;
		portfolioId: string;
		verifier: string;
		select: Prisma.AuthConnectionSelect;
	}): Promise<AuthConnection> {
		try {
			const requestAuth = await this.prismaService
				.rlsPortfolioClient(portfolioId)
				.authConnection.findFirst({
					where: {
						portfolioId,
						source: AuthSource.ETRADE_REQUEST,
						userId,
					},
				});

			if (!requestAuth?.secret || !requestAuth.token) {
				throw new Error('Missing request authentication.');
			}

			const authConnection = await new Promise<AuthConnection>(
				(resolve, reject) => {
					this.oauthClient.getOAuthAccessToken(
						requestAuth.token ?? '',
						requestAuth.secret ?? '',
						verifier,
						async (err, token, secret) => {
							if (err) {
								reject(err);
							}
							const existing = await this.prismaService
								.rlsPortfolioClient(portfolioId)
								.authConnection.findFirst({
									where: {
										portfolioId,
										source: AuthSource.ETRADE_ACCESS,
										userId,
									},
								});
							resolve(
								this.prismaService
									.rlsPortfolioClient(portfolioId)
									.authConnection.upsert({
										create: {
											authedAt: new Date(),
											externalId: crypto.randomUUID(),
											portfolioId,
											secret,
											source: 'ETRADE_ACCESS',
											token,
											type: 'OAUTH_1',
											userId,
											verifier,
										},
										update: {
											authedAt: new Date(),
											secret,
											token,
											verifier,
										},
										where: {
											id: existing?.id,
										},
									}),
							);
						},
					);
				},
			);

			await this.sync({
				authConnection,
				select,
				userId,
			});

			return authConnection;
		} catch (error) {
			this.logger.error(
				`Failed to get access oauth connection: ${JSON.stringify(error)}`,
			);
			throw new Error(JSON.stringify(error));
		}
	}

	/**
	 * Using the env's etrade credentials we send an oauth request to obtain
	 * a request token that can be used to generate a verification url
	 */

	getRequestToken(extraParams: Record<string, string> = {}) {
		return new Promise<{
			authorizeUrl: string;
			query: { oauth_callback_confirmed: 'true' | 'false' };
			token: string;
			tokenSecret: string;
		}>((resolve, reject) => {
			this.oauthClient.getOAuthRequestToken(
				extraParams,
				(err, oauthToken, oauthTokenSecret, parsedQueryString) => {
					if (err) {
						this.logger.error(err);
						// void this.prismaService.log.create({
						//   data: {
						//     data: err as unknown as InputJsonValue,
						//     description: "/getRequestToken",
						//     // @ts-expect-error log code if its there
						//     responseStatus: err.statusCode || undefined,
						//     source: AuthSource.ETRADE_REQUEST,
						//     type: LogType.AUTH,
						//   },
						// });
						reject(err);
						return;
					}
					resolve({
						authorizeUrl: parsedQueryString.login_url ?? '',
						query: parsedQueryString,
						token: oauthToken,
						tokenSecret: oauthTokenSecret,
					});
				},
			);
		});
	}

	getAuthorizeUrl(reqToken: string) {
		return `${this.configService.get(
			'ETRADE_OAUTH_AUTHORIZE_URL',
		)}?key=${this.configService.get('ETRADE_API_KEY')}&token=${reqToken}`;
	}

	/**
	 * The url should be valid for 5 minutes and we can reuse it in that time
	 */
	private assertVerificationUrlValid(authConnection?: AuthConnection) {
		if (!authConnection?.verificationUrl) {
			return false;
		}

		const currentTime = new Date();
		const timeDifference =
			currentTime.getTime() - authConnection.updatedAt.getTime();
		const fiveMinutesInMilliseconds = 5 * 60 * 1000;

		return timeDifference <= fiveMinutesInMilliseconds;
	}

	private buildUrl({ pageOrQuery, path }: UrlData) {
		const query: Record<string, string> = {
			api_key: this.configService.get<string>('ETRADE_API_KEY') ?? '',
			...pageOrQuery,
		};
		const url = new URL(
			`https://${this.configService.get('ETRADE_HOSTNAME')}${path}`,
		);
		const searchParams = new URLSearchParams(query);
		url.search = searchParams.toString();
		return url.toString();
	}

	async sync({
		authConnection,
		select,
		userId,
	}: {
		authConnection: AuthConnection;
		userId: string;
		select: Prisma.AuthConnectionSelect;
	}): Promise<AuthConnection> {
		const { secret, token } = authConnection;
		if (!token || !secret) {
			throw new Error('Missing token or secret');
		}
		// Upsert Accounts
		const { AccountListResponse }: EtradeAccountListResponse =
			await this.getProtectedResourceWithRetry(
				this.buildUrl(this.getAcctUrl()),
				'GET',
				token,
				secret,
			);
		const accountBalanceResults: EtradeBalanceResponse[] = await Promise.all(
			AccountListResponse.Accounts.Account.map((account) => {
				return new Promise<EtradeBalanceResponse>((resolve, reject) => {
					this.oauthClient.getProtectedResource(
						this.buildUrl(
							this.getBalanceUrl(account.accountIdKey, account.institutionType),
						),
						'GET',
						token,
						secret,
						this.createResponseHandler(
							resolve,
							reject,
							'EtradeBalanceResponse',
						),
					);
				});
			}),
		);
		let internalAccounts: Account[] = [];
		try {
			const accountOperations = AccountListResponse.Accounts.Account.map(
				(account) => {
					const balanceMatch = accountBalanceResults.find(
						(accountBalance) =>
							accountBalance.BalanceResponse?.accountId === account.accountId,
					);
					const balance = balanceMatch?.BalanceResponse;
					return this.prismaService
						.$extends(PrismaService.bypassRLS())
						.account.upsert({
							create: {
								accountValueTotal:
									balance?.Computed?.RealTimeValues?.totalAccountValue,
								authConnection: {
									connect: {
										id: authConnection.id,
									},
								},
								balanceAccount: balance?.Computed?.accountBalance,
								balanceMoneyMarket: balance?.Cash?.moneyMktBalance,
								balanceShortAdjustment: balance?.Computed?.shortAdjustBalance,
								cashAvailableForInvestment:
									balance?.Computed?.cashAvailableForInvestment,
								cashBalance: balance?.Computed?.cashBalance,
								cashBuyingPower: balance?.Computed?.cashBuyingPower,
								cashForOpenOrders: balance?.Cash?.fundsForOpenOrdersCash,
								cashNet: balance?.Computed?.netCash,
								cashOpenOrderReserveDT:
									balance?.Margin?.dtMarginOpenOrderReserve,
								cashSettledForInvestment:
									balance?.Computed?.settledCashForInvestment,
								cashUnsettledForInvestment:
									balance?.Computed?.unSettledCashForInvestment,
								closedDate:
									account.closedDate === 0
										? null
										: new Date(account.closedDate),
								createdBy: {
									connect: {
										id: userId,
									},
								},
								description: account.accountDesc,
								name: account.accountName,
								equityRegt: balance?.Computed?.regtEquity,
								equityRegtPercent: balance?.Computed?.regtEquityPercent,
								externalId: account.accountId,
								fundsWithheldFromPurchasingPower:
									balance?.Computed?.fundsWithheldFromPurchasePower,
								fundsWithheldFromWithdrawal:
									balance?.Computed?.fundsWithheldFromWithdrawal,
								institution: account.institutionType,
								key: account.accountIdKey,
								marginBuyingPower: balance?.Computed?.marginBuyingPower,
								marginBuyingPowerDT: balance?.Computed?.dtMarginBuyingPower,
								marginOpenOrderReserveDT:
									balance?.Margin?.dtCashOpenOrderReserve,
								marketValueTotal: balance?.Computed?.RealTimeValues?.netMv,
								optionLevel: balance?.optionLevel as OptionLevel,
								portfolio: {
									connect: {
										id: authConnection.portfolioId,
									},
								},
								provider: 'ETRADE',
								status: account.accountStatus,
								type: account.accountType,
							},
							update: {
								accountValueTotal:
									balance?.Computed?.RealTimeValues?.totalAccountValue,
								authConnectionId: authConnection.id,
								balanceAccount: balance?.Computed?.accountBalance,
								balanceMoneyMarket: balance?.Cash?.moneyMktBalance,
								balanceShortAdjustment: balance?.Computed?.shortAdjustBalance,
								cashAvailableForInvestment:
									balance?.Computed?.cashAvailableForInvestment,
								cashBalance: balance?.Computed?.cashBalance,
								cashBuyingPower: balance?.Computed?.cashBuyingPower,
								cashForOpenOrders: balance?.Cash?.fundsForOpenOrdersCash,
								cashNet: balance?.Computed?.netCash,
								cashOpenOrderReserveDT:
									balance?.Margin?.dtMarginOpenOrderReserve,
								cashSettledForInvestment:
									balance?.Computed?.settledCashForInvestment,
								cashUnsettledForInvestment:
									balance?.Computed?.unSettledCashForInvestment,
								closedDate:
									account.closedDate === 0
										? null
										: new Date(account.closedDate),
								description: account.accountDesc,
								name: account.accountName,
								equityRegt: balance?.Computed?.regtEquity,
								equityRegtPercent: balance?.Computed?.regtEquityPercent,
								externalId: account.accountId,
								fundsWithheldFromPurchasingPower:
									balance?.Computed?.fundsWithheldFromPurchasePower,
								fundsWithheldFromWithdrawal:
									balance?.Computed?.fundsWithheldFromWithdrawal,
								institution: account.institutionType,
								key: account.accountIdKey,
								marginBuyingPower: balance?.Computed?.marginBuyingPower,
								marginBuyingPowerDT: balance?.Computed?.dtMarginBuyingPower,
								marginOpenOrderReserveDT:
									balance?.Margin?.dtCashOpenOrderReserve,
								marketValueTotal: balance?.Computed?.RealTimeValues?.netMv,
								optionLevel: balance?.optionLevel as OptionLevel,
								portfolioId: authConnection.portfolioId,
								provider: 'ETRADE',
								status: account.accountStatus,
								type: account.accountType,
							},
							where: {
								authConnectionId_plaidAccountMask_type: {
									authConnectionId: authConnection.id,
									plaidAccountMask: account.accountId,
									type: account.accountType,
								},
							},
						});
				},
			);
			internalAccounts =
				await this.prismaService.$transaction(accountOperations);
			this.logger.log('Successfully upserted accounts');
		} catch (error) {
			this.logger.error('Failed to upsert accounts', error);
		}

		await this.syncPositions(internalAccounts, token, secret);
		await this.syncTransactions(internalAccounts, token, secret);
		// await this.syncOrders(internalAccounts, token, secret);

		return (
			this.prismaService.$extends(
				PrismaService.forPortfolio(authConnection.portfolioId),
			) as unknown as PrismaClient
		).authConnection.update({
			data: {
				syncedAt: new Date(),
			},
			select,
			where: {
				id: authConnection.id,
				portfolioId: authConnection.portfolioId,
			},
		});
	}

	private async syncTransactions(
		accounts: Account[],
		token: string,
		secret: string,
	) {
		const accountTransactionResults: TransactionListResponse[] =
			await Promise.all(
				accounts.map((account) => {
					if (!account.key) {
						throw new Error('Etrade account is missing key');
					}
					return new Promise<TransactionListResponse>((resolve, reject) => {
						this.oauthClient.getProtectedResource(
							this.buildUrl(this.getAccountTransactionsUrl(account.key ?? '')),
							'GET',
							token,
							secret,
							this.createResponseHandler(
								resolve,
								reject,
								'TransactionListResponse',
							),
						);
					});
				}),
			);
		const assetsUpsert: Prisma.AssetUpsertArgs[] = [];
		const transactionOperations: Prisma.TransactionUpsertArgs[] =
			accountTransactionResults.flatMap(
				(accountTransactions) =>
					accountTransactions.TransactionListResponse.Transaction?.map(
						(transactionData) => {
							const internalAccount = accounts.find(
								(internalAcc) =>
									internalAcc.externalId === transactionData.accountId,
							);
							if (!internalAccount) {
								throw new Error('Could not find an account for the positions');
							}

							if (transactionData.brokerage?.product?.symbol) {
								assetsUpsert.push({
									create: {
										name: transactionData.brokerage.product.symbol,
										symbol: transactionData.brokerage.product.symbol,
										type: transactionData.brokerage.product.securityType,
									},
									update: {},
									where: {
										symbol: transactionData.brokerage.product.symbol,
									},
								});
							}
							const internalAccountId = internalAccount.id;
							return {
								create: {
									accountId: internalAccountId,
									amount: transactionData.amount,
									assetSymbol:
										transactionData.brokerage?.product?.symbol ?? 'UNKOWN',
									description: transactionData.description,
									detailsURI: transactionData.detailsURI,
									displaySymbol: transactionData.brokerage?.displaySymbol,
									externalId: transactionData.transactionId,
									fee: transactionData.brokerage?.fee,
									memo: transactionData.memo,
									paymentCurrency: transactionData.brokerage?.paymentCurrency,
									postDate: dateOrNull(transactionData.postDate),
									price: transactionData.brokerage?.price,
									quantity: transactionData.brokerage?.quantity,
									securityType:
										transactionData.brokerage?.product?.securityType,
									settlementCurrency:
										transactionData.brokerage?.settlementCurrency,
									settlementDate: dateOrNull(
										transactionData.brokerage?.settlementDate,
									),
									transactionDate: dateOrNull(transactionData.transactionDate),
									type: transactionData.transactionType,
									portfolioId: internalAccount.portfolioId,
								},
								update: {
									amount: transactionData.amount,
									assetSymbol: transactionData.brokerage?.product?.symbol,
									description: transactionData.description,
									detailsURI: transactionData.detailsURI,
									displaySymbol: transactionData.brokerage?.displaySymbol,
									fee: transactionData.brokerage?.fee,
									memo: transactionData.memo,
									paymentCurrency: transactionData.brokerage?.paymentCurrency,
									postDate: dateOrNull(transactionData.postDate),
									price: transactionData.brokerage?.price,
									quantity: transactionData.brokerage?.quantity,
									securityType:
										transactionData.brokerage?.product?.securityType,
									settlementCurrency:
										transactionData.brokerage?.settlementCurrency,
									settlementDate: dateOrNull(
										transactionData.brokerage?.settlementDate,
									),
									transactionDate: dateOrNull(transactionData.transactionDate),
									type: transactionData.transactionType,
								},
								where: {
									accountId_externalId: {
										accountId: internalAccountId,
										externalId: transactionData.transactionId,
									},
								},
							};
						},
					) ?? [],
			);

		return this.prismaService
			.$extends(PrismaService.forPortfolio(accounts[0].portfolioId))
			.$transaction([
				...assetsUpsert.map((t) => this.prismaService.asset.upsert(t)),
				...transactionOperations.map((t) =>
					this.prismaService.transaction.upsert(t),
				),
			]);
	}

	private async syncPositions(
		accounts: Account[],
		token: string,
		secret: string,
	) {
		const accountPortfolioResults: EtradePortfolioResponse[] =
			await Promise.all(
				accounts.map((account) => {
					if (!account.key) {
						throw new Error('Etrade account is missing key');
					}
					return new Promise<EtradePortfolioResponse>((resolve, reject) => {
						this.oauthClient.getProtectedResource(
							this.buildUrl(this.getPortfolioUrl(account.key ?? '')),
							'GET',
							token,
							secret,
							this.createResponseHandler(
								resolve,
								reject,
								'EtradePortfolioResponse',
							),
						);
					});
				}),
			);
		const assetsUpsert: Prisma.AssetUpsertArgs[] = [];

		const lotDetails: string[] = [];
		const accountIds: Set<string> = new Set<string>();

		const createManyPositions: Prisma.PositionCreateManyInput[] =
			accountPortfolioResults.flatMap((portfolioResult) => {
				return (
					portfolioResult.PortfolioResponse?.AccountPortfolio?.flatMap(
						(account) => {
							return (
								account.Position?.map((position) => {
									lotDetails.push(position.lotsDetails);
									// Upsert any ticket we find
									assetsUpsert.push({
										create: {
											name: position.Product.productId.symbol,
											symbol: position.Product.productId.symbol,
											type: position.Product.productId.typeCode,
										},
										update: {},
										where: {
											symbol: position.Product.productId.symbol,
										},
									});
									const internalAccount = accounts.find(
										(internalAcc) =>
											internalAcc.externalId === account.accountId &&
											internalAcc.provider === 'ETRADE',
									);
									if (!internalAccount) {
										throw new Error(
											'Could not find an account for the positions',
										);
									}
									const internalAccountId = internalAccount.id;
									accountIds.add(internalAccountId);
									return {
										accountId: internalAccountId,
										assetSymbol: position.Product.productId.symbol,
										commissionDay: position.todayCommissions
											? new Decimal(position.todayCommissions)
											: undefined,
										commissionTotal: position.commissions
											? new Decimal(position.commissions)
											: undefined,
										costPerShare: position.costPerShare
											? new Decimal(position.costPerShare)
											: undefined,
										costTotal: position.totalCost
											? new Decimal(position.totalCost)
											: undefined,
										dateAcquired: position.dateAcquired
											? new Date(position.dateAcquired)
											: undefined,
										dateExpiration: position.dateExpiration
											? new Date(position.dateExpiration)
											: undefined,
										externalId: position.positionId.toString(),
										feesDay: position.todayFees
											? new Decimal(position.todayFees)
											: undefined,
										feesOther: position.otherFees
											? new Decimal(position.otherFees)
											: undefined,
										gainDay: position.daysGain
											? new Decimal(position.daysGain)
											: undefined,
										gainTotal: position.totalGain
											? new Decimal(position.totalGain)
											: undefined,
										gainTotalPCT: position.totalGainPct
											? new Decimal(position.totalGainPct)
											: undefined,
										marketValue: position.marketValue
											? new Decimal(position.marketValue)
											: undefined,
										pricePaid: position.pricePaid
											? new Decimal(position.pricePaid)
											: new Decimal(0),
										quantity: position.quantity ?? 0,
										quoteStatus: position.quoteStatus,
										type: position.positionType ?? 'Unkown',
										portfolioId: internalAccount.portfolioId,
									} satisfies Prisma.PositionCreateManyInput;
								}) ?? []
							);
						},
					) ?? []
				);
			});

		const lotResults: LotDetailResponse[] = await Promise.all(
			lotDetails.map((lot) => {
				return new Promise<LotDetailResponse>((resolve, reject) => {
					this.oauthClient.getProtectedResource(
						lot,
						'GET',
						token,
						secret,
						this.createResponseHandler(resolve, reject, 'LotDetailResponse'),
					);
				});
			}),
		);

		await this.prismaService
			.$extends(PrismaService.forPortfolio(accounts[0].portfolioId))
			.$transaction(async (tx) => {
				// Upsert the assets
				await Promise.all(
					assetsUpsert.map((upsert) => tx.asset.upsert(upsert)),
				);

				// Delete old positions as there is no way to do a diff on what needs to be removed
				await tx.position.deleteMany({
					where: {
						accountId: {
							in: accounts.map((a) => a.id),
						},
					},
				});

				// Create positions
				const positions = await tx.position.createManyAndReturn({
					data: createManyPositions,
					select: {
						accountId: true,
						assetSymbol: true,
						externalId: true,
						id: true,
						portfolioId: true,
					},
				});

				return tx.lot.createMany({
					data: lotResults.flatMap((lotDetails) =>
						lotDetails.PositionLotsResponse.PositionLot.map((lot) => {
							const position = positions.find(
								(p) => p.externalId === lot.positionId.toString(),
							);
							if (!position) {
								throw new Error('Could not find a position for the lot');
							}
							return {
								accountId: position.accountId,
								acquiredDate: lot.acquiredDate
									? new Date(lot.acquiredDate)
									: new Date(),
								adjPrice: lot.adjPrice,
								assetSymbol: position.assetSymbol,
								availableQty: lot.availableQty,
								commPerShare: lot.commPerShare,
								costTotal: lot.totalCost,
								exchangeRate: lot.exchangeRate,
								externalId: String(lot.positionLotId),
								feesPerShare: lot.feesPerShare,
								gainDay: lot.daysGain,
								gainDayPct: lot.daysGainPct,
								gainTotal: lot.totalGain,
								legNo: lot.legNo,
								locationCode: lot.locationCode,
								lotSourceCode: lot.lotSourceCode,
								marketValue: lot.marketValue,
								orderNo: lot.orderNo,
								originalQty: lot.originalQty,
								paymentCurrency: lot.paymentCurrency,
								positionId: position.id,
								price: lot.price,
								remainingQty: lot.remainingQty,
								settlementCurrency: lot.settlementCurrency,
								shortType: lot.shortType,
								termCode: lot.termCode,
								totalCostForGainPct: lot.totalCostForGainPct,
								portfolioId: position.portfolioId,
							} satisfies Prisma.LotCreateManyInput;
						}),
					),
				});
			});

		this.logger.log('Successfully recreated positions and lots');
	}

	private createResponseHandler(
		resolve: (value: any) => void,

		reject: (reason?: any) => void,
		_description?: string,
	) {
		return (err: any, data: any, res: any) => {
			if (err) {
				this.logger.error(err);
				// await this.prismaService.log.create({
				//   data: {
				//     data: err,
				//     description: description,
				//     responseStatus: res.statusCode,
				//     source: AuthSource.ETRADE_ACCESS,
				//     type: LogType.EXTERNAL_SYNC,
				//   },
				// });
				reject(err);
				return;
			}

			if (res.statusCode !== 200) {
				// await this.prismaService.log.create({
				//   data: {
				//     data: err,
				//     description: description,
				//     responseStatus: res.statusCode,
				//     source: AuthSource.ETRADE_ACCESS,
				//     type: LogType.EXTERNAL_SYNC,
				//   },
				// });
				// Reject with an error for non-200 status codes
				reject(new Error(`Unexpected status code: ${res.statusCode}`));
				return;
			}

			try {
				// Process the data
				const result = JSON.parse(data);
				// await this.prismaService.log.create({
				//   data: {
				//     data: result,
				//     description: description,
				//     responseStatus: res.statusCode,
				//     source: AuthSource.ETRADE_ACCESS,
				//     type: LogType.EXTERNAL_SYNC,
				//   },
				// });
				// Resolve with the result
				resolve(result);
			} catch (parseError) {
				// await this.prismaService.log.create({
				//   data: {
				//     data: parseError as InputJsonValue,
				//     description: description,
				//     responseStatus: res.statusCode,
				//     source: AuthSource.ETRADE_ACCESS,
				//     type: LogType.EXTERNAL_SYNC,
				//   },
				// });
				// Reject with an error for JSON parsing issues
				reject(
					new Error(
						`Failed to parse response data: ${JSON.stringify(parseError)}`,
					),
				);
			}
		};
	}

	private getAcctUrl(): UrlData {
		return { path: `${this.accountListUri}.json` };
	}

	private getBalanceUrl(
		externalId: string,
		institution: AccountInstitution,
	): UrlData {
		return {
			pageOrQuery: { instType: institution, realTimeNAV: 'true' },
			path: `${this.accountsUri}${externalId}/balance.json`,
		};
	}

	private getPortfolioUrl(externalId: string): UrlData {
		return {
			pageOrQuery: {
				lotsRequired: 'true',
				totalsRequired: 'true',
			},
			path: `${this.accountsUri}${externalId}/portfolio.json`,
		};
	}

	private getAccountTransactionsUrl(externalId: string): UrlData {
		const currentYear = new Date().getFullYear();
		return {
			pageOrQuery: {
				endDate: `0101${currentYear + 1}`,
				startDate: `0101${currentYear}`,
			},
			path: `${this.accountsUri}${externalId}/transactions.json`,
		};
	}

	private async getProtectedResourceWithRetry(
		url: string,
		method: string,
		token: string,
		secret: string,
		retries = 1,
	): Promise<EtradeAccountListResponse> {
		try {
			const response = await new Promise((resolve, reject) => {
				const responseHandler = this.createResponseHandler(
					resolve,
					reject,
					'EtradeAccountListResponse',
				);
				this.oauthClient.getProtectedResource(
					url,
					method,
					token,
					secret,
					responseHandler,
				);
			});
			return response as EtradeAccountListResponse;
		} catch (error) {
			// Check if the error is due to an expired token
			if (this.isTokenExpiredError(error) && retries > 0) {
				// Renew the token
				await this.renewOauthConnection({
					secret,
					token,
				});
				// Retry the original request with the new token and secret
				return this.getProtectedResourceWithRetry(
					url,
					method,
					token,
					secret,
					retries - 1,
				);
			} else {
				this.logger.error('Failed to access protected resource');
				throw error;
			}
		}
	}

	private isTokenExpiredError(error: any) {
		// Implement logic to check if the error is due to an expired token
		// This could be based on the error message, status code, etc.
		return error.statusCode === 401;
	}
}
