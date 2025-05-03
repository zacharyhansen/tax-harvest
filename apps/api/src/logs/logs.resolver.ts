import type { Prisma } from '@prisma/client'
import type { GraphQLResolveInfo } from 'graphql'

import type { ClerkClaims } from '../auth/types'
import type { LogsService } from './logs.service'

import type { PrismaService } from '~/prisma/prisma.service'
import type { PaginationProps } from '~/utilities/pagination'

import { Args, Info, Int, Query, Resolver } from '@nestjs/graphql'
import { ClerkContext } from '../auth/decorators/clerk-context.decorator'
import { Log, LogOrderByRelationAggregateInput } from '../generated/graphql'
import { PrismaSelect } from '../utilities/prisma/prisma-select'

@Resolver(() => Log)
export class LogsResolver {
  constructor(
    private readonly logsService: LogsService,
    private readonly prismaService: PrismaService,
  ) {}

  @Query(() => [Log], { nullable: false })
  logs(
    @ClerkContext()
    clerkContext: ClerkClaims,
    @Info()
    info: GraphQLResolveInfo,
    @Args('pagination', { nullable: true })
    pagination?: PaginationProps,
    @Args('orderBy', {
      nullable: true,
      type: () => LogOrderByRelationAggregateInput,
    })
    orderBy?: Prisma.LogOrderByWithRelationInput,
  ) {
    const { select } = new PrismaSelect<Prisma.LogSelect>(info).value
    return this.logsService.logs({
      select,
      where: {
        portfolioId: clerkContext.metadata.portfolioId,
      },
      skip: pagination?.skip,
      take: pagination?.take,
      orderBy: orderBy ?? { id: 'desc' },
    })
  }

  @Query(() => Int, { nullable: false })
  logsCount(
    @ClerkContext()
    clerkContext: ClerkClaims,
  ) {
    return this.prismaService.log.count({
      where: {
        portfolioId: clerkContext.metadata.portfolioId,
      },
    })
  }

  @Query(() => Log, { nullable: true })
  log(
    @Args('logId', { type: () => Int }) logId: number,
    @ClerkContext()
    clerkContext: ClerkClaims,
  ) {
    return this.prismaService.log.findUnique({
      where: { id: logId, portfolioId: clerkContext.metadata.portfolioId },
    })
  }
}
