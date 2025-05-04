import { Module } from '@nestjs/common'
import { PlaidController } from './plaid.controller'
import { PlaidResolver } from './plaid.resolver'
import { PlaidService } from './plaid.service'

@Module({
  controllers: [PlaidController],
  exports: [PlaidService],
  providers: [PlaidService, PlaidResolver],
})
export class PlaidModule {}
