import type { Prisma } from '@prisma/client'
import type { CsvService } from '../csv/csv.service'

import type { GoogleStorageService } from '../google-storage/google-storage.service'
import type { LotService } from '../lot/lot.service'
import type { PrismaService } from '../prisma/prisma.service'
import { Injectable } from '@nestjs/common'

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
    data: Prisma.FileCreateManyInput[]
    select: Prisma.FileSelect
  }) {
    const createdFiles = await this.prismaService.file.createManyAndReturn({
      data,
      select,
    })
    for (const file of createdFiles) {
      const fileContent = await this.googleStorageService.getGCPFileAsString({
        gcpFileName: file.gcpFilename,
      })
      await this.csvService
        .etradeCSVToLots({ content: fileContent })
        .then(({ records, lotSeededDate }) => {
          return {
            lots: this.csvService.etradeTransformCSVRecords({
              records,
            }),
            lotSeededDate,
          }
        })
        .then(({ lots, lotSeededDate }) => {
          return this.lotService.upsertLotsForAccount({
            accountId: file.accountId,
            lots: lots.map(
              lot =>
                ({
                  ...lot,
                  fileId: file.id,
                  price: lot.price.toString(),
                  remainingQty: lot.remainingQty.toString(),
                  accountId: file.accountId,
                }) satisfies Prisma.LotCreateManyInput,
            ),
            lotSeededDate,
            replace: true,
          })
        })
    }

    return createdFiles
  }
}
