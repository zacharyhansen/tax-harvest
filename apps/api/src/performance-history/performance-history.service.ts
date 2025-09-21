import { Injectable } from '@nestjs/common';
import { Database } from '../database/database';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service for querying performance history data
 * Provides simplified access to RealizedPAndL and PositionSnapshot records
 * @example
 * const pAndL = await performanceHistoryService.getRealizedPAndLHistory(portfolioId, { timeSpan: TimeSpanV2.YTD });
 */
@Injectable()
export class PerformanceHistoryService {
	constructor(
		readonly _database: Database,
		readonly _prismaService: PrismaService,
	) {}
}
