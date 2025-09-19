import { Test, type TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import type { ClerkClaims } from '../auth/types';
import {
	PerformanceTimeSpan,
	PositionPerformanceDataPoint,
	PositionPerformanceInput,
} from './portfolio-snapshot.dto';
import { PortfolioSnapshotResolver } from './portfolio-snapshot.resolver';
import { PortfolioSnapshotService } from './portfolio-snapshot.service';

describe('PortfolioSnapshotResolver', () => {
	let resolver: PortfolioSnapshotResolver;
	// biome-ignore lint/suspicious/noExplicitAny: <ok>
	let mockService: any;

	beforeEach(async () => {
		mockService = {
			getAccountPerformance: vi.fn().mockResolvedValue([]),
			getPositionPerformance: vi.fn().mockResolvedValue([]),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PortfolioSnapshotResolver,
				{ provide: PortfolioSnapshotService, useValue: mockService },
			],
		}).compile();

		resolver = module.get<PortfolioSnapshotResolver>(PortfolioSnapshotResolver);
	});

	describe('portfolioPerformanceByPosition', () => {
		it('should call service with correct parameters', async () => {
			const mockClaims: ClerkClaims = {
				metadata: {
					portfolioId: 'test-portfolio-id',
				},
			} as ClerkClaims;

			const input: PositionPerformanceInput = {
				timeSpan: PerformanceTimeSpan.SIX_MONTHS,
				symbols: ['AAPL', 'GOOGL'],
			};

			const expectedResult: PositionPerformanceDataPoint[] = [
				{
					date: '2024-01-01',
					portfolioTotal: 2000,
					positions: [
						{
							symbol: 'AAPL',
							value: 1200,
							shares: 10,
						},
						{
							symbol: 'GOOGL',
							value: 800,
							shares: 5,
						},
					],
				},
			];

			vi.spyOn(mockService, 'getPositionPerformance').mockResolvedValue(
				expectedResult,
			);

			const result = await resolver.portfolioPerformanceByPosition(
				mockClaims,
				input,
			);

			expect(mockService.getPositionPerformance).toHaveBeenCalledWith(
				'test-portfolio-id',
				input,
			);
			expect(result).toEqual(expectedResult);
		});

		it('should handle empty results', async () => {
			const mockClaims: ClerkClaims = {
				metadata: {
					portfolioId: 'test-portfolio-id',
				},
			} as ClerkClaims;

			const input: PositionPerformanceInput = {
				timeSpan: PerformanceTimeSpan.ALL,
			};

			vi.spyOn(mockService, 'getPositionPerformance').mockResolvedValue([]);

			const result = await resolver.portfolioPerformanceByPosition(
				mockClaims,
				input,
			);

			expect(result).toEqual([]);
		});
	});
});
