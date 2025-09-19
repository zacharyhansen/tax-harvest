import {
	Field,
	Float,
	InputType,
	ObjectType,
	registerEnumType,
} from '@nestjs/graphql';

export enum PerformanceTimeSpan {
	YTD = 'YTD',
	SIX_MONTHS = 'SIX_MONTHS',
	ONE_YEAR = 'ONE_YEAR',
	TWO_YEARS = 'TWO_YEARS',
	ALL = 'ALL',
}

export enum PerformanceType {
	DEFAULT = 'DEFAULT',
	POSITION = 'POSITION',
}

registerEnumType(PerformanceTimeSpan, {
	name: 'PerformanceTimeSpan',
	description: 'Time span for portfolio performance data',
});

registerEnumType(PerformanceType, {
	name: 'PerformanceType',
	description: 'Type of performance data grouping',
});

@InputType()
export class PortfolioPerformanceInput {
	@Field(() => PerformanceTimeSpan)
	timeSpan: PerformanceTimeSpan;

	@Field(() => PerformanceType, {
		defaultValue: PerformanceType.DEFAULT,
		deprecationReason: 'Use specific performance queries instead',
	})
	type: PerformanceType = PerformanceType.DEFAULT;
}

/**
 * Input for account performance query
 */
@InputType()
export class AccountPerformanceInput {
	@Field(() => PerformanceTimeSpan, {
		description: 'Time span for the performance data',
	})
	timeSpan: PerformanceTimeSpan;
}

/**
 * Input for position performance query
 */
@InputType()
export class PositionPerformanceInput {
	@Field(() => PerformanceTimeSpan, {
		description: 'Time span for the performance data',
	})
	timeSpan: PerformanceTimeSpan;

	@Field(() => [String], {
		nullable: true,
		description: 'Filter by specific symbols (returns all if not provided)',
	})
	symbols?: string[];
}

/**
 * Base performance data point with common fields
 */
@ObjectType()
export class BasePerformanceDataPoint {
	@Field(() => String, { description: 'Date in ISO format' })
	date: string;

	@Field(() => Float, { description: 'Total portfolio value' })
	portfolioTotal: number;
}

/**
 * Account-level performance data for a specific account
 */
@ObjectType()
export class AccountPerformance {
	@Field(() => String, { description: 'Account ID' })
	accountId: string;

	@Field(() => String, { description: 'Account name' })
	accountName: string;

	@Field(() => Float, { description: 'Account value total' })
	valueTotal: number;

	@Field(() => Float, { description: 'Account value cash' })
	valueCash: number;

	@Field(() => Float, { description: 'Account value assets' })
	valueAssets: number;

	@Field(() => Float, { description: 'Realized P&L short term' })
	realizedPAndLShortTerm: number;

	@Field(() => Float, { description: 'Realized P&L long term' })
	realizedPAndLLongTerm: number;

	@Field(() => Float, { description: 'Unrealized profit' })
	unrealizedProfit: number;

	@Field(() => Float, { description: 'Unrealized loss' })
	unrealizedLoss: number;
}

/**
 * Performance data point broken down by accounts
 */
@ObjectType()
export class AccountPerformanceDataPoint extends BasePerformanceDataPoint {
	@Field(() => [AccountPerformance], {
		description: 'Performance breakdown by account',
	})
	accounts: AccountPerformance[];
}

/**
 * Position-level performance data for a specific asset
 */
@ObjectType()
export class PositionPerformance {
	@Field(() => String, { description: 'Asset symbol' })
	symbol: string;

	@Field(() => Float, { description: 'Position value' })
	value: number;

	@Field(() => Float, { description: 'Number of shares', nullable: true })
	shares?: number;
}

/**
 * Performance data point broken down by positions
 */
@ObjectType()
export class PositionPerformanceDataPoint extends BasePerformanceDataPoint {
	@Field(() => [PositionPerformance], {
		description: 'Performance breakdown by position',
	})
	positions: PositionPerformance[];
}
