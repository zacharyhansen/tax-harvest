import { UseGuards } from '@nestjs/common';
import { Args, Info, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import { AdminGuard } from '~/auth/guards/admin.guard';
import {
	PlaidInstitution,
	PlaidInstitutionWhereInput,
} from '~/generated/graphql';
import { PlaidService } from '~/plaid/plaid.service';
import { PrismaSelect } from '~/utilities/prisma/prisma-select';
import { PlaidInstitutionService } from './plaid-institution.service';

/**
 * GraphQL resolver for Plaid institutions (admin-only)
 * Uses auto-generated Prisma GraphQL types from schema
 */
@Resolver(() => PlaidInstitution)
@UseGuards(AdminGuard)
export class PlaidInstitutionResolver {
	constructor(
		private readonly plaidInstitutionService: PlaidInstitutionService,
		private readonly plaidService: PlaidService,
	) {}

	/**
	 * Query all Plaid institutions with optional filtering and pagination
	 * @example
	 * query {
	 *   plaidInstitutions(where: { oauth: { equals: true } }, skip: 0, take: 500) {
	 *     id
	 *     name
	 *     oauth
	 *   }
	 * }
	 */
	@Query(() => [PlaidInstitution], {
		name: 'plaidInstitutions',
		description: 'Get all Plaid institutions (admin-only)',
	})
	async plaidInstitutions(
		@Info() info: GraphQLResolveInfo,
		@Args('where', { type: () => PlaidInstitutionWhereInput, nullable: true })
		where?: PlaidInstitutionWhereInput,
		@Args('skip', { type: () => Int, nullable: true })
		skip?: number,
		@Args('take', { type: () => Int, nullable: true })
		take?: number,
	) {
		const { select } = new PrismaSelect<Prisma.PlaidInstitutionSelect>(info)
			.value;

		return this.plaidInstitutionService.findMany({
			select,
			where,
			skip,
			take,
		});
	}

	/**
	 * Query a single Plaid institution by ID
	 * @example
	 * query {
	 *   plaidInstitution(institutionId: "ins_1") {
	 *     id
	 *     name
	 *     products
	 *     status
	 *   }
	 * }
	 */
	@Query(() => PlaidInstitution, {
		name: 'plaidInstitution',
		description: 'Get a single Plaid institution (admin-only)',
		nullable: true,
	})
	async plaidInstitution(
		@Info() info: GraphQLResolveInfo,
		@Args('institutionId', { type: () => String }) institutionId: string,
	) {
		const { select } = new PrismaSelect<Prisma.PlaidInstitutionSelect>(info)
			.value;

		return this.plaidInstitutionService.findOne({
			select,
			where: { id: institutionId },
		});
	}

	/**
	 * Get total count of institutions
	 * @example
	 * query {
	 *   plaidInstitutionsCount
	 * }
	 */
	@Query(() => Int, {
		name: 'plaidInstitutionsCount',
		description: 'Get total count of Plaid institutions (admin-only)',
	})
	async plaidInstitutionsCount(
		@Args('where', { type: () => PlaidInstitutionWhereInput, nullable: true })
		where?: PlaidInstitutionWhereInput,
	) {
		return this.plaidInstitutionService.count(where);
	}

	/**
	 * Manually trigger refresh of institutions from Plaid API
	 * @example
	 * mutation {
	 *   adminRefreshPlaidInstitutions
	 * }
	 */
	@Mutation(() => Boolean, {
		name: 'adminRefreshPlaidInstitutions',
		description: 'Manually refresh institutions from Plaid API (admin-only)',
	})
	async adminRefreshPlaidInstitutions(): Promise<boolean> {
		try {
			await this.plaidService.refreshAllInstitutions();
			return true;
		} catch {
			return false;
		}
	}
}
