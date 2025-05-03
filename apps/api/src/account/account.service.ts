import type { Prisma } from '@prisma/client'
import type { Database } from '../database/database'

import type { PrismaService } from '../prisma/prisma.service'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name)
  constructor(
    private readonly db: Database,
    private readonly prismaService: PrismaService,
  ) {}

  getAccountsWithPortfolioId(
    portfolioId: string,
    args: Prisma.AccountFindManyArgs,
  ) {
    return this.prismaService.account.findMany({
      ...args,
      orderBy: {
        name: 'asc',
      },
      where: {
        AND: [
          {
            portfolioId: {
              equals: portfolioId,
            },
          },
          args.where ?? {},
        ],
      },
    })
  }

  async setupAccounts({
    id,
    select,
  }: {
    id: string
    select: Prisma.AccountSelect
  }) {
    return this.prismaService.account.findMany({
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
    })
  }

  getAccount(args: Prisma.AccountFindUniqueOrThrowArgs) {
    return this.prismaService.account.findUniqueOrThrow(args)
  }

  createAccountForPortfolio(accountInsertObject: Prisma.AccountCreateInput) {
    return this.prismaService.account.create({ data: accountInsertObject })
  }

  updateAccount(
    accountUpdateInput: Prisma.AccountUpdateInput,
    accountWhereUniqueInput: Prisma.AccountWhereUniqueInput,
  ) {
    return this.prismaService.account.update({
      data: accountUpdateInput,
      where: accountWhereUniqueInput,
    })
  }
}
