import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PositionService {
  constructor(readonly prismaService: PrismaService) {}

  portfolioPositions({
    portfolioId,
    select,
  }: {
    portfolioId: string;
    select: Prisma.PositionSelect;
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
    });
  }
}
