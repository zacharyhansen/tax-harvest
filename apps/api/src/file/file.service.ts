import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { CsvService } from '../csv/csv.service'
import { GoogleStorageService } from '../google-storage/google-storage.service'
import { LotService } from '../lot/lot.service'
import { PrismaService } from '../prisma/prisma.service'
import { InitFileUploadPayload } from './file.resolver'

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
    portfolioId,
  }: {
    data: Prisma.FileCreateManyInput[]
    select: Prisma.FileSelect
    portfolioId: string
  }) {
    const createdFiles = await this.prismaService.$extends(this.prismaService.forPortfolio(portfolioId)).file.createManyAndReturn({
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
                  portfolioId,
                }) satisfies Prisma.LotCreateManyInput,
            ),
            lotSeededDate,
            replace: true,
            portfolioId,
          })
        })
    }

    return createdFiles
  }

  async initAccountFileUpload({
    accountCreateInput,
    fileData,
    select,
    portfolioId,
    userId,
  }: {
    accountCreateInput: Prisma.AccountCreateInput
    fileData: InitFileUploadPayload[]
    select: Prisma.FileSelect
    portfolioId: string
    userId: string
  }) {
    const account = await this.prismaService.$extends(this.prismaService.forPortfolio(portfolioId)).account.create({
      data: accountCreateInput,
    })
    return this.createAndProcessFiles({
      data: fileData.map(file => ({
        ...file,
        uploadedBy: userId,
        accountId: account.id,
        portfolioId,
      })),
      select,
      portfolioId,
    })
  }
}
