import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Selectable, sql } from 'kysely';
import { Database, executeWithRLS } from '~/database/database';
import { Position } from '~/database/db';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PositionService {
	constructor(
		readonly prismaService: PrismaService,
		private readonly db: Database,
	) {}

	currentAccountPositions({
		portfolioId,
		accountId,
	}: {
		accountId: string;
		portfolioId: string;
	}): Promise<Selectable<Position>[]> {
		return executeWithRLS(this.db, portfolioId, async (trx) => {
			const latestSnapshot = await trx
				.selectFrom('PositionSnapshot')
				.where('portfolioId', '=', portfolioId)
				.select('id')
				.orderBy('createdAt', 'desc')
				.executeTakeFirstOrThrow();

			return trx
				.selectFrom('Position')
				.where('Position.portfolioId', '=', portfolioId)
				.where('Position.accountId', '=', accountId)
				.where('Position.positionSnapshotId', '=', latestSnapshot.id)
				.selectAll('Position')
				.execute();
		});
	}

	async portfolioPositions({
		portfolioId,
		select,
	}: {
		portfolioId: string;
		select: Prisma.PositionSelect;
	}) {
		const latestSnapshots = await executeWithRLS(
			this.db,
			portfolioId,
			async (trx) => {
				return trx
					.selectFrom('PositionSnapshot')
					.distinctOn(sql`"portfolioId", "authConnectionId"`)
					.orderBy('portfolioId')
					.orderBy('authConnectionId')
					.orderBy('createdAt', 'desc')
					.selectAll()
					.execute();
			},
		);

		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.position.findMany({
				where: {
					portfolioId,
					positionSnapshotId: { in: latestSnapshots.map((s) => s.id) },
				},
				select,
			});
	}
}
