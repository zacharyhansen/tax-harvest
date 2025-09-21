import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LotApplicationModule } from '~/lot-application/lot-application.module';
import { DatabaseModule } from '../database/database.module';
import { LotResolver } from './lot.resolver';
import { LotService } from './lot.service';

@Module({
	exports: [LotService],
	imports: [DatabaseModule, ConfigModule, LotApplicationModule],
	providers: [LotService, LotResolver],
})
export class LotModule {}
