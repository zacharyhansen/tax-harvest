import {
	Args,
	Field,
	Info,
	Mutation,
	ObjectType,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import type { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import type { ClerkClaims } from '~/auth/types';

import { PrismaService } from '~/prisma/prisma.service';

import { ClerkContext } from '../auth/decorators/clerk-context.decorator';
import { AuthConnection, AuthSource } from '../generated/graphql';
import { PrismaSelect } from '../utilities/prisma/prisma-select';
import { AuthConnectionService } from './auth-connection.service';

@ObjectType()
export class AuthConnectionExt extends AuthConnection {
	@Field(() => Boolean)
	_requiresReAuth: boolean;
}

@Resolver(() => AuthConnectionExt)
export class AuthConnectionResolver {
	constructor(
		private readonly authConnectionService: AuthConnectionService,
		private readonly prismaService: PrismaService,
	) {}

	@Query(() => AuthConnectionExt, { name: 'authConnection', nullable: false })
	authConnection(
		@Info()
		info: GraphQLResolveInfo,
		@ClerkContext()
		currentUser: ClerkClaims,
		@Args('id', { type: () => String })
		id: string,
	) {
		const { select } = new PrismaSelect<Prisma.AuthConnectionSelect>(info)
			.value;

		return this.prismaService
			.rlsPortfolioClient(currentUser.metadata.portfolioId)
			.authConnection.findUnique({
				select,
				where: {
					id,
					userId: currentUser.sub,
					portfolioId: currentUser.metadata.portfolioId,
				},
			});
	}

	/**
	 * Get all Plaid auth connections for the current user
	 * @example
	 * query {
	 *   plaidAuthConnections {
	 *     id
	 *     plaidInstitutionId
	 *     authedAt
	 *     accounts {
	 *       id
	 *       name
	 *     }
	 *   }
	 * }
	 */
	@Query(() => [AuthConnection], {
		name: 'plaidAuthConnections',
		nullable: false,
	})
	plaidAuthConnections(
		@Info()
		info: GraphQLResolveInfo,
		@ClerkContext()
		currentUser: ClerkClaims,
	) {
		const { select } = new PrismaSelect<Prisma.AuthConnectionSelect>(info)
			.value;

		return this.prismaService
			.rlsPortfolioClient(currentUser.metadata.portfolioId)
			.authConnection.findMany({
				select,
				where: {
					// userId: currentUser.sub,
					portfolioId: currentUser.metadata.portfolioId,
					source: AuthSource.PLAID,
				},
			});
	}

	@ResolveField(() => Boolean, {
		description: 'Does the auth connection need to be refreshed',
		name: '_requiresReAuth',
	})
	_requiresReAuth(@Parent() { authedAt, source }: AuthConnection) {
		return this.authConnectionService.requiresReAuth(source, authedAt);
	}

	@Mutation(() => AuthConnection, {
		description:
			'Delete an auth connection and all associated accounts and data',
		name: 'deleteAuthConnection',
	})
	async deleteAuthConnection(
		@Args('authConnectionId', { type: () => String })
		authConnectionId: string,
		@ClerkContext() { metadata }: ClerkClaims,
	): Promise<AuthConnection> {
		return this.authConnectionService.deleteAuthConnection(
			authConnectionId,
			metadata.portfolioId,
		);
	}
}
