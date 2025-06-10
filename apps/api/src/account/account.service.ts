import { Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { Database } from '../database/database'
import { PrismaService } from '../prisma/prisma.service'

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
    return this.prismaService.$extends(PrismaService.forPortfolio(portfolioId)).account.findMany({
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
    return this.prismaService.$extends(PrismaService.forPortfolio(id)).account.findMany({
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

  getAccount(portfolioId: string, args: Prisma.AccountFindUniqueOrThrowArgs) {
    return this.prismaService.$extends(PrismaService.forPortfolio(portfolioId)).account.findUniqueOrThrow(args)
  }

  createAccountForPortfolio(accountInsertObject: Prisma.AccountCreateInput) {
    return this.prismaService.$extends(PrismaService.forPortfolio(accountInsertObject.portfolio!.connect!.id!)).account.create({ data: accountInsertObject })
  }

  updateAccount(
    accountUpdateInput: Prisma.AccountUpdateInput,
    accountWhereUniqueInput: Prisma.AccountWhereUniqueInput,
    portfolioId: string,
  ) {
    return this.prismaService.$extends(PrismaService.forPortfolio(portfolioId)).account.update({
      data: accountUpdateInput,
      where: {
        ...accountWhereUniqueInput,
        portfolioId,
      },
    })
  }
}
