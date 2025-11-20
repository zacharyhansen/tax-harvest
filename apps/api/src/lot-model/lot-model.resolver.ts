import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { ClerkClaims } from '~/auth/types';
import { ClerkContext } from '../auth/decorators/clerk-context.decorator';
import { LotModel, LotOnLotModel } from '../generated/graphql';
import { LotModelService } from './lot-model.service';

/**
 * GraphQL resolver for LotModel operations.
 * Provides queries and mutations for managing tax models and their lot associations.
 */
@Resolver(() => LotModel)
export class LotModelResolver {
	constructor(private readonly lotModelService: LotModelService) {}

	/**
	 * Creates a new LotModel with optional lot associations.
	 *
	 * @example
	 * ```graphql
	 * mutation {
	 *   createLotModel(
	 *     lotOnLotModels: [
	 *       { lotId: "lot-1", quantity: 10 }
	 *       { lotId: "lot-2", quantity: 20 }
	 *     ]
	 *   ) {
	 *     id
	 *     lotOnLotModels {
	 *       lotId
	 *       quantity
	 *     }
	 *   }
	 * }
	 * ```
	 */
	@Mutation(() => LotModel, {
		description: 'Create a new lot model with optional lot associations',
	})
	async createLotModel(
		@ClerkContext() clerkContext: ClerkClaims,
		@Args('lotOnLotModels', {
			type: () => [LotOnLotModelInput],
			nullable: true,
		})
		lotOnLotModels?: { lotId: string; quantity: number }[],
	) {
		return this.lotModelService.createLotModel({
			portfolioId: clerkContext.metadata.portfolioId,
			lotOnLotModels,
		});
	}

	/**
	 * Adds a lot to an existing model.
	 *
	 * @example
	 * ```graphql
	 * mutation {
	 *   insertLotOnLotModel(
	 *     lotModelId: "model-123"
	 *     lotId: "lot-456"
	 *     quantity: 15
	 *   ) {
	 *     lotId
	 *     quantity
	 *   }
	 * }
	 * ```
	 */
	@Mutation(() => LotOnLotModel, {
		description: 'Add a lot to a model',
	})
	async insertLotOnLotModel(
		@ClerkContext() clerkContext: ClerkClaims,
		@Args('lotModelId', { type: () => String })
		lotModelId: string,
		@Args('lotId', { type: () => String })
		lotId: string,
		@Args('quantity', { type: () => Number })
		quantity: number,
	) {
		return this.lotModelService.insertLotOnLotModel({
			portfolioId: clerkContext.metadata.portfolioId,
			lotModelId,
			lotId,
			quantity,
		});
	}

	/**
	 * Removes a lot from a model.
	 *
	 * @example
	 * ```graphql
	 * mutation {
	 *   deleteLotOnLotModel(
	 *     lotModelId: "model-123"
	 *     lotId: "lot-456"
	 *   ) {
	 *     lotId
	 *   }
	 * }
	 * ```
	 */
	@Mutation(() => LotOnLotModel, {
		description: 'Remove a lot from a model',
	})
	async deleteLotOnLotModel(
		@ClerkContext() clerkContext: ClerkClaims,
		@Args('lotModelId', { type: () => String })
		lotModelId: string,
		@Args('lotId', { type: () => String })
		lotId: string,
	) {
		return this.lotModelService.deleteLotOnLotModel({
			portfolioId: clerkContext.metadata.portfolioId,
			lotModelId,
			lotId,
		});
	}

	/**
	 * Deletes a lot model and all its associations.
	 *
	 * @example
	 * ```graphql
	 * mutation {
	 *   deleteLotModel(lotModelId: "model-123") {
	 *     id
	 *   }
	 * }
	 * ```
	 */
	@Mutation(() => LotModel, {
		description: 'Delete a lot model',
	})
	async deleteLotModel(
		@ClerkContext() clerkContext: ClerkClaims,
		@Args('lotModelId', { type: () => String })
		lotModelId: string,
	) {
		return this.lotModelService.deleteLotModel({
			portfolioId: clerkContext.metadata.portfolioId,
			lotModelId,
		});
	}

	/**
	 * Removes all lots from a model without deleting the model itself.
	 *
	 * @example
	 * ```graphql
	 * mutation {
	 *   clearLotModel(lotModelId: "model-123") {
	 *     count
	 *   }
	 * }
	 * ```
	 */
	@Mutation(() => BatchPayload, {
		description: 'Clear all lots from a model',
	})
	async clearLotModel(
		@ClerkContext() clerkContext: ClerkClaims,
		@Args('lotModelId', { type: () => String })
		lotModelId: string,
	) {
		return this.lotModelService.clearLotModel({
			portfolioId: clerkContext.metadata.portfolioId,
			lotModelId,
		});
	}

	/**
	 * Retrieves a specific lot model with all its lots.
	 *
	 * @example
	 * ```graphql
	 * query {
	 *   lotModel(lotModelId: "model-123") {
	 *     id
	 *     lotOnLotModels {
	 *       lot {
	 *         assetSymbol
	 *       }
	 *       quantity
	 *     }
	 *   }
	 * }
	 * ```
	 */
	@Query(() => LotModel, {
		description: 'Get a lot model by ID',
		nullable: true,
	})
	async lotModel(
		@ClerkContext() clerkContext: ClerkClaims,
		@Args('lotModelId', { type: () => String })
		lotModelId: string,
	) {
		return this.lotModelService.getLotModel({
			portfolioId: clerkContext.metadata.portfolioId,
			lotModelId,
		});
	}

	/**
	 * Lists all lot models for the current portfolio.
	 *
	 * @example
	 * ```graphql
	 * query {
	 *   lotModels {
	 *     id
	 *     createdAt
	 *     lotOnLotModels {
	 *       quantity
	 *     }
	 *   }
	 * }
	 * ```
	 */
	@Query(() => [LotModel], {
		description: 'List all lot models for a portfolio',
	})
	async lotModels(@ClerkContext() clerkContext: ClerkClaims) {
		return this.lotModelService.listLotModels({
			portfolioId: clerkContext.metadata.portfolioId,
		});
	}
}

/**
 * Input type for creating LotOnLotModel associations.
 */
import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
class LotOnLotModelInput {
	@Field(() => String)
	lotId: string;

	@Field(() => Float)
	quantity: number;
}

/**
 * Response type for batch operations.
 */
@ObjectType()
class BatchPayload {
	@Field(() => Number)
	count: number;
}
