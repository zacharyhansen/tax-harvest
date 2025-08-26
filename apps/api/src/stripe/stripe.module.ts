import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StripeController } from './stripe.controller';
import { StripeResolver } from './stripe.resolver';
import { StripeService } from './stripe.service';

@Module({
	controllers: [StripeController],
	exports: [StripeService],
	providers: [StripeService, StripeResolver],
	imports: [forwardRef(() => ConfigModule)],
})
export class StripeModule {}
