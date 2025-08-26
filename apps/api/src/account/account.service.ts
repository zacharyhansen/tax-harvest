import { Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { Database } from '../database/database';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountService {
	private readonly logger = new Logger(AccountService.name);
	constructor(
		readonly _db: Database,
		private readonly prismaService: PrismaService,
	) {}

	getAccountsWithPortfolioId(
		portfolioId: string,
		args: Prisma.AccountFindManyArgs,
	) {
		return this.prismaService
			.$extends(PrismaService.forPortfolio(portfolioId))
			.account.findMany({
				...args,
				orderBy: {
					name: 'asc',
				},
			});
	}

	async setupAccounts({
		id,
		select,
	}: {
		id: string;
		select: Prisma.AccountSelect;
	}) {
		return this.prismaService
			.$extends(PrismaService.forPortfolio(id))
			.account.findMany({
				where: {
					AND: [
						{
							OR: [
								{
									uploadedPositions: false,
								},
								{
									setRealizedValues: false,
								},
							],
						},
						{
							portfolioId: id,
							skipSetup: false,
						},
					],
				},
				select,
			});
	}

	getAccount(portfolioId: string, args: Prisma.AccountFindUniqueOrThrowArgs) {
		return this.prismaService
			.$extends(PrismaService.forPortfolio(portfolioId))
			.account.findUniqueOrThrow(args);
	}

	createAccountForPortfolio(accountInsertObject: Prisma.AccountCreateInput) {
		return this.prismaService
			.$extends(
				// biome-ignore lint/style/noNonNullAssertion: <ok>
				PrismaService.forPortfolio(accountInsertObject.portfolio?.connect?.id!),
			)
			.account.create({ data: accountInsertObject });
	}

	updateAccount(
		accountUpdateInput: Prisma.AccountUpdateInput,
		accountWhereUniqueInput: Prisma.AccountWhereUniqueInput,
		portfolioId: string,
	) {
		return this.prismaService
			.$extends(PrismaService.forPortfolio(portfolioId))
			.account.update({
				data: accountUpdateInput,
				where: {
					...accountWhereUniqueInput,
					portfolioId,
				},
			});
	}

	/**
	 * Delete an account and all associated data (only for UNCONNECTED accounts)
	 * @param accountWhereUniqueInput - The unique identifier for the account
	 * @param portfolioId - The portfolio ID for security
	 * @returns The deleted account
	 */
	async deleteAccount(
		accountWhereUniqueInput: Prisma.AccountWhereUniqueInput,
		portfolioId: string,
	) {
		this.logger.log(
			`Deleting account ${accountWhereUniqueInput.id} from portfolio ${portfolioId}`,
		);

		// First verify the account exists and is UNCONNECTED
		const account = await this.prismaService
			.$extends(PrismaService.forPortfolio(portfolioId))
			.account.findUniqueOrThrow({
				where: {
					...accountWhereUniqueInput,
					portfolioId,
				},
			});

		if (account.provider !== 'UNCONNECTED') {
			throw new Error(
				'Can only delete UNCONNECTED accounts. For connected accounts, delete the auth connection instead.',
			);
		}

		return this.prismaService
			.$extends(PrismaService.forPortfolio(portfolioId))
			.$transaction(async (trx) => {
				// First delete all related data
				// Delete positions
				await trx.position.deleteMany({
					where: {
						account: {
							id: accountWhereUniqueInput.id,
							portfolioId,
						},
					},
				});
				// Delete lots
				await trx.lot.deleteMany({
					where: {
						account: {
							id: accountWhereUniqueInput.id,
							portfolioId,
						},
					},
				});
				// Delete transactions
				await trx.transaction.deleteMany({
					where: {
						account: {
							id: accountWhereUniqueInput.id,
							portfolioId,
						},
					},
				});

				// Finally delete the account itself
				return trx.account.delete({
					where: {
						...accountWhereUniqueInput,
						portfolioId,
					},
				});
			});
	}
}
