import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Resolver,
} from '@nestjs/graphql'
import { AdminGuard } from '~/auth/guards/admin.guard'
import { HarvestNotificationFrequency } from '~/generated/graphql'
import { PrismaService } from '~/prisma/prisma.service'
import { CronTasksService } from './cron-tasks.service'

@Resolver()
@UseGuards(AdminGuard)
export class CronTasksResolver {
  constructor(
    private readonly cronTasksService: CronTasksService,
    private readonly prismaService: PrismaService,
  ) { }

  @Mutation(() => Boolean)
  sendWashSaleNotificationsForDate(
    @Args('date', {
      type: () => Date,
    })
    date: Date,
  ): Promise<boolean> {
    return this.cronTasksService.sendWashSaleNotifications({ date })
  }

  @Mutation(() => Boolean)
  sendNotificationsByFrequency(
    @Args('frequency', {
      type: () => HarvestNotificationFrequency,
    })
    frequency: HarvestNotificationFrequency,
  ): Promise<boolean> {
    return this.cronTasksService.sendPortfolioNotifications(frequency)
  }
}
