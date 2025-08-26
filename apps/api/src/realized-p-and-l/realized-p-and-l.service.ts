import { Injectable, Logger } from '@nestjs/common';
import type { Prisma, RealizedPAndL } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RealizedPandLService {
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: <log>
	private readonly logger = new Logger(RealizedPandLService.name);
	constructor(private readonly prismaService: PrismaService) {}

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
			const realizedPAndL =
				// biome-ignore lint/suspicious/noTsIgnore: <excessive types>
				// @ts-ignore - ignore types
				await this.prismaService
					.$extends(PrismaService.forPortfolio(portfolioId))
					.realizedPAndL.findUniqueOrThrow({
						select: select as Prisma.RealizedPAndLSelect,
						where: {
							accountId_year: {
								accountId,
								year,
							},
						},
					});
			return realizedPAndL;
		} catch {
			return this.prismaService
				.$extends(PrismaService.forPortfolio(portfolioId))
				.$transaction(async (trx) => {
					await trx.account.update({
						data: {
							setRealizedValues: true,
						},
						where: {
							id: accountId,
						},
					});
					// biome-ignore lint/suspicious/noTsIgnore: <ok>
					// @ts-ignore - ignore types
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
							year,
						},
						select,
					});
				});
		}
	}
}
