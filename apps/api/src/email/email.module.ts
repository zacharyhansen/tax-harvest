import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CronTasksModule } from '../cron-tasks/cron-tasks.module'
import { EmailController } from './email.controller'
import { EmailService } from './email.service'

@Module({
  imports: [ConfigModule, CronTasksModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
