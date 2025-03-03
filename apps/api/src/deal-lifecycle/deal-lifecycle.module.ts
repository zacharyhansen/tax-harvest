import { Module } from "@nestjs/common";

import { DealLifecycleService } from "./deal-lifecycle.service";

@Module({
  providers: [DealLifecycleService],
})
export class DealLifecycleModule {}
