import { Controller, Get, HttpCode, Logger } from "@nestjs/common";

@Controller("health")
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  @Get()
  @HttpCode(200)
  run() {
    this.logger.log("Health endpoint called!");
    return { status: "ok" };
  }
}
