import { Module } from '@nestjs/common'

import { LotTransactionBatchResolver } from './lot-transaction-batch.resolver'
import { LotTransactionBatchService } from './lot-transaction-batch.service'

@Module({
  providers: [LotTransactionBatchService, LotTransactionBatchResolver],
})
export class LotTransactionBatchModule {}
