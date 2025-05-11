import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { HarvestNotificationFrequency } from '@prisma/client'

import { AssetService } from '../asset/asset.service'
import { EmailService } from '../email/email.service'
import { PolygonService } from '../polygon/polygon.service'
import { PriceHourlyVectorService } from '../price-hourly-vector/price-hourly-vector.service'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CronTasksService {
  private readonly logger = new Logger(CronTasksService.name)
  constructor(
    private readonly polygonService: PolygonService,
    private readonly assetService: AssetService,
    private readonly priceHourlyVectorService: PriceHourlyVectorService,
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM, { name: 'update_asset_last_price' })
  async updateAssetsLastPrice() {
    this.logger.log(`Updating all asset prices`)
    await this.polygonService.updateAllAssetPrices()
    this.logger.log(`Updated all asset prices`)
  }

  @Cron(CronExpression.EVERY_WEEK, { name: 'ingest_hourly_asset_prices' })
  async updateHourlyAssetPrices() {
    this.logger.log(`Updating asset hourly prices for this week.`)
    const now = new Date()
    const from = new Date()
    // Ingest from 8 days ago (1 day overlap to ensure we get it all) to today
    from.setDate(now.getDate() - 8)
    await this.polygonService.ingestHourly({
      from,
      to: now,
    })
    this.logger.log(`Updated asset hourly prices for this week.`)

    const assets = await this.assetService.distinctAssets()
    this.logger.log(`Updating asset info for ${assets.length} assets.`)
    await Promise.all(
      assets.map(asset => this.polygonService.processAsset(asset.symbol)),
    )
    this.logger.log(`Updated asset info for ${assets.length} assets`)
  }

  @Cron('0 0 */14 * 0', { name: 'generate_embeddings' })
  async generateEmbeddings() {
    const date = new Date().toString()
    this.logger.log(`Creating embeddings // ${date}.`)
    await this.priceHourlyVectorService.createEmbeddings()
    this.logger.log(`Created embeddings // ${date}.`)
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM, { name: 'send_daily_portfolio_notifications' })
  async sendDailyPortfolioNotifications() {
    this.logger.log('Sending daily portfolio notifications')
    await this.sendPortfolioNotifications(HarvestNotificationFrequency.DAILY)
  }

  @Cron(CronExpression.EVERY_WEEK, { name: 'send_weekly_portfolio_notifications' })
  async sendWeeklyPortfolioNotifications() {
    this.logger.log('Sending weekly portfolio notifications')
    await this.sendPortfolioNotifications(HarvestNotificationFrequency.WEEKLY)
  }

  @Cron('0 0 1 * *', { name: 'send_monthly_portfolio_notifications' })
  async sendMonthlyPortfolioNotifications() {
    this.logger.log('Sending monthly portfolio notifications')
    await this.sendPortfolioNotifications(HarvestNotificationFrequency.MONTHLY)
  }

  @Cron('0 0 1 */3 *', { name: 'send_quarterly_portfolio_notifications' })
  async sendQuarterlyPortfolioNotifications() {
    this.logger.log('Sending quarterly portfolio notifications')
    await this.sendPortfolioNotifications(HarvestNotificationFrequency.QUARTERLY)
  }

  async sendPortfolioNotifications(frequency: HarvestNotificationFrequency) {
    try {
      // Get all portfolios with the specified notification frequency
      const portfolios = await this.prisma.portfolio.findMany({
        where: {
          notificationFrequency: frequency,
        },
        include: {
          usersOnPortfolios: {
            include: {
              user: true,
            },
          },
        },
      })

      this.logger.log(`Found ${portfolios.length} portfolios for ${frequency.toLowerCase()} notifications`)

      // Process portfolios in batches of 50
      const BATCH_SIZE = 50
      const DELAY_BETWEEN_BATCHES = 1000 // 1 second delay between batches
      const DELAY_BETWEEN_EMAILS = 100 // 100ms delay between individual emails

      for (let i = 0; i < portfolios.length; i += BATCH_SIZE) {
        const batch = portfolios.slice(i, i + BATCH_SIZE)
        this.logger.log(`Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(portfolios.length / BATCH_SIZE)}`)

        // Process each portfolio in the batch
        for (const portfolio of batch) {
          // Filter out users without emails and create notification tasks
          const notificationTasks = portfolio.usersOnPortfolios
            .filter(uop => uop.user.email)
            .map(uop => ({
              email: uop.user.email!,
              portfolioName: portfolio.name,
            }))

          // Send emails with rate limiting
          for (const task of notificationTasks) {
            try {
              await this.emailService.sendPortfolioNotification(
                task.email,
                task.portfolioName,
                frequency,
              )
              // Add delay between individual emails
              await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_EMAILS))
            }
            catch (error) {
              this.logger.error(
                `Failed to send notification to ${task.email} for portfolio ${task.portfolioName}:`,
                error,
              )
              // Continue with next email even if one fails
              continue
            }
          }
        }

        // Add delay between batches if there are more batches to process
        if (i + BATCH_SIZE < portfolios.length) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
        }
      }

      this.logger.log(`Successfully processed ${frequency.toLowerCase()} portfolio notifications`)
    }
    catch (error) {
      this.logger.error(`Failed to process ${frequency.toLowerCase()} portfolio notifications:`, error)
    }
  }
}
