import { Module } from '@nestjs/common';
import { PlaidModule } from '~/plaid/plaid.module';
import { PlaidInstitutionResolver } from './plaid-institution.resolver';
import { PlaidInstitutionService } from './plaid-institution.service';

@Module({
	imports: [PlaidModule],
	providers: [PlaidInstitutionService, PlaidInstitutionResolver],
	exports: [PlaidInstitutionService],
})
export class PlaidInstitutionModule {}
