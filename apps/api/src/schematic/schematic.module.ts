import { Module } from "@nestjs/common";

import { SchematicService } from "./schematic.service";

@Module({
  providers: [SchematicService],
  exports: [SchematicService],
})
export class SchematicModule {}
