import type { GraphQLResolveInfo } from 'graphql'
import type { ClerkClaims } from '~/auth/types'
import {
  Args,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import { Prisma } from '@prisma/client'

import { ClerkContext } from '~/auth/decorators/clerk-context.decorator'

import { AuthConnectionService } from '../auth-connection/auth-connection.service'
import {
  Account,
  AccountCreateInput,
  AccountUpdateInput,
  AccountWhereInput,
  AccountWhereUniqueInput,
  RealizedPAndL,
} from '../generated/graphql'
import { RealizedPandLService } from '../realized-p-and-l/realized-p-and-l.service'
import { PrismaSelect } from '../utilities/prisma/prisma-select'
import { AccountService } from './account.service'

@Resolver(() => Account)
export class AccountResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly authConnectionService: AuthConnectionService,
    private readonly realizedPAndLService: RealizedPandLService,
  ) {}

  // @ResolveField(() => AuthConnectionExt, {
  //   description: "Auth Connection of the account with computed fields",
  //   name: "authConnectionExt",
  // })
  // authConnectionExt(
  //   @Info()
  //   info: GraphQLResolveInfo,
  //   @Parent() { authConnectionId }: Account,
  // ) {
  //   const { select } = new PrismaSelect<Prisma.AuthConnectionSelect>(info)
  //     .value;
  //   if (!authConnectionId) {
  //     throw new Error("Account has no auth connection");
  //   }
  //   return this.authConnectionService.getAuthConnection({
  //     id: authConnectionId,
  //     select,
  //   });
  // }

  @Query(() => [Account], {
    description: 'Get accounts that need setup',
    name: 'setupAccounts',
  })
  async setupAccounts(
    @ClerkContext() { metadata }: ClerkClaims,
    @Info() info: GraphQLResolveInfo,
  ) {
    const { select } = new PrismaSelect<Prisma.AccountSelect>(info).value

    return this.accountService.setupAccounts({
      id: metadata.portfolioId,
      select,
    })
  }

  @Query(() => Account, {
    description: 'Find a connected account by id',
    name: 'account',
  })
  async account(
    @Info()
    info: GraphQLResolveInfo,
    @Args('id', {
      type: () => String,
    })
    id: string,
  ): Promise<Account> {
    const { select } = new PrismaSelect<Prisma.AccountSelect>(info).value

    return this.accountService.getAccount({
      select,
      where: {
        id,
      },
    })
  }

  @Query(() => [Account], {
    description: 'Get accounts',
    name: 'accounts',
  })
  async accounts(
    @ClerkContext() { metadata }: ClerkClaims,
    @Info()
    info: GraphQLResolveInfo,
    @Args('where', { nullable: true, type: () => AccountWhereInput })
    where: AccountWhereInput,
  ) {
    const { select } = new PrismaSelect<Prisma.AccountSelect>(info).value
    return this.accountService.getAccountsWithPortfolioId(
      metadata.portfolioId,
      {
        select,
        where,
      },
    )
  }

  @Mutation(() => Account, {
    description: 'Create a new connected account',
    name: 'createAccountForPortfolio',
  })
  async createAccountForPortfolio(
    @ClerkContext() { metadata, sub }: ClerkClaims,
    @Args('accountCreateInput', {
      type: () => AccountCreateInput,
    })
    accountCreateInput: Prisma.AccountCreateInput,
  ): Promise<Account> {
    const inputWithUser: Prisma.AccountCreateInput = {
      ...accountCreateInput,
      createdBy: { connect: { id: sub } },
      portfolio: {
        connect: {
          id: metadata.portfolioId,
        },
      },
    }
    return this.accountService.createAccountForPortfolio(inputWithUser)
  }

  @Mutation(() => Account, {
    description: 'Update a connected account',
    name: 'updateAccount',
  })
  async updateAccount(
    @Args('accountUpdateInput', {
      type: () => AccountUpdateInput,
    })
    accountUpdateInput: Prisma.AccountUpdateInput,
    @Args('accountWhereUniqueInput', {
      type: () => AccountWhereUniqueInput,
    })
    accountWhereUniqueInput: Prisma.AccountWhereUniqueInput,
  ): Promise<Account> {
    return this.accountService.updateAccount(
      accountUpdateInput,
      accountWhereUniqueInput,
    )
  }

  @ResolveField(() => RealizedPAndL, { name: '_realizedProfitAndLoss' })
  async _realizedProfitAndLoss(
    @Parent() account: Account,
    @Info()
    info: GraphQLResolveInfo,
    @Args('year', { nullable: true, type: () => Number })
    year?: number,
  ): Promise<RealizedPAndL> {
    const { select } = new PrismaSelect<Prisma.RealizedPAndLSelect>(info).value

    return this.realizedPAndLService._realizedProfitAndLoss({
      accountId: account.id,
      select,
      year: year ?? new Date().getFullYear(),
      portfolioId: account.portfolioId,
    })
  }
}
