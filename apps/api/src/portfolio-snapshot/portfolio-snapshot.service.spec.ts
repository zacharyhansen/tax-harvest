/** biome-ignore-all lint/suspicious/noExplicitAny: <test file ok> */
import { Test, type TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { Database } from '../database/database';
import { PrismaService } from '../prisma/prisma.service';
import { PerformanceTimeSpan } from './portfolio-snapshot.dto';
import { PortfolioSnapshotService } from './portfolio-snapshot.service';

describe('PortfolioSnapshotService', () => {
	let service: PortfolioSnapshotService;
	let mockDb: any;
	let mockPrismaService: any;

	beforeEach(async () => {
		// Create mock implementations
		mockDb = {
			with: vi.fn().mockReturnThis(),
			selectFrom: vi.fn().mockReturnThis(),
			select: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			orderBy: vi.fn().mockReturnThis(),
			execute: vi.fn().mockResolvedValue([]),
		};

		mockPrismaService = {
			rlsPortfolioClient: vi.fn().mockReturnValue({
				account: {
					findMany: vi.fn().mockResolvedValue([]),
				},
			}),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PortfolioSnapshotService,
				{ provide: Database, useValue: mockDb },
				{ provide: PrismaService, useValue: mockPrismaService },
			],
		}).compile();

		service = module.get<PortfolioSnapshotService>(PortfolioSnapshotService);
	});

	describe('calculateStartDate', () => {
		it('should calculate correct start date for YTD', () => {
			const now = new Date();
			const startDate = (service as any).calculateStartDate(
				PerformanceTimeSpan.YTD,
			);

			expect(startDate.getMonth()).toBe(0); // January
			expect(startDate.getDate()).toBe(1); // 1st
			expect(startDate.getFullYear()).toBe(now.getFullYear());
		});

		it('should calculate correct start date for SIX_MONTHS', () => {
			const now = new Date();
			const startDate = (service as any).calculateStartDate(
				PerformanceTimeSpan.SIX_MONTHS,
			);

			const expectedMonth = now.getMonth() - 6;
			const _expectedYear =
				expectedMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
			const adjustedMonth =
				expectedMonth < 0 ? expectedMonth + 12 : expectedMonth;

			expect(startDate.getMonth()).toBe(adjustedMonth);
		});

		it('should calculate correct start date for ONE_YEAR', () => {
			const now = new Date();
			const startDate = (service as any).calculateStartDate(
				PerformanceTimeSpan.ONE_YEAR,
			);

			expect(startDate.getFullYear()).toBe(now.getFullYear() - 1);
		});

		it('should calculate correct start date for TWO_YEARS', () => {
			const now = new Date();
			const startDate = (service as any).calculateStartDate(
				PerformanceTimeSpan.TWO_YEARS,
			);

			expect(startDate.getFullYear()).toBe(now.getFullYear() - 2);
		});

		it('should calculate correct start date for ALL', () => {
			const startDate = (service as any).calculateStartDate(
				PerformanceTimeSpan.ALL,
			);

			expect(startDate.getFullYear()).toBe(2000);
		});
	});
});
