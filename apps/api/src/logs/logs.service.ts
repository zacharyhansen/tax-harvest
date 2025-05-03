import type { Prisma } from '@prisma/client'
import type { PrismaService } from '../prisma/prisma.service'

import { Injectable } from '@nestjs/common'

@Injectable()
export class LogsService {
  constructor(private readonly prismaService: PrismaService) {}

  logs(args: Prisma.LogFindManyArgs) {
    return this.prismaService.log.findMany(args)
  }
}
