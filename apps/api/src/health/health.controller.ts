import { Controller, Get, HttpCode } from '@nestjs/common'

import { Public } from '../auth/decorators/public.decorator'

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(200)
  @Public()
  run() {
    return { status: 'ok' }
  }
}
