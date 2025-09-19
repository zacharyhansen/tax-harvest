import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MultiChangeSetResolver } from './multi-change-set.resolver';

@Module({
	exports: [],
	imports: [PrismaModule],
	providers: [MultiChangeSetResolver],
})
export class MultiChangeSetModule {}
