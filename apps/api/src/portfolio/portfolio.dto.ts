import {
	Field,
	InputType,
	ObjectType,
	registerEnumType,
} from '@nestjs/graphql';
import type { OrderType as PrismaOrderType } from '@prisma/client';

import { HarvestLotCurrent, LotCurrent, TaxGain } from '~/lot/lot.dto';
import { HarvestType, OrderType } from '../generated/graphql';

export enum SetUpStatus {
	NO_ACCOUNTS = 'NO_ACCOUNTS',
	ACCOUNT_SETUP_REQUIRED = 'ACCOUNT_SETUP_REQUIRED',
	COMPLETE = 'COMPLETE',
}

registerEnumType(SetUpStatus, {
	name: 'SetUpStatus',
});

@ObjectType()
export class PortfolioSummaryUnrealized {
	@Field()
	gainTotal: number;

	@Field()
	lossTotal: number;

	@Field()
	accountCount: number;

	@Field()
	total: number;

	@Field()
	positionCount: number;
}

@ObjectType()
export class TaxCalculation {
	@Field({ description: 'The base amount before tax' })
	total: number;

	@Field({ description: 'The tax rate applied' })
	rate: number;

	@Field({ description: 'The calculated tax amount (total * rate)' })
	result: number;
}

@ObjectType()
export class EstimatedTaxBill {
	@Field({ description: 'Total estimated tax bill across all categories' })
	total: number;

	@Field(() => TaxCalculation)
	shortTermCapitalGain: TaxCalculation;

	@Field(() => TaxCalculation)
	longTermCapitalGain: TaxCalculation;

	@Field(() => TaxCalculation)
	dividend: TaxCalculation;

	@Field(() => TaxCalculation)
	qualifiedDividend: TaxCalculation;

	@Field(() => TaxCalculation)
	nonQualifiedDividend: TaxCalculation;

	@Field(() => TaxCalculation)
	dividendReinvestment: TaxCalculation;

	@Field(() => TaxCalculation)
	interest: TaxCalculation;

	@Field(() => TaxCalculation)
	interestReinvestment: TaxCalculation;

	@Field(() => TaxCalculation)
	distribution: TaxCalculation;

	@Field(() => TaxCalculation)
	accountFee: TaxCalculation;

	@Field(() => TaxCalculation)
	managementFee: TaxCalculation;

	@Field(() => TaxCalculation)
	fundFee: TaxCalculation;

	@Field(() => TaxCalculation)
	taxWithheld: TaxCalculation;

	@Field(() => TaxCalculation)
	nonResidentTax: TaxCalculation;

	@Field(() => TaxCalculation)
	deposit: TaxCalculation;

	@Field(() => TaxCalculation)
	withdrawal: TaxCalculation;

	@Field(() => TaxCalculation)
	contribution: TaxCalculation;

	@Field(() => TaxCalculation)
	returnOfPrincipal: TaxCalculation;

	@Field(() => TaxCalculation)
	loanPayment: TaxCalculation;

	@Field(() => TaxCalculation)
	marginExpense: TaxCalculation;

	@Field(() => TaxCalculation)
	stockDistribution: TaxCalculation;

	@Field(() => TaxCalculation)
	unqualifiedGain: TaxCalculation;
}

@ObjectType()
export class PortfolioSummaryRealized {
	// Derived fields -------------------------------------------------------------
	@Field({
		description: 'Total realized gain or loss derived from the relevant fields',
	})
	gainTotal: number;

	@Field(() => EstimatedTaxBill, {
		description: 'Estimated tax bill based on realized gains and losses',
	})
	estimatedTaxBill: EstimatedTaxBill;

	// 1-1 databse column fields --------------------------------------------------
	@Field({ description: 'Total current plaid amount' })
	current: number;

	@Field({ description: 'Total available plaid amount' })
	available: number;

	@Field()
	shortTermCapitalGain: number;

	@Field()
	longTermCapitalGain: number;

	@Field()
	dividend: number;

	@Field()
	qualifiedDividend: number;

	@Field()
	nonQualifiedDividend: number;

	@Field()
	dividendReinvestment: number;

	@Field()
	interest: number;

	@Field()
	interestReinvestment: number;

	@Field()
	distribution: number;

	@Field()
	accountFee: number;

	@Field()
	managementFee: number;

	@Field()
	fundFee: number;

	@Field()
	taxWithheld: number;

	@Field()
	nonResidentTax: number;

	@Field()
	deposit: number;

	@Field()
	withdrawal: number;

	@Field()
	contribution: number;

	@Field()
	returnOfPrincipal: number;

	@Field()
	loanPayment: number;

	@Field()
	marginExpense: number;

	@Field()
	stockDistribution: number;

	@Field()
	unqualifiedGain: number;

	@Field({
		description: 'The unrealized profit from RealizedPAndL (Not real time)',
	})
	unrealizedProfit: number;

	@Field({
		description: 'The unrealized loss from RealizedPAndL (Not real time)',
	})
	unrealizedLoss: number;
}

@ObjectType()
export class HarvestPotential {
	@Field(() => Number, {
		description: 'The realized gain or loss that can be harvested',
	})
	realized: number;

	@Field(() => Number, {
		description: 'The unrealized gain or loss that can be harvested',
	})
	unrealized: number;

	@Field(() => Number, {
		description: 'The total amount to be harvested (should always be positive)',
	})
	total: number;
}

@ObjectType()
export class PortfolioSummaryIncludingHarvest {
	@Field(() => PortfolioSummaryRealized)
	realized: PortfolioSummaryRealized;

	@Field(() => PortfolioSummaryUnrealized)
	unrealized: PortfolioSummaryUnrealized;

	@Field(() => HarvestPotential)
	harvest: HarvestPotential;
}

@ObjectType()
export class PortfolioSummary {
	@Field(() => PortfolioSummaryRealized)
	realized: PortfolioSummaryRealized;

	@Field(() => PortfolioSummaryUnrealized)
	unrealized: PortfolioSummaryUnrealized;

	@Field(() => HarvestPotential)
	harvest: HarvestPotential;

	@Field(() => SetUpStatus)
	setUpStatus: SetUpStatus;

	@Field(() => PortfolioSummaryIncludingHarvest)
	includingCurrentHarvest: PortfolioSummaryIncludingHarvest;
}

@ObjectType()
export class HarvestOrder {
	@Field(() => String, { nullable: true })
	lotId?: string;

	@Field(() => String)
	assetSymbol: string;

	@Field(() => Number)
	quantity: number;

	@Field(() => String)
	type: 'sell' | 'buy';

	@Field(() => Number)
	profitAndLoss: number;
}

@ObjectType()
export class HarvestLotOrder {
	@Field()
	id: string;

	@Field({ description: 'Lot Id' })
	lotId: string;

	@Field()
	accountId: string;

	@Field()
	pricePaid: string;

	@Field()
	costBasis: string;

	@Field()
	valueTotal: string;

	@Field()
	gainTotal: string;

	@Field()
	quantity: string;

	@Field()
	lastPrice: string;

	@Field()
	assetSymbol: string;

	@Field()
	dollarPerSharePnL: string;

	@Field(() => TaxGain)
	taxGain: TaxGain;

	@Field(() => OrderType)
	orderType: PrismaOrderType;

	@Field(() => Date)
	acquiredDate: Date;
}

@ObjectType()
export class HarvestResult {
	@Field(() => [HarvestLotOrder])
	realizedOrders: HarvestLotOrder[];

	@Field(() => [HarvestLotOrder])
	unrealizedOrders: HarvestLotOrder[];

	@Field(() => [HarvestLotOrder])
	allOrders: HarvestLotOrder[];

	@Field(() => PortfolioSummary)
	portfolioSummary: PortfolioSummary;

	@Field(() => Number)
	neutralHarvestTarget: number;
}

@ObjectType()
export class UnrealizedHarvestMatchResult {
	@Field(() => LotCurrent)
	sourceLot: LotCurrent;

	@Field(() => [HarvestLotOrder])
	matchedLotOrders: HarvestLotOrder[];
}

@ObjectType()
export class HarvestMatchPair {
	@Field(() => [HarvestLotCurrent])
	sourceLots: HarvestLotCurrent[];

	@Field(() => [HarvestLotCurrent])
	matchedLots: HarvestLotCurrent[];

	@Field(() => Number)
	sourceHarvestPAndL: number;

	@Field(() => Number)
	matchedHarvestPAndL: number;
}

@ObjectType()
export class HarvestMatchItem {
	@Field()
	id: string;

	@Field(() => [HarvestMatchPair])
	pairs: HarvestMatchPair[];
}

@ObjectType()
export class HarvestEvalResult {
	@Field(() => PortfolioSummary)
	summary: PortfolioSummary;

	@Field(() => HarvestType)
	harvestType: HarvestType;

	@Field(() => [LotCurrent], { nullable: true })
	lotsCurrent?: LotCurrent[];

	@Field(() => [HarvestMatchItem], { nullable: true })
	matchedItems?: HarvestMatchItem[];

	@Field(() => Number, {
		description: 'Total number of harvest lots if user is paying',
	})
	totalHarvestLots: number;

	@Field(() => [String], {
		description: 'List of unique asset symbols in portfolio',
	})
	uniqueAssetSymbols: string[];

	@Field(() => Number, {
		description: 'The neutral harvest target',
	})
	neutralHarvestTarget: number;

	@Field(() => Number, {
		description:
			'The remaining harvest target after harvesting the current lots (takes into account the target nuetral state ~-3k for tax write offs)',
	})
	remainingHarvestTarget: number;
}

@InputType()
export class DirectedHarvestLot {
	@Field(() => String)
	lotId: string;

	@Field(() => Number)
	quantity: number;

	@Field(() => Boolean, { nullable: true })
	counterTransaction?: boolean;
}

@InputType()
export class HarvestEvalFilters {
	@Field(() => Number, { nullable: true })
	minPAndL?: number;

	@Field(() => [String], { nullable: true })
	excludeAssetSymbols?: string[];

	@Field(() => Date, { nullable: true })
	purchaseDateBefore?: Date;

	@Field(() => Date, { nullable: true })
	purchaseDateAfter?: Date;
}
