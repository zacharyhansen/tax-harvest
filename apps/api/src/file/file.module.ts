import { Module } from "@nestjs/common";

import { CsvModule } from "../csv/csv.module";
import { GoogleStorageModule } from "../google-storage/google-storage.module";
import { LotModule } from "../lot/lot.module";
import { FileService } from "./file.service";

@Module({
  imports: [GoogleStorageModule, CsvModule, LotModule],
  providers: [FileService],
})
export class FileModule {}
