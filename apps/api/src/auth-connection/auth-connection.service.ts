import { Injectable } from '@nestjs/common';
import { type AuthConnection, AuthSource } from '@prisma/client';
import { PlaidService } from '../plaid/plaid.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthConnectionService {
	constructor(
		readonly prismaService: PrismaService,
		private readonly plaidService: PlaidService,
	) {}

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
			.rlsPortfolioClient(portfolioId)
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
			.rlsPortfolioClient(portfolioId)
			.$transaction(async (trx) => {
				// First delete all related accounts and their data
				const accounts = await trx.account.findMany({
					where: {
						authConnectionId: authConnection.id,
						portfolioId,
					},
				});

				// Track unique portfolio connect IDs to delete
				const portfolioConnectIds = new Set<string>();

				for (const account of accounts) {
					// Track the portfolio connect ID
					if (account.portfolioConnectId) {
						portfolioConnectIds.add(account.portfolioConnectId);
					}

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

				// Delete orphaned portfolio connect records
				for (const portfolioConnectId of portfolioConnectIds) {
					// Check if any other accounts still reference this portfolio connect
					const remainingAccounts = await trx.account.count({
						where: { portfolioConnectId },
					});

					// If no accounts remain, delete the portfolio connect
					if (remainingAccounts === 0) {
						await trx.portfolioConnect.delete({
							where: { id: portfolioConnectId },
						});
					}
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
