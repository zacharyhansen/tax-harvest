import { Module } from '@nestjs/common'

import { AssetModule } from '../asset/asset.module'
import { PolygonModule } from '../polygon/polygon.module'
import { PriceHourlyVectorModule } from '../price-hourly-vector/price-hourly-vector.module'
import { CronTasksService } from './cron-tasks.service'

@Module({
  imports: [PolygonModule, AssetModule, PriceHourlyVectorModule],
  providers: [CronTasksService],
})
export class CronTasksModule {}
