import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";
import { LotService } from "./lot.service";

@Module({
  exports: [LotService],
  imports: [DatabaseModule],
  providers: [LotService],
})
export class LotModule {}
