import { Module } from '@nestjs/common'

import { PolygonModule } from '../polygon/polygon.module'
import { PriceHourlyVectorModule } from '../price-hourly-vector/price-hourly-vector.module'
import { AssetService } from './asset.service'

@Module({
  exports: [AssetService],
  imports: [PriceHourlyVectorModule, PolygonModule],
  providers: [AssetService],
})
export class AssetModule {}
