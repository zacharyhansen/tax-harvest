import { Module } from "@nestjs/common";

import { TableService } from "./table.service";

@Module({
  providers: [TableService],
})
export class TableModule {}
