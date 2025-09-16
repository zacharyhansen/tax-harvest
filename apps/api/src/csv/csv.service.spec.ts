import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Test, type TestingModule } from '@nestjs/testing';

import { CsvService } from './csv.service';
import lotRecordsFromEtradePortfolioDownload from './test/lotRecordsFromEtradePortfolioDownload.json';
import lotRecordsFromEtradePortfolioDownload_3 from './test/lotRecordsFromEtradePortfolioDownload_3.json';

describe('csvService', () => {
	let service: CsvService;

	beforeEach(async () => {
		const csvModule: TestingModule = await Test.createTestingModule({
			providers: [CsvService],
		}).compile();

		service = csvModule.get<CsvService>(CsvService);
	});

	it('should detect correct lot header line for etrade csv', () => {
		const content = readFileSync(
			resolve(__dirname, './test/etradePortfolioDownload.csv'),
			'utf-8',
		);
		expect(CsvService.etradeDetectLotHeaderLine(content)).toEqual(11);
	});

	it('should detect the correct lot seed date for etrade csv', () => {
		const content = readFileSync(
			resolve(__dirname, './test/etradePortfolioDownload.csv'),
			'utf-8',
		);

		expect(service.etradeLotSeededDate(content)?.toISOString()).toEqual(
			new Date('2024-10-28T04:30:00.000Z').toISOString(),
		);
	});

	it('should read etrade lot records', async () => {
		const content = CsvService.csvToString(
			resolve(__dirname, './test/etradePortfolioDownload.csv'),
		);
		const { records } = await service.etradeCSVToLots({
			content,
		});

		expect(records).toEqual(lotRecordsFromEtradePortfolioDownload);

		const content_3 = CsvService.csvToString(
			resolve(__dirname, './test/etradePortfolioDownload_3.csv'),
		);
		const { records: records_3 } = await service.etradeCSVToLots({
			content: content_3,
		});
		expect(records_3).toEqual(lotRecordsFromEtradePortfolioDownload_3);
	});

	describe('etradeTransformCSVRecords', () => {
		it('should transform valid etrade lot records with dates (no timezone)', () => {
			const records = service.etradeTransformCSVRecords({
				records: lotRecordsFromEtradePortfolioDownload,
			});
			expect(
				records.map((r) => ({
					...r,
					price: r.price.toFixed(4),
					remainingQty: r.remainingQty.toFixed(4),
					acquiredDate: r.acquiredDate.toISOString(),
				})),
			).toMatchSnapshot();

			const records_3 = service.etradeTransformCSVRecords({
				records: lotRecordsFromEtradePortfolioDownload_3,
			});

			expect(
				records_3.map((r) => ({
					...r,
					price: r.price.toFixed(4),
					remainingQty: r.remainingQty.toFixed(4),
					acquiredDate: r.acquiredDate.toISOString(),
				})),
			).toMatchSnapshot();
		});

		it('should transform records with timezone-aware dates when lotSeededDate is provided', () => {
			// Test with Eastern Time (ET) - during daylight saving time (EDT)
			const etLotSeededDate = new Date('2024-08-15T20:30:00-0400'); // EDT: UTC-4
			const testRecords = [
				{
					Symbol: 'AAPL',
					'Last Price $': '150.00',
					'Change $': '2.50',
					'Change %': '1.69',
					Quantity: '10.0000',
					'Price Paid $': '145.00',
					"Day's Gain $": '25.00',
					'Total Gain $': '50.00',
					'Total Gain %': '3.45',
					'Value $': '1500.00',
				},
				{
					Symbol: '05/10/2024', // This is the lot date
					'Last Price $': '150.00',
					'Change $': '2.50',
					'Change %': '1.69',
					Quantity: '5.0000',
					'Price Paid $': '140.00',
					"Day's Gain $": '50.00',
					'Total Gain $': '50.00',
					'Total Gain %': '7.14',
					'Value $': '750.00',
				},
			];

			const transformedRecords = service.etradeTransformCSVRecords({
				records: testRecords,
				lotSeededDate: etLotSeededDate,
			});

			expect(transformedRecords).toHaveLength(1);

			// The date should be May 10, 2024 at 12:00 PM in EDT
			// EDT is UTC-4, so 12:00 PM EDT = 16:00 UTC
			const expectedDate = new Date('2024-05-10T16:00:00.000Z');
			expect(transformedRecords[0].acquiredDate.getTime()).toBe(
				expectedDate.getTime(),
			);
			expect(transformedRecords[0].assetSymbol).toBe('AAPL');
		});

		it('should handle Pacific Time timezone correctly', () => {
			// Test with Pacific Time (PT) - during standard time (PST)
			const pstLotSeededDate = new Date('2024-01-15T21:30:00-0800'); // PST: UTC-8
			const testRecords = [
				{
					Symbol: 'MSFT',
					'Last Price $': '400.00',
					'Change $': '5.00',
					'Change %': '1.27',
					Quantity: '10.0000',
					'Price Paid $': '350.00',
					"Day's Gain $": '50.00',
					'Total Gain $': '500.00',
					'Total Gain %': '14.29',
					'Value $': '4000.00',
				},
				{
					Symbol: '12/25/2023', // Christmas day
					'Last Price $': '400.00',
					'Change $': '5.00',
					'Change %': '1.27',
					Quantity: '3.0000',
					'Price Paid $': '320.00',
					"Day's Gain $": '240.00',
					'Total Gain $': '240.00',
					'Total Gain %': '25.00',
					'Value $': '1200.00',
				},
			];

			const transformedRecords = service.etradeTransformCSVRecords({
				records: testRecords,
				lotSeededDate: pstLotSeededDate,
			});

			expect(transformedRecords).toHaveLength(1);

			// The date should be December 25, 2023 at 12:00 PM in PST
			// PST is UTC-8, so 12:00 PM PST = 20:00 UTC
			const expectedDate = new Date('2023-12-25T20:00:00.000Z');
			expect(transformedRecords[0].acquiredDate.getTime()).toBe(
				expectedDate.getTime(),
			);
			expect(transformedRecords[0].assetSymbol).toBe('MSFT');
		});

		it('should fallback to local timezone when no lotSeededDate is provided', () => {
			const testRecords = [
				{
					Symbol: 'GOOGL',
					'Last Price $': '2800.00',
					'Change $': '25.00',
					'Change %': '0.90',
					Quantity: '1.0000',
					'Price Paid $': '2500.00',
					"Day's Gain $": '25.00',
					'Total Gain $': '300.00',
					'Total Gain %': '12.00',
					'Value $': '2800.00',
				},
				{
					Symbol: '03/15/2024',
					'Last Price $': '2800.00',
					'Change $': '25.00',
					'Change %': '0.90',
					Quantity: '2.0000',
					'Price Paid $': '2400.00',
					"Day's Gain $": '50.00',
					'Total Gain $': '800.00',
					'Total Gain %': '16.67',
					'Value $': '5600.00',
				},
			];

			const transformedRecords = service.etradeTransformCSVRecords({
				records: testRecords,
				// No lotSeededDate provided
			});

			expect(transformedRecords).toHaveLength(1);

			// Without timezone info, should create local date at noon
			const expectedDate = new Date(2024, 2, 15, 12, 0, 0); // March 15, 2024 12:00 PM local
			expect(transformedRecords[0].acquiredDate.getTime()).toBe(
				expectedDate.getTime(),
			);
			expect(transformedRecords[0].assetSymbol).toBe('GOOGL');
		});

		it('should throw error when no dates are found in records', () => {
			const invalidRecords = [
				{
					Symbol: 'ABNB',
					'Last Price $': '139.1601',
					'Change $': '-0.14',
					'Change %': '-0.10',
					Quantity: '20.0000',
					'Price Paid $': '124.74',
					"Day's Gain $": '-2.7980',
					'Total Gain $': '288.4020',
					'Total Gain %': '11.5601',
					'Value $': '2783.2020',
				},
				{
					Symbol: 'AMD',
					'Last Price $': '157.595',
					'Change $': '-2.81',
					'Change %': '-1.75',
					Quantity: '175.0000',
					'Price Paid $': '102.888',
					"Day's Gain $": '-492.6250',
					'Total Gain $': '9573.7278',
					'Total Gain %': '53.1714',
					'Value $': '27579.1250',
				},
			];

			expect(() =>
				service.etradeTransformCSVRecords({ records: invalidRecords }),
			).toThrow(
				'Invalid CSV format: No lot dates found in the Symbol column. Please ensure you have expanded the lot details before downloading the CSV.',
			);
		});
	});

	it('should work end to end', async () => {
		const content = CsvService.csvToString(
			resolve(__dirname, './test/etradePortfolioDownload_2.csv'),
		);
		const { records, lotSeededDate } = await service.etradeCSVToLots({
			content,
		});
		expect(records).toMatchSnapshot();
		const finalRecords = service.etradeTransformCSVRecords({
			records,
			lotSeededDate,
		});

		expect(
			finalRecords.map((r) => ({
				...r,
				price: r.price.valueOf(),
				remainingQty: r.remainingQty.valueOf(),
				acquiredDate: r.acquiredDate.toISOString(),
			})),
		).toMatchSnapshot();
	});

	it('should work end to end with timezone-aware date parsing', async () => {
		const content = CsvService.csvToString(
			resolve(__dirname, './test/etradePortfolioDownload.csv'),
		);
		const { records, lotSeededDate } = await service.etradeCSVToLots({
			content,
		});

		// Ensure we got a lotSeededDate from the CSV
		expect(lotSeededDate).toBeDefined();
		expect(lotSeededDate?.toISOString()).toBe('2024-10-28T04:30:00.000Z');

		const finalRecords = service.etradeTransformCSVRecords({
			records,
			lotSeededDate,
		});

		// Verify that dates are properly timezone-adjusted
		// The lotSeededDate indicates EDT (UTC-4), so lot dates should be adjusted accordingly
		const firstRecord = finalRecords[0];
		expect(firstRecord).toBeDefined();

		// The hour should be adjusted for the EDT timezone (4 hours ahead of the seeded date)
		// Since we set lot dates to 12:00 PM in the CSV's timezone,
		// and EDT is UTC-4, the UTC time should be 16:00
		expect(firstRecord.acquiredDate.getUTCHours()).toBe(16);
	});
});
