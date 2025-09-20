/** biome-ignore-all lint/suspicious/noExplicitAny: <test file> */
/** biome-ignore-all lint/style/noNonNullAssertion: <test file> */
import Decimal from 'decimal.js';
import { Selectable } from 'kysely';
import { Position } from '~/database/db';
import {
	deduplicateEquivalentChangeSetsKysely,
	findSubsetHybrid,
	LotChangeKysely,
	LotDataKysely,
	processMultiChangeSetKysely,
	resolveLotChange,
} from './lot-application';
import { findAllMatchingSubsetsBottomUp } from './lot-application.bottom-up';
import { findGreedySubset } from './lot-application.greedy';

const D = (n: number | string) => new Decimal(n);

const convertToLotData = (
	input: {
		quantity: string;
		price: string;
		lotId: string;
		accountId: string;
		acquiredDate: string;
	}[],
): LotDataKysely[] =>
	input.map((entry) => ({
		quantity: D(entry.quantity),
		price: D(entry.price),
		lotId: entry.lotId,
		accountId: entry.accountId,
		acquiredDate: new Date(entry.acquiredDate),
	}));

const fakePosition = (
	quantity: string,
	targetValue: string,
	assetSymbol: string,
): Selectable<Position> => ({
	accountId: '1',
	assetSymbol,
	change: null,
	changePCT: null,
	commissionDay: null,
	commissionTotal: null,
	costPerShare: null,
	costTotal: targetValue,
	createdAt: new Date(),
	dateAcquired: null,
	dateExpiration: null,
	externalId: null,
	feesDay: null,
	feesOther: null,
	gainDay: null,
	gainTotal: null,
	gainTotalPCT: null,
	id: '1',
	marketValue: null,
	portfolioId: '1',
	pricePaid: null,
	quantity,
	quoteStatus: null,
	type: 'type',
	updatedAt: new Date(),
});

const basicTuples: LotDataKysely[] = [
	{
		quantity: D(4),
		price: D(100),
		lotId: 'test lot id',
		accountId: '1',
		acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
	},
	{
		quantity: D(2),
		price: D(200),
		lotId: 'test lot id',
		accountId: '1',
		acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
	},
	{
		quantity: D(2),
		price: D(200),
		lotId: 'test lot id',
		accountId: '1',
		acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
	},
];

describe('sell transaction allocation strategies', () => {
	describe('greedy', () => {
		it('fIFO: basic', () => {
			const tuples: LotDataKysely[] = [
				{
					quantity: D(100),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(200),
					price: D(200),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(200),
					price: D(300),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const result = findGreedySubset({
				tuples,
				targetQuantity: D(498),
				targetValue: D(109400),
				time: false,
			});
			expect(result).to.deep.include.members([
				{
					quantity: D(100),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(200),
					price: D(200),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(198),
					price: D(300),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			]);
			expect(result?.length).to.be.greaterThan(0);
		});

		it('fail for last in, first out - succeed if reversed', () => {
			const tuples: LotDataKysely[] = [
				{
					quantity: D(100),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(200),
					price: D(200),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(200),
					price: D(300),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const result = findGreedySubset({
				tuples,
				targetQuantity: D(498),
				targetValue: D(109800),
				time: false,
			});
			expect(result).toBeNull();

			const resultReversed = findGreedySubset({
				tuples: tuples.reverse(),
				targetQuantity: D(498),
				targetValue: D(109800),
				time: false,
			});
			expect(resultReversed).to.deep.include.members([
				{
					quantity: D(98),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(200),
					price: D(200),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(200),
					price: D(300),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			]);
			expect(resultReversed?.length).to.be.greaterThan(0);
		});

		it('fIFO: spanning 2 lots', () => {
			const tuples: LotDataKysely[] = [
				{
					quantity: D(100),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(200),
					price: D(200),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(200),
					price: D(300),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const result = findGreedySubset({
				tuples,
				targetQuantity: D(299),
				targetValue: D(49800),
				time: false,
			});
			expect(result).to.deep.include.members([
				{
					quantity: D(100),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(199),
					price: D(200),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			]);
			expect(result?.length).to.be.greaterThan(0);
		});

		it('fIFO: finds solution within value epsilon', () => {
			const tuples: LotDataKysely[] = [
				{
					quantity: D(100),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(200),
					price: D(200),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(200),
					price: D(300),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const result = findGreedySubset({
				tuples,
				targetQuantity: D(299),
				targetValue: D(49800.01),
				time: false,
			});
			expect(result).to.deep.include.members([
				{
					quantity: D(100),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(199),
					price: D(200),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			]);
			expect(result?.length).to.be.greaterThan(0);
		});

		it('fIFO: finds solution within qty epsilon', () => {
			const tuples: LotDataKysely[] = [
				{
					quantity: D(100),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(200),
					price: D(200),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(200),
					price: D(300),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const result = findGreedySubset({
				tuples,
				targetQuantity: D(299.01),
				targetValue: D(49800),
				epsilonValue: D(0.01),
				epsilonQty: D(0.01),
				time: false,
			});
			expect(result).to.deep.include.members([
				{
					quantity: D(100),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(199),
					price: D(200),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			]);
			expect(result?.length).to.be.greaterThan(0);
		});
	});

	describe('bottom up', () => {
		it('no solution - target too high', () => {
			const tuples: LotDataKysely[] = [
				{
					quantity: D(1),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(1),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const result = findAllMatchingSubsetsBottomUp({
				tuples,
				targetQuantity: D(3),
				targetValue: D(400),
				maxResults: 5,
				time: false,
			});
			expect(result).to.deep.equal([]);
		});

		it('no solution - target too low', () => {
			const tuples: LotDataKysely[] = [
				{
					quantity: D(3),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(3),
					price: D(200),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const result = findAllMatchingSubsetsBottomUp({
				tuples,
				targetQuantity: D(1),
				targetValue: D(50),
				maxResults: 5,
				time: false,
			});
			expect(result).to.deep.equal([]);
		});

		it('zero quantity and value', () => {
			const tuples: LotDataKysely[] = [
				{
					quantity: D(1),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(2),
					price: D(200),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const result = findAllMatchingSubsetsBottomUp({
				tuples,
				targetQuantity: D(0),
				targetValue: D(0),
				maxResults: 5,
				time: false,
			});
			expect(result).to.deep.equal([
				[
					{
						quantity: D(0),
						price: D(100),
						lotId: 'test lot id',
						accountId: '1',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
					},
					{
						quantity: D(0),
						price: D(200),
						lotId: 'test lot id',
						accountId: '1',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
					},
				],
			]);
		});

		it('one valid solution', () => {
			const tuples: LotDataKysely[] = [
				{
					quantity: D(3),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(2),
					price: D(150),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const result = findAllMatchingSubsetsBottomUp({
				tuples,
				targetQuantity: D(4),
				targetValue: D(500),
				maxResults: 5,
				time: false,
			});
			expect(result).to.deep.equal([
				[
					{
						quantity: D(2),
						price: D(100),
						lotId: 'test lot id',
						accountId: '1',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
					},
					{
						quantity: D(2),
						price: D(150),
						lotId: 'test lot id',
						accountId: '1',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
					},
				],
			]);
		});

		it('multiple valid combinations', () => {
			const tuples: LotDataKysely[] = [
				{
					quantity: D(2),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(2),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(2),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const result = findAllMatchingSubsetsBottomUp({
				tuples,
				targetQuantity: D(4),
				targetValue: D(400),
				maxResults: 5,
				time: false,
			});
			const unique = new Set(result.map((r) => JSON.stringify(r)));
			expect(unique.size).to.be.greaterThan(1); // Should allow permutations
		});

		it('large values but exact match', () => {
			const tuples: LotDataKysely[] = [
				{
					quantity: D(10),
					price: D(1000),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const result = findAllMatchingSubsetsBottomUp({
				tuples,
				targetQuantity: D(5),
				targetValue: D(5000),
				maxResults: 5,
				time: false,
			});

			expect(result).to.deep.equal([
				[
					{
						quantity: D(5),
						price: D(1000),
						lotId: 'test lot id',
						accountId: '1',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
					},
				],
			]);
		});

		it('all zero quantities', () => {
			const tuples: LotDataKysely[] = [
				{
					quantity: D(0),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(0),
					price: D(200),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const result = findAllMatchingSubsetsBottomUp({
				tuples,
				targetQuantity: D(0),
				targetValue: D(0),
				maxResults: 5,
				time: false,
			});
			expect(result).to.deep.equal([
				[
					{
						quantity: D(0),
						price: D(100),
						lotId: 'test lot id',
						accountId: '1',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
					},
					{
						quantity: D(0),
						price: D(200),
						lotId: 'test lot id',
						accountId: '1',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
					},
				],
			]);
		});

		it('non-uniform values', () => {
			const tuples: LotDataKysely[] = [
				{
					quantity: D(3),
					price: D(5),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(2),
					price: D(20),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(1),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const result = findAllMatchingSubsetsBottomUp({
				tuples,
				targetQuantity: D(3),
				targetValue: D(30),
				maxResults: 5,
				time: false,
			});
			expect(result).to.deep.include([
				{
					quantity: D(2),
					price: D(5),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(1),
					price: D(20),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(0),
					price: D(100),
					lotId: 'test lot id',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			]);
		});

		it('edge case: empty input', () => {
			const result = findAllMatchingSubsetsBottomUp({
				tuples: [],
				targetQuantity: D(0),
				targetValue: D(0),
				maxResults: 5,
				time: false,
			});
			expect(result).to.deep.equal([[]]);
		});

		it('edge case: empty input with non-zero target', () => {
			const result = findAllMatchingSubsetsBottomUp({
				tuples: [],
				targetQuantity: D(1),
				targetValue: D(1),
				maxResults: 5,
				time: false,
			});
			expect(result).to.deep.equal([]);
		});

		it('respects maxResults in DP', () => {
			const result = findAllMatchingSubsetsBottomUp({
				tuples: basicTuples,
				targetQuantity: D(4),
				targetValue: D(600),
				maxResults: 1,
				time: false,
			});

			expect(result.length).toBe(1);
		});

		it('returns all lots when target quantity equals total quantity', () => {
			const tuples: LotDataKysely[] = [
				{
					quantity: D(1),
					price: D(100),
					lotId: 'Lot-1',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(1),
					price: D(200),
					lotId: 'Lot-2',
					accountId: '1',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const result = findAllMatchingSubsetsBottomUp({
				tuples,
				targetQuantity: D(2),
				targetValue: D(305), // Slightly different from actual value (300)
				maxResults: 5,
				time: false,
			});

			expect(result.length).toBe(1);
			expect(result[0].length).toBe(2);
			// Verify that original quantities are preserved
			expect(result[0][0].quantity.eq(D(1))).toBe(true);
			expect(result[0][1].quantity.eq(D(1))).toBe(true);
			// Verify that lot IDs match
			expect(result[0][0].lotId).toBe('Lot-1');
			expect(result[0][1].lotId).toBe('Lot-2');
		});
	});

	describe('hybrid', () => {
		const multiSolutionLotData = [
			{
				quantity: D(2),
				price: D(17.39),
				lotId: '3665b214-2259-44c5-9080-4b580dbf0b62',
				accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
				acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
			},
			{
				quantity: D(2),
				price: D(18.66),
				lotId: '8b663053-a8dd-48b1-b83b-82e9d19fce37',
				accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
				acquiredDate: new Date('2024-06-26T07:00:00.000Z'),
			},
			{
				quantity: D(2),
				price: D(27.6662),
				lotId: 'b4a3feaf-e2be-4542-a571-d9b75bc4e34e',
				accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
				acquiredDate: new Date('2025-04-16T00:00:00.000Z'),
			},
			{
				quantity: D(2),
				price: D(27.6662),
				lotId: '80ddb1a5-627d-4ddf-ab82-077ecf71df5d',
				accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
				acquiredDate: new Date('2025-04-16T00:00:00.000Z'),
			},
		];

		it('max results are honored', () => {
			const result = findSubsetHybrid({
				time: false,
				lotsData: multiSolutionLotData,
				targetQuantity: D(6),
				targetValue: D(127.43),
				maxResults: 1,
				symbol: 'TEST',
			});

			expect(result.length).toBe(1);
		});

		it('multiple solutions are resolved to 1 for equivalent lot changes', () => {
			const result = deduplicateEquivalentChangeSetsKysely([
				[
					{
						quantity: D(2),
						price: D(17.39),
						lotId: '3665b214-2259-44c5-9080-4b580dbf0b62',
						accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
						quantityChange: D(0),
						quantityFinal: D(2),
						symbol: 'TEST',

						upsert: {
							id: '3665b214-2259-44c5-9080-4b580dbf0b62',
							accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
							assetSymbol: 'TEST',
							portfolioId: '1',
							price: '17.39',
							acquiredDate: '2024-05-23T07:00:00.000Z',
							remainingQty: '2',
						},
						realizedProfitAndLossShortTerm: D(0),
						realizedProfitAndLossLongTerm: D(0),
					},
					{
						quantity: D(2),
						price: D(18.66),
						lotId: '8b663053-a8dd-48b1-b83b-82e9d19fce37',
						accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
						acquiredDate: new Date('2024-06-26T07:00:00.000Z'),
						quantityChange: D(0),
						quantityFinal: D(2),
						symbol: 'TEST',

						upsert: {
							id: '8b663053-a8dd-48b1-b83b-82e9d19fce37',
							accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
							assetSymbol: 'TEST',
							portfolioId: '1',
							price: '18.66',
							acquiredDate: '2024-06-26T07:00:00.000Z',
							remainingQty: '2',
						},
						realizedProfitAndLossShortTerm: D(0),
						realizedProfitAndLossLongTerm: D(0),
					},
					{
						quantity: D(2),
						price: D(27.6662),
						lotId: 'b4a3feaf-e2be-4542-a571-d9b75bc4e34e',
						accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
						acquiredDate: new Date('2025-04-16T00:00:00.000Z'),
						quantityChange: D(2),
						quantityFinal: D(0),
						symbol: 'TEST',
						upsert: {
							id: 'b4a3feaf-e2be-4542-a571-d9b75bc4e34e',
							accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
							assetSymbol: 'TEST',
							portfolioId: '1',
							price: '27.6662',
							acquiredDate: new Date('2025-04-16T00:00:00.000Z'),
							remainingQty: '0',
						},
						realizedProfitAndLossShortTerm: D(0),
						realizedProfitAndLossLongTerm: D(0),
					},
					{
						quantity: D(2),
						price: D(27.6662),
						lotId: '80ddb1a5-627d-4ddf-ab82-077ecf71df5d',
						accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
						acquiredDate: new Date('2025-04-16T00:00:00.000Z'),
						quantityChange: D(0),
						quantityFinal: D(2),
						symbol: 'TEST',

						upsert: {
							id: '80ddb1a5-627d-4ddf-ab82-077ecf71df5d',
							accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
							assetSymbol: 'TEST',
							portfolioId: '1',
							price: '27.6662',
							acquiredDate: new Date('2025-04-16T00:00:00.000Z'),
							remainingQty: '2',
						},
						realizedProfitAndLossShortTerm: D(0),
						realizedProfitAndLossLongTerm: D(0),
					},
				],
				[
					{
						quantity: D(2),
						price: D(17.39),
						lotId: '3665b214-2259-44c5-9080-4b580dbf0b62',
						accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
						quantityChange: D(0),
						quantityFinal: D(2),
						symbol: 'TEST',

						upsert: {
							id: '3665b214-2259-44c5-9080-4b580dbf0b62',
							accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
							assetSymbol: 'TEST',
							portfolioId: '1',
							price: '17.39',
							acquiredDate: '2024-05-23T07:00:00.000Z',
							remainingQty: '2',
						},
						realizedProfitAndLossShortTerm: D(0),
						realizedProfitAndLossLongTerm: D(0),
					},
					{
						quantity: D(2),
						price: D(18.66),
						lotId: '8b663053-a8dd-48b1-b83b-82e9d19fce37',
						accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
						acquiredDate: new Date('2024-06-26T07:00:00.000Z'),
						quantityChange: D(0),
						quantityFinal: D(2),
						symbol: 'TEST',

						upsert: {
							id: '8b663053-a8dd-48b1-b83b-82e9d19fce37',
							accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
							assetSymbol: 'TEST',
							portfolioId: '1',
							price: '18.66',
							acquiredDate: '2024-06-26T07:00:00.000Z',
							remainingQty: '2',
						},
						realizedProfitAndLossShortTerm: D(0),
						realizedProfitAndLossLongTerm: D(0),
					},
					{
						quantity: D(2),
						price: D(27.6662),
						lotId: 'b4a3feaf-e2be-4542-a571-d9b75bc4e34e',
						accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
						acquiredDate: new Date('2025-04-16T00:00:00.000Z'),
						quantityChange: D(0),
						quantityFinal: D(2),
						symbol: 'TEST',

						upsert: {
							id: 'b4a3feaf-e2be-4542-a571-d9b75bc4e34e',
							accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
							assetSymbol: 'TEST',
							portfolioId: '1',
							price: '27.6662',
							acquiredDate: '2025-04-16T00:00:00.000Z',
							remainingQty: '2',
						},
						realizedProfitAndLossShortTerm: D(0),
						realizedProfitAndLossLongTerm: D(0),
					},
					{
						quantity: D(2),
						price: D(27.6662),
						lotId: '80ddb1a5-627d-4ddf-ab82-077ecf71df5d',
						accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
						acquiredDate: new Date('2025-04-16T00:00:00.000Z'),
						quantityChange: D(2),
						quantityFinal: D(0),
						symbol: 'TEST',
						upsert: {
							id: '80ddb1a5-627d-4ddf-ab82-077ecf71df5d',
							accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
							assetSymbol: 'TEST',
							portfolioId: '1',
							price: '27.6662',
							acquiredDate: '2025-04-16T00:00:00.000Z',
							remainingQty: '0',
						},
						realizedProfitAndLossShortTerm: D(0),
						realizedProfitAndLossLongTerm: D(0),
					},
				],
				[
					{
						quantity: D(2),
						price: D(17.39),
						lotId: '3665b214-2259-44c5-9080-4b580dbf0b62',
						accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
						quantityChange: D(0),
						quantityFinal: D(2),
						symbol: 'TEST',

						upsert: {
							id: '3665b214-2259-44c5-9080-4b580dbf0b62',
							accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
							assetSymbol: 'TEST',
							portfolioId: '1',
							price: '17.39',
							acquiredDate: '2024-05-23T07:00:00.000Z',
							remainingQty: '2',
						},
						realizedProfitAndLossShortTerm: D(0),
						realizedProfitAndLossLongTerm: D(0),
					},
					{
						quantity: D(2),
						price: D(18.66),
						lotId: '8b663053-a8dd-48b1-b83b-82e9d19fce37',
						accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
						acquiredDate: new Date('2024-06-26T07:00:00.000Z'),
						quantityChange: D(0),
						quantityFinal: D(2),
						symbol: 'TEST',

						upsert: {
							id: '8b663053-a8dd-48b1-b83b-82e9d19fce37',
							accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
							assetSymbol: 'TEST',
							portfolioId: '1',
							price: '18.66',
							acquiredDate: '2024-06-26T07:00:00.000Z',
							remainingQty: '2',
						},
						realizedProfitAndLossShortTerm: D(0),
						realizedProfitAndLossLongTerm: D(0),
					},
					{
						quantity: D(2),
						price: D(27.6662),
						lotId: 'b4a3feaf-e2be-4542-a571-d9b75bc4e34e',
						accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
						acquiredDate: new Date('2025-04-16T00:00:00.000Z'),
						quantityChange: D(1),
						quantityFinal: D(1),
						symbol: 'TEST',

						upsert: {
							id: 'b4a3feaf-e2be-4542-a571-d9b75bc4e34e',
							accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
							assetSymbol: 'TEST',
							portfolioId: '1',
							price: '27.6662',
							acquiredDate: '2025-04-16T00:00:00.000Z',
							remainingQty: '1',
						},
						realizedProfitAndLossShortTerm: D(0),
						realizedProfitAndLossLongTerm: D(0),
					},
					{
						quantity: D(2),
						price: D(27.6662),
						lotId: '80ddb1a5-627d-4ddf-ab82-077ecf71df5d',
						accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
						acquiredDate: new Date('2025-04-16T00:00:00.000Z'),
						quantityChange: D(1),
						quantityFinal: D(1),
						symbol: 'TEST',

						upsert: {
							id: '80ddb1a5-627d-4ddf-ab82-077ecf71df5d',
							accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
							assetSymbol: 'TEST',
							portfolioId: '1',
							price: '27.6662',
							acquiredDate: '2025-04-16T00:00:00.000Z',
							remainingQty: '1',
						},
						realizedProfitAndLossShortTerm: D(0),
						realizedProfitAndLossLongTerm: D(0),
					},
				],
			]);

			expect(result.length).toBe(1);
		});
	});

	describe('production Test Data', () => {
		it('greedy finds solution within maxResults', () => {
			const result = findSubsetHybrid({
				time: false,
				lotsData: basicTuples,
				targetQuantity: D(4),
				targetValue: D(600),
				maxResults: 1,
				symbol: 'TEST',
			});

			expect(result.length).toBe(1);
		});

		it('should work for OKLO example using epsilon of .01', () => {
			const result = findSubsetHybrid({
				symbol: 'TEST',
				time: false,
				lotsData: [
					{
						quantity: D(1),
						price: D(7.55),
						lotId: 'OKLO-1',
						accountId: '1',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
					},
					{
						quantity: D(3),
						price: D(7.5967),
						lotId: 'OKLO-2',
						accountId: '1',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
					},
					{
						quantity: D(2),
						price: D(10.08),
						lotId: 'OKLO-3',
						accountId: '1',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
					},
					{
						quantity: D(3),
						price: D(9.62),
						lotId: 'OKLO-4',
						accountId: '1',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
					},
					{
						quantity: D(2),
						price: D(9.4),
						lotId: 'OKLO-5',
						accountId: '1',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
					},
				],
				targetQuantity: D(11),
				targetValue: D(98.159996),
			});

			expect(result.length).toBe(1);
		});

		it('should work for DASH example where no lots are sold but cost basis incorrect. It should just return the input lot data.', () => {
			const result = findSubsetHybrid({
				time: false,
				lotsData: [
					{
						quantity: D(1),
						price: D(113.61),
						lotId: 'DASH-1',
						accountId: '1',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
					},
					{
						quantity: D(1),
						price: D(111.68),
						lotId: 'DASH-2',
						accountId: '1',
						acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
					},
				],
				targetQuantity: D(2),
				targetValue: D(223.37),
				symbol: 'TEST',
			});

			expect(result.length).toBe(1);
		});

		it('greedy should work for FIFO AND LIFO', () => {
			const tuples = [
				{
					quantity: D(5),
					price: D(16.015),
					lotId: 'f55b5669-df0a-412b-8c44-0a247215450b',
					accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
				{
					quantity: D(1),
					price: D(17.58),
					lotId: 'd159f0a0-a2c4-4749-ad3b-99cccf0612fe',
					accountId: '70d400b4-4b28-4fde-b9a3-180cbdb10be5',
					acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
				},
			];
			const res1 = findSubsetHybrid({
				time: false,
				lotsData: tuples,
				targetQuantity: D(5),
				targetValue: D(80.08),
				symbol: 'TEST',
			});

			expect(res1.length).toBe(1);
			const res2 = findSubsetHybrid({
				time: false,
				lotsData: tuples.reverse(),
				targetQuantity: D(5),
				targetValue: D(80.08),
				symbol: 'TEST',
			});

			expect(res2.length).toBe(1);
		});

		describe('resolveLotChange', () => {
			it('should work for basic AZN example', () => {
				const result = resolveLotChange({
					lotData: [
						{
							quantity: D(1),
							price: D(78.99),
							lotId: 'l-AZN-2',
							accountId: '1',
							acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
						},
						{
							quantity: D(1),
							price: D(78.43),
							lotId: 'l-AZN-3',
							accountId: '1',
							acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
						},
						{
							quantity: D(2),
							price: D(79.09),
							lotId: 'l-AZN-4',
							accountId: '1',
							acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
						},
					],
					position: fakePosition('4', '78.99', 'AZN'),
					transactionBuys: [],
					transactionSells: [],
				});

				expect(result.chosenLotChangeIndex).toBeDefined();
				expect(
					result.lotChanges[result.chosenLotChangeIndex!]?.map((l) => ({
						quantity: l.quantity.toString(),
						price: l.price.toString(),
						lotId: l.lotId,
						quantityChange: l.quantityChange.toString(),
						quantityFinal: l.quantityFinal.toString(),
						symbol: 'AZN',
					})),
				).to.deep.equal([
					{
						quantity: '1',
						price: '78.99',
						lotId: 'l-AZN-2',
						quantityChange: '0',
						quantityFinal: '1',
						symbol: 'AZN',
					},
					{
						quantity: '1',
						price: '78.43',
						lotId: 'l-AZN-3',
						quantityChange: '0',
						quantityFinal: '1',
						symbol: 'AZN',
					},
					{
						quantity: '2',
						price: '79.09',
						lotId: 'l-AZN-4',
						quantityChange: '0',
						quantityFinal: '2',
						symbol: 'AZN',
					},
				]);
			});

			it('should return empty arrays if no target quantity or value is provided', () => {
				const result = resolveLotChange({
					lotData: [
						{
							quantity: D(13),
							price: D(156.7),
							lotId: '3ac041ea-5e10-48f5-850b-7993f121f75c',
							accountId: '539b4211-ef02-462b-8133-9e62538746bb',
							acquiredDate: new Date('2024-04-22T00:00:00.000Z'),
						},
						{
							quantity: D(13),
							price: D(156.7),
							lotId: '341a85b5-08ec-4517-94e7-ba7e6e7b77c7',
							accountId: '539b4211-ef02-462b-8133-9e62538746bb',
							acquiredDate: new Date('2024-04-22T00:00:00.000Z'),
						},
						{
							quantity: D(13),
							price: D(156.7),
							lotId: '25788b6c-2d62-41a7-8e32-717223c6a2ed',
							accountId: '539b4211-ef02-462b-8133-9e62538746bb',
							acquiredDate: new Date('2024-04-22T00:00:00.000Z'),
						},
						{
							quantity: D(13),
							price: D(156.7),
							lotId: '7fbdff4b-d2c9-4809-a6b4-bc38a59a18e6',
							accountId: '539b4211-ef02-462b-8133-9e62538746bb',
							acquiredDate: new Date('2024-04-22T00:00:00.000Z'),
						},
						{
							quantity: D(13),
							price: D(156.7),
							lotId: '22bbcde6-d1c3-4d41-bb75-36838f909bc0',
							accountId: '539b4211-ef02-462b-8133-9e62538746bb',
							acquiredDate: new Date('2024-04-22T00:00:00.000Z'),
						},
						{
							quantity: D(13),
							price: D(156.7),
							lotId: 'ed1d8b1b-15a9-4199-8e88-315101fe895d',
							accountId: '539b4211-ef02-462b-8133-9e62538746bb',
							acquiredDate: new Date('2024-04-22T00:00:00.000Z'),
						},
					],
					// @ts-expect-error test error
					position: fakePosition(undefined, undefined, 'GOOGL'),
					transactionBuys: [],
					transactionSells: [],
				});

				expect(result.lotChanges.length).toBe(0);
				expect(result.chosenLotChangeIndex).toBeNull();
				expect(result.lotChanges[result.chosenLotChangeIndex!]).toBeUndefined();
			});
		});
	});

	describe('ATUS lot application tests', () => {
		const atusLotsData: LotDataKysely[] = [
			{
				lotId: '3a224a82-59c0-4805-8475-e510e07a0878',
				price: D(2.539),
				quantity: D(10),
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: new Date('2025-05-01T00:00:00.000Z'),
			},
			{
				lotId: 'df12c7f9-4b45-4f82-a51e-3a3b00461ade',
				price: D(2.355),
				quantity: D(5),
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: new Date('2025-08-22T00:00:00.000Z'),
			},
			{
				lotId: 'db8dab1a-84d9-4c39-8d8f-a989c508d1ff',
				price: D(2.3392),
				quantity: D(10),
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: new Date('2025-08-18T00:00:00.000Z'),
			},
			{
				lotId: '6dda36be-2c4b-4aeb-ad95-70d2af20bebc',
				price: D(2.2692),
				quantity: D(10),
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: new Date('2025-08-12T00:00:00.000Z'),
			},
			{
				lotId: 'a71dc86f-42c1-4d8d-824a-cee2be59cb03',
				price: D(2.075),
				quantity: D(10),
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: new Date('2025-08-11T00:00:00.000Z'),
			},
		];

		describe('resolveLotChange', () => {
			it('should process ATUS lots and return optimal change set with multiChangeSet', () => {
				const result = resolveLotChange({
					position: fakePosition('37', '85.07', 'ATUS'),
					transactionBuys: [],
					transactionSells: [],
					lotData: atusLotsData,
				});

				// Should return both lotChanges and multiChangeSet
				expect(result.lotChanges).toBeDefined();
				expect(Array.isArray(result.lotChanges)).toBe(true);
				expect(
					result.lotChanges[result.chosenLotChangeIndex!]?.length,
				).toBeGreaterThan(0);

				// Verify each lot change has the required properties
				for (const lotChange of result.lotChanges[
					result.chosenLotChangeIndex!
				] ?? []) {
					expect(lotChange.lotId).toBeDefined();
					expect(lotChange.symbol).toBe('ATUS');
					expect(lotChange.quantityChange).toBeDefined();
					expect(lotChange.quantityFinal).toBeDefined();
					expect(lotChange.upsert).toBeDefined();
					expect(lotChange.upsert.id).toBe(lotChange.lotId);
				}

				// Calculate total quantity change
				const totalQuantityChange = result.lotChanges[
					result.chosenLotChangeIndex!
				]?.reduce((sum, change) => sum.plus(change.quantityChange), D(0));

				// Total quantity change should be 45 - 37 = 8
				expect(totalQuantityChange?.eq(D(8))).toBe(true);

				// Calculate remaining quantity
				const remainingQuantity = result.lotChanges[
					result.chosenLotChangeIndex!
				]?.reduce((sum, change) => sum.plus(change.quantityFinal), D(0));

				// Remaining quantity should equal target quantity
				expect(remainingQuantity?.eq(D(37))).toBe(true);
			});

			it('should return multiChangeSet when multiple solutions exist', () => {
				const result = resolveLotChange({
					transactionBuys: [],
					transactionSells: [],
					lotData: atusLotsData,
					position: fakePosition('37', '85.07', 'ATUS'),
				});

				// If multiple solutions exist, multiChangeSet should be populated
				if (result.lotChanges.length > 1) {
					// Each option should be an array of LotChanges
					for (const option of result.lotChanges) {
						expect(Array.isArray(option)).toBe(true);
						expect(option.length).toBe(atusLotsData.length);
					}
				}
			});

			it('should correctly calculate upsert remainingQty values', () => {
				const result = resolveLotChange({
					transactionBuys: [],
					transactionSells: [],
					lotData: atusLotsData,
					position: fakePosition('37', '85.07', 'ATUS'),
				});

				// Verify that each upsert's remainingQty matches the quantityFinal
				for (const lotChange of result.lotChanges) {
					for (const change of lotChange) {
						expect(
							new Decimal(change.upsert.remainingQty).eq(change.quantityFinal),
						).toBe(true);
					}
				}
			});

			it('should preserve lot metadata in change set', () => {
				const result = resolveLotChange({
					lotData: atusLotsData,
					position: fakePosition('37', '85.07', 'ATUS'),
					transactionBuys: [],
					transactionSells: [],
				});

				// Verify that original lot data is preserved
				expect(result.lotChanges[result.chosenLotChangeIndex!]).toBeDefined();
				for (const lotChange of result.lotChanges[
					result.chosenLotChangeIndex!
				] ?? []) {
					const originalLot = atusLotsData.find(
						(lot) => lot.lotId === lotChange.lotId,
					);
					expect(originalLot).toBeDefined();
					if (originalLot) {
						expect(lotChange.price.eq(originalLot.price)).toBe(true);
						expect(lotChange.accountId).toBe(originalLot.accountId);
						expect(lotChange.acquiredDate.toISOString()).toBe(
							originalLot.acquiredDate.toISOString(),
						);
					}
				}
			});
		});

		describe('processMultiChangeSet', () => {
			it('should select the change set with the most zeroed-out lots', () => {
				// Create mock change sets with different numbers of zeroed-out lots
				const changeSets: LotChangeKysely[][] = [
					// Change set 1: 1 lot zeroed out
					[
						{
							lotId: 'lot1',
							price: D(10),
							quantity: D(10),
							accountId: 'acc1',
							acquiredDate: new Date('2025-01-01'),
							quantityFinal: D(0), // Zeroed out
							quantityChange: D(10),
							symbol: 'TEST',
							upsert: {} as any,

							realizedProfitAndLossShortTerm: D(0),
							realizedProfitAndLossLongTerm: D(0),
						},
						{
							lotId: 'lot2',
							price: D(20),
							quantity: D(10),
							accountId: 'acc1',
							acquiredDate: new Date('2025-01-02'),
							quantityFinal: D(5), // Not zeroed
							quantityChange: D(5),
							symbol: 'TEST',
							upsert: {} as any,

							realizedProfitAndLossShortTerm: D(0),
							realizedProfitAndLossLongTerm: D(0),
						},
					],
					// Change set 2: 2 lots zeroed out
					[
						{
							lotId: 'lot1',
							price: D(10),
							quantity: D(10),
							accountId: 'acc1',
							acquiredDate: new Date('2025-01-01'),
							quantityFinal: D(0), // Zeroed out
							quantityChange: D(10),
							symbol: 'TEST',
							upsert: {} as any,

							realizedProfitAndLossShortTerm: D(0),
							realizedProfitAndLossLongTerm: D(0),
						},
						{
							lotId: 'lot2',
							price: D(20),
							quantity: D(10),
							accountId: 'acc1',
							acquiredDate: new Date('2025-01-02'),
							quantityFinal: D(0), // Zeroed out
							quantityChange: D(10),
							symbol: 'TEST',
							upsert: {} as any,

							realizedProfitAndLossShortTerm: D(0),
							realizedProfitAndLossLongTerm: D(0),
						},
						{
							lotId: 'lot3',
							price: D(30),
							quantity: D(10),
							accountId: 'acc1',
							acquiredDate: new Date('2025-01-03'),
							quantityFinal: D(5), // Not zeroed
							quantityChange: D(5),
							symbol: 'TEST',
							upsert: {} as any,

							realizedProfitAndLossShortTerm: D(0),
							realizedProfitAndLossLongTerm: D(0),
						},
					],
					// Change set 3: No lots zeroed out
					[
						{
							lotId: 'lot1',
							price: D(10),
							quantity: D(10),
							accountId: 'acc1',
							acquiredDate: new Date('2025-01-01'),
							quantityFinal: D(5), // Not zeroed
							quantityChange: D(5),
							symbol: 'TEST',
							upsert: {} as any,

							realizedProfitAndLossShortTerm: D(0),
							realizedProfitAndLossLongTerm: D(0),
						},
						{
							lotId: 'lot2',
							price: D(20),
							quantity: D(10),
							accountId: 'acc1',
							acquiredDate: new Date('2025-01-02'),
							quantityFinal: D(5), // Not zeroed
							quantityChange: D(5),
							symbol: 'TEST',
							upsert: {} as any,

							realizedProfitAndLossShortTerm: D(0),
							realizedProfitAndLossLongTerm: D(0),
						},
					],
				];

				const result = processMultiChangeSetKysely(changeSets);

				// Should select change set 2 (index 1) with 2 zeroed-out lots
				expect(result).toBe(1);

				// Verify it has the most zeroed-out lots
				const zeroedCount = changeSets[result!].filter((change) =>
					change.quantityFinal.eq(0),
				).length;
				expect(zeroedCount).toBe(2);
			});

			it('should handle single change set', () => {
				const singleChangeSet: LotChangeKysely[][] = [
					[
						{
							lotId: 'lot1',
							price: D(10),
							quantity: D(10),
							accountId: 'acc1',
							acquiredDate: new Date('2025-01-01'),
							quantityFinal: D(5),
							quantityChange: D(5),
							symbol: 'TEST',
							upsert: {} as any,

							realizedProfitAndLossShortTerm: D(0),
							realizedProfitAndLossLongTerm: D(0),
						},
					],
				];

				const result = processMultiChangeSetKysely(singleChangeSet);
				expect(result).toBe(0);
			});

			it('should handle empty change set array', () => {
				const emptyChangeSets: LotChangeKysely[][] = [];
				const result = processMultiChangeSetKysely(emptyChangeSets);
				expect(result).toBeNull();
			});

			it('should return first change set when all have equal zeroed-out lots', () => {
				const changeSets: LotChangeKysely[][] = [
					// Change set 1: 1 lot zeroed out
					[
						{
							lotId: 'lot1-1',
							price: D(10),
							quantity: D(10),
							accountId: 'acc1',
							acquiredDate: new Date('2025-01-01'),
							quantityFinal: D(0),
							quantityChange: D(10),
							symbol: 'TEST',
							upsert: {} as any,
							realizedProfitAndLossShortTerm: D(0),
							realizedProfitAndLossLongTerm: D(0),
						},
					],
					// Change set 2: Also 1 lot zeroed out
					[
						{
							lotId: 'lot2-1',
							price: D(20),
							quantity: D(10),
							accountId: 'acc1',
							acquiredDate: new Date('2025-01-02'),
							quantityFinal: D(0),
							quantityChange: D(10),
							symbol: 'TEST',
							upsert: {} as any,
							realizedProfitAndLossShortTerm: D(0),
							realizedProfitAndLossLongTerm: D(0),
						},
					],
				];

				const result = processMultiChangeSetKysely(changeSets);
				// When tied, should return the first one
				expect(result).toBe(0);
			});
		});
	});

	describe('handle OPEN lot example', () => {
		const lotData: LotDataKysely[] = convertToLotData([
			{
				quantity: '5',
				price: '2.156',
				lotId: 'cd27aa80-9341-4a96-b66a-50f2e1628979',
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: '2024-05-23T00:00:00.000Z',
			},
			{
				quantity: '1',
				price: '1.87',
				lotId: '40ec54fd-0972-4e61-8734-bf293ef44ef2',
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: '2024-06-20T00:00:00.000Z',
			},
			{
				quantity: '5',
				price: '1.836',
				lotId: '8e7ebd66-dc62-44c3-b074-136235579735',
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: '2024-06-24T00:00:00.000Z',
			},
			{
				quantity: '4',
				price: '1.75',
				lotId: 'e3081b66-c556-4d61-866c-8017e110694f',
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: '2024-06-26T00:00:00.000Z',
			},
			{
				quantity: '2',
				price: '2.155',
				lotId: 'd2747dca-f5af-48cf-ac65-3872523d104c',
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: '2024-06-05T00:00:00.000Z',
			},
			{
				quantity: '3',
				price: '0.9533',
				lotId: '4bddb04f-74d7-40d4-b727-69b4c9eaa2fc',
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: '2025-04-15T00:00:00.000Z',
			},
			{
				quantity: '3',
				price: '0.9533',
				lotId: 'e0ed7850-c944-4a35-8288-9a1ca0c06c82',
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: '2025-04-16T00:00:00.000Z',
			},
			{
				quantity: '8',
				price: '0.96',
				lotId: '3ee01f2d-9add-4f79-b0e7-c9835168aecb',
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: '2025-04-17T00:00:00.000Z',
			},
			{
				quantity: '20',
				price: '0.75',
				lotId: 'bdbc2587-2469-4f0e-adff-09b5b97f3e95',
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: '2025-05-01T00:00:00.000Z',
			},
			{
				quantity: '5',
				price: '3.365',
				lotId: 'e8669755-2049-48b0-b287-1dec32ab9392',
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: '2025-08-18T00:00:00.000Z',
			},
		]);

		describe('findAllMatchingSubsetsBottomUp', () => {
			it('should process OPEN lots and return 3 pssible changeset options', () => {
				const result = findAllMatchingSubsetsBottomUp({
					tuples: lotData,
					targetQuantity: D(53),
					targetValue: D(72.19),
					time: false,
				});
				// Should return both lotChanges and multiChangeSet
				expect(result?.length).toBe(3);
			});
		});

		describe('findLotChangeSets', () => {
			it('should choose the correct lot changes based on the solution with the most whole lots sold', () => {
				const lotChanges = resolveLotChange({
					lotData: lotData,
					position: fakePosition('53', '72.19', 'OPEN'),
					transactionBuys: [],
					transactionSells: [],
				});
				expect(lotChanges.lotChanges.length).toBe(3);
				expect(
					lotChanges.lotChanges[lotChanges.chosenLotChangeIndex!]
						?.find(
							(lot) => lot.lotId === '40ec54fd-0972-4e61-8734-bf293ef44ef2',
						)
						?.quantityFinal.toNumber(),
				).toBe(0);
				expect(
					lotChanges.lotChanges[lotChanges.chosenLotChangeIndex!]
						?.find(
							(lot) => lot.lotId === 'd2747dca-f5af-48cf-ac65-3872523d104c',
						)
						?.quantityFinal.toNumber(),
				).toBe(0);
			});
		});
	});

	describe('handle simple sell all', () => {
		it('should identify the correct lot changes with the greedy subset', () => {
			const lotData = convertToLotData([
				{
					lotId: '2fd0f111-2b0a-4ac9-924d-0cf439163546',
					price: '116.08',
					quantity: '1',
					accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
					acquiredDate: '2024-06-21T02:00:00.000Z',
				},
				{
					lotId: '91644dfc-cf47-47b8-bf0a-dc9ca2cfa106',
					price: '111.42',
					quantity: '1',
					accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
					acquiredDate: '2024-06-27T02:00:00.000Z',
				},
			]);
			const greedyResult = findGreedySubset({
				tuples: lotData,
				targetQuantity: D(0),
				targetValue: D(0),
				time: false,
			});
			expect(greedyResult?.length).toBe(2);
			expect(
				greedyResult?.forEach((lot) => {
					expect(lot.quantity.toNumber()).toBe(0);
				}),
			);
			const lotChanges = resolveLotChange({
				lotData,
				position: fakePosition('0', '0', 'JBL'),
				transactionBuys: [],
				transactionSells: [],
			});
			expect(lotChanges.lotChanges.length).toBe(1);
			expect(
				lotChanges.lotChanges[lotChanges.chosenLotChangeIndex!]?.length,
			).toBe(2);
			expect(
				lotChanges.lotChanges[
					lotChanges.chosenLotChangeIndex!
				]?.[0].quantityFinal.toNumber(),
			).toBe(0);
			expect(
				lotChanges.lotChanges[
					lotChanges.chosenLotChangeIndex!
				]?.[1].quantityFinal.toNumber(),
			).toBe(0);
		});
	});
});
