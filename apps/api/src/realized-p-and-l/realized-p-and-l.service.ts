import { Injectable, Logger } from '@nestjs/common'
import { Prisma, RealizedPAndL } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class RealizedPandLService {
  private readonly logger = new Logger(RealizedPandLService.name)
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Fetch or create and return RealizedPAndL
   */
  async _realizedProfitAndLoss({
    accountId,
    select,
    year,
  }: {
    accountId: string
    year: number
    select: Prisma.RealizedPAndLSelect
  }): Promise<RealizedPAndL> {
    try {
      const realizedPAndL
        = await this.prismaService.realizedPAndL.findUniqueOrThrow({
          select,
          where: {
            accountId_year: {
              accountId,
              year,
            },
          },
        })
      return realizedPAndL
    }
    catch {
      return this.prismaService.$transaction(async (trx) => {
        await trx.account.update({
          data: {
            setRealizedValues: true,
          },
          where: {
            id: accountId,
          },
        })

        return trx.realizedPAndL.create({
          data: {
            account: {
              connect: {
                id: accountId,
              },
            },
            year,
          },
          select,
        })
      })
    }
  }
}
