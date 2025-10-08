import { readFileSync } from 'node:fs';

import { Injectable } from '@nestjs/common';
import type { Lot, LotUploadFileType } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import Decimal from 'decimal.js';
import type { Insertable } from 'kysely';

export interface EtradeCSVLotRecord {
	Symbol: string;
	'Last Price $': string;
	'Change $': string;
	'Change %': string;
	Quantity: string;
	'Price Paid $': string;
	"Day's Gain $": string;
	'Total Gain $': string;
	'Total Gain %': string;
	'Value $': string;
}

export interface SchwabPositionRecord {
	Symbol: string;
	Description: string;
	'Qty (Quantity)': string;
	Price: string;
	'Price Chng $ (Price Change $)': string;
	'Price Chng % (Price Change %)': string;
	'Mkt Val (Market Value)': string;
	'Day Chng $ (Day Change $)': string;
	'Day Chng % (Day Change %)': string;
	'Cost Basis': string;
	'Gain $ (Gain/Loss $)': string;
	'Gain % (Gain/Loss %)': string;
	'Reinvest?': string;
	'Reinvest Capital Gains?': string;
	'Security Type': string;
}

export interface SchwabLotDetailRecord {
	'Open Date': string;
	Quantity: string;
	Price: string;
	'Cost/Share': string;
	'Market Value': string;
	'Cost Basis': string;
	'Gain/Loss ($)': string;
	'Gain/Loss (%)': string;
	'Holding Period': string;
}

@Injectable()
export class CsvService {
	/**
	 * Converts a CSV file to an array of JSON objects where each row in the CSV becomes an object.
	 * @param {string} filePath The path to the CSV file.
	 * @returns {any[]} An array of objects, each representing a row in the CSV.
	 */

	// biome-ignore lint/suspicious/noExplicitAny: <files types>
	static csvToJson(filePath: string): Promise<any[]> {
		const csvFile = readFileSync(filePath);
		const records = parse(csvFile, {
			columns: true,
			skip_empty_lines: true,
		});
		return records;
	}

	/**
	 * Transforms E*TRADE CSV lot records into a standardized format with timezone-aware date handling.
	 *
	 * @param records - Array of raw E*TRADE CSV lot records
	 * @param lotSeededDate - Optional date extracted from CSV generation timestamp, used for timezone correction
	 * @returns Array of transformed lot records with properly adjusted dates
	 *
	 * @example
	 * ```typescript
	 * const csvContent = "Generated at Aug 4 2025 08:51 PM ET...";
	 * const { records, lotSeededDate } = await service.etradeCSVToLots({ content: csvContent });
	 * const transformedRecords = service.etradeTransformCSVRecords({ records, lotSeededDate });
	 * // Dates will be adjusted to the timezone specified in the CSV (ET in this example)
	 * ```
	 *
	 * @remarks
	 * When lotSeededDate is provided, lot acquisition dates are parsed as 12:00 PM in the CSV's timezone.
	 * Without lotSeededDate, dates default to local system timezone.
	 * The CSV format expects lot dates in MM/DD/YYYY format within the Symbol column.
	 */
	etradeTransformCSVRecords({
		records,
		lotSeededDate,
	}: {
		records: EtradeCSVLotRecord[];
		lotSeededDate?: Date;
	}): {
		acquiredDate: Date;
		assetSymbol: string;
		price: Decimal;
		remainingQty: Decimal;
	}[] {
		// Check if any records contain dates
		const hasDateRecords = records.some((record) => {
			// Check if the Symbol field contains a valid date
			const possibleDate = new Date(record.Symbol);
			return (
				!Number.isNaN(possibleDate.getTime()) &&
				/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(record.Symbol)
			);
		});

		if (!hasDateRecords) {
			throw new Error(
				'Invalid CSV format: No lot dates found in the Symbol column. Please ensure you have expanded the lot details before downloading the CSV.',
			);
		}

		// Extract timezone offset from lotSeededDate if available
		let timezoneOffsetMinutes = 0;
		if (lotSeededDate) {
			timezoneOffsetMinutes = lotSeededDate.getTimezoneOffset();
		}

		const transformedRecords = [];
		let currentTicker = '';
		for (const record of records) {
			if (/^\D+$/.test(record.Symbol)) {
				currentTicker = record.Symbol;
			} else {
				// Parse the date string (MM/DD/YYYY format) and create timezone-aware date
				const dateStr = record.Symbol;
				const [month, day, year] = dateStr
					.split('/')
					.map((num) => parseInt(num, 10));

				// Create date at 12:00 PM (noon) in the CSV's timezone
				let acquiredDate: Date;
				if (lotSeededDate) {
					// Create date in UTC first, then adjust for the CSV's timezone
					const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
					// Apply the timezone offset from the lotSeededDate
					acquiredDate = new Date(
						utcDate.getTime() - timezoneOffsetMinutes * 60 * 1000,
					);
				} else {
					// Fallback to local timezone if no lotSeededDate available
					acquiredDate = new Date(year, month - 1, day, 12, 0, 0);
				}

				transformedRecords.push({
					acquiredDate,
					assetSymbol: currentTicker,
					price: new Decimal(record['Price Paid $']),
					remainingQty: new Decimal(record.Quantity),
				} satisfies Omit<
					Insertable<Lot>,
					| 'accountId'
					| 'id'
					| 'createdAt'
					| 'updatedAt'
					| 'excludeFromHarvest'
					| 'portfolioId'
				>);
			}
		}
		return transformedRecords;
	}

	async etradeCSVToLots({ content }: { content: string }): Promise<{
		records: EtradeCSVLotRecord[];
		lotSeededDate: Date | undefined;
		accountName: string;
	}> {
		const fromLine = CsvService.etradeDetectLotHeaderLine(content);
		const records: EtradeCSVLotRecord[] = [];

		const parser = parse(content, {
			columns: true, // Skip empty lines
			from_line: fromLine, // Use first parsed row as headers
			skip_empty_lines: true, // Dynamically detected starting line
			skipRecordsWithError: true,
			trim: true,
		});

		try {
			for await (const record of parser) {
				records.push(record);
			}
		} catch (error) {
			// Type guard to check if `error` is an instance of `Error`
			if (
				error instanceof Error &&
				error.message.includes('Invalid Record Length')
			) {
				console.error(
					'Parsing stopped: Invalid Record Length error encountered.',
				);
			} else {
				throw error; // Rethrow if it's a different error
			}
		}

		const lotSeededDate = this.etradeLotSeededDate(content);
		const accountName = CsvService.etradeExtractAccountName(content);

		return { records, lotSeededDate, accountName };
	}

	etradeLotSeededDate(content: string) {
		// Extract generation date
		const lines = content.split('\n');
		let lotSeededDate: Date | undefined;
		for (const line of lines) {
			const match = line.match(
				/Generated at ([A-Za-z]+ \d+ \d{4} \d+:\d+ [AP]M) ([A-Z]{2,4})/,
			);
			if (match) {
				const dateStr = match[1];
				const timezone = match[2];
				try {
					// Map common timezone abbreviations to their offsets
					const timezoneOffsets: Record<string, string> = {
						ET: '-0400', // EDT
						EST: '-0500',
						EDT: '-0400',
						CT: '-0500', // CDT
						CST: '-0600',
						CDT: '-0500',
						MT: '-0600', // MDT
						MST: '-0700',
						MDT: '-0600',
						PT: '-0700', // PDT
						PST: '-0800',
						PDT: '-0700',
					};

					let offset = timezoneOffsets[timezone];

					// If it's ET/CT/MT/PT, check if we need to use standard time
					if (['ET', 'CT', 'MT', 'PT'].includes(timezone)) {
						const parsedDate = new Date(dateStr);
						const month = parsedDate.getMonth(); // 0-11
						// If month is in standard time period (Nov-Mar)
						if (month >= 10 || month <= 2) {
							offset = timezoneOffsets[`${timezone}ST`]; // Use standard time offset
						}
					}

					if (offset) {
						lotSeededDate = new Date(`${dateStr} GMT${offset}`);
					} else {
						// If we don't recognize the timezone, try parsing without offset
						console.warn(
							`Unknown timezone: ${timezone}, parsing without offset`,
						);
						lotSeededDate = new Date(dateStr);
					}

					if (Number.isNaN(lotSeededDate.getTime())) {
						throw new TypeError('Invalid date');
					}
				} catch {
					console.error(
						'Failed to parse date:',
						dateStr,
						'with timezone:',
						timezone,
					);
					lotSeededDate = undefined;
				}
				break;
			}
		}
		return lotSeededDate;
	}

	static etradeDetectLotHeaderLine(fileContent: string): number {
		const lines = fileContent.split('\n');

		// Find the line containing "Symbol" (case-insensitive) followed by a non-empty line
		const headerLineIndex = lines.findIndex((line, index) => {
			const isSymbolLine = /symbol/i.test(line); // Case-insensitive match for "Symbol"
			const nextLineFirstCell = lines[index + 1]?.split(',')[0].trim(); // Check only the first cell of the next line
			const hasNextLineContent = nextLineFirstCell && nextLineFirstCell !== '';
			return isSymbolLine && hasNextLineContent;
		});

		// Return line number + 1 for `from_line` (since csv-parse uses 1-based indexing)
		return headerLineIndex === -1 ? -1 : headerLineIndex + 1;
	}

	/**
	 * Extracts the account name from E*TRADE CSV content.
	 * The account name is found in the "Account Summary" section on line 3.
	 * @param content - The CSV content as a string
	 * @returns The extracted account name, or empty string if not found
	 * @example
	 * ```typescript
	 * const csvContent = 'Account Summary\nAccount,Net Account Value,...\n"Individual Brokerage -9871",192946.27,...';
	 * const accountName = CsvService.etradeExtractAccountName(csvContent);
	 * // Returns: "Individual Brokerage -9871"
	 * ```
	 */
	static etradeExtractAccountName(content: string): string {
		const lines = content.split('\n');

		// The account name is typically on line 3 (index 2) in the format:
		// "Account Name -XXXX",value1,value2,...
		// First, verify we have an Account Summary section
		const hasAccountSummary = lines.some((line) =>
			line.includes('Account Summary'),
		);

		if (!hasAccountSummary) {
			return '';
		}

		// Find the line with Account header (line 2)
		const accountHeaderIndex = lines.findIndex((line) =>
			/^Account,/.test(line),
		);

		if (accountHeaderIndex === -1 || accountHeaderIndex + 1 >= lines.length) {
			return '';
		}

		// The account data is on the next line
		const accountDataLine = lines[accountHeaderIndex + 1];

		// Extract the first cell which contains the account name
		// It may be quoted, so we need to handle that
		const match = accountDataLine.match(/^"([^"]+)"/);
		if (match) {
			return match[1];
		}

		// If not quoted, extract up to the first comma
		const firstCommaIndex = accountDataLine.indexOf(',');
		if (firstCommaIndex > 0) {
			return accountDataLine.substring(0, firstCommaIndex).trim();
		}

		return '';
	}

	static csvToString(filePath: string): string {
		return readFileSync(filePath, 'utf8');
	}

	/**
	 * Detects the type of CSV file based on its content
	 * @param content - The CSV content as a string
	 * @returns The detected CSV file type or null if unrecognized
	 * @example
	 * ```typescript
	 * const csvType = CsvService.detectCSVType(csvContent);
	 * if (csvType === 'ETRADE_LOTS') {
	 *   // Process as E*Trade lots file
	 * }
	 * ```
	 */
	static detectCSVType(content: string): LotUploadFileType | null {
		const lines = content.split('\n').slice(0, 30); // Check first 30 lines

		// Check for E*Trade CSV markers
		if (
			lines.some((line) => line.includes('Account Summary')) &&
			lines.some((line) => line.includes('Price Paid $')) &&
			lines.some((line) => /Symbol.*Last Price \$.*Change \$/.test(line))
		) {
			return 'ETRADE_LOTS';
		}

		// Check for Schwab Positions CSV markers
		if (
			lines.some((line) => line.includes('Positions for')) &&
			lines.some((line) =>
				/Symbol.*Qty \(Quantity\).*Cost Basis.*Security Type/.test(line),
			)
		) {
			return 'SCHWAB_POSITIONS';
		}

		// Check for Schwab Lot Details CSV markers
		if (
			lines.some((line) => line.includes('Lot Details for')) &&
			lines.some((line) =>
				/Open Date.*Quantity.*Cost\/Share.*Holding Period/.test(line),
			)
		) {
			return 'SCHWAB_LOTS';
		}

		return null;
	}

	/**
	 * Parses Schwab positions CSV and returns structured data
	 * @param content - The CSV content as a string
	 * @returns Object containing parsed positions and account information
	 */
	async schwabPositionsToRecords(content: string): Promise<{
		accounts: Array<{
			accountName: string;
			positions: SchwabPositionRecord[];
		}>;
		generatedAt?: Date;
	}> {
		const lines = content.split('\n');
		const accounts: Array<{
			accountName: string;
			positions: SchwabPositionRecord[];
		}> = [];

		// Extract generation date if available
		let generatedAt: Date | undefined;
		const firstLine = lines[0];
		const dateMatch = firstLine.match(
			/as of (\d{2}:\d{2} [AP]M [A-Z]{2,3}), (\d{2}\/\d{2}\/\d{4})/,
		);
		if (dateMatch) {
			try {
				generatedAt = new Date(`${dateMatch[2]} ${dateMatch[1]}`);
			} catch {
				// Ignore parse errors
			}
		}

		let currentAccount: string | null = null;
		let currentPositions: SchwabPositionRecord[] = [];
		let headerLineIndex = -1;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			// Skip empty lines and lines with just commas
			if (!line || line.trim() === '' || /^[",\s]+$/.test(line)) {
				continue;
			}

			// Check for account name (e.g., "Roth_Contributory_IRA ...040","","",...)
			// Account names appear as first cell followed by empty cells
			if (
				!line.startsWith('"Symbol') &&
				!line.startsWith('"Positions') &&
				!line.startsWith('"Account Total') &&
				!line.startsWith('"Cash')
			) {
				// Try to parse first cell
				const firstCellMatch = line.match(/^"([^"]+)"/);
				if (firstCellMatch) {
					const potentialAccount = firstCellMatch[1].trim();
					// Verify it's an account name pattern (contains underscore or dots)
					// and the rest of the line is empty cells
					if (
						(potentialAccount.includes('_') ||
							potentialAccount.includes('...')) &&
						line.includes('","","","')
					) {
						// Save previous account if exists
						if (currentAccount) {
							accounts.push({
								accountName: currentAccount,
								positions: currentPositions,
							});
						}
						currentAccount = potentialAccount;
						currentPositions = [];
						headerLineIndex = -1;
					}
				}
			}

			// Check for header line
			if (line.includes('"Symbol"') && line.includes('Security Type')) {
				headerLineIndex = i;
				continue;
			}

			// Parse position data
			if (headerLineIndex >= 0 && i > headerLineIndex && currentAccount) {
				// Skip totals and cash lines
				if (
					line.includes('"Account Total') ||
					line.includes('"Cash & Cash Investments')
				) {
					continue;
				}

				try {
					const records = parse(line, {
						columns: [
							'Symbol',
							'Description',
							'Qty (Quantity)',
							'Price',
							'Price Chng $ (Price Change $)',
							'Price Chng % (Price Change %)',
							'Mkt Val (Market Value)',
							'Day Chng $ (Day Change $)',
							'Day Chng % (Day Change %)',
							'Cost Basis',
							'Gain $ (Gain/Loss $)',
							'Gain % (Gain/Loss %)',
							'Reinvest?',
							'Reinvest Capital Gains?',
							'Security Type',
						],
						skip_empty_lines: true,
						trim: true,
						relax_quotes: true,
					});

					if (records?.[0]?.Symbol && !records[0].Symbol.includes('--')) {
						currentPositions.push(records[0]);
					}
				} catch {
					// Skip unparseable lines
				}
			}
		}

		// Save last account (even if no positions - might be cash only)
		if (currentAccount) {
			accounts.push({
				accountName: currentAccount,
				positions: currentPositions,
			});
		}

		return { accounts, generatedAt };
	}

	/**
	 * Parses Schwab lot detail CSV and returns structured lot data
	 * @param content - The CSV content as a string
	 * @returns Object containing parsed lots and metadata
	 */
	async schwabLotDetailsToLots(content: string): Promise<{
		symbol: string;
		accountName: string;
		lots: Array<{
			acquiredDate: Date;
			assetSymbol: string;
			price: Decimal;
			remainingQty: Decimal;
		}>;
		generatedAt?: Date;
	}> {
		const lines = content.split('\n');

		// Extract symbol and account from first line
		// Format: "RIVN Lot Details for ...040 as of 01:44 PM ET, 09/20/2025"
		const firstLine = lines[0];
		const symbolMatch = firstLine.match(/^"?([A-Z]+) Lot Details/);
		const accountMatch = firstLine.match(/for\s+([^"]+)\s+as of/);

		const symbol = symbolMatch?.[1] || '';
		const accountName = accountMatch?.[1]?.trim() || '';

		// Extract generation date
		let generatedAt: Date | undefined;
		const dateMatch = firstLine.match(
			/as of (\d{2}:\d{2} [AP]M [A-Z]{2,3}), (\d{2}\/\d{2}\/\d{4})/,
		);
		if (dateMatch) {
			try {
				generatedAt = new Date(`${dateMatch[2]} ${dateMatch[1]}`);
			} catch {
				// Ignore parse errors
			}
		}

		// Find header line
		const headerLineIndex = lines.findIndex((line) =>
			line.includes('Open Date'),
		);

		if (headerLineIndex === -1) {
			return { symbol, accountName, lots: [], generatedAt };
		}

		const lots: Array<{
			acquiredDate: Date;
			assetSymbol: string;
			price: Decimal;
			remainingQty: Decimal;
		}> = [];

		// Parse lot records
		for (let i = headerLineIndex + 1; i < lines.length; i++) {
			const line = lines[i];

			// Skip total line and empty lines
			if (line.startsWith('"Total') || line.trim() === '' || line === '""') {
				continue;
			}

			try {
				const record = parse(line, {
					columns: [
						'Open Date',
						'Quantity',
						'Price',
						'Cost/Share',
						'Market Value',
						'Cost Basis',
						'Gain/Loss ($)',
						'Gain/Loss (%)',
						'Holding Period',
					],
					skip_empty_lines: true,
					trim: true,
				})[0] as SchwabLotDetailRecord;

				if (record?.['Open Date']) {
					// Parse date (MM/DD/YYYY format)
					const [month, day, year] = record['Open Date']
						.split('/')
						.map((n) => parseInt(n, 10));
					const acquiredDate = new Date(year, month - 1, day, 12, 0, 0);

					lots.push({
						acquiredDate,
						assetSymbol: symbol,
						price: new Decimal(record['Cost/Share'].replace(/[$,]/g, '')),
						remainingQty: new Decimal(record.Quantity.replace(/,/g, '')),
					});
				}
			} catch {
				// Skip unparseable lines
			}
		}

		return { symbol, accountName, lots, generatedAt };
	}
}
