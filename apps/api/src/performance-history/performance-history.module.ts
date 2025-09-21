import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PerformanceHistoryResolver } from './performance-history.resolver';
import { PerformanceHistoryService } from './performance-history.service';

@Module({
	imports: [DatabaseModule, PrismaModule],
	providers: [PerformanceHistoryService, PerformanceHistoryResolver],
	exports: [PerformanceHistoryService],
})
export class PerformanceHistoryModule {}
