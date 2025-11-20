import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { LotModelResolver } from './lot-model.resolver';
import { LotModelService } from './lot-model.service';

@Module({
	exports: [LotModelService],
	imports: [DatabaseModule, ConfigModule],
	providers: [LotModelService, LotModelResolver],
})
export class LotModelModule {}
