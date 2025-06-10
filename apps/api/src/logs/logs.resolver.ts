import type { GraphQLResolveInfo } from 'graphql'
import type { ClerkClaims } from '../auth/types'
import { Args, Info, Int, Query, Resolver } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { PaginationProps } from '~/utilities/pagination'
import { ClerkContext } from '../auth/decorators/clerk-context.decorator'
import { Log, LogOrderByRelationAggregateInput } from '../generated/graphql'
import { PrismaSelect } from '../utilities/prisma/prisma-select'
import { LogsService } from './logs.service'

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
    return this.logsService.logs(clerkContext.metadata.portfolioId, {
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
    return this.prismaService.$extends(this.prismaService.forPortfolio(clerkContext.metadata.portfolioId)).log.count({
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
    return this.prismaService.$extends(this.prismaService.forPortfolio(clerkContext.metadata.portfolioId)).log.findUnique({
      where: { id: logId, portfolioId: clerkContext.metadata.portfolioId },
    })
  }
}
