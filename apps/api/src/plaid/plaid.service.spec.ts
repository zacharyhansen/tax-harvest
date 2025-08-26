import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Test, type TestingModule } from '@nestjs/testing';
import { AuthSource, AuthType } from '@prisma/client';
import Decimal from 'decimal.js';
import type { AccountBase, Security } from 'plaid';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppModule } from '~/app/app.module';
import { CsvService } from '~/csv/csv.service';
import { findLotChangeSets, type LotChange } from './lot-application';
import { PlaidService } from './plaid.service';

describe('plaidService', () => {
	let csvService: CsvService;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		csvService = moduleFixture.get<CsvService>(CsvService);
	});

	// Find all test date directories in test folder
	const testDir = join(__dirname, 'test');
	const testDates = readdirSync(testDir).filter((dir) =>
		/^\d{4}-\d{2}-\d{2}$/.test(dir),
	); // Filter for YYYY-MM-DD format directories

	// Create a test for each date directory
	describe.each(testDates)('lot application for %s', (testDate) => {
		it('should process transactions and find matching lot combinations', async () => {
			const dateDir = join(testDir, testDate);
			const initialDir = join(dateDir, 'initial');
			const finalDir = join(dateDir, 'final');

			// Read the seed file
			const seedFile = join(initialDir, 'seed.csv');
			const csvContent = readFileSync(seedFile, 'utf8');

			// Parse the seed file to get lots
			const { records, lotSeededDate } = await csvService.etradeCSVToLots({
				content: csvContent,
			});
			if (!lotSeededDate) {
				throw new Error('Lot seeded date not found');
			}
			const lots = csvService.etradeTransformCSVRecords({ records });

			// Read the final API files
			const holdingsFile = join(finalDir, 'api_holdings.json');
			const transactionsFile = join(finalDir, 'api_transactions.json');

			// Parse JSON files
			const holdingsData = JSON.parse(readFileSync(holdingsFile, 'utf8'));
			const transactionsData = JSON.parse(
				readFileSync(transactionsFile, 'utf8'),
			);

			// Type guard interfaces for Plaid data
			interface HoldingsData {
				accounts: AccountBase[];
				securities: Security[];
				holdings: unknown[];
			}

			// Create mock auth connection for the test
			const mockAuthConnection = {
				id: 'test-auth-connection',
				userId: 'test-user',
				portfolioId: 'test-portfolio',
				source: AuthSource.PLAID,
				type: AuthType.PLAID_LINK,
				externalId: 'test-external-id',
				secret: 'test-secret',
				createdAt: new Date(),
				updatedAt: new Date(),
				verificationUrl: null,
				isSyncing: false,
				lastSyncStartedAt: null,
				lastSyncCompletedAt: null,
				lastSyncError: null,
				isConnected: true,
				authedAt: new Date(),
				syncedAt: new Date(),
				lastTransactionSyncedAtPlaid: new Date(),
				token: null,
				verifier: null,
				plaidInstitutionId: 'test-institution-id',
			};

			// Prepare data using PlaidService
			// 1. Convert holdings to position objects
			const typedHoldingsData = holdingsData as HoldingsData;

			const mockAccounts = PlaidService.convertPlaidAccounts({
				plaidAccounts: typedHoldingsData.accounts,
				plaidAuthConnection: mockAuthConnection,
			}).map((account) => ({
				...account,
				id: account.externalId ?? '',
				externalId: account.externalId ?? '',
				lotSeededDate,
			}));

			const assets = PlaidService.convertPlaidAssets({
				securities: typedHoldingsData.securities,
			});

			const positions = PlaidService.convertPlaidHoldings({
				holdingsResponse: holdingsData,
				// @ts-expect-error - mockAccounts is not a valid type
				accounts: mockAccounts,
			});

			// 2. Convert transactions - only take the lots that are not applied
			const transactions = PlaidService.convertPlaidTransactions({
				investmentsTransactionsGetResponse: transactionsData,
				accounts: mockAccounts,
				plaidAuthConnection: mockAuthConnection,
			});

			writeFileSync(
				join(dateDir, 'transactions.json'),
				JSON.stringify(transactions),
			);

			const { lotTupleMap } = PlaidService.lotDataMapFromLotsAndTransactions({
				// @ts-expect-error exact type is not needed for testing
				lots: lots.map((lot, index) => ({
					...lot,
					id: `l-${lot.assetSymbol}-${index}`,
					accountId: 'test-account',
				})),
				// @ts-expect-error exact type is not needed for testing
				transactions: transactions.map((t, index) => ({
					...t,
					assetSymbol: t.asset.connect?.symbol ?? '',
					id: `${index}-${t.asset.connect?.symbol}-${t.account.connect?.id}`,
				})),
				useTestLotId: true,
			});

			writeFileSync(
				join(dateDir, 'lotTupleMap.json'),
				JSON.stringify(Array.from(lotTupleMap.entries())),
			);

			const lotResults: [string, { lotChanges: LotChange[] }][] = Array.from(
				lotTupleMap.entries(),
			).map(([symbol, lotTuples]) => {
				const position = positions.find((p) => p.assetSymbol === symbol);

				return [
					symbol,
					findLotChangeSets(
						{
							lotsData: lotTuples,
							targetQuantity: position?.quantity
								? new Decimal(position.quantity as number)
								: undefined,
							targetValue: position?.costTotal
								? new Decimal(position.costTotal as number)
								: undefined,
							symbol,
						},
						'test-portfolio',
					),
				];
			});

			// Write the final positions to the output file
			// This is just for debugging and inspection purposes
			const finalPositionsFile = join(dateDir, 'finalPositions.json');
			writeFileSync(finalPositionsFile, JSON.stringify(lotResults));

			// Basic expectations to verify test ran
			expect(positions.length).toBeGreaterThan(0);
			expect(mockAccounts.length).toBeGreaterThan(0);
			expect(assets.length).toBeGreaterThan(0);
			expect(lotResults).toMatchSnapshot();
		});
	});
});
