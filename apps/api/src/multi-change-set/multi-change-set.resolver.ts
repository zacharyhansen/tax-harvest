import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import { ClerkContext } from '~/auth/decorators/clerk-context.decorator';
import { AdminGuard } from '~/auth/guards/admin.guard';
import type { ClerkClaims } from '~/auth/types';
import { PrismaSelect } from '~/utilities/prisma/prisma-select';
import {
	MultiChangeSet,
	MultiChangeSetUpdateInput,
} from '../generated/graphql';
import { PrismaService } from '../prisma/prisma.service';

/**
 * GraphQL resolver for MultiChangeSet operations
 */
@Resolver(() => MultiChangeSet)
export class MultiChangeSetResolver {
	constructor(private readonly prismaService: PrismaService) {}

	/**
	 * Query multiple MultiChangeSet records
	 */
	@Query(() => [MultiChangeSet], { name: 'multiChangeSets' })
	async multiChangeSets(
		@ClerkContext() { metadata }: ClerkClaims,
		@Info() info: GraphQLResolveInfo,
	) {
		const { select } = new PrismaSelect<Prisma.MultiChangeSetSelect>(info)
			.value;

		return this.prismaService
			.rlsPortfolioClient(metadata.portfolioId)
			.multiChangeSet.findMany({
				select,
			});
	}

	/**
	 * Query a single MultiChangeSet record
	 */
	@Query(() => MultiChangeSet, { name: 'multiChangeSet', nullable: true })
	async findOne(
		@ClerkContext() { metadata }: ClerkClaims,
		@Info() info: GraphQLResolveInfo,
		@Args('id') id: number,
	) {
		const { select } = new PrismaSelect<Prisma.MultiChangeSetSelect>(info)
			.value;

		return this.prismaService
			.rlsPortfolioClient(metadata.portfolioId)
			.multiChangeSet.findUnique({
				select,
				where: { id },
			});
	}

	/**
	 * Update an existing MultiChangeSet record
	 */
	@Mutation(() => MultiChangeSet, { name: 'updateMultiChangeSet' })
	async update(
		@ClerkContext() { metadata }: ClerkClaims,
		@Args('id') id: number,
		@Args('data', {
			nullable: false,
			type: () => MultiChangeSetUpdateInput,
		})
		data: Prisma.MultiChangeSetUpdateInput,
	) {
		return this.prismaService
			.rlsPortfolioClient(metadata.portfolioId)
			.multiChangeSet.update({
				data,
				where: { id },
			});
	}

	/**
	 * Admin query for all MultiChangeSets without RLS
	 */
	@UseGuards(AdminGuard)
	@Query(() => [MultiChangeSet], { name: 'adminMultiChangeSets' })
	async adminFindMany(
		@ClerkContext() claims: ClerkClaims,
		@Info() info: GraphQLResolveInfo,
	) {
		// Check if user has admin role
		if (claims.metadata.role !== 'admin') {
			throw new Error('Unauthorized: Admin access required');
		}

		const { select } = new PrismaSelect<Prisma.MultiChangeSetSelect>(info)
			.value;

		return this.prismaService.rlsBypassClient().multiChangeSet.findMany({
			select,
		});
	}
}
