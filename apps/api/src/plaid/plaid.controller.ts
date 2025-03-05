import {
  Controller,
  Logger,
  Post,
  type RawBodyRequest,
  Req,
  Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Public } from "../auth/decorators/public.decorator";
import { PlaidService } from "./plaid.service";

@Controller("plaid")
export class PlaidController {
  private readonly logger = new Logger(PlaidController.name);

  constructor(
    private readonly userService: PlaidService,
    private readonly configService: ConfigService,
  ) {}

  @Post("webhook")
  @Public()
  handleWebhook(@Req() request: RawBodyRequest<Request>, @Res() res: Response) {
    try {
      console.log("hit webhook");
      console.log({ clerkweb: request.rawBody?.toString("utf8") });

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

      //   return res.status(200).json({
      //     message: "Webhook processed successfully",
      //     success: true,
      //   });
      // } catch (error) {
      //   console.error("Webhook error:", error);
      //   return res.status(400).json({
      //     message: error,
      //     success: false,
      //   });
      return "ok";
    } catch (error) {
      console.error("Webhook error:", error);
      return "error";
    }
  }
}
