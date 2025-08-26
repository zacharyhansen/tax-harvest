import { Module } from '@nestjs/common';

import { AuthConnectionModule } from '../auth-connection/auth-connection.module';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';

@Module({
	exports: [TransactionService],
	imports: [AuthConnectionModule],
	providers: [TransactionService, TransactionResolver],
})
export class TransactionModule {}
