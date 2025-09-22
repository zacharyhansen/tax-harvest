import { Injectable } from '@nestjs/common';
import { Selectable, sql } from 'kysely';
import { PortfolioBalanceSnapshot } from '~/database/db';
import { Database, executeWithRLS } from '../database/database';
import { PrismaService } from '../prisma/prisma.service';
import {
	AccountPerformanceDataPoint,
	AccountPerformanceInput,
	PerformanceTimeSpan,
	PositionPerformanceDataPoint,
	PositionPerformanceInput,
} from './portfolio-snapshot.dto';

interface PositionData {
	assetSymbol: string;
	quantity: string | null;
	marketValue: string | null;
}

/**
 * Service for retrieving and aggregating portfolio performance data
 * @example
 * const performance = await portfolioSnapshotService.getPerformance(
 *   'uuid',
 *   {
 *     timeSpan: PerformanceTimeSpan.YTD,
 *     type: PerformanceType.DEFAULT
 *   }
 * );
 */
@Injectable()
export class PortfolioSnapshotService {
	constructor(
		readonly _prismaService: PrismaService,
		private readonly db: Database,
	) {}

	/**
	 * Get portfolio performance data by accounts
	 */
	async getAccountPerformance(
		portfolioId: string,
		input: AccountPerformanceInput,
	): Promise<AccountPerformanceDataPoint[]> {
		const dateFrom = this.calculateStartDate(input.timeSpan);
		const snapshots = await this.fetchSnapshots(portfolioId, dateFrom);
		const dailyData = this.aggregateByDay(snapshots);

		// Get account names for better UX
		const accountNames = await this.getAccountNames(portfolioId);

		return this.transformToTypedAccountFormat(dailyData, accountNames);
	}

	/**
	 * Get portfolio performance data by positions
	 */
	async getPositionPerformance(
		portfolioId: string,
		input: PositionPerformanceInput,
	): Promise<PositionPerformanceDataPoint[]> {
		const dateFrom = this.calculateStartDate(input.timeSpan);
		const snapshots = await this.fetchSnapshots(portfolioId, dateFrom);
		const dailyData = this.aggregateByDay(snapshots);

		return this.transformToTypedPositionFormat(
			dailyData,
			portfolioId,
			input.symbols,
		);
	}

	/**
	 * Calculate the start date based on the time span
	 */
	private calculateStartDate(timeSpan: PerformanceTimeSpan): Date {
		const now = new Date();
		const startDate = new Date();

		switch (timeSpan) {
			case PerformanceTimeSpan.YTD:
				startDate.setMonth(0, 1); // January 1st of current year
				startDate.setHours(0, 0, 0, 0);
				break;
			case PerformanceTimeSpan.SIX_MONTHS:
				startDate.setMonth(now.getMonth() - 6);
				break;
			case PerformanceTimeSpan.ONE_YEAR:
				startDate.setFullYear(now.getFullYear() - 1);
				break;
			case PerformanceTimeSpan.TWO_YEARS:
				startDate.setFullYear(now.getFullYear() - 2);
				break;
			case PerformanceTimeSpan.ALL:
				startDate.setFullYear(2000); // Effectively all data
				break;
		}

		return startDate;
	}

	/**
	 * Fetch snapshots from database with efficient aggregation
	 */
	private async fetchSnapshots(portfolioId: string, dateFrom: Date) {
		// Use a CTE to get the oldest snapshot per day per account
		return executeWithRLS(this.db, portfolioId, (trx) =>
			trx
				.with('daily_snapshots', (db) =>
					db
						.selectFrom('PortfolioBalanceSnapshot')
						.selectAll()
						.select([
							sql<number>`ROW_NUMBER() OVER (
							PARTITION BY DATE("createdAt"), "accountId"
							ORDER BY "createdAt" ASC
						)`.as('rn'),
						])
						.where('portfolioId', '=', portfolioId)
						.where('createdAt', '>=', dateFrom),
				)
				.selectFrom('daily_snapshots')
				.selectAll()
				.where('rn', '=', 1)
				.orderBy('createdAt', 'asc')
				.execute(),
		);
	}

	/**
	 * Group snapshots by day, keeping all accounts per day
	 */
	private aggregateByDay(
		snapshots: Selectable<PortfolioBalanceSnapshot>[],
	): Map<string, Selectable<PortfolioBalanceSnapshot>[]> {
		const dailyData = new Map<string, Selectable<PortfolioBalanceSnapshot>[]>();

		for (const snapshot of snapshots) {
			const dateKey = snapshot.createdAt.toISOString().split('T')[0];
			if (!dailyData.has(dateKey)) {
				dailyData.set(dateKey, []);
			}
			dailyData.get(dateKey)?.push(snapshot);
		}

		return dailyData;
	}

	/**
	 * Get account names for better UX
	 */
	private async getAccountNames(
		portfolioId: string,
	): Promise<Map<string, string>> {
		const accounts = await this._prismaService
			.rlsPortfolioClient(portfolioId)
			.account.findMany({
				select: { id: true, name: true },
			});

		const accountMap = new Map<string, string>();
		for (const account of accounts) {
			accountMap.set(account.id, account.name || 'Unnamed Account');
		}
		return accountMap;
	}

	/**
	 * Fetch positions for a specific balance snapshot
	 */
	private async fetchPositionsForSnapshot(
		portfolioId: string,
		balanceSnapshotId: string,
	): Promise<PositionData[]> {
		return executeWithRLS(this.db, portfolioId, (trx) =>
			trx
				.selectFrom('PositionSnapshotOnPortfolioBalanceSnapshot')
				.innerJoin(
					'PositionSnapshot',
					'PositionSnapshot.id',
					'PositionSnapshotOnPortfolioBalanceSnapshot.positionSnapshotId',
				)
				.innerJoin(
					'Position',
					'Position.positionSnapshotId',
					'PositionSnapshot.id',
				)
				.select([
					'Position.assetSymbol',
					'Position.quantity',
					'Position.marketValue',
				])
				.where(
					'PositionSnapshotOnPortfolioBalanceSnapshot.portfolioBalanceSnapshotId',
					'=',
					balanceSnapshotId,
				)
				.execute(),
		);
	}

	/**
	 * Transform daily data to typed account format
	 */
	private transformToTypedAccountFormat(
		dailyData: Map<string, Selectable<PortfolioBalanceSnapshot>[]>,
		accountNames: Map<string, string>,
	): AccountPerformanceDataPoint[] {
		const result: AccountPerformanceDataPoint[] = [];

		for (const [date, snapshots] of dailyData.entries()) {
			let portfolioTotal = 0;
			// const accounts = [];

			for (const snapshot of snapshots) {
				// Calculate total value as current (cash) + market value of assets
				const valueTotal =
					Number(snapshot.current) + Number(snapshot.available);
				// const valueCash = Number(snapshot.current);
				// const valueAssets = Number(snapshot.available);

				portfolioTotal += valueTotal;
				// accounts.push({
				// 	accountName:
				// 		accountNames.get(snapshot.accountId) || 'Unknown Account',
				// 	valueTotal: valueTotal,
				// 	valueCash: valueCash,
				// 	valueAssets: valueAssets,
				// 	realizedPAndLShortTerm: Number(snapshot.shortTermCapitalGain),
				// 	realizedPAndLLongTerm: Number(snapshot.longTermCapitalGain),
				// 	unrealizedProfit: Number(snapshot.unrealizedProfit),
				// 	unrealizedLoss: Number(snapshot.unrealizedLoss),
				// });
			}

			result.push({
				date,
				portfolioTotal,
				accounts: [],
			});
		}

		return result;
	}

	/**
	 * Transform daily data to typed position format
	 */
	private async transformToTypedPositionFormat(
		dailyData: Map<string, Selectable<PortfolioBalanceSnapshot>[]>,
		portfolioId: string,
		symbols?: string[],
	): Promise<PositionPerformanceDataPoint[]> {
		const result: PositionPerformanceDataPoint[] = [];
		const symbolFilter = symbols ? new Set(symbols) : null;

		// Get position data for each day
		for (const [date, snapshots] of dailyData.entries()) {
			let portfolioTotal = 0;
			const positionMap = new Map<string, { value: number; shares: number }>();

			for (const snapshot of snapshots) {
				// Calculate total value
				const valueTotal =
					Number(snapshot.current) + Number(snapshot.available);
				portfolioTotal += valueTotal;

				// Get positions for this snapshot through the join table
				const positionData = await this.fetchPositionsForSnapshot(
					portfolioId,
					String(snapshot.id),
				);

				// Aggregate positions by symbol
				for (const position of positionData) {
					if (position.assetSymbol && position.marketValue) {
						const symbol = position.assetSymbol;

						// Skip if we have a filter and this symbol isn't in it
						if (symbolFilter && !symbolFilter.has(symbol)) {
							continue;
						}

						const existing = positionMap.get(symbol) || {
							value: 0,
							shares: 0,
						};
						positionMap.set(symbol, {
							value: existing.value + Number(position.marketValue || 0),
							shares: existing.shares + Number(position.quantity || 0),
						});
					}
				}
			}

			const positions = Array.from(positionMap.entries()).map(
				([symbol, data]) => ({
					symbol,
					value: data.value,
					shares: data.shares,
				}),
			);

			result.push({
				date,
				portfolioTotal,
				positions,
			});
		}

		return result;
	}
}
