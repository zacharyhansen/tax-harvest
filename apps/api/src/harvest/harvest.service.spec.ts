import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

import { DatabaseModule } from "~/database/database.module";
import { LotModule } from "~/lot/lot.module";

import { PrismaModule } from "../prisma/prisma.module";
import { HarvestService } from "./harvest.service";

describe("HarvestService", () => {
  let service: HarvestService;

  beforeEach(async () => {
    const moduleHarvest: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestService,
        {
          provide: ConfigService,
          useValue: new Map(), // Mock ConfigService directly
        },
      ],
      imports: [PrismaModule, LotModule, DatabaseModule],
      exports: [
        {
          provide: ConfigService,
          useValue: new Map(), // Mock ConfigService directly
        },
      ],
    }).compile();

    service = moduleHarvest.get<HarvestService>(HarvestService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
