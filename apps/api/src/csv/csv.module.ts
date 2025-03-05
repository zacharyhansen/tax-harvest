import { Module } from '@nestjs/common';

import { CsvService } from './csv.service';

@Module({
  exports: [CsvService],
  providers: [CsvService],
})
export class CsvModule {}
