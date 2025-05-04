import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class LotTransactionBatchService {
  constructor(private readonly prismaService: PrismaService) {}

  lotTransactionBatches(args: Prisma.LotTransactionBatchFindManyArgs) {
    return this.prismaService.lotTransactionBatch.findMany(args)
  }
}
