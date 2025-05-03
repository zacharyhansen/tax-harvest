import type { Prisma } from '@prisma/client'

import type { GraphQLResolveInfo } from 'graphql'
import type { ClerkClaims } from '../auth/types'
import type { PrismaService } from '../prisma/prisma.service'

import type { PlaidService } from './plaid.service'
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ClerkContext } from '../auth/decorators/clerk-context.decorator'
import { Account } from '../generated/graphql'
import { PrismaSelect } from '../utilities/prisma/prisma-select'
import { PlaidLinkOnSuccessMetadata } from './plaid.dto'

@Resolver()
export class PlaidResolver {
  constructor(
    private readonly plaidService: PlaidService,
    private readonly prismaService: PrismaService,
  ) {}

  @Query(() => String, {
    description: 'Get plaid link token for user',
    name: 'linkToken',
  })
  async linkToken(
    @Info()
    info: GraphQLResolveInfo,
    @ClerkContext()
    currentUser: ClerkClaims,
  ) {
    const plaidResponse = await this.plaidService.linkToken({
      userId: currentUser.sub,
    })

    return plaidResponse.data.link_token
  }

  @Mutation(() => [Account], {
    description:
      'Set up plaid auth connection and create accounts from syncing plaid',
    name: 'setAccessTokenAndSyncAccounts',
  })
  async setAccessTokenAndSyncAccounts(
    @Info()
    info: GraphQLResolveInfo,
    @ClerkContext()
    currentUser: ClerkClaims,
    @Args('publicToken', {
      nullable: false,
      type: () => String,
    })
    publicToken: string,
    @Args('metaData', {
      nullable: false,
      type: () => PlaidLinkOnSuccessMetadata,
    })
    metaData: PlaidLinkOnSuccessMetadata,
  ) {
    const { select } = new PrismaSelect<Prisma.AccountSelect>(info).value

    const accounts = await this.plaidService.setAccessToken({
      metaData,
      portfolioId: currentUser.metadata.portfolioId,
      publicToken,
      userId: currentUser.sub,
    })

    return this.prismaService.account.findMany({
      select,
      where: {
        id: { in: accounts.map(a => a.id) },
      },
    })
  }
}
