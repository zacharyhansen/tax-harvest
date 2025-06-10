/* eslint-disable ts/ban-ts-comment */
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
    portfolioId,
  }: {
    accountId: string
    year: number
    select: Prisma.RealizedPAndLSelect
    portfolioId: string
  }): Promise<RealizedPAndL> {
    try {
      const realizedPAndL
      // @ts-ignore - ignore types
        = await this.prismaService.$extends(this.prismaService.forPortfolio(portfolioId)).realizedPAndL.findUniqueOrThrow({
          select: select as Prisma.RealizedPAndLSelect,
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
      return this.prismaService.$extends(this.prismaService.forPortfolio(portfolioId)).$transaction(async (trx) => {
        await trx.account.update({
          data: {
            setRealizedValues: true,
          },
          where: {
            id: accountId,
          },
        })
        // @ts-ignore - ignore types
        return trx.realizedPAndL.create({
          data: {
            account: {
              connect: {
                id: accountId,
              },
            },
            portfolio: {
              connect: {
                id: portfolioId,
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
