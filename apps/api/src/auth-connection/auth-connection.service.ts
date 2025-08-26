import { Injectable } from '@nestjs/common';
import { type AuthConnection, AuthSource, type Prisma } from '@prisma/client';
import { EtradeService } from '../etrade/etrade.service';
import { PlaidService } from '../plaid/plaid.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthConnectionService {
	constructor(
		readonly prismaService: PrismaService,
		private readonly etradeService: EtradeService,
		private readonly plaidService: PlaidService,
	) {}

	async syncAuthConnection({
		authConnection,
		id,
		select,
		userId,
		portfolioId,
	}: {
		id?: string;
		authConnection?: AuthConnection;
		userId: string;
		select: Prisma.AuthConnectionSelect;
		portfolioId: string;
	}): Promise<AuthConnection> {
		if (!id && !authConnection) {
			throw new Error('You must provide an id or existing connection to sync');
		}

		const connection =
			authConnection ??
			(await this.prismaService
				.$extends(PrismaService.forPortfolio(portfolioId))
				.authConnection.findUniqueOrThrow({
					where: {
						id,
						portfolioId,
					},
				}));

		switch (connection.source) {
			case AuthSource.ETRADE_ACCESS: {
				return this.etradeService.sync({
					authConnection: connection,
					select,
					userId,
				});
			}
			case AuthSource.PLAID: {
				await this.plaidService.syncPlaidItem({
					plaidAuthConnection: connection,
				});
				return connection;
			}
			default: {
				throw new Error(`Not implemented: ${connection.source}`);
			}
		}
	}

	resolveRequestOauth({
		authSource,
		portfolioId,
		userId,
	}: {
		portfolioId: string;
		userId: string;
		authSource: AuthSource;
	}) {
		switch (authSource) {
			case AuthSource.ETRADE_REQUEST: {
				return this.etradeService.requestOauthConnection({
					portfolioId,
					userId,
				});
			}
			default: {
				throw new Error(`Not implemented: ${authSource}`);
			}
		}
	}

	resolveAccessOauth({
		authSource,
		portfolioId,
		select,
		userId,
		verifier,
	}: {
		portfolioId: string;
		userId: string;
		authSource: AuthSource;
		verifier: string;
		select: Prisma.AuthConnectionSelect;
	}) {
		switch (authSource) {
			case AuthSource.ETRADE_ACCESS: {
				return this.etradeService.accessOauthConnection({
					portfolioId,
					select,
					userId,
					verifier,
				});
			}
			default: {
				throw new Error(`Not implemented: ${authSource}`);
			}
		}
	}

	requiresReAuth(source: AuthSource, authedAt: Date) {
		switch (source) {
			case AuthSource.ETRADE_ACCESS: {
				const now = new Date();
				const twentyFourHoursAgo = new Date(
					now.getTime() - 24 * 60 * 60 * 1000,
				);
				return authedAt < twentyFourHoursAgo;
			}
			case AuthSource.PLAID: {
				return true;
			}
			case AuthSource.LOCAL: {
				return false;
			}
			default: {
				throw new Error(`Not implemented: ${source}`);
			}
		}
	}

	/**
	 * Delete an auth connection and optionally remove the external connection
	 * @param authConnectionId - The auth connection ID to delete
	 * @param portfolioId - The portfolio ID for security
	 * @returns The deleted auth connection
	 */
	async deleteAuthConnection(
		authConnectionId: string,
		portfolioId: string,
	): Promise<AuthConnection> {
		const authConnection = await this.prismaService
			.$extends(PrismaService.forPortfolio(portfolioId))
			.authConnection.findUniqueOrThrow({
				where: {
					id: authConnectionId,
					portfolioId,
				},
			});

		// Remove external connection if it's Plaid
		if (authConnection.source === AuthSource.PLAID && authConnection.secret) {
			await this.plaidService.removeItem(authConnection.secret);
		}

		// Delete the auth connection in a transaction
		return this.prismaService
			.$extends(PrismaService.forPortfolio(portfolioId))
			.$transaction(async (trx) => {
				// First delete all related accounts and their data
				const accounts = await trx.account.findMany({
					where: {
						authConnectionId: authConnection.id,
						portfolioId,
					},
				});

				for (const account of accounts) {
					// Delete related data for each account
					await trx.position.deleteMany({
						where: { accountId: account.id },
					});
					await trx.lot.deleteMany({
						where: { accountId: account.id },
					});
					await trx.transaction.deleteMany({
						where: { accountId: account.id },
					});

					// Delete the account
					await trx.account.delete({
						where: { id: account.id },
					});
				}

				// Finally delete the auth connection
				return trx.authConnection.delete({
					where: {
						id: authConnection.id,
						portfolioId,
					},
				});
			});
	}
}
