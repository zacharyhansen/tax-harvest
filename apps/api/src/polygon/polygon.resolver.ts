import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { PolygonService, PolygonStockData } from './polygon.service'

@Resolver(() => PolygonStockData)
export class PolygonResolver {
  constructor(private readonly polygonService: PolygonService) {}

  @Query(() => [PolygonStockData], {
    description: 'Chart data for the past 3 months for a asset',
    name: 'chartThreeMonth',
  })
  async chartThreeMonth(
    @Args('asset', {
      type: () => String,
    })
    asset: string,
  ): Promise<PolygonStockData[]> {
    return this.polygonService
      .chartThreeMonth({
        asset,
      })
      .then(result => (result.results ?? []) as PolygonStockData[])
  }

  @Mutation(() => String, {
    description: 'Update last price of every asset',
    name: 'updateAllAssetPrices',
  })
  async updateAllAssetPrices(): Promise<string> {
    await this.polygonService.updateAllAssetPrices()
    return 'ok'
  }

  @Mutation(() => String, {
    description: 'Pull hourly price data for all assets within the window.',
    name: 'updateHourlyAssetPrices',
  })
  async updateHourlyAssetPrices(
    @Args('from', {
      type: () => Date,
    })
    from: Date,
    @Args('to', {
      type: () => Date,
    })
    to: Date,
  ): Promise<string> {
    await this.polygonService.ingestHourly({
      from,
      to,
    })
    return 'ok'
  }
}
