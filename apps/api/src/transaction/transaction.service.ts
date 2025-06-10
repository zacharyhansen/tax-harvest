import { Injectable, Logger } from '@nestjs/common'

import { Prisma } from '@prisma/client'
import { Database } from '../database/database'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name)
  constructor(
    private readonly db: Database,
    private readonly prismaService: PrismaService,
  ) {}

  async getTransactionsWithPortfolioId(
    portfolioId: string,
    args: Prisma.TransactionFindManyArgs,
  ) {
    return this.prismaService.$extends(PrismaService.forPortfolio(portfolioId)).transaction.findMany({
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
    })
  }
}
