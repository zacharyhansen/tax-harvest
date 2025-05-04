import { Module } from '@nestjs/common'
import { PriceHourlyVectorService } from './price-hourly-vector.service'

@Module({
  exports: [PriceHourlyVectorService],
  providers: [PriceHourlyVectorService],
})
export class PriceHourlyVectorModule {}
