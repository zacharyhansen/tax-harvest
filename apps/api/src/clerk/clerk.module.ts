import { forwardRef, Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { ClerkController } from './clerk.controller';
import { ClerkService } from './clerk.service';

@Module({
  controllers: [ClerkController],
  exports: [ClerkService],
  imports: [forwardRef(() => UserModule)],
  providers: [ClerkService],
})
export class ClerkModule {}
