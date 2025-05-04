import Decimal from 'decimal.js'

import {
  findLotChangeSets,
  findSubsetHybrid,
  LotData,
} from './lot-application'
import { findAllMatchingSubsetsBottomUp } from './lot-application.bottom-up'
import { findGreedySubset } from './lot-application.greedy'

const D = (n: number | string) => new Decimal(n)

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
]

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
      ]
      const result = findGreedySubset({
        tuples,
        targetQuantity: D(498),
        targetValue: D(109400),
        time: false,
      })
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
      ])
      expect(result?.length).to.be.greaterThan(0)
    })

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
      ]
      const result = findGreedySubset({
        tuples,
        targetQuantity: D(498),
        targetValue: D(109800),
        time: false,
      })
      expect(result).toBeNull()

      const resultReversed = findGreedySubset({
        tuples: tuples.reverse(),
        targetQuantity: D(498),
        targetValue: D(109800),
        time: false,
      })
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
      ])
      expect(resultReversed?.length).to.be.greaterThan(0)
    })

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
      ]
      const result = findGreedySubset({
        tuples,
        targetQuantity: D(299),
        targetValue: D(49800),
        time: false,
      })
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
      ])
      expect(result?.length).to.be.greaterThan(0)
    })

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
      ]
      const result = findGreedySubset({
        tuples,
        targetQuantity: D(299),
        targetValue: D(49800.01),
        time: false,
      })
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
      ])
      expect(result?.length).to.be.greaterThan(0)
    })

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
      ]
      const result = findGreedySubset({
        tuples,
        targetQuantity: D(299.01),
        targetValue: D(49800),
        epsilonValue: D(0.01),
        epsilonQty: D(0.01),
        time: false,
      })
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
      ])
      expect(result?.length).to.be.greaterThan(0)
    })
  })

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
      ]
      const result = findAllMatchingSubsetsBottomUp({
        tuples,
        targetQuantity: D(3),
        targetValue: D(400),
        maxResults: 5,
        time: false,
      })
      expect(result).to.deep.equal([])
    })

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
      ]
      const result = findAllMatchingSubsetsBottomUp({
        tuples,
        targetQuantity: D(1),
        targetValue: D(50),
        maxResults: 5,
        time: false,
      })
      expect(result).to.deep.equal([])
    })

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
      ]
      const result = findAllMatchingSubsetsBottomUp({
        tuples,
        targetQuantity: D(0),
        targetValue: D(0),
        maxResults: 5,
        time: false,
      })
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
      ])
    })

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
      ]
      const result = findAllMatchingSubsetsBottomUp({
        tuples,
        targetQuantity: D(4),
        targetValue: D(500),
        maxResults: 5,
        time: false,
      })
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
      ])
    })

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
      ]
      const result = findAllMatchingSubsetsBottomUp({
        tuples,
        targetQuantity: D(4),
        targetValue: D(400),
        maxResults: 5,
        time: false,
      })
      const unique = new Set(result.map(r => JSON.stringify(r)))
      expect(unique.size).to.be.greaterThan(1) // Should allow permutations
    })

    it('large values but exact match', () => {
      const tuples: LotData[] = [
        {
          quantity: D(10),
          price: D(1000),
          lotId: 'test lot id',
          accountId: '1',
          acquiredDate: new Date('2024-05-23T07:00:00.000Z'),
        },
      ]
      const result = findAllMatchingSubsetsBottomUp({
        tuples,
        targetQuantity: D(5),
        targetValue: D(5000),
        maxResults: 5,
        time: false,
      })
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
      ])
    })

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
      ]
      const result = findAllMatchingSubsetsBottomUp({
        tuples,
        targetQuantity: D(0),
        targetValue: D(0),
        maxResults: 5,
        time: false,
      })
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
      ])
    })

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
      ]
      const result = findAllMatchingSubsetsBottomUp({
        tuples,
        targetQuantity: D(3),
        targetValue: D(30),
        maxResults: 5,
        time: false,
      })
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
      ])
    })

    it('edge case: empty input', () => {
      const result = findAllMatchingSubsetsBottomUp({
        tuples: [],
        targetQuantity: D(0),
        targetValue: D(0),
        maxResults: 5,
        time: false,
      })
      expect(result).to.deep.equal([[]])
    })

    it('edge case: empty input with non-zero target', () => {
      const result = findAllMatchingSubsetsBottomUp({
        tuples: [],
        targetQuantity: D(1),
        targetValue: D(1),
        maxResults: 5,
        time: false,
      })
      expect(result).to.deep.equal([])
    })

    it('respects maxResults in DP', () => {
      const result = findAllMatchingSubsetsBottomUp({
        tuples: basicTuples,
        targetQuantity: D(4),
        targetValue: D(600),
        maxResults: 1,
        time: false,
      })

      expect(result.length).toBe(1)
    })

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
      ]
      const result = findAllMatchingSubsetsBottomUp({
        tuples,
        targetQuantity: D(2),
        targetValue: D(305), // Slightly different from actual value (300)
        maxResults: 5,
        time: false,
      })

      expect(result.length).toBe(1)
      expect(result[0].length).toBe(2)
      // Verify that original quantities are preserved
      expect(result[0][0].quantity.eq(D(1))).toBe(true)
      expect(result[0][1].quantity.eq(D(1))).toBe(true)
      // Verify that lot IDs match
      expect(result[0][0].lotId).toBe('Lot-1')
      expect(result[0][1].lotId).toBe('Lot-2')
    })
  })

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
    ]

    it('max results are honored', () => {
      const result = findSubsetHybrid({
        time: false,
        lotsData: multiSolutionLotData,
        targetQuantity: D(6),
        targetValue: D(127.43),
        maxResults: 1,
        symbol: 'TEST',
      })

      expect(result.length).toBe(1)
    })

    it('multiple solutions are resolved to 1 for equivalent lot changes', () => {
      const result = findLotChangeSets({
        time: false,
        lotsData: multiSolutionLotData,
        targetQuantity: D(6),
        targetValue: D(127.43),
        symbol: 'TEST',
      })

      // This test will throw an error if the lot changes are not unique
      expect(result.lotChanges.length).toBe(4)
    })
  })

  describe('production Test Data', () => {
    it('greedy finds solution within maxResults', () => {
      const result = findSubsetHybrid({
        time: false,
        lotsData: basicTuples,
        targetQuantity: D(4),
        targetValue: D(600),
        maxResults: 1,
        symbol: 'TEST',
      })

      expect(result.length).toBe(1)
    })

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
      })

      expect(result.length).toBe(1)
    })

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
      })

      expect(result.length).toBe(1)
    })

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
      ]
      const res1 = findSubsetHybrid({
        time: false,
        lotsData: tuples,
        targetQuantity: D(5),
        targetValue: D(80.08),
        symbol: 'TEST',
      })

      expect(res1.length).toBe(1)
      const res2 = findSubsetHybrid({
        time: false,
        lotsData: tuples.reverse(),
        targetQuantity: D(5),
        targetValue: D(80.08),
        symbol: 'TEST',
      })

      expect(res2.length).toBe(1)
    })

    describe('findLotChangeSets', () => {
      it('should work for basic AZN example', () => {
        const result = findLotChangeSets({
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
        })

        expect(
          result.lotChanges.map(l => ({
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
        ])
      })
    })
  })
})
