import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '../database/database.module'
import { LotResolver } from './lot.resolver'
import { LotService } from './lot.service'

@Module({
  exports: [LotService],
  imports: [DatabaseModule, ConfigModule],
  providers: [LotService, LotResolver],
})
export class LotModule {}
