import { Module } from '@nestjs/common';

import { CsvModule } from '../csv/csv.module';
import { GoogleStorageModule } from '../google-storage/google-storage.module';
import { LotModule } from '../lot/lot.module';
import { LotUploadModule } from '../lot-upload/lot-upload.module';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';

@Module({
	imports: [GoogleStorageModule, CsvModule, LotModule, LotUploadModule],
	providers: [FileService, FileResolver],
})
export class FileModule {}
