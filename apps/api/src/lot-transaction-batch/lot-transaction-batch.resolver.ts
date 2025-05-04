import type { GraphQLResolveInfo } from 'graphql'
import type { ClerkClaims } from '../auth/types'
import { Args, Info, Query, Resolver } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { ClerkContext } from '../auth/decorators/clerk-context.decorator'
import {
  LotTransactionBatch,
  LotTransactionBatchOrderByRelationAggregateInput,
} from '../generated/graphql'
import { PrismaSelect } from '../utilities/prisma/prisma-select'
import { LotTransactionBatchService } from './lot-transaction-batch.service'

@Resolver(() => LotTransactionBatch)
export class LotTransactionBatchResolver {
  constructor(
    private readonly lotTransactionBatchService: LotTransactionBatchService,
    private readonly prismaService: PrismaService,
  ) {}

  @Query(() => [LotTransactionBatch], { nullable: false })
  lotTransactionBatches(
    @ClerkContext()
    clerkContext: ClerkClaims,
    @Info()
    info: GraphQLResolveInfo,
    @Args('orderBy', {
      nullable: true,
      type: () => LotTransactionBatchOrderByRelationAggregateInput,
    })
    orderBy?: Prisma.LotTransactionBatchOrderByWithRelationInput,
  ) {
    const { select } = new PrismaSelect<Prisma.LotTransactionBatchSelect>(info)
      .value
    return this.lotTransactionBatchService.lotTransactionBatches({
      select,
      where: {
        portfolioId: clerkContext.metadata.portfolioId,
      },
      orderBy: orderBy ?? { createdAt: 'desc' },
    })
  }

  @Query(() => LotTransactionBatch, { nullable: true })
  lotTransactionBatch(
    @Args('lotTransactionBatchId', { type: () => String })
    lotTransactionBatchId: string,
    @ClerkContext()
    clerkContext: ClerkClaims,
    @Info()
    info: GraphQLResolveInfo,
  ) {
    const { select } = new PrismaSelect<Prisma.LotTransactionBatchSelect>(info)
      .value
    return this.prismaService.lotTransactionBatch.findUnique({
      where: {
        id: lotTransactionBatchId,
        portfolioId: clerkContext.metadata.portfolioId,
      },
      select,
    })
  }
}
