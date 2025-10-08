import { Module } from '@nestjs/common';
import { AssetModule } from '../asset/asset.module';
import { NotificationModule } from '../notification/notification.module';
import { PlaidModule } from '../plaid/plaid.module';
import { PolygonModule } from '../polygon/polygon.module';
import { PriceHourlyVectorModule } from '../price-hourly-vector/price-hourly-vector.module';
import { CronTasksResolver } from './cron-tasks.resolver';
import { CronTasksService } from './cron-tasks.service';

@Module({
	imports: [
		PolygonModule,
		AssetModule,
		PriceHourlyVectorModule,
		NotificationModule,
		PlaidModule,
	],
	providers: [CronTasksService, CronTasksResolver],
	exports: [CronTasksService],
})
export class CronTasksModule {}
