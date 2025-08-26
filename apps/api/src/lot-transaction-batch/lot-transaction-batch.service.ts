import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LotTransactionBatchService {
	constructor(readonly _prismaService: PrismaService) {}
}
