import type { Prisma } from '@prisma/client'
import type { PrismaService } from '../prisma/prisma.service'

import { Injectable } from '@nestjs/common'

@Injectable()
export class PositionService {
  constructor(readonly prismaService: PrismaService) {}

  portfolioPositions({
    portfolioId,
    select,
  }: {
    portfolioId: string
    select: Prisma.PositionSelect
  }) {
    return this.prismaService.position.findMany({
      select,
      where: {
        account: {
          portfolio: {
            id: portfolioId,
          },
        },
      },
    })
  }
}
