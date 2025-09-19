import { Args, Query, Resolver } from '@nestjs/graphql';
import { ClerkContext } from '../auth/decorators/clerk-context.decorator';
import type { ClerkClaims } from '../auth/types';
import {
	AccountPerformanceDataPoint,
	AccountPerformanceInput,
	PositionPerformanceDataPoint,
	PositionPerformanceInput,
} from './portfolio-snapshot.dto';
import { PortfolioSnapshotService } from './portfolio-snapshot.service';

@Resolver()
export class PortfolioSnapshotResolver {
	constructor(
		private readonly portfolioSnapshotService: PortfolioSnapshotService,
	) {}

	/**
	 * Get portfolio performance data broken down by accounts
	 * @example
	 * query {
	 *   portfolioPerformanceByAccount(input: { timeSpan: YTD }) {
	 *     date
	 *     portfolioTotal
	 *     accounts {
	 *       accountId
	 *       accountName
	 *       value
	 *     }
	 *   }
	 * }
	 */
	@Query(() => [AccountPerformanceDataPoint], {
		description: 'Get portfolio performance data broken down by accounts',
		name: 'portfolioPerformanceByAccount',
	})
	async portfolioPerformanceByAccount(
		@ClerkContext() { metadata }: ClerkClaims,
		@Args('input') input: AccountPerformanceInput,
	): Promise<AccountPerformanceDataPoint[]> {
		const result = await this.portfolioSnapshotService.getAccountPerformance(
			metadata.portfolioId,
			input,
		);

		// Add fake data point if insufficient data
		if (result.length > 0 && result.length <= 14) {
			const lastEntry = result[result.length - 1];
			const twoWeeksFromLastEntry = new Date(lastEntry.date);
			twoWeeksFromLastEntry.setDate(twoWeeksFromLastEntry.getDate() - 14);

			result.unshift({
				date: twoWeeksFromLastEntry.toISOString().split('T')[0],
				portfolioTotal: lastEntry.portfolioTotal * 1.02, // Add 2% growth for visual effect
				accounts: lastEntry.accounts.map((acc) => ({
					...acc,
					valueTotal: 0,
					valueCash: 0,
					valueAssets: 0,
					realizedPAndLShortTerm: 0,
					realizedPAndLLongTerm: 0,
					unrealizedProfit: 0,
					unrealizedLoss: 0,
				})),
			});
		}

		return result;
	}

	/**
	 * Get portfolio performance data broken down by positions
	 * @example
	 * query {
	 *   portfolioPerformanceByPosition(input: { timeSpan: YTD, symbols: ["AAPL", "GOOGL"] }) {
	 *     date
	 *     portfolioTotal
	 *     positions {
	 *       symbol
	 *       value
	 *       shares
	 *     }
	 *   }
	 * }
	 */
	@Query(() => [PositionPerformanceDataPoint], {
		description: 'Get portfolio performance data broken down by positions',
		name: 'portfolioPerformanceByPosition',
	})
	async portfolioPerformanceByPosition(
		@ClerkContext() { metadata }: ClerkClaims,
		@Args('input') input: PositionPerformanceInput,
	): Promise<PositionPerformanceDataPoint[]> {
		const result = await this.portfolioSnapshotService.getPositionPerformance(
			metadata.portfolioId,
			input,
		);

		// Add fake data point if insufficient data
		if (result.length > 0 && result.length <= 14) {
			const lastEntry = result[result.length - 1];
			const twoWeeksFromLastEntry = new Date(lastEntry.date);
			twoWeeksFromLastEntry.setDate(twoWeeksFromLastEntry.getDate() - 14);

			result.unshift({
				date: twoWeeksFromLastEntry.toISOString().split('T')[0],
				portfolioTotal: lastEntry.portfolioTotal * 1.02, // Add 2% growth for visual effect
				positions: lastEntry.positions.map((pos) => ({
					...pos,
					value: 0,
				})),
			});
		}

		return result;
	}
}
