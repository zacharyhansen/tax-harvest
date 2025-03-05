import { Module } from "@nestjs/common";

import { VectorGraphService } from "./vector-graph.service";

@Module({
  exports: [VectorGraphService],
  providers: [VectorGraphService],
})
export class VectorGraphModule {}
