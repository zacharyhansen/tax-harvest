import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

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
		return this.prismaService
			.$extends(PrismaService.forPortfolio(portfolioId))
			.position.findMany({
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
