import { forwardRef, Module } from '@nestjs/common';

import { ClerkModule } from '../clerk/clerk.module';
import { PlaidModule } from '../plaid/plaid.module';
import { StripeModule } from '../stripe/stripe.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
	exports: [UserService],
	imports: [
		StripeModule,
		forwardRef(() => ClerkModule),
		PlaidModule,
		forwardRef(() => ClerkModule),
	],
	providers: [UserService, UserResolver],
})
export class UserModule {}
