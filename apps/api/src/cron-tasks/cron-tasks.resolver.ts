import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AdminGuard } from '~/auth/guards/admin.guard';
import { HarvestNotificationFrequency } from '~/generated/graphql';
import { NotificationService } from '~/notification/notification.service';

@Resolver()
@UseGuards(AdminGuard)
export class CronTasksResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@Mutation(() => Boolean)
	sendWashSaleNotificationsForDate(
		@Args('date', {
			type: () => Date,
		})
		date: Date,
	): Promise<boolean> {
		return this.notificationService.sendWashSaleNotifications({ date });
	}

	@Mutation(() => Boolean)
	sendNotificationsByFrequency(
		@Args('frequency', {
			type: () => HarvestNotificationFrequency,
		})
		frequency: HarvestNotificationFrequency,
	): Promise<boolean> {
		return this.notificationService.sendPortfolioNotifications(frequency);
	}
}
