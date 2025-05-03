import { Module } from '@nestjs/common'

import { RealizedPandLResolver } from './realized-p-and-l.resolver'
import { RealizedPandLService } from './realized-p-and-l.service'

@Module({
  exports: [RealizedPandLService],
  providers: [RealizedPandLService, RealizedPandLResolver],
})
export class RealizedPandLModule {}
