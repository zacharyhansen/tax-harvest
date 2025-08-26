import { Injectable } from '@nestjs/common';

import type { Prisma } from '@prisma/client';
import { Database } from '../database/database';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
	constructor(
		readonly _db: Database,
		private readonly prismaService: PrismaService,
	) {}

	async getTransactionsWithPortfolioId(
		portfolioId: string,
		args: Prisma.TransactionFindManyArgs,
	) {
		return this.prismaService
			.$extends(PrismaService.forPortfolio(portfolioId))
			.transaction.findMany({
				...args,
				orderBy: {
					transactionDate: 'desc',
				},
				where: {
					account: {
						portfolioId: {
							equals: portfolioId,
						},
					},
				},
			});
	}
}
