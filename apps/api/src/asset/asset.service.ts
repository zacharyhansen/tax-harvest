import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { Database } from '../database/database';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetService {
	constructor(
		private readonly db: Database,
		private readonly prismaService: PrismaService,
	) {}

	async getAssets(args: Prisma.AssetFindManyArgs) {
		return this.prismaService.asset.findMany(args);
	}

	async getAssetData(args: Prisma.AssetFindUniqueOrThrowArgs) {
		return this.prismaService.asset.findUniqueOrThrow(args);
	}

	distinctAssets() {
		return this.db
			.selectFrom('Asset')
			.select('Asset.symbol')
			.where('Asset.symbol', 'not in', ['CUR:USD'])
			.distinct()
			.execute();
	}
}
