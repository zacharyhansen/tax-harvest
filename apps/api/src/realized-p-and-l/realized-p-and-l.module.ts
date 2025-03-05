import { Module } from "@nestjs/common";

import { RealizedPandLService } from "./realized-p-and-l.service";

@Module({
  exports: [RealizedPandLService],
  providers: [RealizedPandLService],
})
export class RealizedPandLModule {}
