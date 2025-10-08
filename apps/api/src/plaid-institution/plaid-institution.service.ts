import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '~/prisma/prisma.service';

/**
 * Service for managing Plaid institutions
 * @example
 * const institutions = await plaidInstitutionService.findMany({ where: { oauth: true } });
 */
@Injectable()
export class PlaidInstitutionService {
	constructor(private readonly prismaService: PrismaService) {}

	/**
	 * Find many institutions with optional filters
	 */
	async findMany(params: {
		select?: Prisma.PlaidInstitutionSelect;
		where?: Prisma.PlaidInstitutionWhereInput;
		orderBy?: Prisma.PlaidInstitutionOrderByWithRelationInput;
		skip?: number;
		take?: number;
	}) {
		return this.prismaService.rlsBypassClient().plaidInstitution.findMany({
			select: params.select,
			where: params.where,
			orderBy: params.orderBy || { name: 'asc' },
			skip: params.skip,
			take: params.take,
		});
	}

	/**
	 * Find one institution by ID
	 */
	async findOne(params: {
		select?: Prisma.PlaidInstitutionSelect;
		where: Prisma.PlaidInstitutionWhereUniqueInput;
	}) {
		return this.prismaService.rlsBypassClient().plaidInstitution.findUnique({
			select: params.select,
			where: params.where,
		});
	}

	/**
	 * Count institutions with optional filters
	 */
	async count(where?: Prisma.PlaidInstitutionWhereInput) {
		return this.prismaService.rlsBypassClient().plaidInstitution.count({
			where,
		});
	}
}
