import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from '~/notification/notification.module';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
	imports: [ConfigModule, forwardRef(() => NotificationModule)],
	controllers: [EmailController],
	providers: [EmailService],
	exports: [EmailService],
})
export class EmailModule {}
