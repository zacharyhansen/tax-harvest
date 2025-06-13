import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { HarvestNotificationFrequency } from '@prisma/client'

import { sql } from 'kysely'
import { Database } from '~/database/database'
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
    private readonly db: Database,
  ) { }

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

  @Cron(CronExpression.EVERY_DAY_AT_5AM, { name: 'send_wash_sale_notifications' })
  async sendDailyWashSaleNotifications() {
    this.logger.log('Sending wash sale notifications')
    await this.sendWashSaleNotifications({ date: new Date() })
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM, { name: 'send_daily_portfolio_notifications' })
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

  async sendPortfolioNotifications(frequency: HarvestNotificationFrequency): Promise<boolean> {
    try {
      // Get all portfolios with the specified notification frequency
      const portfolios = await this.prisma.$extends(PrismaService.bypassRLS()).portfolio.findMany({
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
      return true
    }
    catch (error) {
      this.logger.error(`Failed to process ${frequency.toLowerCase()} portfolio notifications:`, error)
      return false
    }
  }

  // TODO: Move this to job queue
  async sendWashSaleNotifications({ date }: { date: Date }): Promise<boolean> {
    try {
      const notifications = await this.db.transaction().execute(async (trx) => {
        await Database.bypassRLS(trx)

        return trx.selectFrom('Harvest')
          .select([
            'Harvest.portfolioId',
            sql<string[]>`array_agg("harvestTransactionItemId")`.as('harvestTransactionItemIds'),
            sql<string[]>`array_agg("User"."email")`.as('emails'),
          ])
          .innerJoin('HarvestTransaction', 'HarvestTransaction.harvestId', 'Harvest.id')
          .innerJoin('UsersOnPortfolios', 'UsersOnPortfolios.portfolioId', 'HarvestTransaction.portfolioId')
          .innerJoin('User', 'User.id', 'UsersOnPortfolios.userId')
          .where('afterWashRevertDate', '>=', new Date(new Date().setDate(date.getDate() - 1)))
          .where('afterWashRevertDate', '<=', date)
          .where('notify', '=', true)
          .groupBy('Harvest.portfolioId')
          .execute()
      })

      this.logger.log(`Found ${notifications.length} portfolios for wash sale notifications`)

      // Process portfolios in batches of 50
      const BATCH_SIZE = 50
      const DELAY_BETWEEN_BATCHES = 1000 // 1 second delay between batches
      const DELAY_BETWEEN_EMAILS = 100 // 100ms delay between individual emails

      for (let i = 0; i < notifications.length; i += BATCH_SIZE) {
        const batch = notifications.slice(i, i + BATCH_SIZE)
        this.logger.log(`Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(notifications.length / BATCH_SIZE)}`)

        // Get protfolio data for batch
        const porfolioData = await this.prisma.$extends(PrismaService.bypassRLS()).portfolio.findMany({
          where: {
            id: {
              in: batch.map(n => n.portfolioId),
            },
          },
          select: {
            id: true,
            name: true,
          },
        }).then(portfolios => portfolios.reduce((acc, portfolio) => {
          acc[portfolio.id] = {
            id: portfolio.id,
            name: portfolio.name,
          }
          return acc
        }, {} as Record<string, { id: string, name: string }>),
        )

        // Process each notification in the batch
        for (const notification of batch) {
          if (notification.harvestTransactionItemIds.length === 0 || notification.emails.length === 0) {
            console.info(`No harvest transaction item ids or emails for portfolio ${notification.portfolioId}, skipping...`)
            continue
          }
          // Get harvest transaction item data for batch
          const harvestTransactionItemData = await this.prisma.$extends(PrismaService.bypassRLS()).harvestTransactionItem.findMany({
            where: {
              id: {
                in: notification.harvestTransactionItemIds,
              },
            },
            select: {
              id: true,
              assetSymbol: true,
              orderType: true,
              date: true,
              quantity: true,
            },
          })

          // Send emails for each notification
          for (const email of notification.emails) {
            if (!porfolioData[notification.portfolioId]) {
              console.info(`No portfolio data for portfolio ${notification.portfolioId}, skipping...`)
              continue
            }

            try {
              await this.emailService.sendWashSaleNotification(
                email,
                porfolioData[notification.portfolioId],
                harvestTransactionItemData,
              )
              // Add delay between individual emails
              await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_EMAILS))
            }
            catch (error) {
              this.logger.error(
                `Failed to send notification to ${email} for portfolio ${porfolioData[notification.portfolioId].name}:`,
                error,
              )
              // Continue with next email even if one fails
              continue
            }
          }
        }

        // Add delay between batches if there are more batches to process
        if (i + BATCH_SIZE < notifications.length) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
        }
      }

      this.logger.log(`Successfully processed wash sale notifications`)
      return true
    }
    catch (error) {
      this.logger.error(`Failed to process wash sale notifications:`, error)
      return false
    }
  }
}
