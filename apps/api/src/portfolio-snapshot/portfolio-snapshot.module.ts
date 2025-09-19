import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PortfolioSnapshotResolver } from './portfolio-snapshot.resolver';
import { PortfolioSnapshotService } from './portfolio-snapshot.service';

@Module({
	imports: [DatabaseModule, PrismaModule],
	providers: [PortfolioSnapshotService, PortfolioSnapshotResolver],
	exports: [PortfolioSnapshotService],
})
export class PortfolioSnapshotModule {}
