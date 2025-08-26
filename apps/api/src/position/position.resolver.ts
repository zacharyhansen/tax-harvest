import { Info, Query, Resolver } from '@nestjs/graphql';
import type { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import { ClerkContext } from '../auth/decorators/clerk-context.decorator';
import type { ClerkClaims } from '../auth/types';
import { Position } from '../generated/graphql';
import { PrismaSelect } from '../utilities/prisma/prisma-select';
import { PositionService } from './position.service';

@Resolver(() => Position)
export class PositionResolver {
	constructor(private readonly positionService: PositionService) {}

	@Query(() => [Position], { name: 'portfolioPositions', nullable: false })
	portfolioPositions(
		@ClerkContext()
		clerkContext: ClerkClaims,
		@Info()
		info: GraphQLResolveInfo,
	) {
		const { select } = new PrismaSelect<Prisma.PositionSelect>(info).value;
		return this.positionService.portfolioPositions({
			portfolioId: clerkContext.metadata.portfolioId,
			select,
		});
	}
}
