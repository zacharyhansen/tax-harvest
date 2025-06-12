import { createClerkClient } from '@clerk/backend'

import { forwardRef, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserModule } from '../user/user.module'
import { ClerkController } from './clerk.controller'
import { ClerkService } from './clerk.service'

@Module({
  controllers: [ClerkController],
  exports: [ClerkService],
  imports: [forwardRef(() => UserModule)],
  providers: [ClerkService, {
    inject: [ConfigService],
    provide: 'CLERK_CLIENT',
    useFactory: async (configService: ConfigService) => {
      const clerkClient = createClerkClient({ secretKey: configService.get('CLERK_SECRET_KEY') })
      return clerkClient
    },
  }],
})
export class ClerkModule { }
