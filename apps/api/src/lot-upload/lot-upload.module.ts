import { Module } from '@nestjs/common';
import { PositionModule } from '~/position/position.module';
import { CsvService } from '../csv/csv.service';
import { GoogleStorageModule } from '../google-storage/google-storage.module';
import { LotModule } from '../lot/lot.module';
import { PrismaModule } from '../prisma/prisma.module';
import { LotUploadResolver } from './lot-upload.resolver';
import { LotUploadService } from './lot-upload.service';

@Module({
	imports: [PrismaModule, GoogleStorageModule, LotModule, PositionModule],
	providers: [LotUploadService, LotUploadResolver, CsvService],
	exports: [LotUploadService],
})
export class LotUploadModule {}
