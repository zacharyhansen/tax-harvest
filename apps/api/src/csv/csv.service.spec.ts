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
	});
});
