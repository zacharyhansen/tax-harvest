import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import { ClerkContext } from '~/auth/decorators/clerk-context.decorator';
import { AdminGuard } from '~/auth/guards/admin.guard';
import type { ClerkClaims } from '~/auth/types';
import { PrismaSelect } from '~/utilities/prisma/prisma-select';
import { MergeError, MergeErrorUpdateInput } from '../generated/graphql';
import { PrismaService } from '../prisma/prisma.service';

/**
 * GraphQL resolver for MultiChangeSet operations
 */
@Resolver(() => MergeError)
export class MultiChangeSetResolver {
	constructor(private readonly prismaService: PrismaService) {}

	/**
	 * Query multiple MultiChangeSet records
	 */
	@Query(() => [MergeError], { name: 'mergeErrors' })
	async mergeErrors(
		@ClerkContext() { metadata }: ClerkClaims,
		@Info() info: GraphQLResolveInfo,
	) {
		const { select } = new PrismaSelect<Prisma.MergeErrorSelect>(info).value;

		return this.prismaService
			.rlsPortfolioClient(metadata.portfolioId)
			.mergeError.findMany({
				select,
			});
	}

	/**
	 * Query a single MultiChangeSet record
	 */
	@Query(() => MergeError, { name: 'mergeError', nullable: true })
	async findOne(
		@ClerkContext() { metadata }: ClerkClaims,
		@Info() info: GraphQLResolveInfo,
		@Args('id', { type: () => String }) id: string,
	) {
		const { select } = new PrismaSelect<Prisma.MergeErrorSelect>(info).value;

		return this.prismaService
			.rlsPortfolioClient(metadata.portfolioId)
			.mergeError.findUnique({
				select,
				where: { id },
			});
	}

	/**
	 * Update an existing MultiChangeSet record
	 */
	@Mutation(() => MergeError, { name: 'updateMergeError' })
	async update(
		@ClerkContext() { metadata }: ClerkClaims,
		@Args('id', { type: () => String }) id: string,
		@Args('data', {
			nullable: false,
			type: () => MergeErrorUpdateInput,
		})
		data: Prisma.MergeErrorUpdateInput,
	) {
		return this.prismaService
			.rlsPortfolioClient(metadata.portfolioId)
			.mergeError.update({
				data,
				where: { id },
			});
	}

	/**
	 * Admin query for all MultiChangeSets without RLS
	 */
	@UseGuards(AdminGuard)
	@Query(() => [MergeError], { name: 'adminMergeErrors' })
	async adminFindMany(
		@ClerkContext() claims: ClerkClaims,
		@Info() info: GraphQLResolveInfo,
	) {
		// Check if user has admin role
		if (claims.metadata.role !== 'admin') {
			throw new Error('Unauthorized: Admin access required');
		}

		const { select } = new PrismaSelect<Prisma.MergeErrorSelect>(info).value;

		return this.prismaService.rlsBypassClient().mergeError.findMany({
			select,
		});
	}
}
