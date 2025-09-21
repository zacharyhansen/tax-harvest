import { Module } from '@nestjs/common';
import { LotApplicationModule } from '~/lot-application/lot-application.module';
import { PositionModule } from '~/position/position.module';
import { PlaidController } from './plaid.controller';
import { PlaidResolver } from './plaid.resolver';
import { PlaidService } from './plaid.service';

@Module({
	controllers: [PlaidController],
	exports: [PlaidService],
	providers: [PlaidService, PlaidResolver],
	imports: [PositionModule, LotApplicationModule],
})
export class PlaidModule {}
