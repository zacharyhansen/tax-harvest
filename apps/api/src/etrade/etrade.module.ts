import { Module } from '@nestjs/common'

import { EtradeService } from './etrade.service'

@Module({
  exports: [EtradeService],
  providers: [EtradeService],
})
export class EtradeModule {}
