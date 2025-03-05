import { Test, TestingModule } from '@nestjs/testing';

import { HarvestService } from './harvest.service';

describe('HarvestService', () => {
  let service: HarvestService;

  beforeEach(async () => {
    const moduleHarvest: TestingModule = await Test.createTestingModule({
      providers: [HarvestService],
    }).compile();

    service = moduleHarvest.get<HarvestService>(HarvestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
