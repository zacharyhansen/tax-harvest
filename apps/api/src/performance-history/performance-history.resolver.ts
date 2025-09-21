import { Resolver } from '@nestjs/graphql';
import { PerformanceHistoryService } from './performance-history.service';

/**
 * GraphQL resolver for performance history queries
 * Exposes simplified access to RealizedPAndL and PositionSnapshot data
 */
@Resolver()
export class PerformanceHistoryResolver {
	constructor(readonly _performanceHistoryService: PerformanceHistoryService) {}
}
