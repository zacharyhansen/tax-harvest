import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { Prisma } from '@prisma/client';
import Decimal from 'decimal.js';
import { AccountsLotResetEvent } from '~/events/accounts-lot-reset';
import { AccountsSyncedEvent } from '~/events/accounts-synced';
import { EventId } from '~/events/event-id';
import { Database } from '../database/database';
import { LotService } from '../lot/lot.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountService {
	private readonly logger = new Logger(AccountService.name);
	constructor(
		readonly _db: Database,
		private readonly prismaService: PrismaService,
		private readonly lotService: LotService,
	) {}

	getAccountsWithPortfolioId(
		portfolioId: string,
		args: Prisma.AccountFindManyArgs,
	) {
		return this.prismaService.rlsPortfolioClient(portfolioId).account.findMany({
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
		return this.prismaService.rlsPortfolioClient(id).account.findMany({
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
			.rlsPortfolioClient(portfolioId)
			.account.findUniqueOrThrow(args);
	}

	createAccountForPortfolio(accountInsertObject: Prisma.AccountCreateInput) {
		return (
			this.prismaService
				// biome-ignore lint/style/noNonNullAssertion: <ok>
				.rlsPortfolioClient(accountInsertObject.portfolio?.connect?.id!)
				.account.create({ data: accountInsertObject })
		);
	}

	updateAccount(
		accountUpdateInput: Prisma.AccountUpdateInput,
		accountWhereUniqueInput: Prisma.AccountWhereUniqueInput,
		portfolioId: string,
	) {
		return this.prismaService.rlsPortfolioClient(portfolioId).account.update({
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
			.rlsPortfolioClient(portfolioId)
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
			.rlsPortfolioClient(portfolioId)
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

	@OnEvent(EventId.ACCOUNTS_SYNCED)
	async handleAccountSynced(event: AccountsSyncedEvent) {
		this.logger.log(`Accounts ${event.accountIds.join(', ')} synced`);

		const [accounts, lotsCurrent] = await Promise.all([
			this.prismaService
				.rlsPortfolioClient(event.portfolioId)
				.account.findMany({
					where: {
						id: {
							in: event.accountIds,
						},
					},
					select: {
						id: true,
						marketValueTotal: true,
						positions: {
							select: {
								assetSymbol: true,
								marketValue: true,
							},
						},
						realizedPAndL: {
							select: {
								shortTerm: true,
								longTerm: true,
							},
							orderBy: {
								year: 'desc',
							},
							take: 1,
						},
					},
				}),
			this.lotService.lotCurrent({ portfolioId: event.portfolioId }),
		]);

		const portfolioBalanceSnapshot: Prisma.PortfolioBalanceSnapshotCreateManyInput[] =
			[];

		for (const account of accounts) {
			const summaryCurrentLots = this.lotService.summaryCurrentLots(
				lotsCurrent.filter((lot) => lot.accountId === account.id),
			);

			const positiionsTotal = account.positions.reduce(
				(acc, curr) => acc.plus(curr.marketValue ?? 0),
				new Decimal(0),
			);
			portfolioBalanceSnapshot.push({
				portfolioId: event.portfolioId,
				accountId: account.id,
				valueTotal: account.marketValueTotal?.toNumber() ?? 0,
				valueCash:
					account.marketValueTotal?.toNumber() ??
					0 - positiionsTotal.toNumber(),
				valueAssets: positiionsTotal.toNumber(),
				positions: account.positions.map((position) => ({
					assetSymbol: position.assetSymbol,
					marketValue: position.marketValue?.toNumber(),
				})),
				realizedPAndLShortTerm:
					account.realizedPAndL?.[0]?.shortTerm.toNumber() ?? 0,
				realizedPAndLLongTerm:
					account.realizedPAndL?.[0]?.longTerm.toNumber() ?? 0,
				unrealizedProfit: summaryCurrentLots.gainTotal,
				unrealizedLoss: summaryCurrentLots.lossTotal,
			});
		}

		return this.prismaService
			.rlsPortfolioClient(event.portfolioId)
			.portfolioBalanceSnapshot.createMany({
				data: portfolioBalanceSnapshot,
			});
	}
}
