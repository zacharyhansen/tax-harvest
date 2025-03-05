import { Module } from "@nestjs/common";

import { AuthConnectionModule } from "../auth-connection/auth-connection.module";
import { RealizedPandLModule } from "../realized-p-and-l/realized-p-and-l.module";
import { AccountService } from "./account.service";

@Module({
  exports: [AccountService],
  imports: [AuthConnectionModule, RealizedPandLModule],
  providers: [AccountService],
})
export class AccountModule {}
