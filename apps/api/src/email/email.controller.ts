import { Body, Controller, Post } from '@nestjs/common';
import type { HarvestNotificationFrequency } from '@prisma/client';
import { Public } from '~/auth/decorators/public.decorator';
import { NotificationService } from '../notification/notification.service';
import { EmailService } from './email.service';

interface TestEmailDto {
	to: string;
	name?: string;
}

interface TestPortfolioNotificationDto {
	frequency: HarvestNotificationFrequency;
}

@Controller('email')
export class EmailController {
	constructor(
		private readonly emailService: EmailService,
		private readonly notificationService: NotificationService,
	) {}

	@Post('test')
	@Public()
	async sendTestEmail(@Body() { to, name = 'Test User' }: TestEmailDto) {
		await this.emailService.sendWelcomeEmail(to, name);
		return { message: 'Test email sent successfully' };
	}

	@Post('test/portfolio-notifications')
	@Public()
	async sendTestPortfolioNotifications(
		@Body() { frequency }: TestPortfolioNotificationDto,
	) {
		await this.notificationService.sendPortfolioNotifications(frequency);
		return {
			message: `Portfolio notifications for ${frequency} frequency triggered successfully`,
		};
	}
}
