import type { GraphQLResolveInfo } from 'graphql'
import type { ClerkClaims } from '~/auth/types'
import {
  Args,
  Field,
  Info,
  Mutation,
  ObjectType,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import { Prisma } from '@prisma/client'

import { PrismaService } from '~/prisma/prisma.service'

import { ClerkContext } from '../auth/decorators/clerk-context.decorator'
import { AuthConnection, AuthSource } from '../generated/graphql'
import { PrismaSelect } from '../utilities/prisma/prisma-select'
import { AuthConnectionService } from './auth-connection.service'

@ObjectType()
export class AuthConnectionExt extends AuthConnection {
  @Field(() => Boolean)
  _requiresReAuth: boolean
}

@Resolver(() => AuthConnectionExt)
export class AuthConnectionResolver {
  constructor(
    private readonly authConnectionService: AuthConnectionService,
    private readonly prismaService: PrismaService,
  ) {}

  @Query(() => AuthConnectionExt, { name: 'authConnection', nullable: false })
  authConnection(
    @Info()
    info: GraphQLResolveInfo,
    @ClerkContext()
    currentUser: ClerkClaims,
    @Args('id', { type: () => String })
    id: string,
  ) {
    const { select } = new PrismaSelect<Prisma.AuthConnectionSelect>(info)
      .value

    return this.prismaService.authConnection.findUnique({
      select,
      where: {
        id,
        userId: currentUser.sub,
      },
    })
  }

  @Query(() => AuthConnectionExt)
  requestOauthConnection(
    @ClerkContext()
    currentUser: ClerkClaims,
    @Args('portfolioId', {
      type: () => String,
    })
    portfolioId: string,
    @Args('authSource', {
      type: () => AuthSource,
    })
    authSource: AuthSource,
  ) {
    return this.authConnectionService.resolveRequestOauth({
      authSource,
      portfolioId,
      userId: currentUser.sub,
    })
  }

  @Mutation(() => AuthConnectionExt)
  accessOauthConnection(
    @Info()
    info: GraphQLResolveInfo,
    @ClerkContext()
    currentUser: ClerkClaims,
    @Args('verifier', {
      type: () => String,
    })
    verifier: string,
    @Args('portfolioId', {
      type: () => String,
    })
    portfolioId: string,
    @Args('authSource', {
      type: () => AuthSource,
    })
    authSource: AuthSource,
  ) {
    const { select } = new PrismaSelect<Prisma.AuthConnectionSelect>(info)
      .value

    return this.authConnectionService.resolveAccessOauth({
      authSource,
      portfolioId,
      select,
      userId: currentUser.sub,
      verifier,
    })
  }

  @Mutation(() => AuthConnectionExt)
  syncAuthConnection(
    @Info()
    info: GraphQLResolveInfo,
    @ClerkContext()
    currentUser: ClerkClaims,
    @Args('id', { type: () => String })
    id: string,
  ) {
    const { select } = new PrismaSelect<Prisma.AuthConnectionSelect>(info)
      .value
    return this.authConnectionService.syncAuthConnection({
      id,
      select,
      userId: currentUser.sub,
    })
  }

  @ResolveField(() => Boolean, {
    description: 'Does the auth connection need to be refreshed',
    name: '_requiresReAuth',
  })
  _requiresReAuth(@Parent() { authedAt, source }: AuthConnection) {
    return this.authConnectionService.requiresReAuth(source, authedAt)
  }
}
