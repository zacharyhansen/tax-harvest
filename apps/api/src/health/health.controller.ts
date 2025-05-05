import { Controller, Get, HttpCode, Logger } from '@nestjs/common'

import { Public } from '../auth/decorators/public.decorator'

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name)

  @Get()
  @HttpCode(200)
  @Public()
  run() {
    this.logger.log('im healthy baby')
    return { status: 'ok' }
  }
}
