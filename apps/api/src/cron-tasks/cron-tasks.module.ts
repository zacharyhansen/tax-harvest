import { forwardRef, Module } from '@nestjs/common'
import { AssetModule } from '../asset/asset.module'
import { EmailModule } from '../email/email.module'
import { PolygonModule } from '../polygon/polygon.module'
import { PriceHourlyVectorModule } from '../price-hourly-vector/price-hourly-vector.module'
import { PrismaService } from '../prisma/prisma.service'
import { CronTasksResolver } from './cron-tasks.resolver'
import { CronTasksService } from './cron-tasks.service'

@Module({
  imports: [PolygonModule, AssetModule, PriceHourlyVectorModule, forwardRef(() => EmailModule)],
  providers: [CronTasksService, PrismaService, CronTasksResolver],
  exports: [CronTasksService],
})
export class CronTasksModule { }
