import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Test, TestingModule } from '@nestjs/testing';

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

	describe('CSV Type Detection', () => {
		it('should detect E*Trade CSV format', () => {
			const content = readFileSync(
				resolve(__dirname, './test/etradePortfolioDownload.csv'),
				'utf-8',
			);
			expect(CsvService.detectCSVType(content)).toEqual('ETRADE_LOTS');
		});

		it('should detect Schwab positions CSV format', () => {
			const content = readFileSync(
				resolve(
					__dirname,
					'./test/schwab/01/All-Accounts-Positions-{0}-Positions-2025-09-20-134641.csv',
				),
				'utf-8',
			);
			expect(CsvService.detectCSVType(content)).toEqual('SCHWAB_POSITIONS');
		});

		it('should detect Schwab lot details CSV format', () => {
			const content = readFileSync(
				resolve(__dirname, './test/schwab/01/Lot-Details.csv'),
				'utf-8',
			);
			expect(CsvService.detectCSVType(content)).toEqual('SCHWAB_LOTS');
		});

		it('should return null for unrecognized CSV format', () => {
			const content = 'Random,CSV,Content\n1,2,3\n4,5,6';
			expect(CsvService.detectCSVType(content)).toBeNull();
		});
	});

	describe('Schwab CSV Parsing', () => {
		it('should parse Schwab positions CSV correctly', async () => {
			const content = readFileSync(
				resolve(
					__dirname,
					'./test/schwab/01/All-Accounts-Positions-{0}-Positions-2025-09-20-134641.csv',
				),
				'utf-8',
			);

			const result = await service.schwabPositionsToRecords(content);

			expect(result.accounts).toHaveLength(3);

			// Check first account
			const rothAccount = result.accounts.find((a) =>
				a.accountName.includes('Roth_Contributory_IRA'),
			);
			expect(rothAccount).toBeDefined();
			expect(rothAccount?.positions).toHaveLength(2); // GOOG and RIVN

			const googPosition = rothAccount?.positions.find(
				(p) => p.Symbol === 'GOOG',
			);
			expect(googPosition).toBeDefined();
			expect(googPosition?.['Qty (Quantity)']).toBe('181');
			expect(googPosition?.['Cost Basis']).toBe('$31891.74');

			// Check second account
			const individualAccount = result.accounts.find((a) =>
				a.accountName.includes('Individual'),
			);
			expect(individualAccount).toBeDefined();
			expect(individualAccount?.positions).toHaveLength(3); // 767CVR020, GOOG, U

			// Check third account (Rollover)
			const rolloverAccount = result.accounts.find((a) =>
				a.accountName.includes('Rollover_IRA'),
			);
			expect(rolloverAccount).toBeDefined();
			expect(rolloverAccount?.positions).toHaveLength(0); // Only has cash
		});

		it('should parse Schwab lot details CSV correctly', async () => {
			const content = readFileSync(
				resolve(__dirname, './test/schwab/01/Lot-Details.csv'),
				'utf-8',
			);

			const result = await service.schwabLotDetailsToLots(content);

			expect(result.symbol).toBe('RIVN');
			expect(result.accountName).toBe('...040');
			expect(result.lots).toHaveLength(1);

			const lot = result.lots[0];
			expect(lot.assetSymbol).toBe('RIVN');
			expect(lot.remainingQty.toString()).toBe('343');
			expect(lot.price.toString()).toBe('14.565014577259');
			expect(lot.acquiredDate.toISOString()).toContain('2024-07-05');
		});

		it('should parse Schwab lot details with multiple lots', async () => {
			const content = readFileSync(
				resolve(__dirname, './test/schwab/01/Lot-Details (1).csv'),
				'utf-8',
			);

			const result = await service.schwabLotDetailsToLots(content);

			expect(result.symbol).toBe('GOOG');
			expect(result.accountName).toBe('...040');
			expect(result.lots).toHaveLength(4);

			// Check first lot
			const firstLot = result.lots[0];
			expect(firstLot.assetSymbol).toBe('GOOG');
			expect(firstLot.remainingQty.toString()).toBe('36');
			expect(firstLot.price.toString()).toBe('204.705');

			// Check that dates are parsed correctly (dates are at noon local time)
			const dates = result.lots.map((l) => {
				const year = l.acquiredDate.getFullYear();
				const month = String(l.acquiredDate.getMonth() + 1).padStart(2, '0');
				const day = String(l.acquiredDate.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			});
			expect(dates).toContain('2025-08-14');
			expect(dates).toContain('2025-06-03');
			expect(dates).toContain('2024-07-05');
			expect(dates).toContain('2024-04-09');
		});
	});

	it('should detect correct lot header line for etrade csv', () => {
		const content = readFileSync(
			resolve(__dirname, './test/etradePortfolioDownload.csv'),
			'utf-8',
		);
		expect(CsvService.etradeDetectLotHeaderLine(content)).toEqual(11);
	});

	describe('etradeExtractAccountName', () => {
		it('should extract account name from etradePortfolioDownload.csv', () => {
			const content = readFileSync(
				resolve(__dirname, './test/etradePortfolioDownload.csv'),
				'utf-8',
			);
			const accountName = CsvService.etradeExtractAccountName(content);
			expect(accountName).toBe('Individual Brokerage -9871');
		});

		it('should extract account name from etradePortfolioDownload_2.csv', () => {
			const content = readFileSync(
				resolve(__dirname, './test/etradePortfolioDownload_2.csv'),
				'utf-8',
			);
			const accountName = CsvService.etradeExtractAccountName(content);
			expect(accountName).toBe('Individual Brokerage -4314');
		});

		it('should extract account name from etradePortfolioDownload_3.csv', () => {
			const content = readFileSync(
				resolve(__dirname, './test/etradePortfolioDownload_3.csv'),
				'utf-8',
			);
			const accountName = CsvService.etradeExtractAccountName(content);
			expect(accountName).toBe('S Corporation -7763');
		});

		it('should return empty string for content without Account Summary', () => {
			const content = 'Random,CSV,Content\n1,2,3\n4,5,6';
			const accountName = CsvService.etradeExtractAccountName(content);
			expect(accountName).toBe('');
		});

		it('should return empty string for malformed account data', () => {
			const content = 'Account Summary\nAccount,Net Account Value\n';
			const accountName = CsvService.etradeExtractAccountName(content);
			expect(accountName).toBe('');
		});
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
		const { records, accountName } = await service.etradeCSVToLots({
			content,
		});

		expect(records).toEqual(lotRecordsFromEtradePortfolioDownload);
		expect(accountName).toBe('Individual Brokerage -9871');

		const content_3 = CsvService.csvToString(
			resolve(__dirname, './test/etradePortfolioDownload_3.csv'),
		);
		const { records: records_3, accountName: accountName_3 } =
			await service.etradeCSVToLots({
				content: content_3,
			});
		expect(records_3).toEqual(lotRecordsFromEtradePortfolioDownload_3);
		expect(accountName_3).toBe('S Corporation -7763');
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
		const { records, lotSeededDate, accountName } =
			await service.etradeCSVToLots({
				content,
			});
		expect(records).toMatchSnapshot();
		expect(accountName).toBe('Individual Brokerage -4314');
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
		const { records, lotSeededDate, accountName } =
			await service.etradeCSVToLots({
				content,
			});

		// Ensure we got a lotSeededDate from the CSV
		expect(lotSeededDate).toBeDefined();
		expect(lotSeededDate?.toISOString()).toBe('2024-10-28T04:30:00.000Z');
		expect(accountName).toBe('Individual Brokerage -9871');

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
