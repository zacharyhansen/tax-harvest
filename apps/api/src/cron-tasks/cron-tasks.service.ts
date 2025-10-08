import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HarvestNotificationFrequency } from '@prisma/client';
import { AssetService } from '../asset/asset.service';
import { NotificationService } from '../notification/notification.service';
import { PolygonService } from '../polygon/polygon.service';
import { PriceHourlyVectorService } from '../price-hourly-vector/price-hourly-vector.service';

@Injectable()
export class CronTasksService {
	private readonly logger = new Logger(CronTasksService.name);
	constructor(
		private readonly polygonService: PolygonService,
		readonly _assetService: AssetService,
		readonly _priceHourlyVectorService: PriceHourlyVectorService,
		private readonly notificationService: NotificationService,
	) {}

	@Cron('*/15 * * * *', { name: 'update_asset_last_price' })
	async updateAssetsLastPrice() {
		this.logger.log(`Updating all asset prices`);
		await this.polygonService.updateAllAssetPrices();
		this.logger.log(`Updated all asset prices`);
	}

	// @Cron(CronExpression.EVERY_WEEK, { name: 'ingest_hourly_asset_prices' })
	// async updateHourlyAssetPrices() {
	//   this.logger.log(`Updating asset hourly prices for this week.`)
	//   const now = new Date()
	//   const from = new Date()
	//   // Ingest from 8 days ago (1 day overlap to ensure we get it all) to today
	//   from.setDate(now.getDate() - 8)
	//   await this.polygonService.ingestHourly({
	//     from,
	//     to: now,
	//   })
	//   this.logger.log(`Updated asset hourly prices for this week.`)

	//   const assets = await this.assetService.distinctAssets()
	//   this.logger.log(`Updating asset info for ${assets.length} assets.`)
	//   await Promise.all(
	//     assets.map(asset => this.polygonService.processAsset(asset.symbol)),
	//   )
	//   this.logger.log(`Updated asset info for ${assets.length} assets`)
	// }

	// @Cron('0 0 */14 * 0', { name: 'generate_embeddings' })
	// async generateEmbeddings() {
	//   const date = new Date().toString()
	//   this.logger.log(`Creating embeddings // ${date}.`)
	//   await this.priceHourlyVectorService.createEmbeddings()
	//   this.logger.log(`Created embeddings // ${date}.`)
	// }

	@Cron(CronExpression.EVERY_DAY_AT_5AM, {
		name: 'send_wash_sale_notifications',
	})
	async sendDailyWashSaleNotifications() {
		this.logger.log('Sending wash sale notifications');
		await this.notificationService.sendWashSaleNotifications({
			date: new Date(),
		});
	}

	@Cron(CronExpression.EVERY_DAY_AT_6AM, {
		name: 'send_daily_portfolio_notifications',
	})
	async sendDailyPortfolioNotifications() {
		this.logger.log('Sending daily portfolio notifications');
		await this.notificationService.sendPortfolioNotifications(
			HarvestNotificationFrequency.DAILY,
		);
	}

	@Cron(CronExpression.EVERY_WEEK, {
		name: 'send_weekly_portfolio_notifications',
	})
	async sendWeeklyPortfolioNotifications() {
		this.logger.log('Sending weekly portfolio notifications');
		await this.notificationService.sendPortfolioNotifications(
			HarvestNotificationFrequency.WEEKLY,
		);
	}

	@Cron('0 0 1 * *', { name: 'send_monthly_portfolio_notifications' })
	async sendMonthlyPortfolioNotifications() {
		this.logger.log('Sending monthly portfolio notifications');
		await this.notificationService.sendPortfolioNotifications(
			HarvestNotificationFrequency.MONTHLY,
		);
	}

	@Cron('0 0 1 */3 *', { name: 'send_quarterly_portfolio_notifications' })
	async sendQuarterlyPortfolioNotifications() {
		this.logger.log('Sending quarterly portfolio notifications');
		await this.notificationService.sendPortfolioNotifications(
			HarvestNotificationFrequency.QUARTERLY,
		);
	}

	/**
	 * Nightly sync of Plaid institutions
	 * Runs at 3 AM daily to refresh institution data from Plaid API
	 */
	// @Cron(CronExpression.EVERY_DAY_AT_3AM, {
	// 	name: 'refresh_plaid_institutions',
	// })
	// async refreshPlaidInstitutions() {
	// 	this.logger.log('Starting nightly Plaid institutions refresh');
	// 	try {
	// 		const count = await this.plaidService.refreshAllInstitutions();
	// 		this.logger.log(`Successfully synced ${count} institutions`);
	// 	} catch (error) {
	// 		this.logger.error('Failed to refresh Plaid institutions:', error);
	// 	}
	// }
}
