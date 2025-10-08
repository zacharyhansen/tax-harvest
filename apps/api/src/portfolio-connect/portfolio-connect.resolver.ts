import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import { PrismaService } from '~/prisma/prisma.service';
import { PrismaSelect } from '~/utilities/prisma/prisma-select';
import { ClerkContext } from '../auth/decorators/clerk-context.decorator';
import type { ClerkClaims } from '../auth/types';
import {
	PlaidInstitution,
	PortfolioConnect,
	PortfolioConnectUpdateInput,
	PortfolioConnectWhereInput,
} from '../generated/graphql';

const ALLOWED_INSTITUTIONS = ['ins_129473', 'ins_11', 'ins_110003'];

@Resolver(() => PortfolioConnect)
export class PortfolioConnectResolver {
	constructor(private readonly prismaService: PrismaService) {}

	@Query(() => PortfolioConnect)
	async portfolioConnect(
		@ClerkContext()
		{ metadata }: ClerkClaims,
		@Info()
		info: GraphQLResolveInfo,
		@Args('id') id: string,
	): Promise<PortfolioConnect> {
		const { select } = new PrismaSelect<Prisma.PortfolioConnectSelect>(info)
			.value;

		return this.prismaService
			.rlsPortfolioClient(metadata.portfolioId)
			.portfolioConnect.findUniqueOrThrow({
				where: {
					id,
				},
				select,
			});
	}

	@Query(() => [PlaidInstitution])
	async newConnectPlaidInstitutionOptions(
		@ClerkContext()
		{ metadata }: ClerkClaims,
		@Info()
		info: GraphQLResolveInfo,
	): Promise<PlaidInstitution[]> {
		const { select } = new PrismaSelect<Prisma.PlaidInstitutionSelect>(info)
			.value;

		const existingConnectedPlaidInstitutions = await this.prismaService
			.rlsPortfolioClient(metadata.portfolioId)
			.portfolioConnect.findMany({
				where: {
					portfolioId: metadata.portfolioId,
				},
				select: {
					plaidInstitutionId: true,
				},
			});

		return this.prismaService
			.rlsPortfolioClient(metadata.portfolioId)
			.plaidInstitution.findMany({
				where: {
					id: {
						notIn: existingConnectedPlaidInstitutions.map(
							(p) => p.plaidInstitutionId,
						),
						in: ALLOWED_INSTITUTIONS,
					},
				},
				select,
			});
	}

	@Query(() => [PortfolioConnect])
	async portfolioConnections(
		@ClerkContext()
		{ metadata }: ClerkClaims,
		@Info()
		info: GraphQLResolveInfo,
		@Args('where', { type: () => PortfolioConnectWhereInput, nullable: true })
		where: Prisma.PortfolioConnectWhereInput,
	): Promise<PortfolioConnect[]> {
		const { select } = new PrismaSelect<Prisma.PortfolioConnectSelect>(info)
			.value;

		return this.prismaService
			.rlsPortfolioClient(metadata.portfolioId)
			.portfolioConnect.findMany({
				where,
				select,
			});
	}

	@Mutation(() => PortfolioConnect)
	async createPortfolioConnect(
		@ClerkContext()
		{ metadata }: ClerkClaims,
		@Info()
		info: GraphQLResolveInfo,
		@Args('plaidInstitutionId')
		plaidInstitutionId: string,
	): Promise<PortfolioConnect> {
		const { select } = new PrismaSelect<Prisma.PortfolioConnectSelect>(info)
			.value;

		return this.prismaService
			.rlsPortfolioClient(metadata.portfolioId)
			.portfolioConnect.create({
				data: {
					plaidInstitutionId,
					portfolioId: metadata.portfolioId,
				},
				select,
			});
	}

	@Mutation(() => PortfolioConnect)
	async deletePortfolioConnect(
		@ClerkContext()
		{ metadata }: ClerkClaims,
		@Info()
		info: GraphQLResolveInfo,
		@Args('id')
		id: string,
	): Promise<PortfolioConnect> {
		const { select } = new PrismaSelect<Prisma.PortfolioConnectSelect>(info)
			.value;

		return this.prismaService
			.rlsPortfolioClient(metadata.portfolioId)
			.portfolioConnect.delete({
				where: {
					id,
					portfolioId: metadata.portfolioId,
				},
				select,
			});
	}

	@Mutation(() => PortfolioConnect)
	async updatePortfolioConnect(
		@ClerkContext()
		{ metadata }: ClerkClaims,
		@Info()
		info: GraphQLResolveInfo,
		@Args('id') id: string,
		@Args('data', { type: () => PortfolioConnectUpdateInput })
		data: Prisma.PortfolioConnectUpdateInput,
	): Promise<PortfolioConnect> {
		const { select } = new PrismaSelect<Prisma.PortfolioConnectSelect>(info)
			.value;

		return this.prismaService
			.rlsPortfolioClient(metadata.portfolioId)
			.portfolioConnect.update({
				where: {
					id,
				},
				data,
				select,
			});
	}
}
