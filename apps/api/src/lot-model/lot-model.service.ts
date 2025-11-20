import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service for managing LotModel entities and their associated LotOnLotModel relationships.
 * Provides operations for creating, updating, and deleting tax models and their lot associations.
 *
 * @example
 * ```typescript
 * // Create a new lot model with associated lots
 * const model = await lotModelService.createLotModel({
 *   portfolioId: 'portfolio-123',
 *   accountId: 'account-456',
 *   lotOnLotModels: [
 *     { lotId: 'lot-1', quantity: 10 },
 *     { lotId: 'lot-2', quantity: 20 }
 *   ]
 * });
 * ```
 */
@Injectable()
export class LotModelService {
	constructor(private readonly prismaService: PrismaService) {}

	/**
	 * Creates a new LotModel with optional LotOnLotModel associations.
	 *
	 * @param data - The lot model data including portfolio and optional lot associations
	 * @returns The created LotModel with its associations
	 *
	 * @example
	 * ```typescript
	 * const model = await createLotModel({
	 *   portfolioId: 'portfolio-123',
	 *   lotOnLotModels: [{ lotId: 'lot-1', quantity: 10 }]
	 * });
	 * ```
	 */
	async createLotModel({
		portfolioId,
		lotOnLotModels,
	}: {
		portfolioId: string;
		lotOnLotModels?: { lotId: string; quantity: number }[];
	}) {
		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotModel.create({
				data: {
					portfolioId,
					lotOnLotModels: lotOnLotModels
						? {
								create: lotOnLotModels.map((item) => ({
									lotId: item.lotId,
									quantity: item.quantity,
								})),
							}
						: undefined,
				},
				include: {
					lotOnLotModels: {
						include: {
							lot: {
								include: {
									asset: true,
								},
							},
						},
					},
				},
			});
	}

	/**
	 * Inserts a new LotOnLotModel record to associate a lot with a model.
	 *
	 * @param portfolioId - The portfolio ID for RLS context
	 * @param lotModelId - The ID of the lot model
	 * @param lotId - The ID of the lot to associate
	 * @param quantity - The quantity of the lot in this model
	 * @returns The created LotOnLotModel record
	 *
	 * @example
	 * ```typescript
	 * await insertLotOnLotModel({
	 *   portfolioId: 'portfolio-123',
	 *   lotModelId: 'model-1',
	 *   lotId: 'lot-1',
	 *   quantity: 10
	 * });
	 * ```
	 */
	async insertLotOnLotModel({
		portfolioId,
		lotModelId,
		lotId,
		quantity,
	}: {
		portfolioId: string;
		lotModelId: string;
		lotId: string;
		quantity: number;
	}) {
		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotOnLotModel.create({
				data: {
					lotModelId,
					lotId,
					quantity,
				},
				include: {
					lot: {
						include: {
							asset: true,
						},
					},
				},
			});
	}

	/**
	 * Deletes a specific LotOnLotModel record by composite key.
	 *
	 * @param portfolioId - The portfolio ID for RLS context
	 * @param lotModelId - The ID of the lot model
	 * @param lotId - The ID of the lot
	 * @returns The deleted LotOnLotModel record
	 *
	 * @example
	 * ```typescript
	 * await deleteLotOnLotModel({
	 *   portfolioId: 'portfolio-123',
	 *   lotModelId: 'model-1',
	 *   lotId: 'lot-1'
	 * });
	 * ```
	 */
	async deleteLotOnLotModel({
		portfolioId,
		lotModelId,
		lotId,
	}: {
		portfolioId: string;
		lotModelId: string;
		lotId: string;
	}) {
		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotOnLotModel.delete({
				where: {
					lotModelId_lotId: {
						lotModelId,
						lotId,
					},
				},
			});
	}

	/**
	 * Deletes a LotModel and all associated LotOnLotModel records (cascade).
	 *
	 * @param portfolioId - The portfolio ID for RLS context
	 * @param lotModelId - The ID of the lot model to delete
	 * @returns The deleted LotModel record
	 *
	 * @example
	 * ```typescript
	 * await deleteLotModel({
	 *   portfolioId: 'portfolio-123',
	 *   lotModelId: 'model-1'
	 * });
	 * ```
	 */
	async deleteLotModel({
		portfolioId,
		lotModelId,
	}: {
		portfolioId: string;
		lotModelId: string;
	}) {
		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotModel.delete({
				where: {
					id: lotModelId,
				},
			});
	}

	/**
	 * Clears all LotOnLotModel records for a specific LotModel.
	 *
	 * @param portfolioId - The portfolio ID for RLS context
	 * @param lotModelId - The ID of the lot model to clear
	 * @returns The count of deleted records
	 *
	 * @example
	 * ```typescript
	 * const result = await clearLotModel({
	 *   portfolioId: 'portfolio-123',
	 *   lotModelId: 'model-1'
	 * });
	 * console.log(`Deleted ${result.count} lots from model`);
	 * ```
	 */
	async clearLotModel({
		portfolioId,
		lotModelId,
	}: {
		portfolioId: string;
		lotModelId: string;
	}) {
		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotOnLotModel.deleteMany({
				where: {
					lotModelId,
				},
			});
	}

	/**
	 * Retrieves a LotModel with all its associated lots.
	 *
	 * @param portfolioId - The portfolio ID for RLS context
	 * @param lotModelId - The ID of the lot model to retrieve
	 * @returns The LotModel with all associations
	 *
	 * @example
	 * ```typescript
	 * const model = await getLotModel({
	 *   portfolioId: 'portfolio-123',
	 *   lotModelId: 'model-1'
	 * });
	 * ```
	 */
	async getLotModel({
		portfolioId,
		lotModelId,
	}: {
		portfolioId: string;
		lotModelId: string;
	}) {
		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotModel.findUnique({
				where: {
					id: lotModelId,
				},
				include: {
					lotOnLotModels: {
						include: {
							lot: {
								include: {
									asset: true,
								},
							},
						},
					},
				},
			});
	}

	/**
	 * Lists all LotModels for a portfolio.
	 *
	 * @param portfolioId - The portfolio ID for RLS context
	 * @returns Array of LotModels with associations
	 *
	 * @example
	 * ```typescript
	 * const models = await listLotModels({
	 *   portfolioId: 'portfolio-123'
	 * });
	 * ```
	 */
	async listLotModels({ portfolioId }: { portfolioId: string }) {
		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotModel.findMany({
				where: {
					portfolioId,
				},
				include: {
					lotOnLotModels: {
						include: {
							lot: {
								include: {
									asset: true,
								},
							},
						},
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
			});
	}
}
