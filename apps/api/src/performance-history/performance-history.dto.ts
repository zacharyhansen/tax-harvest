import {
	Field,
	Float,
	ID,
	InputType,
	ObjectType,
	registerEnumType,
} from '@nestjs/graphql';

/**
 * Time span options for performance history queries
 */
export enum TimeSpanV2 {
	YTD = 'YTD',
	SIX_MONTHS = 'SIX_MONTHS',
	ONE_YEAR = 'ONE_YEAR',
	TWO_YEARS = 'TWO_YEARS',
	ALL = 'ALL',
}

registerEnumType(TimeSpanV2, {
	name: 'TimeSpanV2',
	description: 'Time span options for performance history queries',
});

/**
 * Input for time-based filtering of performance history
 */
@InputType()
export class TimeRangeInput {
	@Field(() => TimeSpanV2, {
		nullable: true,
		description: 'Pre-defined time span',
	})
	timeSpan?: TimeSpanV2;

	@Field(() => Date, { nullable: true, description: 'Custom start date' })
	startDate?: Date;

	@Field(() => Date, { nullable: true, description: 'Custom end date' })
	endDate?: Date;
}

/**
 * Raw RealizedPAndL record output
 */
@ObjectType()
export class RealizedPAndLHistoryOutput {
	@Field(() => ID)
	id: string;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => String)
	accountId: string;

	@Field(() => String)
	portfolioId: string;

	@Field(() => String)
	positionId: string;

	// Balance fields
	@Field(() => Float)
	current: number;

	@Field(() => Float)
	available: number;

	@Field(() => Date, { nullable: true })
	lastUpdatedDatetime?: Date;

	// P&L fields matching ProfitAndLossType
	@Field(() => Float)
	shortTermCapitalGain: number;

	@Field(() => Float)
	longTermCapitalGain: number;

	@Field(() => Float)
	dividend: number;

	@Field(() => Float)
	qualifiedDividend: number;

	@Field(() => Float)
	nonQualifiedDividend: number;

	@Field(() => Float)
	dividendReinvestment: number;

	@Field(() => Float)
	interest: number;

	@Field(() => Float)
	interestReinvestment: number;

	@Field(() => Float)
	distribution: number;

	@Field(() => Float)
	accountFee: number;

	@Field(() => Float)
	managementFee: number;

	@Field(() => Float)
	fundFee: number;

	@Field(() => Float)
	taxWithheld: number;

	@Field(() => Float)
	nonResidentTax: number;

	@Field(() => Float)
	deposit: number;

	@Field(() => Float)
	withdrawal: number;

	@Field(() => Float)
	contribution: number;

	@Field(() => Float)
	returnOfPrincipal: number;

	@Field(() => Float)
	loanPayment: number;

	@Field(() => Float)
	marginExpense: number;

	@Field(() => Float)
	stockDistribution: number;

	@Field(() => Float)
	unqualifiedGain: number;
}

/**
 * Raw Position record output
 */
@ObjectType()
export class PositionOutput {
	@Field(() => ID)
	id: string;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => String)
	positionSnapshotId: string;

	@Field(() => String)
	accountId: string;

	@Field(() => String)
	portfolioId: string;

	@Field(() => String, { nullable: true })
	externalId?: string;

	@Field(() => Date, { nullable: true })
	dateAcquired?: Date;

	@Field(() => Date, { nullable: true })
	dateExpiration?: Date;

	@Field(() => String)
	assetSymbol: string;

	@Field(() => Float, { nullable: true })
	pricePaid?: number;

	@Field(() => Float)
	quantity: number;

	@Field(() => String, { nullable: true })
	type?: string;

	// Additional position fields
	@Field(() => Float, { nullable: true })
	commissionTotal?: number;

	@Field(() => Float, { nullable: true })
	feesOther?: number;

	@Field(() => Float, { nullable: true })
	feesDay?: number;

	@Field(() => Float, { nullable: true })
	gainDay?: number;

	@Field(() => Float, { nullable: true })
	marketValue?: number;

	@Field(() => Float, { nullable: true })
	costTotal?: number;

	@Field(() => Float, { nullable: true })
	gainTotal?: number;

	@Field(() => Float, { nullable: true })
	gainTotalPCT?: number;

	@Field(() => Float, { nullable: true })
	costPerShare?: number;

	@Field(() => Float, { nullable: true })
	commissionDay?: number;

	@Field(() => Float, { nullable: true })
	changePCT?: number;

	@Field(() => Float, { nullable: true })
	change?: number;

	@Field(() => String, { nullable: true })
	quoteStatus?: string;
}

/**
 * Raw PositionSnapshot record with nested Position records
 */
@ObjectType()
export class PositionSnapshotHistoryOutput {
	@Field(() => ID)
	id: string;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => String)
	accountId: string;

	@Field(() => String)
	portfolioId: string;

	@Field(() => [PositionOutput], { description: 'Nested position records' })
	positions: PositionOutput[];
}
