import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import type { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import { PrismaService } from '~/prisma/prisma.service';
import { ClerkContext } from '../auth/decorators/clerk-context.decorator';
import type { ClerkClaims } from '../auth/types';
import {
	PlaidMerge,
	PlaidMergeOrderByRelationAggregateInput,
} from '../generated/graphql';
import { PrismaSelect } from '../utilities/prisma/prisma-select';

@Resolver(() => PlaidMerge)
export class PlaidMergeResolver {
	constructor(private readonly prismaService: PrismaService) {}

	@Query(() => [PlaidMerge], { nullable: false })
	plaidMerges(
		@ClerkContext()
		clerkContext: ClerkClaims,
		@Info()
		info: GraphQLResolveInfo,
		@Args('orderBy', {
			nullable: true,
			type: () => PlaidMergeOrderByRelationAggregateInput,
		})
		orderBy?: Prisma.PlaidMergeOrderByWithRelationInput,
	) {
		const { select } = new PrismaSelect<Prisma.PlaidMergeSelect>(info).value;

		return this.prismaService
			.rlsPortfolioClient(clerkContext.metadata.portfolioId)
			.plaidMerge.findMany({
				select,
				where: {
					portfolioId: clerkContext.metadata.portfolioId,
				},
				orderBy: orderBy ?? { createdAt: 'desc' },
			});
	}

	@Query(() => PlaidMerge, { nullable: true })
	plaidMerge(
		@Args('plaidMergeId', { type: () => String })
		plaidMergeId: string,
		@ClerkContext()
		clerkContext: ClerkClaims,
		@Info()
		info: GraphQLResolveInfo,
	) {
		const { select } = new PrismaSelect<Prisma.PlaidMergeSelect>(info).value;

		return this.prismaService
			.rlsPortfolioClient(clerkContext.metadata.portfolioId)
			.plaidMerge.findUnique({
				where: {
					id: plaidMergeId,
					portfolioId: clerkContext.metadata.portfolioId,
				},
				select,
			});
	}
}
