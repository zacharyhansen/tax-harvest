import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import type { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import { PrismaService } from '~/prisma/prisma.service';
import { ClerkContext } from '../auth/decorators/clerk-context.decorator';
import type { ClerkClaims } from '../auth/types';
import {
	LotTransactionBatch,
	LotTransactionBatchOrderByRelationAggregateInput,
} from '../generated/graphql';
import { PrismaSelect } from '../utilities/prisma/prisma-select';
import { LotTransactionBatchService } from './lot-transaction-batch.service';

@Resolver(() => LotTransactionBatch)
export class LotTransactionBatchResolver {
	constructor(
		readonly _lotTransactionBatchService: LotTransactionBatchService,
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
			.value;
		return this.prismaService
			.$extends(PrismaService.forPortfolio(clerkContext.metadata.portfolioId))
			.lotTransactionBatch.findMany({
				select,
				where: {
					portfolioId: clerkContext.metadata.portfolioId,
				},
				orderBy: orderBy ?? { createdAt: 'desc' },
			});
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
			.value;
		return this.prismaService
			.$extends(PrismaService.forPortfolio(clerkContext.metadata.portfolioId))
			.lotTransactionBatch.findUnique({
				where: {
					id: lotTransactionBatchId,
					portfolioId: clerkContext.metadata.portfolioId,
				},
				select,
			});
	}
}
