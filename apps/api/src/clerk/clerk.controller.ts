import type {
  RawBodyRequest,
  Request,
  Response,
} from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'
import type { UserService } from '../user/user.service'
import type { ClerkWebHookEvent } from './clerk.dto'

import {
  Controller,
  Headers,
  Logger,
  Post,

  Req,
  Res,
} from '@nestjs/common'
import { Webhook } from 'svix'
import { Public } from '../auth/decorators/public.decorator'
import { isClerkUser } from './clerk.dto'

@Controller('clerk')
export class ClerkController {
  private readonly logger = new Logger(ClerkController.name)

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post('webhook')
  @Public()
  async handleWebhook(
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Req() request: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    try {
      // Verify webhook secret exists
      const webhookSecret = this.configService.get<string>(
        'CLERK_USER_UPDATE_CREATE_WEBHOOK_SIGN_SECRET',
      )
      if (!webhookSecret) {
        throw new Error('Missing WEBHOOK_SECRET in environment variables')
      }

      // Verify required headers
      if (!svixId || !svixTimestamp || !svixSignature) {
        // @ts-expect-error - This is a fastify response
        return res.status(400).json({
          message: 'Missing required Svix headers',
          success: false,
        })
      }

      // Initialize webhook instance
      const wh = new Webhook(webhookSecret)

      // Verify the webhook payload
      const payload = request.rawBody?.toString('utf8')

      if (!payload) {
        throw new Error('Missing webhook payload.')
      }

      const evt = wh.verify(payload, {
        'svix-id': svixId,
        'svix-signature': svixSignature,
        'svix-timestamp': svixTimestamp,
      }) as ClerkWebHookEvent

      if (isClerkUser(evt.data)) {
        // Handle different webhook events
        const email = evt.data.email_addresses.find(
          email => email.id === evt.data.primary_email_address_id,
        )?.email_address
        const phoneNumber = evt.data.phone_numbers.find(
          num => num.id === evt.data.primary_phone_number_id,
        )?.phone_number
        const name = `${evt.data.first_name} ${evt.data.last_name}`

        // Keep user creation to this single entry point (even tho it requires an extra request)
        await this.userService.asserUserExists(
          evt.data.id,
          { id: true },
          {
            email,
            id: evt.data.id,
            phoneNumber,
            photo: evt.data.image_url,
          },
        )

        switch (evt.type) {
          case 'user.created': {
            // Dont need to do anything as the this.userService.asserUserExists handles this
            this.logger.log(`Clerk user create event for ${evt.data.id}`)
            break
          }
          case 'user.updated': {
            this.logger.log(`Clerk user update event for ${evt.data.id}`)

            // Handle user update
            await this.userService.updateUser({
              data: {
                email,
                id: evt.data.id,
                name,
                phoneNumber,
                photo: evt.data.image_url,
              },
              where: {
                id: evt.data.id,
              },
            })
            break
          }
        }
        // @ts-expect-error - This is a fastify response
        return res.status(200).json({
          message: 'Webhook processed successfully',
          success: true,
        })
      }
    }
    catch (error) {
      console.error('Webhook error:', error)
      // @ts-expect-error - This is a fastify response
      return res.status(400).json({
        message: error,
        success: false,
      })
    }
  }
}
