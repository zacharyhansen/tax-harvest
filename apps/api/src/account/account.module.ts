import { Module } from '@nestjs/common';

import { AuthConnectionModule } from '../auth-connection/auth-connection.module';
import { LotModule } from '../lot/lot.module';
import { RealizedPandLModule } from '../realized-p-and-l/realized-p-and-l.module';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

@Module({
	exports: [AccountService],
	imports: [AuthConnectionModule, RealizedPandLModule, LotModule],
	providers: [AccountService, AccountResolver],
})
export class AccountModule {}
