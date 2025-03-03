import { Module } from "@nestjs/common";

import { DatasetService } from "./dataset.service";

@Module({
  providers: [DatasetService],
  exports: [DatasetService],
})
export class DatasetModule {}
