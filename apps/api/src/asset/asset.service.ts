import type { Prisma } from '@prisma/client'
import type { Database } from '../database/database'

import type { PrismaService } from '../prisma/prisma.service'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name)
  constructor(
    private readonly db: Database,
    private readonly prismaService: PrismaService,
  ) {}

  async getAssets(args: Prisma.AssetFindManyArgs) {
    return this.prismaService.asset.findMany(args)
  }

  async getAssetData(args: Prisma.AssetFindUniqueOrThrowArgs) {
    return this.prismaService.asset.findUniqueOrThrow(args)
  }

  distinctAssets() {
    return this.db
      .selectFrom('Asset')
      .select('Asset.symbol')
      .where('Asset.symbol', 'not in', ['CUR:USD'])
      .distinct()
      .execute()
  }
}
