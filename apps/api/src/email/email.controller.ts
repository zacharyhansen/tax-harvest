import { Body, Controller, Post } from '@nestjs/common'
import { Public } from '~/auth/decorators/public.decorator'
import { EmailService } from './email.service'

interface TestEmailDto {
  to: string
  name?: string
}

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  @Public()
  async sendTestEmail(@Body() { to, name = 'Test User' }: TestEmailDto) {
    await this.emailService.sendWelcomeEmail(to, name)
    return { message: 'Test email sent successfully' }
  }
}
