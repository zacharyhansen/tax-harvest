import type { AssetService } from '../asset/asset.service'
import type { PolygonService } from '../polygon/polygon.service'

import type { PriceHourlyVectorService } from '../price-hourly-vector/price-hourly-vector.service'
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class CronTasksService {
  private readonly logger = new Logger(CronTasksService.name)
  constructor(
    private readonly polygonService: PolygonService,
    private readonly assetService: AssetService,
    private readonly priceHourlyVectorService: PriceHourlyVectorService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM, { name: 'update_asset_last_price' })
  async updateAssetsLastPrice() {
    this.logger.log(`Updating all asset prices`)
    await this.polygonService.updateAllAssetPrices()
    this.logger.log(`Updated all asset prices`)
  }

  @Cron(CronExpression.EVERY_WEEK, { name: 'ingest_hourly_asset_prices' })
  async updateHourlyAssetPrices() {
    this.logger.log(`Updating asset hourly prices for this week.`)
    const now = new Date()
    const from = new Date()
    // Ingest from 8 days ago (1 day overlap to ensure we get it all) to today
    from.setDate(now.getDate() - 8)
    await this.polygonService.ingestHourly({
      from,
      to: now,
    })
    this.logger.log(`Updated asset hourly prices for this week.`)

    const assets = await this.assetService.distinctAssets()
    this.logger.log(`Updating asset info for ${assets.length} assets.`)
    await Promise.all(
      assets.map(asset => this.polygonService.processAsset(asset.symbol)),
    )
    this.logger.log(`Updated asset info for ${assets.length} assets`)
  }

  @Cron('0 0 */14 * 0', { name: 'generate_embeddings' })
  async generateEmbeddings() {
    const date = new Date().toString()
    this.logger.log(`Creating embeddings // ${date}.`)
    await this.priceHourlyVectorService.createEmbeddings()
    this.logger.log(`Created embeddings // ${date}.`)
  }
}
