import type { Prisma } from '@prisma/client'
import type { PrismaService } from '../prisma/prisma.service'

import { Injectable } from '@nestjs/common'

@Injectable()
export class LotTransactionBatchService {
  constructor(private readonly prismaService: PrismaService) {}

  lotTransactionBatches(args: Prisma.LotTransactionBatchFindManyArgs) {
    return this.prismaService.lotTransactionBatch.findMany(args)
  }
}
