import { Module } from '@nestjs/common'

import { LotModule } from '../lot/lot.module'
import { HarvestResolver } from './harvest.resolver'
import { HarvestService } from './harvest.service'

@Module({
  exports: [HarvestService],
  imports: [LotModule],
  providers: [HarvestService, HarvestResolver],
})
export class HarvestModule {}
