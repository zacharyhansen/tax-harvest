import type { TestingModule } from "@nestjs/testing";

import { Test } from "@nestjs/testing";

import { DealLifecycleService } from "./deal-lifecycle.service";

describe("DealLifecycleService", () => {
  let service: DealLifecycleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DealLifecycleService],
    }).compile();

    service = module.get<DealLifecycleService>(DealLifecycleService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
