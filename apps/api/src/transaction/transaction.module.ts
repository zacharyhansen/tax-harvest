import { Module } from "@nestjs/common";

import { AuthConnectionModule } from "../auth-connection/auth-connection.module";
import { TransactionService } from "./transaction.service";

@Module({
  exports: [TransactionService],
  imports: [AuthConnectionModule],
  providers: [TransactionService],
})
export class TransactionModule {}
