import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { Database } from '~/database/database';
import { LotService } from '~/lot/lot.service';
import { PolygonService } from '~/polygon/polygon.service';
import { PrismaService } from '~/prisma/prisma.service';
import { HarvestService } from './harvest.service';

describe('harvestService', () => {
	let service: HarvestService;

	beforeEach(async () => {
		const moduleHarvest: TestingModule = await Test.createTestingModule({
			providers: [
				HarvestService,
				{
					provide: ConfigService,
					useValue: { get: vi.fn() }, // A minimal mock
				},
				{
					provide: PolygonService,
					useValue: { someMethod: vi.fn() }, // Mock PolygonService
				},
				{
					provide: Database,
					useValue: { query: vi.fn() }, // Mock DB if needed
				},
				{
					provide: PrismaService,
					useValue: { query: vi.fn() }, // Mock DB if needed
				},
				{
					provide: LotService,
					useValue: { query: vi.fn() }, // Mock DB if needed
				},
			],
		}).compile();

		service = moduleHarvest.get<HarvestService>(HarvestService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
