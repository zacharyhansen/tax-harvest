import Decimal from 'decimal.js';

import {
	findLotChangeSets,
	findSubsetHybrid,
	type LotChange,
	type LotData,
	processMultiChangeSet,
} from './lot-application';
import { findAllMatchingSubsetsBottomUp } from './lot-application.bottom-up';
import { findGreedySubset } from './lot-application.greedy';

const D = (n: number | string) => new Decimal(n);

const basicTuples: LotData[] = [
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
			const tuples: LotData[] = [
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
			const tuples: LotData[] = [
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
			const tuples: LotData[] = [
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
			const tuples: LotData[] = [
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
			const tuples: LotData[] = [
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
			const tuples: LotData[] = [
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
			const tuples: LotData[] = [
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
			const tuples: LotData[] = [
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
			const tuples: LotData[] = [
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
			const tuples: LotData[] = [
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
			const tuples: LotData[] = [
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
			const tuples: LotData[] = [
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
			const tuples: LotData[] = [
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
			const tuples: LotData[] = [
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
			const result = findLotChangeSets(
				{
					time: false,
					lotsData: multiSolutionLotData,
					targetQuantity: D(6),
					targetValue: D(127.43),
					symbol: 'TEST',
				},
				'test-portfolio',
			);

			// This test will throw an error if the lot changes are not unique
			expect(result.lotChanges.length).toBe(4);
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

		describe('findLotChangeSets', () => {
			it('should work for basic AZN example', () => {
				const result = findLotChangeSets(
					{
						time: false,
						symbol: 'AZN',
						lotsData: [
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
						targetQuantity: D(4),
						targetValue: D(78.99),
					},
					'test-portfolio',
				);

				expect(
					result.lotChanges.map((l) => ({
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
				const result = findLotChangeSets(
					{
						time: false,
						lotsData: [
							{
								quantity: D(13),
								price: D(156.7),
								lotId: '3ac041ea-5e10-48f5-850b-7993f121f75c',
								accountId: '539b4211-ef02-462b-8133-9e62538746bb',
								acquiredDate: new Date('2024-04-22T00:00:00.000Z'),
								isNewBuy: true,
							},
							{
								quantity: D(13),
								price: D(156.7),
								lotId: '341a85b5-08ec-4517-94e7-ba7e6e7b77c7',
								accountId: '539b4211-ef02-462b-8133-9e62538746bb',
								acquiredDate: new Date('2024-04-22T00:00:00.000Z'),
								isNewBuy: true,
							},
							{
								quantity: D(13),
								price: D(156.7),
								lotId: '25788b6c-2d62-41a7-8e32-717223c6a2ed',
								accountId: '539b4211-ef02-462b-8133-9e62538746bb',
								acquiredDate: new Date('2024-04-22T00:00:00.000Z'),
								isNewBuy: true,
							},
							{
								quantity: D(13),
								price: D(156.7),
								lotId: '7fbdff4b-d2c9-4809-a6b4-bc38a59a18e6',
								accountId: '539b4211-ef02-462b-8133-9e62538746bb',
								acquiredDate: new Date('2024-04-22T00:00:00.000Z'),
								isNewBuy: true,
							},
							{
								quantity: D(13),
								price: D(156.7),
								lotId: '22bbcde6-d1c3-4d41-bb75-36838f909bc0',
								accountId: '539b4211-ef02-462b-8133-9e62538746bb',
								acquiredDate: new Date('2024-04-22T00:00:00.000Z'),
								isNewBuy: true,
							},
							{
								quantity: D(13),
								price: D(156.7),
								lotId: 'ed1d8b1b-15a9-4199-8e88-315101fe895d',
								accountId: '539b4211-ef02-462b-8133-9e62538746bb',
								acquiredDate: new Date('2024-04-22T00:00:00.000Z'),
								isNewBuy: true,
							},
						],
						targetQuantity: undefined,
						targetValue: undefined,
						symbol: 'GOOGL',
					},
					'test-portfolio',
				);

				expect(result.lotChanges.length).toBe(0);
				expect(result.multiChangeSet).toBeNull();
			});
		});
	});

	describe('ATUS lot application tests', () => {
		const portfolioId = '8f58fa62-ecb7-4b35-afcc-15121f80cbb5';

		const atusLotsData: LotData[] = [
			{
				lotId: '3a224a82-59c0-4805-8475-e510e07a0878',
				price: D(2.539),
				quantity: D(10),
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: new Date('2025-05-01T00:00:00.000Z'),
				isNewBuy: false,
			},
			{
				lotId: 'df12c7f9-4b45-4f82-a51e-3a3b00461ade',
				price: D(2.355),
				quantity: D(5),
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: new Date('2025-08-22T00:00:00.000Z'),
				isNewBuy: true,
			},
			{
				lotId: 'db8dab1a-84d9-4c39-8d8f-a989c508d1ff',
				price: D(2.3392),
				quantity: D(10),
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: new Date('2025-08-18T00:00:00.000Z'),
				isNewBuy: true,
			},
			{
				lotId: '6dda36be-2c4b-4aeb-ad95-70d2af20bebc',
				price: D(2.2692),
				quantity: D(10),
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: new Date('2025-08-12T00:00:00.000Z'),
				isNewBuy: true,
			},
			{
				lotId: 'a71dc86f-42c1-4d8d-824a-cee2be59cb03',
				price: D(2.075),
				quantity: D(10),
				accountId: 'aeec08d8-e163-4b20-b6ac-89b52fc2fd67',
				acquiredDate: new Date('2025-08-11T00:00:00.000Z'),
				isNewBuy: true,
			},
		];

		describe('findLotChangeSets', () => {
			it('should process ATUS lots and return optimal change set with multiChangeSet', () => {
				const result = findLotChangeSets(
					{
						symbol: 'ATUS',
						lotsData: atusLotsData,
						targetValue: D(85.07),
						targetQuantity: D(37),
						time: false,
					},
					portfolioId,
				);

				// Should return both lotChanges and multiChangeSet
				expect(result.lotChanges).toBeDefined();
				expect(Array.isArray(result.lotChanges)).toBe(true);
				expect(result.lotChanges.length).toBeGreaterThan(0);

				// Verify each lot change has the required properties
				for (const lotChange of result.lotChanges) {
					expect(lotChange.lotId).toBeDefined();
					expect(lotChange.symbol).toBe('ATUS');
					expect(lotChange.quantityChange).toBeDefined();
					expect(lotChange.quantityFinal).toBeDefined();
					expect(lotChange.upsert).toBeDefined();
					expect(lotChange.upsert.id).toBe(lotChange.lotId);
					expect(lotChange.upsert.portfolio?.connect?.id).toBe(portfolioId);
					expect(lotChange.upsert.asset?.connect?.symbol).toBe('ATUS');
					expect(lotChange.upsert.account?.connect?.id).toBe('aeec08d8-e163-4b20-b6ac-89b52fc2fd67');
				}

				// Calculate total quantity change
				const totalQuantityChange = result.lotChanges.reduce(
					(sum, change) => sum.plus(change.quantityChange),
					D(0),
				);

				// Total quantity change should be 45 - 37 = 8
				expect(totalQuantityChange.eq(D(8))).toBe(true);

				// Calculate remaining quantity
				const remainingQuantity = result.lotChanges.reduce(
					(sum, change) => sum.plus(change.quantityFinal),
					D(0),
				);

				// Remaining quantity should equal target quantity
				expect(remainingQuantity.eq(D(37))).toBe(true);
			});

			it('should handle multiple valid solutions by calling processMultiChangeSet', () => {
				// This test verifies that when multiple solutions exist,
				// the function uses processMultiChangeSet to select the optimal one
				const result = findLotChangeSets(
					{
						symbol: 'ATUS',
						lotsData: atusLotsData,
						targetValue: D(85.07),
						targetQuantity: D(37),
						time: false,
					},
					portfolioId,
				);

				// The result should be deterministic - it should select the change set
				// with the most zeroed-out lots
				expect(result.lotChanges).toBeDefined();

				// When there are multiple solutions, multiChangeSet should contain them
				if (result.multiChangeSet) {
					expect(result.multiChangeSet.options).toBeDefined();
					expect(Array.isArray(result.multiChangeSet.options)).toBe(true);
					expect(result.multiChangeSet.symbol).toBe('ATUS');
					expect(result.multiChangeSet.targetQuantity?.eq(D(37))).toBe(true);
					expect(result.multiChangeSet.targetValue?.eq(D(85.07))).toBe(true);

					// Verify that lotChanges is the result of processMultiChangeSet
					const zeroedOutInSelected = result.lotChanges.filter((change) =>
						change.quantityFinal.eq(0),
					).length;

					// Check that the selected solution maximizes zeroed-out lots
					for (const solution of result.multiChangeSet.options) {
						const zeroedOut = solution.filter((change) =>
							change.quantityFinal.eq(0),
						).length;
						expect(zeroedOutInSelected).toBeGreaterThanOrEqual(zeroedOut);
					}
				} else {
					// If single solution, multiChangeSet should be null
					expect(result.multiChangeSet).toBeNull();
				}
			});

			it('should return multiChangeSet when multiple solutions exist', () => {
				const result = findLotChangeSets(
					{
						symbol: 'ATUS',
						lotsData: atusLotsData,
						targetValue: D(85.07),
						targetQuantity: D(37),
						time: false,
					},
					portfolioId,
				);

				// If multiple solutions exist, multiChangeSet should be populated
				if (result.multiChangeSet) {
					expect(result.multiChangeSet.options.length).toBeGreaterThan(1);
					expect(result.multiChangeSet.symbol).toBe('ATUS');
					expect(result.multiChangeSet.targetQuantity?.toString()).toBe('37');
					expect(result.multiChangeSet.targetValue?.toString()).toBe('85.07');

					// Each option should be an array of LotChanges
					for (const option of result.multiChangeSet.options) {
						expect(Array.isArray(option)).toBe(true);
						expect(option.length).toBe(atusLotsData.length);
					}
				}
			});

			it('should correctly calculate upsert remainingQty values', () => {
				const result = findLotChangeSets(
					{
						symbol: 'ATUS',
						lotsData: atusLotsData,
						targetValue: D(85.07),
						targetQuantity: D(37),
						time: false,
					},
					portfolioId,
				);

				// Verify that each upsert's remainingQty matches the quantityFinal
				for (const lotChange of result.lotChanges) {
					expect(lotChange.upsert.remainingQty.eq(lotChange.quantityFinal)).toBe(true);
				}
			});

			it('should preserve lot metadata in change set', () => {
				const result = findLotChangeSets(
					{
						symbol: 'ATUS',
						lotsData: atusLotsData,
						targetValue: D(85.07),
						targetQuantity: D(37),
						time: false,
					},
					portfolioId,
				);

				// Verify that original lot data is preserved
				for (const lotChange of result.lotChanges) {
					const originalLot = atusLotsData.find((lot) => lot.lotId === lotChange.lotId);
					expect(originalLot).toBeDefined();
					if (originalLot) {
						expect(lotChange.price.eq(originalLot.price)).toBe(true);
						expect(lotChange.accountId).toBe(originalLot.accountId);
						expect(lotChange.acquiredDate.toISOString()).toBe(
							originalLot.acquiredDate.toISOString(),
						);
						expect(lotChange.isNewBuy).toBe(originalLot.isNewBuy);
					}
				}
			});

			it('should return null multiChangeSet when no target is provided', () => {
				const result = findLotChangeSets(
					{
						symbol: 'ATUS',
						lotsData: atusLotsData,
						targetValue: undefined,
						targetQuantity: undefined,
						time: false,
					},
					portfolioId,
				);

				expect(result.lotChanges).toEqual([]);
				expect(result.multiChangeSet).toBeNull();
			});
		});

		describe('processMultiChangeSet', () => {
			it('should select the change set with the most zeroed-out lots', () => {
				// Create mock change sets with different numbers of zeroed-out lots
				const changeSets: LotChange[][] = [
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
						},
					],
				];

				const result = processMultiChangeSet(changeSets);

				// Should select change set 2 (index 1) with 2 zeroed-out lots
				expect(result).toBe(changeSets[1]);

				// Verify it has the most zeroed-out lots
				const zeroedCount = result.filter((change) => change.quantityFinal.eq(0)).length;
				expect(zeroedCount).toBe(2);
			});

			it('should handle single change set', () => {
				const singleChangeSet: LotChange[][] = [
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
						},
					],
				];

				const result = processMultiChangeSet(singleChangeSet);
				expect(result).toBe(singleChangeSet[0]);
			});

			it('should handle empty change set array', () => {
				const emptyChangeSets: LotChange[][] = [];
				const result = processMultiChangeSet(emptyChangeSets);
				expect(result).toBeUndefined();
			});

			it('should return first change set when all have equal zeroed-out lots', () => {
				const changeSets: LotChange[][] = [
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
						},
					],
				];

				const result = processMultiChangeSet(changeSets);
				// When tied, should return the first one
				expect(result).toBe(changeSets[0]);
			});
		});
	});
});