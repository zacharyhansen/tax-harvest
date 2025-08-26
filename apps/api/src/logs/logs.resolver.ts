import { Args, Info, Int, Query, Resolver } from '@nestjs/graphql';
import type { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import { PrismaService } from '~/prisma/prisma.service';
import { PaginationProps } from '~/utilities/pagination';
import { ClerkContext } from '../auth/decorators/clerk-context.decorator';
import type { ClerkClaims } from '../auth/types';
import { Log, LogOrderByRelationAggregateInput } from '../generated/graphql';
import { PrismaSelect } from '../utilities/prisma/prisma-select';
import { LogsService } from './logs.service';

@Resolver(() => Log)
export class LogsResolver {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly logsService: LogsService,
	) {}

	@Query(() => [Log], { nullable: false })
	async logs(
		@ClerkContext()
		clerkContext: ClerkClaims,
		@Info()
		info: GraphQLResolveInfo,
		@Args('pagination', { nullable: true })
		pagination?: PaginationProps,
		@Args('orderBy', {
			nullable: true,
			type: () => LogOrderByRelationAggregateInput,
		})
		orderBy?: Prisma.LogOrderByWithRelationInput,
	): Promise<Log[]> {
		const { select } = new PrismaSelect<Prisma.LogSelect>(info).value;
		const logs = await this.logsService.logs(
			clerkContext.metadata.portfolioId,
			{
				select,
				where: {
					portfolioId: clerkContext.metadata.portfolioId,
				},
				skip: pagination?.skip,
				take: pagination?.take,
				orderBy: orderBy ?? { id: 'desc' },
			},
		);
		// TODO: fix this
		// @ts-expect-error cant get big int sclar to work
		return logs.map((log) => ({
			...log,
			id: log.id.toString(),
		}));
	}

	@Query(() => Int, { nullable: false })
	logsCount(
		@ClerkContext()
		clerkContext: ClerkClaims,
	) {
		return this.prismaService
			.$extends(PrismaService.forPortfolio(clerkContext.metadata.portfolioId))
			.log.count({
				where: {
					portfolioId: clerkContext.metadata.portfolioId,
				},
			});
	}

	@Query(() => Log, { nullable: true })
	log(
		@Args('logId', { type: () => Int }) logId: number,
		@ClerkContext()
		clerkContext: ClerkClaims,
	) {
		return this.prismaService
			.$extends(PrismaService.forPortfolio(clerkContext.metadata.portfolioId))
			.log.findUniqueOrThrow({
				where: { id: logId, portfolioId: clerkContext.metadata.portfolioId },
			})
			.then((log) => ({
				...log,
				id: log?.id?.toString(),
			}));
	}
}
