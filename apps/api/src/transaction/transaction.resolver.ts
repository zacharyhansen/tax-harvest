import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import type { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import { ClerkContext } from '~/auth/decorators/clerk-context.decorator';
import type { ClerkClaims } from '~/auth/types';
import { PrismaService } from '~/prisma/prisma.service';
import { Transaction, TransactionWhereInput } from '../generated/graphql';
import { PrismaSelect } from '../utilities/prisma/prisma-select';
import { TransactionService } from './transaction.service';

@Resolver(() => Transaction)
export class TransactionResolver {
	constructor(
		private readonly transactionService: TransactionService,
		private readonly prismaService: PrismaService,
	) {}

	@Query(() => Transaction, {
		description: 'Find a connected transaction by id',
		name: 'transaction',
	})
	async transaction(
		@Info()
		info: GraphQLResolveInfo,
		@Args('id', {
			type: () => String,
		})
		id: string,
		@ClerkContext() { metadata }: ClerkClaims,
	): Promise<Transaction> {
		const { select } = new PrismaSelect<Prisma.TransactionSelect>(info).value;

		return this.prismaService
			.$extends(PrismaService.forPortfolio(metadata.portfolioId))
			.transaction.findUniqueOrThrow({
				select,
				where: {
					id,
					portfolioId: {
						equals: metadata.portfolioId,
					},
				},
			});
	}

	@Query(() => [Transaction], {
		description: 'Get transactions',
		name: 'transactions',
	})
	async transactions(
		@ClerkContext() { metadata }: ClerkClaims,
		@Info()
		info: GraphQLResolveInfo,
		@Args('where', { nullable: true, type: () => TransactionWhereInput })
		where: TransactionWhereInput,
	) {
		const { select } = new PrismaSelect<Prisma.TransactionSelect>(info).value;
		return this.transactionService.getTransactionsWithPortfolioId(
			metadata.portfolioId,
			{
				select,
				where,
			},
		);
	}
}
