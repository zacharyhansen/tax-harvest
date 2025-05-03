import type { PrismaService } from '../prisma/prisma.service'

import { Injectable } from '@nestjs/common'

@Injectable()
export class VectorGraphService {
  constructor(readonly prismaService: PrismaService) {}
}
