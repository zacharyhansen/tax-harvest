import { Module } from '@nestjs/common';
import { PlaidMergeResolver } from './plaid-merge.resolver';

@Module({
	providers: [PlaidMergeResolver],
})
export class PlaidMergeModule {}
