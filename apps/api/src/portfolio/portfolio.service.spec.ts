import { Test, type TestingModule } from '@nestjs/testing';

import { HarvestType } from '@prisma/client';
import { AppModule } from '~/app/app.module';
import { type LotCurrent, TaxGain } from '~/lot/lot.dto';
import { PortfolioSummaryRealized } from './portfolio.dto';
import Harvest from './portfolio.harvest';
import { PortfolioService } from './portfolio.service';
import HarvestInput_1 from './test/harvest_1/input.json';
import HarvestLotMap_1 from './test/harvest_1/lotMap.json';
import HarvestRealizedOrders_1 from './test/harvest_1/realizedOrders.json';
import HarvestUnrealizedOrders_1 from './test/harvest_1/unrealizedOrders.json';
import HarvestInput_2 from './test/harvest_2/input.json';
import HarvestLotMap_2 from './test/harvest_2/lotMap.json';
import HarvestRealizedOrders_2 from './test/harvest_2/realizedOrders.json';
import HarvestUnrealizedOrders_2 from './test/harvest_2/unrealizedOrders.json';
import HarvestAllOrders_3 from './test/harvest_3/allOrders.json';
import HarvestInput_3 from './test/harvest_3/input.json';
import HarvestRealizedOrders_3 from './test/harvest_3/realizedOrders.json';
import HarvestUnrealizedOrders_3 from './test/harvest_3/unrealizedOrders.json';

const mockRealized = (
	input: Partial<PortfolioSummaryRealized> = {},
): PortfolioSummaryRealized => {
	const createMockTaxCalc = (total: number) => ({
		total,
		rate: 0,
		result: 0,
	});

	return {
		// Derived fields -------------------------------------------------------------
		gainTotal: input.gainTotal ?? 0,
		estimatedTaxBill: input.estimatedTaxBill ?? {
			total: 0,
			shortTermCapitalGain: createMockTaxCalc(0),
			longTermCapitalGain: createMockTaxCalc(0),
			dividend: createMockTaxCalc(0),
			qualifiedDividend: createMockTaxCalc(0),
			nonQualifiedDividend: createMockTaxCalc(0),
			dividendReinvestment: createMockTaxCalc(0),
			interest: createMockTaxCalc(0),
			interestReinvestment: createMockTaxCalc(0),
			distribution: createMockTaxCalc(0),
			accountFee: createMockTaxCalc(0),
			managementFee: createMockTaxCalc(0),
			fundFee: createMockTaxCalc(0),
			taxWithheld: createMockTaxCalc(0),
			nonResidentTax: createMockTaxCalc(0),
			deposit: createMockTaxCalc(0),
			withdrawal: createMockTaxCalc(0),
			contribution: createMockTaxCalc(0),
			returnOfPrincipal: createMockTaxCalc(0),
			loanPayment: createMockTaxCalc(0),
			marginExpense: createMockTaxCalc(0),
			stockDistribution: createMockTaxCalc(0),
			unqualifiedGain: createMockTaxCalc(0),
		},
		// 1-1 databse column fields --------------------------------------------------
		current: input.current ?? 0,
		available: input.available ?? 0,
		shortTermCapitalGain: input.shortTermCapitalGain ?? 0,
		longTermCapitalGain: input.longTermCapitalGain ?? 0,
		dividend: input.dividend ?? 0,
		qualifiedDividend: input.qualifiedDividend ?? 0,
		nonQualifiedDividend: input.nonQualifiedDividend ?? 0,
		dividendReinvestment: input.dividendReinvestment ?? 0,
		interest: input.interest ?? 0,
		interestReinvestment: input.interestReinvestment ?? 0,
		distribution: input.distribution ?? 0,
		accountFee: input.accountFee ?? 0,
		managementFee: input.managementFee ?? 0,
		fundFee: input.fundFee ?? 0,
		taxWithheld: input.taxWithheld ?? 0,
		nonResidentTax: input.nonResidentTax ?? 0,
		deposit: input.deposit ?? 0,
		withdrawal: input.withdrawal ?? 0,
		contribution: input.contribution ?? 0,
		returnOfPrincipal: input.returnOfPrincipal ?? 0,
		loanPayment: input.loanPayment ?? 0,
		marginExpense: input.marginExpense ?? 0,
		stockDistribution: input.stockDistribution ?? 0,
		unqualifiedGain: input.unqualifiedGain ?? 0,
		unrealizedProfit: input.unrealizedProfit ?? 0,
		unrealizedLoss: input.unrealizedLoss ?? 0,
		...input,
	};
};

describe('portfolioService', () => {
	let service: PortfolioService;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		service = moduleFixture.get<PortfolioService>(PortfolioService);
	});

	it('should handle a positive realized gain and a larger unrealized gain', () => {
		const realized = mockRealized({
			dividend: 200,
			longTermCapitalGain: 400,
			shortTermCapitalGain: 400,
			gainTotal: 1000,
		});
		const unrealized = {
			accountCount: 1,
			gainTotal: 84_048,
			lossTotal: -2850,
			positionCount: 1,
			total: 81198,
		};

		expect(
			PortfolioService.calculateHarvest({
				realized,
				unrealized,
			}).harvest,
		).toEqual({
			realized: -1000,
			total: 2850,
			unrealized: -1850,
		});
	});

	it('should handle a negative realized gain and a larger unrealized gain', () => {
		const realized = mockRealized({
			dividend: 200,
			longTermCapitalGain: -300,
			shortTermCapitalGain: -400,
			gainTotal: -500,
		});
		const unrealized = {
			accountCount: 1,
			gainTotal: 10_000,
			lossTotal: -2000,
			positionCount: 1,
			total: 8000,
		};

		expect(
			PortfolioService.calculateHarvest({
				realized,
				unrealized,
			}).harvest,
		).toEqual({
			realized: 500,
			total: 2500,
			unrealized: -2000,
		});
	});

	it('should handle a negative realized gain and a smaller unrealized gain', () => {
		const realized = mockRealized({
			dividend: 200,
			longTermCapitalGain: -300,
			shortTermCapitalGain: -400,
			gainTotal: -500,
		});
		const unrealized = {
			accountCount: 1,
			gainTotal: 200,
			lossTotal: -2000,
			positionCount: 1,
			total: -1800,
		};

		expect(
			PortfolioService.calculateHarvest({
				realized,
				unrealized,
			}).harvest,
		).toEqual({
			realized: 200,
			total: 200,
			unrealized: 0,
		});
	});

	it('should handle a positive realized gain and a smaller unrealized gain', () => {
		const realized = mockRealized({
			dividend: 200,
			longTermCapitalGain: 400,
			shortTermCapitalGain: 400,
			gainTotal: 1000,
		});
		const unrealized = {
			accountCount: 1,
			gainTotal: 500,
			lossTotal: -10_000,
			positionCount: 1,
			total: -9500,
		};

		expect(
			PortfolioService.calculateHarvest({
				realized,
				unrealized,
			}).harvest,
		).toEqual({
			realized: -1000,
			total: 1500,
			unrealized: 500,
		});
	});

	it('should handle unrealized calculation', () => {
		const realized = mockRealized({
			dividend: 234,
			longTermCapitalGain: -520,
			shortTermCapitalGain: -312,
			gainTotal: -598,
		});
		const unrealized = {
			accountCount: 2,
			gainTotal: 168_097,
			lossTotal: -5701,
			positionCount: 258,
			total: 162396,
		};

		expect(
			PortfolioService.calculateHarvest({
				realized,
				unrealized,
			}).harvest,
		).toEqual({
			realized: 598,
			total: 6299,
			unrealized: -5701,
		});
	});

	it('should set up harvest lot buckets correctly', () => {
		// @ts-expect-error Date type doesnt match but its not used
		const harvest = new Harvest(HarvestInput_1);
		harvest.setupBuckets();
		expect(harvest.assetLotsByValue).toEqual(HarvestLotMap_1);
	});

	it('should handle a harvest', () => {
		// @ts-expect-error Date type doesnt match but its not used
		const harvest = new Harvest(HarvestInput_1);
		harvest.process();

		expect(harvest.realizedOrders).toEqual(
			expect.arrayContaining(
				HarvestRealizedOrders_1.map((order) => {
					// id field is auto generated for now so we need to not have that in the result comparison here
					// @ts-expect-error Its ok to remove the id for testing
					delete order.id;
					return expect.objectContaining(order);
				}),
			),
		);

		expect(harvest.unrealizedOrders).toEqual(
			expect.arrayContaining(
				HarvestUnrealizedOrders_1.map((order) => {
					// id field is auto generated for now so we need to not have that in the result comparison here
					// @ts-expect-error Its ok to remove the id for testing
					delete order.id;
					return expect.objectContaining(order);
				}),
			),
		);
	});

	it('should handle super small harvest if limits are lowered', () => {
		// @ts-expect-error Date type doesnt match but its not used
		const harvest = new Harvest(HarvestInput_2);
		harvest.setupBuckets();
		expect(harvest.assetLotsByValue).toEqual(HarvestLotMap_2);

		harvest.process();

		expect(harvest.realizedOrders).toEqual(
			expect.arrayContaining(
				HarvestRealizedOrders_2.map((order) => {
					// id field is auto generated for now so we need to not have that in the result comparison here
					// @ts-expect-error Its ok to remove the id for testing
					delete order.id;
					return expect.objectContaining(order);
				}),
			),
		);

		expect(harvest.unrealizedOrders).toEqual(
			expect.arrayContaining(
				HarvestUnrealizedOrders_2.map((order) => {
					// id field is auto generated for now so we need to not have that in the result comparison here
					// @ts-expect-error Its ok to remove the id for testing
					delete order.id;
					return expect.objectContaining(order);
				}),
			),
		);
	});

	it('should produce all orders of both realized and unrealized for a directed harvest', () => {
		// @ts-expect-error Date type doesnt match but its not used
		const harvest = new Harvest(HarvestInput_3);

		harvest.process();

		expect(harvest.realizedOrders).toEqual(
			expect.arrayContaining(
				HarvestRealizedOrders_3.map((order) => {
					// id field is auto generated for now so we need to not have that in the result comparison here
					// @ts-expect-error Its ok to remove the id for testing
					delete order.id;
					return expect.objectContaining(order);
				}),
			),
		);

		expect(harvest.unrealizedOrders).toEqual(
			expect.arrayContaining(
				HarvestUnrealizedOrders_3.map((order) => {
					// id field is auto generated for now so we need to not have that in the result comparison here
					// @ts-expect-error Its ok to remove the id for testing
					delete order.id;
					return expect.objectContaining(order);
				}),
			),
		);

		expect(harvest.allOrders).toEqual(
			expect.arrayContaining(
				HarvestAllOrders_3.map((order) => {
					// id field is auto generated for now so we need to not have that in the result comparison here
					// @ts-expect-error Its ok to remove the id for testing
					delete order.id;
					return expect.objectContaining(order);
				}),
			),
		);
	});

	describe('harvestType', () => {
		it('should return NO_OPPORTUNITY_EMPTY when all values are zero', () => {
			const result = service.harvestType({
				realizedGainTotal: 0,
				unrealizedGainTotal: 0,
				unrealizedLossTotal: 0,
			});
			expect(result).toBe(HarvestType.NO_OPPORTUNITY_EMPTY);
		});

		it('should return REDUCE_TAXES when both unrealized and realized are negative but realized is less than NUETRAL_HARVEST_TARGET (the allowable tax income write off)', () => {
			const result = service.harvestType({
				realizedGainTotal: -1000,
				unrealizedGainTotal: -500,
				unrealizedLossTotal: -2000,
			});
			expect(result).toBe(HarvestType.REDUCE_TAXES);
		});

		it('should return NO_OPPORTUNITY_LOSSES when both unrealized and realized are negative and realized is greater than NUETRAL_HARVEST_TARGET', () => {
			const result = service.harvestType({
				realizedGainTotal: -3000,
				unrealizedGainTotal: -500,
				unrealizedLossTotal: -2000,
			});
			expect(result).toBe(HarvestType.NO_OPPORTUNITY_LOSSES);
		});

		it('should return NO_OPPORTUNITY_GAINS when unrealized loss is zero/positive and realized gain is positive', () => {
			const result = service.harvestType({
				realizedGainTotal: 1000,
				unrealizedGainTotal: 500,
				unrealizedLossTotal: 0,
			});
			expect(result).toBe(HarvestType.NO_OPPORTUNITY_GAINS);
		});

		it('should return REDUCE_TAXES when realized is positive and unrealized is negative', () => {
			// Assuming NUETRAL_HARVEST_THRESHOLD is 1000
			const result = service.harvestType({
				realizedGainTotal: 500,
				unrealizedGainTotal: 2000,
				unrealizedLossTotal: -1500,
			});
			expect(result).toBe(HarvestType.REDUCE_TAXES);
		});

		it('should return REDUCE_TAXES when realized is negative but within NUETRAL_HARVEST_THRESHOLD', () => {
			// Assuming NUETRAL_HARVEST_THRESHOLD is 1000
			const result = service.harvestType({
				realizedGainTotal: -800,
				unrealizedGainTotal: 2000,
				unrealizedLossTotal: -1500,
			});
			expect(result).toBe(HarvestType.REDUCE_TAXES);
		});

		it('should return REDUCE_TAXES when realized gain exceeds neutral threshold', () => {
			// Assuming NUETRAL_HARVEST_THRESHOLD is 1000
			const result = service.harvestType({
				realizedGainTotal: 5000,
				unrealizedGainTotal: 2000,
				unrealizedLossTotal: -1500,
			});
			expect(result).toBe(HarvestType.REDUCE_TAXES);
		});

		it('should return CAPTURE_GAINS_TAX_FREE when realized loss exceeds neutral threshold', () => {
			// Assuming NUETRAL_HARVEST_THRESHOLD is 1000
			const result = service.harvestType({
				realizedGainTotal: -5000,
				unrealizedGainTotal: 2000,
				unrealizedLossTotal: -1500,
			});
			expect(result).toBe(HarvestType.CAPTURE_GAINS_TAX_FREE);
		});

		it('should handle edge case with mixed positive/negative values correctly', () => {
			const result = service.harvestType({
				realizedGainTotal: 2000,
				unrealizedGainTotal: 10000,
				unrealizedLossTotal: -3000,
			});
			expect(result).toBe(HarvestType.REDUCE_COST_BASIS);
		});

		it('should handle large unrealized losses with small realized losses correctly', () => {
			const result = service.harvestType({
				realizedGainTotal: -100,
				unrealizedGainTotal: 5000,
				unrealizedLossTotal: -100000,
			});
			expect(result).toBe(HarvestType.REDUCE_TAXES);
		});

		it('should return NO_OPPORTUNITY_LOSSES when only losses exist', () => {
			const result = service.harvestType({
				realizedGainTotal: -3000,
				unrealizedGainTotal: -2000,
				unrealizedLossTotal: -3000,
			});
			expect(result).toBe(HarvestType.NO_OPPORTUNITY_LOSSES);
		});

		it('should handle exact threshold boundary correctly', () => {
			// Assuming NUETRAL_HARVEST_THRESHOLD is 1000
			const result = service.harvestType({
				realizedGainTotal: -3000,
				unrealizedGainTotal: 2000,
				unrealizedLossTotal: -3500,
			});
			expect(result).toBe(HarvestType.REDUCE_COST_BASIS);
		});
	});

	describe('matchLots', () => {
		const createMockLot = (overrides: Partial<LotCurrent> = {}): LotCurrent => {
			const base = {
				id: 'lot-1',
				accountId: 'account-1',
				acquiredDate: new Date(),
				costBasis: '1000',
				dollarPerSharePnL: '5',
				gainTotal: '500',
				gainTotalPct: '0.5',
				lastPrice: '15',
				price: '10',
				remainingQty: '100',
				symbol: 'AAPL',
				taxGain: TaxGain.LONG,
				value: '1500',
				currentHarvestQty: '0',
				availableQty: '0',
				...overrides,
			};

			// Calculate availableQty as remainingQty - currentHarvestQty
			const remainingQty = Number(base.remainingQty);
			const currentHarvestQty = Number(base.currentHarvestQty);
			const availableQty = (remainingQty - currentHarvestQty).toString();

			return {
				...base,
				availableQty,
			};
		};

		it('should return empty array when no source lots provided', () => {
			const sourceLots: LotCurrent[][] = [];
			const matchingLots = [[createMockLot()]];

			const result = PortfolioService.matchLots({ sourceLots, matchingLots });

			expect(result).toEqual([]);
		});

		it('should return empty array when no matching lots provided', () => {
			const sourceLots = [[createMockLot()]];
			const matchingLots: LotCurrent[][] = [];

			const result = PortfolioService.matchLots({ sourceLots, matchingLots });

			expect(result).toEqual([]);
		});

		it('should match source lot with positive P&L to matching lot with negative P&L', () => {
			const sourceLots = [
				[
					createMockLot({
						id: 'source-1',
						remainingQty: '10',
						currentHarvestQty: '0',
						dollarPerSharePnL: '15', // +$15 per share, 10 available shares = +$150 total
					}),
				],
			];

			const matchingLots = [
				[
					createMockLot({
						id: 'match-1',
						remainingQty: '20',
						currentHarvestQty: '0',
						dollarPerSharePnL: '-15', // -$15 per share, 20 available shares = -$300 total
					}),
				],
			];

			const result = PortfolioService.matchLots({ sourceLots, matchingLots });

			expect(result).toHaveLength(1); // One source row
			expect(result[0]).toHaveLength(1); // One matching combination
			expect(result[0][0].sourceLots).toHaveLength(1);
			expect(result[0][0].sourceLots[0].id).toBe('source-1');
			expect(result[0][0].matchedLots).toHaveLength(1);
			expect(result[0][0].matchedLots[0].id).toBe('match-1');
			// Should use 10 shares to get -$150 P&L (10 shares * -$15 per share)
			expect(result[0][0].matchedLots[0].harvestQuantity).toBe('10');
			expect(result[0][0].matchedLots[0].harvestPAndL).toBe(-150);
		});

		it('should match source lot with negative P&L to matching lot with positive P&L', () => {
			const sourceLots = [
				[
					createMockLot({
						id: 'source-1',
						remainingQty: '20',
						currentHarvestQty: '0',
						dollarPerSharePnL: '-10', // -$10 per share, 20 shares = -$200 total
					}),
				],
			];

			const matchingLots = [
				[
					createMockLot({
						id: 'match-1',
						remainingQty: '50',
						currentHarvestQty: '0',
						dollarPerSharePnL: '10', // +$10 per share, 50 shares = +$500 total
					}),
				],
			];

			const result = PortfolioService.matchLots({ sourceLots, matchingLots });

			expect(result).toHaveLength(1);
			expect(result[0][0].matchedLots[0].harvestQuantity).toBe('20');
			expect(result[0][0].matchedLots[0].harvestPAndL).toBe(200);
		});

		it('should handle multiple source lots in a row', () => {
			const sourceLots = [
				[
					createMockLot({
						id: 'source-1',
						remainingQty: '10',
						currentHarvestQty: '0',
						dollarPerSharePnL: '10', // 10 shares * $10 = $100
					}),
					createMockLot({
						id: 'source-2',
						remainingQty: '5',
						currentHarvestQty: '0',
						dollarPerSharePnL: '10', // 5 shares * $10 = $50
					}),
				],
			];

			const matchingLots = [
				[
					createMockLot({
						id: 'match-1',
						remainingQty: '20',
						currentHarvestQty: '0',
						dollarPerSharePnL: '-15', // 20 shares * -$15 = -$300 available
					}),
				],
			];

			const result = PortfolioService.matchLots({ sourceLots, matchingLots });

			expect(result).toHaveLength(1);
			expect(result[0][0].sourceLots).toHaveLength(2);
			// Total source P&L is $150, so should use 10 shares at -$15 per share
			expect(result[0][0].matchedLots[0].harvestQuantity).toBe('10');
			expect(result[0][0].matchedLots[0].harvestPAndL).toBe(-150);
		});

		it('should process multiple source lot rows separately', () => {
			const sourceLots = [
				[
					createMockLot({
						id: 'source-1',
						remainingQty: '10',
						currentHarvestQty: '0',
						dollarPerSharePnL: '10', // 10 shares * $10 = $100
					}),
				],
				[
					createMockLot({
						id: 'source-2',
						remainingQty: '20',
						currentHarvestQty: '0',
						dollarPerSharePnL: '10', // 20 shares * $10 = $200
					}),
				],
			];

			const matchingLots = [
				[
					createMockLot({
						id: 'match-1',
						remainingQty: '50',
						currentHarvestQty: '0',
						dollarPerSharePnL: '-10', // 50 shares * -$10 = -$500 available
					}),
				],
			];

			const result = PortfolioService.matchLots({ sourceLots, matchingLots });

			expect(result).toHaveLength(2); // Two source rows
			expect(result[0][0].sourceLots[0].id).toBe('source-1');
			expect(result[0][0].matchedLots[0].harvestQuantity).toBe('10');
			expect(result[0][0].matchedLots[0].harvestPAndL).toBe(-100);
			expect(result[1][0].sourceLots[0].id).toBe('source-2');
			expect(result[1][0].matchedLots[0].harvestQuantity).toBe('20');
			expect(result[1][0].matchedLots[0].harvestPAndL).toBe(-200);
		});

		it('should handle multiple matching lot rows for each source row', () => {
			const sourceLots = [
				[
					createMockLot({
						id: 'source-1',
						remainingQty: '10',
						currentHarvestQty: '0',
						dollarPerSharePnL: '10', // 10 shares * $10 = $100
					}),
				],
			];

			const matchingLots = [
				[
					createMockLot({
						id: 'match-1',
						remainingQty: '20',
						currentHarvestQty: '0',
						dollarPerSharePnL: '-10', // 20 shares * -$10 = -$200 available
					}),
				],
				[
					createMockLot({
						id: 'match-2',
						remainingQty: '30',
						currentHarvestQty: '0',
						dollarPerSharePnL: '-5', // 30 shares * -$5 = -$150 available
					}),
				],
			];

			const result = PortfolioService.matchLots({ sourceLots, matchingLots });

			expect(result).toHaveLength(1); // One source row
			expect(result[0]).toHaveLength(2); // Two matching combinations

			// First combination with match-1
			expect(result[0][0].matchedLots[0].id).toBe('match-1');
			expect(result[0][0].matchedLots[0].harvestQuantity).toBe('10');
			expect(result[0][0].matchedLots[0].harvestPAndL).toBe(-100);

			// Second combination with match-2
			expect(result[0][1].matchedLots[0].id).toBe('match-2');
			expect(result[0][1].matchedLots[0].harvestQuantity).toBe('20');
			expect(result[0][1].matchedLots[0].harvestPAndL).toBe(-100);
		});

		it('should handle multiple lots within a matching row', () => {
			const sourceLots = [
				[
					createMockLot({
						id: 'source-1',
						remainingQty: '20',
						currentHarvestQty: '0',
						dollarPerSharePnL: '10', // +$10 per share, 20 shares = +$200 total
					}),
				],
			];

			const matchingLots = [
				[
					createMockLot({
						id: 'match-1',
						remainingQty: '10',
						currentHarvestQty: '0',
						dollarPerSharePnL: '-10', // -$10 per share, 10 shares = -$100 total
					}),
					createMockLot({
						id: 'match-2',
						remainingQty: '15',
						currentHarvestQty: '0',
						dollarPerSharePnL: '-10', // -$10 per share, 15 shares = -$150 total
					}),
				],
			];

			const result = PortfolioService.matchLots({ sourceLots, matchingLots });

			expect(result).toHaveLength(1);
			expect(result[0][0].matchedLots).toHaveLength(2);

			// With whole number strategy: source needs $200, allocate shares sequentially
			// First lot: use all 10 shares for -$100
			expect(result[0][0].matchedLots[0].harvestQuantity).toBe('10');
			expect(result[0][0].matchedLots[0].harvestPAndL).toBe(-100);
			// Second lot: need remaining $100, so 10 shares at -$10 each
			expect(result[0][0].matchedLots[1].harvestQuantity).toBe('10');
			expect(result[0][0].matchedLots[1].harvestPAndL).toBe(-100);
		});

		it('should respect already harvested shares when calculating available shares', () => {
			const sourceLots = [
				[
					createMockLot({
						id: 'source-1',
						remainingQty: '100',
						currentHarvestQty: '50', // Already harvested 50 shares
						dollarPerSharePnL: '10', // Only 50 available shares * $10 = $500 total
					}),
				],
			];

			const matchingLots = [
				[
					createMockLot({
						id: 'match-1',
						remainingQty: '200',
						currentHarvestQty: '100', // Already harvested 100 shares
						dollarPerSharePnL: '-5', // Only 100 available shares * -$5 = -$500 total
					}),
				],
			];

			const result = PortfolioService.matchLots({ sourceLots, matchingLots });

			expect(result).toHaveLength(1);
			// Perfect match - matching lot has exactly enough P&L capacity
			expect(result[0][0].matchedLots[0].harvestQuantity).toBe('100');
			expect(result[0][0].matchedLots[0].harvestPAndL).toBe(-500);
		});

		it('should return empty result when no suitable matches found', () => {
			const sourceLots = [
				[
					createMockLot({
						id: 'source-1',
					}),
				],
			];

			const matchingLots = [
				[
					createMockLot({
						id: 'match-1',
						remainingQty: '0', // No shares
						dollarPerSharePnL: '0',
					}),
				],
			];

			const result = PortfolioService.matchLots({ sourceLots, matchingLots });

			expect(result).toEqual([]);
		});

		it('should properly set harvestQuantity and harvestPAndL for source lots', () => {
			const sourceLots = [
				[
					createMockLot({
						id: 'source-1',
						remainingQty: '20',
						currentHarvestQty: '0',
						dollarPerSharePnL: '5', // +$5 per share, 20 shares = +$100 total
					}),
				],
			];

			const matchingLots = [
				[
					createMockLot({
						id: 'match-1',
						remainingQty: '50',
						currentHarvestQty: '0',
						dollarPerSharePnL: '-5', // -$5 per share, 50 shares = -$250 total
					}),
				],
			];

			const result = PortfolioService.matchLots({ sourceLots, matchingLots });

			expect(result).toHaveLength(1);
			// Source lot should use all its shares since matching has more capacity
			expect(result[0][0].sourceLots[0].harvestQuantity).toBe('20');
			expect(result[0][0].sourceLots[0].harvestPAndL).toBe(100);
			// Matching lot should use 20 shares to match -$100 P&L
			expect(result[0][0].matchedLots[0].harvestQuantity).toBe('20');
			expect(result[0][0].matchedLots[0].harvestPAndL).toBe(-100);
		});

		it('should handle scenario B where source lots are adjusted to match limited matching capacity', () => {
			const sourceLots = [
				[
					createMockLot({
						id: 'source-1',
						remainingQty: '100',
						currentHarvestQty: '0',
						dollarPerSharePnL: '10', // +$10 per share, 100 shares = +$1000 total
					}),
				],
			];

			const matchingLots = [
				[
					createMockLot({
						id: 'match-1',
						remainingQty: '30',
						currentHarvestQty: '0',
						dollarPerSharePnL: '-10', // -$10 per share, 30 shares = -$300 total
					}),
				],
			];

			const result = PortfolioService.matchLots({ sourceLots, matchingLots });

			expect(result).toHaveLength(1);
			// Source lot should be adjusted to match what matching lot can provide (30% of original)
			expect(result[0][0].sourceLots[0].harvestQuantity).toBe('30');
			expect(result[0][0].sourceLots[0].harvestPAndL).toBe(300);
			// Matching lot should use all its shares
			expect(result[0][0].matchedLots[0].harvestQuantity).toBe('30');
			expect(result[0][0].matchedLots[0].harvestPAndL).toBe(-300);
		});

		it('should calculate P&L summary values correctly', () => {
			const sourceLots = [
				[
					createMockLot({
						id: 'source-1',
						remainingQty: '10',
						currentHarvestQty: '0',
						dollarPerSharePnL: '15',
					}),
				],
			];

			const matchingLots = [
				[
					createMockLot({
						id: 'match-1',
						remainingQty: '20',
						currentHarvestQty: '0',
						dollarPerSharePnL: '-15',
					}),
				],
			];

			const result = PortfolioService.matchLots({ sourceLots, matchingLots });

			expect(result).toHaveLength(1);
			expect(result[0][0].sourceHarvestPAndL).toBe(150);
			expect(result[0][0].matchedHarvestPAndL).toBe(-150);
			// Verify they sum to near zero (should be balanced)
			expect(
				result[0][0].sourceHarvestPAndL + result[0][0].matchedHarvestPAndL,
			).toBe(0);
		});

		describe('minPAndL filtering', () => {
			it('should filter out source lots that do not meet minPAndL threshold', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-small',
							remainingQty: '5',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10', // 5 shares * $10 = $50 total (below $100 minimum)
						}),
					],
					[
						createMockLot({
							id: 'source-large',
							remainingQty: '20',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10', // 20 shares * $10 = $200 total (above $100 minimum)
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '50',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10',
						}),
					],
				];

				const result = PortfolioService.matchLots({
					sourceLots,
					matchingLots,
					resultFilters: { minPAndL: 100 },
				});

				// Should only have results for the large source lot
				expect(result).toHaveLength(1);
				expect(result[0][0].sourceLots[0].id).toBe('source-large');
				expect(
					Math.abs(result[0][0].sourceHarvestPAndL),
				).toBeGreaterThanOrEqual(100);
			});

			it('should filter out matched results that do not meet minPAndL threshold', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '20',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10', // 20 shares * $10 = $200 total
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-small',
							remainingQty: '5',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10', // Only 5 shares available, will only use 5 for -$50 (below $100 minimum)
						}),
					],
					[
						createMockLot({
							id: 'match-large',
							remainingQty: '50',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10', // 50 shares available, will use 20 for -$200 (above $100 minimum)
						}),
					],
				];

				const result = PortfolioService.matchLots({
					sourceLots,
					matchingLots,
					resultFilters: { minPAndL: 100 },
				});

				// Should only have results for the large matching lot
				expect(result).toHaveLength(1);
				expect(result[0]).toHaveLength(1); // Only one matching combination should pass the filter
				expect(result[0][0].matchedLots[0].id).toBe('match-large');
				expect(
					Math.abs(result[0][0].matchedHarvestPAndL),
				).toBeGreaterThanOrEqual(100);
			});

			it('should return results when both source and matched lots meet minPAndL threshold', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '15',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10', // 15 shares * $10 = $150 total (above $100 minimum)
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '20',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10', // Will use 15 shares for -$150 (above $100 minimum)
						}),
					],
				];

				const result = PortfolioService.matchLots({
					sourceLots,
					matchingLots,
					resultFilters: { minPAndL: 100 },
				});

				expect(result).toHaveLength(1);
				expect(result[0]).toHaveLength(1);
				expect(
					Math.abs(result[0][0].sourceHarvestPAndL),
				).toBeGreaterThanOrEqual(100);
				expect(
					Math.abs(result[0][0].matchedHarvestPAndL),
				).toBeGreaterThanOrEqual(100);
			});

			it('should return empty results when no combinations meet minPAndL threshold', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '5',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10', // 5 shares * $10 = $50 total (below $100 minimum)
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '8',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10', // Will use 5 shares for -$50 (below $100 minimum)
						}),
					],
				];

				const result = PortfolioService.matchLots({
					sourceLots,
					matchingLots,
					resultFilters: { minPAndL: 100 },
				});

				expect(result).toHaveLength(0);
			});

			it('should work without minPAndL filter (backward compatibility)', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '5',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10',
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '10',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10',
						}),
					],
				];

				// No resultFilters provided
				const result = PortfolioService.matchLots({ sourceLots, matchingLots });

				expect(result).toHaveLength(1);
				expect(result[0]).toHaveLength(1);
			});
		});

		describe('zero harvest quantity filtering', () => {
			it('should exclude results where source lots have zero harvest quantity', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '0', // No shares available
							currentHarvestQty: '0',
							dollarPerSharePnL: '10',
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '10',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10',
						}),
					],
				];

				const result = PortfolioService.matchLots({ sourceLots, matchingLots });

				// Should return empty results because source lot has 0 harvestable shares
				expect(result).toHaveLength(0);
			});

			it('should exclude results where matched lots have zero harvest quantity', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '10',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10',
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '0', // No shares available
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10',
						}),
					],
				];

				const result = PortfolioService.matchLots({ sourceLots, matchingLots });

				// Should return empty results because matching lot has 0 harvestable shares
				expect(result).toHaveLength(0);
			});

			it('should exclude results where some lots in multi-lot arrays have zero harvest quantity', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '10',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10',
						}),
						createMockLot({
							id: 'source-2',
							remainingQty: '0', // This lot has no shares available
							currentHarvestQty: '0',
							dollarPerSharePnL: '10',
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '20',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10',
						}),
					],
				];

				const result = PortfolioService.matchLots({ sourceLots, matchingLots });

				// Should return empty results because one source lot will have 0 harvest quantity
				expect(result).toHaveLength(0);
			});

			it('should include results where all lots have non-zero harvest quantities', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '10',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10',
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '20',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10',
						}),
					],
				];

				const result = PortfolioService.matchLots({ sourceLots, matchingLots });

				// Should return results because all lots have harvestable shares
				expect(result).toHaveLength(1);
				expect(result[0]).toHaveLength(1);
				expect(
					Number(result[0][0].sourceLots[0].harvestQuantity),
				).toBeGreaterThan(0);
				expect(
					Number(result[0][0].matchedLots[0].harvestQuantity),
				).toBeGreaterThan(0);
			});

			it('should exclude results where lots are already fully harvested', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '10',
							currentHarvestQty: '10', // Already fully harvested
							dollarPerSharePnL: '10',
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '20',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10',
						}),
					],
				];

				const result = PortfolioService.matchLots({ sourceLots, matchingLots });

				// Should return empty results because source lot has no available shares (fully harvested)
				expect(result).toHaveLength(0);
			});

			it('should handle edge case where P&L calculation results in zero shares needed', () => {
				// Create a scenario where the algorithm would calculate 0 shares needed
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '1',
							currentHarvestQty: '0',
							dollarPerSharePnL: '0.01', // Very small P&L per share = $0.01 total
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '1000',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-100', // Large negative P&L per share
						}),
					],
				];

				const result = PortfolioService.matchLots({ sourceLots, matchingLots });

				// The algorithm should calculate that 0 shares are needed from matching lot
				// and filter out this result
				expect(result).toHaveLength(0);
			});
		});

		describe('maxPercentageDifference filtering', () => {
			it('should include results when P&L difference is within threshold', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '10',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10', // $100 total (10 shares * $10)
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '50',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10', // -$10 per share, will use 10 shares for -$100 to match source
						}),
					],
				];

				// First test without filter to make sure basic matching works
				const resultWithoutFilter = PortfolioService.matchLots({
					sourceLots,
					matchingLots,
				});
				expect(resultWithoutFilter).toHaveLength(1);
				// The algorithm is adjusting to match what's available
				expect(resultWithoutFilter[0][0].sourceHarvestPAndL).toBe(100);
				expect(resultWithoutFilter[0][0].matchedHarvestPAndL).toBe(-100);

				const result = PortfolioService.matchLots({
					sourceLots,
					matchingLots,
					resultFilters: { maxPercentageDifference: 200 }, // Allow 200% difference
				});

				expect(result).toHaveLength(1);
				expect(result[0]).toHaveLength(1);
				// P&L difference is: |100 - (-100)| / max(100, 100) * 100 = 200/100 * 100 = 200%
				expect(result[0][0].sourceHarvestPAndL).toBe(100);
				expect(result[0][0].matchedHarvestPAndL).toBe(-100);
			});

			it('should exclude results when P&L difference exceeds threshold', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '10',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10',
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '1',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-5', // Only -$5 available vs source $10 = 50% difference
						}),
					],
				];

				const result = PortfolioService.matchLots({
					sourceLots,
					matchingLots,
					resultFilters: { maxPercentageDifference: 49 },
				});

				expect(result).toHaveLength(0);
			});

			it('should handle exact threshold boundary cases', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '10',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10',
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '8',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10',
						}),
					],
				];

				// Should be included when threshold is exactly the difference
				const resultAtThreshold = PortfolioService.matchLots({
					sourceLots,
					matchingLots,
					resultFilters: { maxPercentageDifference: 0 },
				});
				expect(resultAtThreshold).toHaveLength(1);

				// Should be excluded when threshold is just below the difference
				const resultBelowThreshold = PortfolioService.matchLots({
					sourceLots,
					matchingLots,
					resultFilters: { maxPercentageDifference: -0.01 },
				});
				expect(resultBelowThreshold).toHaveLength(0);
			});

			it('should work with multiple matching combinations and filter appropriately', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '10',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10',
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '10',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10', // -$100 available, 0% difference (should pass)
						}),
					],
					[
						createMockLot({
							id: 'match-2',
							remainingQty: '1',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-5', // -$5 available, 100% difference (should fail)
						}),
					],
				];

				const result = PortfolioService.matchLots({
					sourceLots,
					matchingLots,
					resultFilters: { maxPercentageDifference: 20 },
				});

				expect(result).toHaveLength(1);
				expect(result[0]).toHaveLength(1);
				expect(result[0][0].matchedLots[0].id).toBe('match-1');
			});

			it('should calculate percentage difference correctly with negative values', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '10',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10',
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '10',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10', // $100 available to match -$100 source
						}),
					],
				];

				const result = PortfolioService.matchLots({
					sourceLots,
					matchingLots,
					resultFilters: { maxPercentageDifference: 25 },
				});

				expect(result).toHaveLength(1);
				expect(result[0]).toHaveLength(1);
			});

			it('should handle edge case with very small P&L values', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '1',
							currentHarvestQty: '0',
							dollarPerSharePnL: '0.01',
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '1',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-0.005', // -$0.005 available vs $0.01 source = 100% difference
						}),
					],
				];

				const result = PortfolioService.matchLots({
					sourceLots,
					matchingLots,
					resultFilters: { maxPercentageDifference: 49 },
				});

				expect(result).toHaveLength(0);
			});

			it('should not apply filter when maxPercentageDifference is not specified', () => {
				const sourceLots = [
					[
						createMockLot({
							id: 'source-1',
							remainingQty: '10',
							currentHarvestQty: '0',
							dollarPerSharePnL: '10',
						}),
					],
				];

				const matchingLots = [
					[
						createMockLot({
							id: 'match-1',
							remainingQty: '1',
							currentHarvestQty: '0',
							dollarPerSharePnL: '-10', // -$10 available vs $100 source = large difference
						}),
					],
				];

				const result = PortfolioService.matchLots({ sourceLots, matchingLots });

				expect(result).toHaveLength(1);
				expect(result[0]).toHaveLength(1);
			});
		});
	});
});
