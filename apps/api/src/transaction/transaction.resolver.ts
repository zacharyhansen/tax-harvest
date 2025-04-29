import type { GraphQLResolveInfo } from "graphql";
import type { ClerkClaims } from "~/auth/types";

import { Args, Info, Query, Resolver } from "@nestjs/graphql";
import { Prisma } from "@prisma/client";

import { ClerkContext } from "~/auth/decorators/clerk-context.decorator";

import { Transaction, TransactionWhereInput } from "../generated/graphql";
import { PrismaSelect } from "../utilities/prisma/prisma-select";
import { TransactionService } from "./transaction.service";

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => Transaction, {
    description: "Find a connected transaction by id",
    name: "transaction",
  })
  async transaction(
    @Info()
    info: GraphQLResolveInfo,
    @Args("id", {
      type: () => String,
    })
    id: string,
  ): Promise<Transaction> {
    const { select } = new PrismaSelect<Prisma.TransactionSelect>(info).value;

    return this.transactionService.getTransaction({
      select,
      where: {
        id: id,
      },
    });
  }

  @Query(() => [Transaction], {
    description: "Get transactions",
    name: "transactions",
  })
  async transactions(
    @ClerkContext() { metadata }: ClerkClaims,
    @Info()
    info: GraphQLResolveInfo,
    @Args("where", { nullable: true, type: () => TransactionWhereInput })
    where: TransactionWhereInput,
  ) {
    const { select } = new PrismaSelect<Prisma.TransactionSelect>(info).value;
    return this.transactionService.getTransactionsWithPortfolioId(
      metadata.portfolioId,
      {
        select,
        where,
      },
    );
  }
}
