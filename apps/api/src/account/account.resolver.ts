import {
	Args,
	Info,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import type { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import { ClerkContext } from '~/auth/decorators/clerk-context.decorator';
import type { ClerkClaims } from '~/auth/types';

import { AuthConnectionService } from '../auth-connection/auth-connection.service';
import {
	Account,
	AccountCreateInput,
	AccountUpdateInput,
	AccountWhereInput,
	AccountWhereUniqueInput,
	RealizedPAndL,
} from '../generated/graphql';
import { RealizedPandLService } from '../realized-p-and-l/realized-p-and-l.service';
import { PrismaSelect } from '../utilities/prisma/prisma-select';
import { AccountService } from './account.service';

@Resolver(() => Account)
export class AccountResolver {
	constructor(
		private readonly accountService: AccountService,
		readonly _authConnectionService: AuthConnectionService,
		private readonly realizedPAndLService: RealizedPandLService,
	) {}

	@Query(() => [Account], {
		description: 'Get accounts that need setup',
		name: 'setupAccounts',
	})
	async setupAccounts(
		@ClerkContext() { metadata }: ClerkClaims,
		@Info() info: GraphQLResolveInfo,
	) {
		const { select } = new PrismaSelect<Prisma.AccountSelect>(info).value;

		return this.accountService.setupAccounts({
			id: metadata.portfolioId,
			select,
		});
	}

	@Query(() => Account, {
		description: 'Find a connected account by id',
		name: 'account',
	})
	async account(
		@Info()
		info: GraphQLResolveInfo,
		@Args('id', {
			type: () => String,
		})
		id: string,
		@ClerkContext() { metadata }: ClerkClaims,
	): Promise<Account> {
		const { select } = new PrismaSelect<Prisma.AccountSelect>(info).value;

		return this.accountService.getAccount(metadata.portfolioId, {
			select,
			where: {
				id,
			},
		});
	}

	@Query(() => [Account], {
		description: 'Get accounts',
		name: 'accounts',
	})
	async accounts(
		@ClerkContext() { metadata }: ClerkClaims,
		@Info()
		info: GraphQLResolveInfo,
		@Args('where', { nullable: true, type: () => AccountWhereInput })
		where: AccountWhereInput,
	) {
		const { select } = new PrismaSelect<Prisma.AccountSelect>(info).value;
		return this.accountService.getAccountsWithPortfolioId(
			metadata.portfolioId,
			{
				select,
				where,
			},
		);
	}

	@Mutation(() => Account, {
		description: 'Create a new connected account',
		name: 'createAccountForPortfolio',
	})
	async createAccountForPortfolio(
		@ClerkContext() { metadata, sub }: ClerkClaims,
		@Args('accountCreateInput', {
			type: () => AccountCreateInput,
		})
		accountCreateInput: Prisma.AccountCreateInput,
	): Promise<Account> {
		const inputWithUser: Prisma.AccountCreateInput = {
			...accountCreateInput,
			createdBy: { connect: { id: sub } },
			portfolio: {
				connect: {
					id: metadata.portfolioId,
				},
			},
		};
		return this.accountService.createAccountForPortfolio(inputWithUser);
	}

	@Mutation(() => Account, {
		description: 'Update a connected account',
		name: 'updateAccount',
	})
	async updateAccount(
		@Args('accountUpdateInput', {
			type: () => AccountUpdateInput,
		})
		accountUpdateInput: Prisma.AccountUpdateInput,
		@Args('accountWhereUniqueInput', {
			type: () => AccountWhereUniqueInput,
		})
		accountWhereUniqueInput: Prisma.AccountWhereUniqueInput,
		@ClerkContext() { metadata }: ClerkClaims,
	): Promise<Account> {
		return this.accountService.updateAccount(
			accountUpdateInput,
			accountWhereUniqueInput,
			metadata.portfolioId,
		);
	}

	@Mutation(() => Account, {
		description: 'Delete a connected account and all associated data',
		name: 'deleteAccount',
	})
	async deleteAccount(
		@Args('accountWhereUniqueInput', {
			type: () => AccountWhereUniqueInput,
		})
		accountWhereUniqueInput: Prisma.AccountWhereUniqueInput,
		@ClerkContext() { metadata }: ClerkClaims,
	): Promise<Account> {
		return this.accountService.deleteAccount(
			accountWhereUniqueInput,
			metadata.portfolioId,
		);
	}

	@ResolveField(() => RealizedPAndL, { name: '_realizedProfitAndLoss' })
	async _realizedProfitAndLoss(
		@Parent() account: Account,
		@Info()
		info: GraphQLResolveInfo,
		@Args('year', { nullable: true, type: () => Number })
		year?: number,
	): Promise<RealizedPAndL> {
		const { select } = new PrismaSelect<Prisma.RealizedPAndLSelect>(info).value;

		return this.realizedPAndLService._realizedProfitAndLoss({
			accountId: account.id,
			select,
			year: year ?? new Date().getFullYear(),
			portfolioId: account.portfolioId,
		});
	}
}
