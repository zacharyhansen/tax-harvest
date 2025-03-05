import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { CsvService } from "../csv/csv.service";
import { GoogleStorageService } from "../google-storage/google-storage.service";
import { LotService } from "../lot/lot.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleStorageService: GoogleStorageService,
    private readonly csvService: CsvService,
    private readonly lotService: LotService,
  ) {}

  async createAndProcessFiles({
    data,
    select,
  }: {
    data: Prisma.FileCreateManyInput[];
    select: Prisma.FileSelect;
  }) {
    const createdFiles = await this.prismaService.file.createManyAndReturn({
      data,
      select: {
        ...select,
        gcpFilename: true,
        id: true,
      },
    });
    for (const file of createdFiles) {
      const fileContent = await this.googleStorageService.getGCPFileAsString({
        gcpFileName: file.gcpFilename,
      });
      await this.csvService
        .etradeCSVToLots({ content: fileContent })
        .then(records => {
          return this.csvService.etradeTransformCSVRecords({ records });
        })
        .then(lots => {
          return this.lotService.upsertLotsForAccount({
            accountId: file.accountId,
            lots: lots.map(lot => ({
              ...lot,
              fileId: file.id,
              price: lot.price.toString(),
              remainingQty: lot.remainingQty.toString(),
            })),
            replace: true,
          });
        });
    }

    return this.prismaService.file.createManyAndReturn({
      data,
      select,
    });
  }
}
