import { Module } from "@nestjs/common";

import { LotModule } from "../lot/lot.module";
import { HarvestService } from "./harvest.service";

@Module({
  exports: [HarvestService],
  imports: [LotModule],
  providers: [HarvestService],
})
export class HarvestModule {}
