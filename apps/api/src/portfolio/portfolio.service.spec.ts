import { Test, TestingModule } from '@nestjs/testing'

import { AppModule } from '~/app/app.module'

import Harvest from './portfolio.harvest'
import { PortfolioService } from './portfolio.service'
import HarvestInput_1 from './test/harvest_1/input.json'
import HarvestLotMap_1 from './test/harvest_1/lotMap.json'
import HarvestRealizedOrders_1 from './test/harvest_1/realizedOrders.json'
import HarvestUnrealizedOrders_1 from './test/harvest_1/unrealizedOrders.json'
import HarvestInput_2 from './test/harvest_2/input.json'
import HarvestLotMap_2 from './test/harvest_2/lotMap.json'
import HarvestRealizedOrders_2 from './test/harvest_2/realizedOrders.json'
import HarvestUnrealizedOrders_2 from './test/harvest_2/unrealizedOrders.json'
import HarvestAllOrders_3 from './test/harvest_3/allOrders.json'
import HarvestInput_3 from './test/harvest_3/input.json'
import HarvestRealizedOrders_3 from './test/harvest_3/realizedOrders.json'
import HarvestUnrealizedOrders_3 from './test/harvest_3/unrealizedOrders.json'

describe('portfolioService', () => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  let service: PortfolioService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    service = moduleFixture.get<PortfolioService>(PortfolioService)
  })

  it('should handle a positive realized gain and a larger unrealized gain', () => {
    const realized = {
      accountCount: 1,
      dividend: 200,
      gainLongTerm: 400,
      gainShortTerm: 400,
      gainTotal: 1000,
    }
    const unrealized = {
      accountCount: 1,
      gainTotal: 84_048,
      lossTotal: -2850,
      positionCount: 1,
      total: 81198,
    }

    expect(
      PortfolioService.calculateHarvest({
        realized,
        unrealized,
      }).harvest,
    ).toEqual({
      realized: -1000,
      total: 2850,
      unrealized: -1850,
    })
  })

  it('should handle a negative realized gain and a larger unrealized gain', () => {
    const realized = {
      accountCount: 1,
      dividend: 200,
      gainLongTerm: -300,
      gainShortTerm: -400,
      gainTotal: -500,
    }
    const unrealized = {
      accountCount: 1,
      gainTotal: 10_000,
      lossTotal: -2000,
      positionCount: 1,
      total: 8000,
    }

    expect(
      PortfolioService.calculateHarvest({
        realized,
        unrealized,
      }).harvest,
    ).toEqual({
      realized: 500,
      total: 2500,
      unrealized: -2000,
    })
  })

  it('should handle a negative realized gain and a smaller unrealized gain', () => {
    const realized = {
      accountCount: 1,
      dividend: 200,
      gainLongTerm: -300,
      gainShortTerm: -400,
      gainTotal: -500,
    }
    const unrealized = {
      accountCount: 1,
      gainTotal: 200,
      lossTotal: -2000,
      positionCount: 1,
      total: -1800,
    }

    expect(
      PortfolioService.calculateHarvest({
        realized,
        unrealized,
      }).harvest,
    ).toEqual({
      realized: 200,
      total: 200,
      unrealized: 0,
    })
  })

  it('should handle a positive realized gain and a smaller unrealized gain', () => {
    const realized = {
      accountCount: 1,
      dividend: 200,
      gainLongTerm: 400,
      gainShortTerm: 400,
      gainTotal: 1000,
    }
    const unrealized = {
      accountCount: 1,
      gainTotal: 500,
      lossTotal: -10_000,
      positionCount: 1,
      total: -9500,
    }

    expect(
      PortfolioService.calculateHarvest({
        realized,
        unrealized,
      }).harvest,
    ).toEqual({
      realized: -1000,
      total: 1500,
      unrealized: 500,
    })
  })

  it('should handle unrealized calculation', () => {
    const realized = {
      accountCount: 2,
      dividend: 234,
      gainLongTerm: -520,
      gainShortTerm: -312,
      gainTotal: -598,
    }
    const unrealized = {
      accountCount: 2,
      gainTotal: 168_097,
      lossTotal: -5701,
      positionCount: 258,
      total: 162396,
    }

    expect(
      PortfolioService.calculateHarvest({
        realized,
        unrealized,
      }).harvest,
    ).toEqual({
      realized: 598,
      total: 6299,
      unrealized: -5701,
    })
  })

  it('should set up harvest lot buckets correctly', () => {
    // @ts-expect-error Date type doesnt match but its not used
    const harvest = new Harvest(HarvestInput_1)
    harvest.setupBuckets()
    expect(harvest.assetLotsByValue).toEqual(HarvestLotMap_1)
  })

  it('should handle a harvest', () => {
    // @ts-expect-error Date type doesnt match but its not used
    const harvest = new Harvest(HarvestInput_1)
    harvest.process()

    expect(harvest.realizedOrders).toEqual(
      expect.arrayContaining(
        HarvestRealizedOrders_1.map((order) => {
          // id field is auto generated for now so we need to not have that in the result comparison here
          // @ts-expect-error Its ok to remove the id for testing
          delete order.id
          return expect.objectContaining(order)
        }),
      ),
    )

    expect(harvest.unrealizedOrders).toEqual(
      expect.arrayContaining(
        HarvestUnrealizedOrders_1.map((order) => {
          // id field is auto generated for now so we need to not have that in the result comparison here
          // @ts-expect-error Its ok to remove the id for testing
          delete order.id
          return expect.objectContaining(order)
        }),
      ),
    )
  })

  it('should handle super small harvest if limits are lowered', () => {
    // @ts-expect-error Date type doesnt match but its not used
    const harvest = new Harvest(HarvestInput_2)
    harvest.setupBuckets()
    expect(harvest.assetLotsByValue).toEqual(HarvestLotMap_2)

    harvest.process()

    expect(harvest.realizedOrders).toEqual(
      expect.arrayContaining(
        HarvestRealizedOrders_2.map((order) => {
          // id field is auto generated for now so we need to not have that in the result comparison here
          // @ts-expect-error Its ok to remove the id for testing
          delete order.id
          return expect.objectContaining(order)
        }),
      ),
    )

    expect(harvest.unrealizedOrders).toEqual(
      expect.arrayContaining(
        HarvestUnrealizedOrders_2.map((order) => {
          // id field is auto generated for now so we need to not have that in the result comparison here
          // @ts-expect-error Its ok to remove the id for testing
          delete order.id
          return expect.objectContaining(order)
        }),
      ),
    )
  })

  it('should produce all orders of both realized and unrealized for a directed harvest', () => {
    // @ts-expect-error Date type doesnt match but its not used
    const harvest = new Harvest(HarvestInput_3)

    harvest.process()

    expect(harvest.realizedOrders).toEqual(
      expect.arrayContaining(
        HarvestRealizedOrders_3.map((order) => {
          // id field is auto generated for now so we need to not have that in the result comparison here
          // @ts-expect-error Its ok to remove the id for testing
          delete order.id
          return expect.objectContaining(order)
        }),
      ),
    )

    expect(harvest.unrealizedOrders).toEqual(
      expect.arrayContaining(
        HarvestUnrealizedOrders_3.map((order) => {
          // id field is auto generated for now so we need to not have that in the result comparison here
          // @ts-expect-error Its ok to remove the id for testing
          delete order.id
          return expect.objectContaining(order)
        }),
      ),
    )

    expect(harvest.allOrders).toEqual(
      expect.arrayContaining(
        HarvestAllOrders_3.map((order) => {
          // id field is auto generated for now so we need to not have that in the result comparison here
          // @ts-expect-error Its ok to remove the id for testing
          delete order.id
          return expect.objectContaining(order)
        }),
      ),
    )
  })
})
