import { Module } from '@nestjs/common'

import { LotModule } from '../lot/lot.module'
import { PolygonModule } from '../polygon/polygon.module'
import { HarvestResolver } from './harvest.resolver'
import { HarvestService } from './harvest.service'

@Module({
  exports: [HarvestService],
  imports: [LotModule, PolygonModule],
  providers: [HarvestService, HarvestResolver],
})
export class HarvestModule { }
