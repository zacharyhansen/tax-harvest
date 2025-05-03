import { Module } from '@nestjs/common'

import { VectorGraphResolver } from './vector-graph.resolver'
import { VectorGraphService } from './vector-graph.service'

@Module({
  exports: [VectorGraphService],
  providers: [VectorGraphService, VectorGraphResolver],
})
export class VectorGraphModule {}
