import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import { ClerkContext } from '../auth/decorators/clerk-context.decorator';
import { AdminGuard } from '../auth/guards/admin.guard';
import type { ClerkClaims } from '../auth/types';
import { Account } from '../generated/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaSelect } from '../utilities/prisma/prisma-select';
import {
	PlaidInstitutionInfo,
	PlaidLinkOnSuccessMetadata,
} from './constants/plaid.dto';
import { PlaidService } from './plaid.service';

@Resolver()
export class PlaidResolver {
	constructor(
		private readonly plaidService: PlaidService,
		private readonly prismaService: PrismaService,
	) {}

	@Query(() => String, {
		description: 'Get plaid link token for user',
		name: 'linkToken',
	})
	async linkToken(
		@Info()
		_info: GraphQLResolveInfo,
		@ClerkContext()
		currentUser: ClerkClaims,
		@Args('authConnectionId', { type: () => String, nullable: true })
		authConnectionId?: string,
	) {
		const plaidResponse = await this.plaidService.linkToken({
			userId: currentUser.sub,
			portfolioId: currentUser.metadata.portfolioId,
			authConnectionId,
		});

		return plaidResponse.data.link_token;
	}

	@Mutation(() => [Account], {
		description:
			'Set up plaid auth connection and create accounts from syncing plaid',
		name: 'setAccessTokenAndSyncAccounts',
	})
	async setAccessTokenAndSyncAccounts(
		@Info()
		info: GraphQLResolveInfo,
		@ClerkContext()
		currentUser: ClerkClaims,
		@Args('publicToken', {
			nullable: false,
			type: () => String,
		})
		publicToken: string,
		@Args('metaData', {
			nullable: false,
			type: () => PlaidLinkOnSuccessMetadata,
		})
		metaData: PlaidLinkOnSuccessMetadata,
		@Args('existingAccountId', {
			nullable: true,
			type: () => String,
		})
		existingAccountId?: string,
	) {
		const { select } = new PrismaSelect<Prisma.AccountSelect>(info).value;

		const accounts = await this.plaidService.setAccessToken({
			metaData,
			portfolioId: currentUser.metadata.portfolioId,
			publicToken,
			userId: currentUser.sub,
			existingAccountId,
		});

		return this.prismaService
			.rlsPortfolioClient(currentUser.metadata.portfolioId)
			.account.findMany({
				select,
				where: {
					id: { in: accounts.map((a) => a.id) },
				},
			});
	}

	/**
	 * Get institution information from Plaid
	 * @param institutionId - The Plaid institution ID
	 * @returns Institution information including name, logo, colors, etc.
	 * @example
	 * query {
	 *   plaidInstitution(institutionId: "ins_3") {
	 *     name
	 *     logo
	 *     primary_color
	 *   }
	 * }
	 */
	@Query(() => PlaidInstitutionInfo, {
		description: 'Get institution information from Plaid',
		name: 'plaidInstitution',
	})
	async plaidInstitution(
		@Args('institutionId', { type: () => String })
		institutionId: string,
	) {
		return this.plaidService.getInstitution(institutionId);
	}

	/**
	 * Process CSV accounts by applying new transactions for each account
	 * @param currentUser - Current authenticated user context
	 * @param accountIds - Array of account IDs that have CSV data to process
	 * @returns Promise<boolean> - Returns true when processing is complete
	 * @example
	 * mutation {
	 *   processCsvAccounts(accountIds: ["account1", "account2"])
	 * }
	 */
	@Mutation(() => Boolean, {
		description:
			'Process CSV accounts by applying new transactions for each account',
		name: 'processCsvAccounts',
	})
	async processCsvAccounts(
		@ClerkContext()
		currentUser: ClerkClaims,
		@Args('accountIds', { type: () => [String] })
		accountIds: string[],
	): Promise<boolean> {
		for (const accountId of accountIds) {
			await this.plaidService.applyNewPlaidTransactions({
				accountId,
				portfolioId: currentUser.metadata.portfolioId,
			});
		}
		return true;
	}

	/**
	 * Admin-only mutation to sync a specific Plaid auth connection
	 * @param authConnectionId - The ID of the auth connection to sync
	 * @returns Promise<boolean> - Returns true when sync is complete
	 * @example
	 * mutation {
	 *   adminSyncPlaidItem(authConnectionId: "auth-connection-id")
	 * }
	 */
	@Mutation(() => Boolean, {
		description: 'Admin-only: Sync a specific Plaid auth connection',
		name: 'adminSyncPlaidItem',
	})
	@UseGuards(AdminGuard)
	async adminSyncPlaidItem(
		@ClerkContext()
		currentUser: ClerkClaims,
		@Args('authConnectionId', { type: () => String })
		authConnectionId: string,
	): Promise<boolean> {
		// Fetch the auth connection without portfolio restrictions
		const authConnection = await this.prismaService
			.$extends(PrismaService.forPortfolio(currentUser.metadata.portfolioId))
			.authConnection.findUniqueOrThrow({
				where: { id: authConnectionId },
			});

		// Sync the Plaid item
		await this.plaidService.syncPlaidItem({
			plaidAuthConnection: authConnection,
		});

		return true;
	}
}
