import { Module } from '@nestjs/common';
import { LotModule } from '~/lot/lot.module';
import { PositionModule } from '~/position/position.module';
import { RealizedPandLResolver } from './realized-p-and-l.resolver';
import { RealizedPandLService } from './realized-p-and-l.service';

@Module({
	exports: [RealizedPandLService],
	providers: [RealizedPandLService, RealizedPandLResolver],
	imports: [PositionModule, LotModule],
})
export class RealizedPandLModule {}
