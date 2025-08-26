import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationService } from './notification.service';

@Module({
	imports: [EmailModule, PrismaModule, DatabaseModule],
	providers: [NotificationService],
	exports: [NotificationService],
})
export class NotificationModule {}
