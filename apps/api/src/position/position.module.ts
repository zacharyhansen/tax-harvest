import { Module } from '@nestjs/common';
import { PositionResolver } from './position.resolver';
import { PositionService } from './position.service';

@Module({
	providers: [PositionService, PositionResolver],
	exports: [PositionService],
})
export class PositionModule {}
