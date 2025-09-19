import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import type { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import { ClerkContext } from '~/auth/decorators/clerk-context.decorator';
import type { ClerkClaims } from '~/auth/types';
import { RealizedPAndL, RealizedPAndLUpdateInput } from '../generated/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaSelect } from '../utilities/prisma/prisma-select';

@Resolver()
export class RealizedPandLResolver {
	constructor(private readonly prismaService: PrismaService) {}

	@Mutation(() => RealizedPAndL, {
		description: 'Update RealizedPAndL',
		name: 'updateRealizedPAndL',
	})
	async updateRealizedPAndL(
		@Info()
		info: GraphQLResolveInfo,
		@Args('id', {
			type: () => String,
		})
		id: string,
		@Args('input', {
			type: () => RealizedPAndLUpdateInput,
		})
		input: Prisma.RealizedPAndLUpdateInput,
		@ClerkContext()
		clerkContext: ClerkClaims,
	): Promise<RealizedPAndL> {
		const { select } = new PrismaSelect(info).value;

		return this.prismaService
			.rlsPortfolioClient(clerkContext.metadata.portfolioId)
			.realizedPAndL.update({
				data: input,
				select: select as Prisma.RealizedPAndLSelect,
				where: { id, portfolioId: clerkContext.metadata.portfolioId },
			});
	}
}
