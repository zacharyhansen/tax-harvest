import { Injectable, Logger } from '@nestjs/common';
import type { Prisma, RealizedPAndL } from '@prisma/client';
import { sql } from 'kysely';
import { Database, executeWithRLS } from '~/database/database';
import { PortfolioSummaryRealized } from '~/portfolio/portfolio.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RealizedPandLService {
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: <log>
	private readonly logger = new Logger(RealizedPandLService.name);
	constructor(
		private readonly prismaService: PrismaService,
		private readonly db: Database,
	) {}

	/**
	 * Fetch or create and return RealizedPAndL
	 */
	async _realizedProfitAndLoss({
		accountId,
		select,
		year,
		portfolioId,
	}: {
		accountId: string;
		year: number;
		select: Prisma.RealizedPAndLSelect;
		portfolioId: string;
	}): Promise<RealizedPAndL> {
		try {
			const startOfYear = new Date(year, 0, 1); // Jan 1, <year> 00:00:00
			// Find the most recent realized p&l for the year
			const realizedPAndL = await this.prismaService
				.rlsPortfolioClient(portfolioId)
				.realizedPAndL.findFirstOrThrow({
					select: select as Prisma.RealizedPAndLSelect,
					where: {
						accountId,
						createdAt: {
							gte: startOfYear,
						},
					},
					orderBy: {
						createdAt: 'desc',
					},
				});
			return realizedPAndL;
		} catch {
			// If we dont have one yet we need to create one
			return this.prismaService
				.rlsPortfolioClient(portfolioId)
				.$transaction(async (trx) => {
					await trx.account.update({
						data: {
							setRealizedValues: true,
						},
						where: {
							id: accountId,
						},
					});
					return trx.realizedPAndL.create({
						data: {
							account: {
								connect: {
									id: accountId,
								},
							},
							portfolio: {
								connect: {
									id: portfolioId,
								},
							},
						},
						select,
					});
				});
		}
	}

	async porfolioRealizedPAndL({
		portfolioId,
		year,
	}: {
		portfolioId: string;
		year?: number;
	}): Promise<PortfolioSummaryRealized> {
		const startOfYear = year
			? new Date(year, 0, 1)
			: new Date(new Date().getFullYear(), 0, 1);

		return executeWithRLS(this.db, portfolioId, async (trx) => {
			const sub = trx
				.selectFrom('RealizedPAndL')
				.selectAll()
				.where('createdAt', '>=', startOfYear)
				.where('portfolioId', '=', portfolioId)
				.orderBy('createdAt', 'desc')
				.distinctOn('accountId');

			return await trx
				.selectFrom(sub.as('account_p_l'))
				.select('account_p_l.portfolioId')
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.shortTermCapitalGain')
						.as('shortTermCapitalGain'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.longTermCapitalGain')
						.as('longTermCapitalGain'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.dividend').as('dividend'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.qualifiedDividend')
						.as('qualifiedDividend'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.nonQualifiedDividend')
						.as('nonQualifiedDividend'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.dividendReinvestment')
						.as('dividendReinvestment'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.interest').as('interest'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.interestReinvestment')
						.as('interestReinvestment'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.distribution').as('distribution'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.accountFee').as('accountFee'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.managementFee').as('managementFee'),
				)
				.select((eb) => eb.fn.sum<number>('account_p_l.fundFee').as('fundFee'))
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.taxWithheld').as('taxWithheld'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.nonResidentTax').as('nonResidentTax'),
				)
				.select((eb) => eb.fn.sum<number>('account_p_l.deposit').as('deposit'))
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.withdrawal').as('withdrawal'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.contribution').as('contribution'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.returnOfPrincipal')
						.as('returnOfPrincipal'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.loanPayment').as('loanPayment'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.marginExpense').as('marginExpense'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.stockDistribution')
						.as('stockDistribution'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.unqualifiedGain')
						.as('unqualifiedGain'),
				)
				.select((eb) => eb.fn.sum<number>('account_p_l.current').as('current'))
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.available').as('available'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>('account_p_l.unrealizedProfit')
						.as('unrealizedProfit'),
				)
				.select((eb) =>
					eb.fn.sum<number>('account_p_l.unrealizedLoss').as('unrealizedLoss'),
				)
				.select((eb) =>
					eb.fn
						.sum<number>(
							sql`"shortTermCapitalGain" + "longTermCapitalGain" + "dividend"`,
						)
						.as('gainTotal'),
				)
				.groupBy('account_p_l.portfolioId')
				.executeTakeFirstOrThrow();
		});
	}
}
