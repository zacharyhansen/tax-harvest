import type { GraphQLResolveInfo } from 'graphql'
import type { ClerkClaims } from '../auth/types'
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { ClerkContext } from '../auth/decorators/clerk-context.decorator'
import { Account } from '../generated/graphql'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaSelect } from '../utilities/prisma/prisma-select'
import { PlaidInstitutionInfo, PlaidLinkOnSuccessMetadata } from './plaid.dto'
import { PlaidService } from './plaid.service'

@Resolver()
export class PlaidResolver {
  constructor(
    private readonly plaidService: PlaidService,
    private readonly prismaService: PrismaService,
  ) { }

  @Query(() => String, {
    description: 'Get plaid link token for user',
    name: 'linkToken',
  })
  async linkToken(
    @Info()
    info: GraphQLResolveInfo,
    @ClerkContext()
    currentUser: ClerkClaims,
    @Args('authConnectionId', { type: () => String, nullable: true })
    authConnectionId?: string,
  ) {
    const plaidResponse = await this.plaidService.linkToken({
      userId: currentUser.sub,
      portfolioId: currentUser.metadata.portfolioId,
      authConnectionId,
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
    @Args('existingAccountId', {
      nullable: true,
      type: () => String,
    })
    existingAccountId?: string,
  ) {
    const { select } = new PrismaSelect<Prisma.AccountSelect>(info).value

    const accounts = await this.plaidService.setAccessToken({
      metaData,
      portfolioId: currentUser.metadata.portfolioId,
      publicToken,
      userId: currentUser.sub,
      existingAccountId,
    })

    return this.prismaService.$extends(PrismaService.forPortfolio(currentUser.metadata.portfolioId)).account.findMany({
      select,
      where: {
        id: { in: accounts.map(a => a.id) },
      },
    })
  }

  /**
   * Get institution information from Plaid
   * @param institutionId - The Plaid institution ID
   * @returns Institution information including name, logo, colors, etc.
   * @example
   * query {
   *   plaidInstitution(institutionId: "ins_3") {
   *     name
   *     logo
   *     primary_color
   *   }
   * }
   */
  @Query(() => PlaidInstitutionInfo, {
    description: 'Get institution information from Plaid',
    name: 'plaidInstitution',
  })
  async plaidInstitution(
    @Args('institutionId', { type: () => String })
    institutionId: string,
  ) {
    return this.plaidService.getInstitution(institutionId)
  }
}
