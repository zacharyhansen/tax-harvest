import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { HarvestNotificationFrequency, OrderType } from '@prisma/client';
import { MailService } from '@sendgrid/mail';
import type Decimal from 'decimal.js';

export interface SendEmailParams {
	to: string;
	subject: string;
	text?: string;
	html?: string;
	from?: string;
}

@Injectable()
export class EmailService {
	private readonly logger = new Logger(EmailService.name);
	private readonly defaultFrom: string;
	private readonly sendgrid: MailService;

	constructor(private readonly configService: ConfigService) {
		// Initialize SendGrid with API key
		this.sendgrid = new MailService();
		this.sendgrid.setApiKey(
			// biome-ignore lint/style/noNonNullAssertion: <ok>
			this.configService.get<string>('SENDGRID_API_KEY')!,
		);
		// biome-ignore lint/style/noNonNullAssertion: <ok>
		this.defaultFrom = this.configService.get<string>('DEFAULT_EMAIL_ADDRESS')!;
	}

	async sendEmail({
		to,
		subject,
		text,
		html,
		from = this.defaultFrom,
	}: SendEmailParams): Promise<void> {
		try {
			if (!text && !html)
				throw new Error('Either text or html content must be provided');

			const content = [];
			if (text) content.push({ type: 'text/plain', value: text });
			if (html) content.push({ type: 'text/html', value: html });

			const msg = {
				to,
				from,
				subject,
				content: content as [{ type: string; value: string }],
			};

			await this.sendgrid.send(msg);
			this.logger.log(`Email sent successfully to ${to}`);
		} catch (error) {
			this.logger.error(`Failed to send email to ${to}:`, error);
			throw error;
		}
	}

	async sendWelcomeEmail(to: string, name: string): Promise<void> {
		const subject = 'Welcome to TaxHarvest!';
		const html = `
      <h1>Welcome to TaxHarvest, ${name}!</h1>
      <p>We're excited to have you on board. TaxHarvest helps you optimize your investment portfolio through tax-loss harvesting.</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    `;

		await this.sendEmail({
			to,
			subject,
			html,
		});
	}

	async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
		const subject = 'Reset Your TaxHarvest Password';
		const resetUrl = `${this.configService.get('CLIENT_ORIGIN')}/reset-password?token=${resetToken}`;
		const html = `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `;

		await this.sendEmail({
			to,
			subject,
			html,
		});
	}

	async sendPortfolioNotification(
		to: string,
		portfolioName: string,
		frequency: HarvestNotificationFrequency,
	): Promise<void> {
		const subject = `TaxHarvest Portfolio Update - ${portfolioName}`;
		const html = `
      <h1>Portfolio Update: ${portfolioName}</h1>
      <p>This is your ${frequency.toLowerCase()} portfolio update from TaxHarvest.</p>
      <p>Log in to your account to view the latest tax harvesting opportunities and portfolio performance.</p>
      <a href="${this.configService.get('CLIENT_ORIGIN')}/main/home">View Your Portfolios</a>
    `;
		await this.sendEmail({
			to,
			subject,
			html,
		});
	}

	async sendWashSaleNotification(
		to: string,
		portfolioData: {
			id: string;
			name: string;
		},
		harvestTransactionItemData: {
			id: string;
			assetSymbol: string;
			orderType: OrderType;
			date: Date;
			quantity: Decimal;
		}[],
	): Promise<void> {
		const subject = `TaxHarvest Wash Sale Notification - ${portfolioData.name}`;
		const html = `
      <h1>Wash Sale Notification: ${portfolioData.name}</h1>
      <p>This is your wash sale notification from TaxHarvest. The following transactions have left the wash sale window and can be reverted:</p>
      <ul>
        ${harvestTransactionItemData
					.map(
						(item) => `
          <li>
            ${item.assetSymbol} ${item.orderType} ${item.date} ${item.quantity.toString()} Shares
          </li>
        `,
					)
					.join('')}
      </ul>
      <p>Log in to your account to view the latest tax harvesting opportunities and portfolio performance.</p>
      <a href="${this.configService.get('CLIENT_ORIGIN')}/main/home">View Your Portfolios</a>
    `;
		await this.sendEmail({
			to,
			subject,
			html,
		});
	}
}
