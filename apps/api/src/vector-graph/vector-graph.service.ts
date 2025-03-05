import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class VectorGraphService {
  constructor(readonly prismaService: PrismaService) {}
}
