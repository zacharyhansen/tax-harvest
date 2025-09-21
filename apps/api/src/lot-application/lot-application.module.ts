import { Module } from '@nestjs/common';
import { LotApplicationService } from './lot-application.service';

@Module({
	exports: [LotApplicationService],
	providers: [LotApplicationService],
})
export class LotApplicationModule {}
