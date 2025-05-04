import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class LogsService {
  constructor(private readonly prismaService: PrismaService) {}

  logs(args: Prisma.LogFindManyArgs) {
    return this.prismaService.log.findMany(args)
  }
}
