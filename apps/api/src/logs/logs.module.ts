import { Module } from '@nestjs/common'

import { LogsResolver } from './logs.resolver'
import { LogsService } from './logs.service'

@Module({
  providers: [LogsService, LogsResolver],
})
export class LogsModule {}
