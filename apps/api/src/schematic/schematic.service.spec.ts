import type { TestingModule } from "@nestjs/testing";

import { Test } from "@nestjs/testing";

import { SchematicService } from "./schematic.service";

describe("SchematicService", () => {
  let service: SchematicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchematicService],
    }).compile();

    service = module.get<SchematicService>(SchematicService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
