import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { Public } from '../auth/decorators/public.decorator';
import type { PlaidWebhook } from './constants/plaid.dto';
import { PlaidService } from './plaid.service';

@Controller('plaid')
export class PlaidController {
	private readonly logger = new Logger(PlaidController.name);

	constructor(private readonly plaidService: PlaidService) {}
	// switch (evt.type) {
	//   case 'user.created':
	//     this.logger.log(`Clerk user create event for ${evt.data.id}`);
	//     break;
	//   case 'user.updated':
	//     this.logger.log(`Clerk user update event for ${evt.data.id}`);

	//     // Handle user update
	//     await this.userService.updateUser({
	//       data: {
	//         email,
	//         id: evt.data.id,
	//         name,
	//         phoneNumber,
	//         photo: evt.data.image_url,
	//       },
	//       where: {
	//         id: evt.data.id,
	//       },
	//     });
	//     break;
	// }
	@Post('webhook')
	@Public()
	async handleWebhook(@Body() body: PlaidWebhook, @Res() res: FastifyReply) {
		try {
			this.logger.log('Processing Plaid webhook:', body);

			switch (body.webhook_type) {
				// Only trigger on investments transactions webhook (not holdings updates as those may be out of date)
				case 'INVESTMENTS_TRANSACTIONS': {
					await this.plaidService.processWebhook(body);
					this.logger.log('Successfully processed Plaid webhook:', body);
					break;
				}
				default: {
					this.logger.warn(`Unhandled webhook type: ${body.webhook_type}`);
				}
			}

			return res.code(200).send();
		} catch (error) {
			this.logger.error('Webhook processing error:', error);
			return res.code(400).send({
				message: 'Failed to process webhook',
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		}
	}
}
