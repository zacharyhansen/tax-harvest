import { Injectable, Logger } from "@nestjs/common";

import { Database } from "../database/database";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
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
        displayName: "asc",
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
    });
  }

  getAccount(args: Prisma.AccountFindUniqueOrThrowArgs) {
    return this.prismaService.account.findUniqueOrThrow(args);
  }

  createAccountForPortfolio(accountInsertObject: Prisma.AccountCreateInput) {
    return this.prismaService.account.create({ data: accountInsertObject });
  }

  updateAccount(
    accountUpdateInput: Prisma.AccountUpdateInput,
    accountWhereUniqueInput: Prisma.AccountWhereUniqueInput,
  ) {
    return this.prismaService.account.update({
      data: accountUpdateInput,
      where: accountWhereUniqueInput,
    });
  }
}
