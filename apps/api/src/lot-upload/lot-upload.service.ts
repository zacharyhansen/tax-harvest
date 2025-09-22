import { notEqual } from 'node:assert';
import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { CsvService } from '../csv/csv.service';
import { GoogleStorageService } from '../google-storage/google-storage.service';
import { LotService } from '../lot/lot.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service for managing staged lot uploads from various providers (E*Trade, Schwab, etc.)
 * Handles multi-file uploads, validation, and application of lots to accounts
 */
@Injectable()
export class LotUploadService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly csvService: CsvService,
		private readonly lotService: LotService,
		private readonly googleStorageService: GoogleStorageService,
	) {}

	/**
	 * Initializes a lot upload for Schwab positions file
	 * Creates LotUpload and LotUploadFile entries for each position
	 * @param params - Upload initialization parameters
	 * @returns Created lot upload with file placeholders
	 */
	async initSchwabPositionsUpload({
		content,
		accountId,
		portfolioId,
		fileId,
	}: {
		content: string;
		accountId: string;
		portfolioId: string;
		fileId: string;
	}) {
		const { accounts } =
			await this.csvService.schwabPositionsToRecords(content);

		// Find the account in the parsed data
		const accountData = accounts[0]; // For now, assuming first account
		if (!accountData) {
			throw new Error('No account data found in Schwab positions file');
		}

		// Get unique symbols that need lot detail files
		const symbols = new Set(
			accountData.positions
				.filter((p) => p['Security Type'] === 'Equity')
				.map((p) => p.Symbol),
		);

		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.$transaction(async (trx) => {
				// Create the lot upload
				const lotUpload = await trx.lotUpload.create({
					data: {
						portfolioId,
						accountId,
						fileId,
						supportedAccountLotProvider: 'SCHWAB',
						applied: false,
					},
				});

				// Create the positions file entry
				await trx.lotUploadFile.create({
					data: {
						portfolioId,
						accountId,
						fileId,
						type: 'SCHWAB_POSITIONS',
						lotUploadId: lotUpload.id,
					},
				});

				// Create placeholder entries for each lot detail file needed
				const lotFileEntries = [];
				for (const _symbol of symbols) {
					lotFileEntries.push({
						portfolioId,
						accountId,
						fileId: null, // Will be filled when file is uploaded
						type: 'SCHWAB_LOTS' as const,
						lotUploadId: lotUpload.id,
					});
				}

				if (lotFileEntries.length > 0) {
					await trx.lotUploadFile.createMany({
						data: lotFileEntries,
					});
				}

				return lotUpload;
			});
	}

	async getLotUploadWithFiles({
		lotUploadId,
		portfolioId,
	}: {
		lotUploadId: string;
		portfolioId: string;
	}) {
		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotUpload.findUniqueOrThrow({
				where: { id: lotUploadId },
				include: {
					LotUploadFile: {
						include: {
							file: true,
						},
					},
				},
			});
	}

	/**
	 * Validates and applies a lot upload to an account
	 * For E*Trade: Immediately processes and applies lots
	 * For Schwab: Validates all files are present, then processes and applies
	 * @param params - Application parameters
	 */
	async applyLotUpload({
		lotUploadId,
		portfolioId,
	}: {
		lotUploadId: string;
		portfolioId: string;
	}) {
		const lotUpload = await this.getLotUploadWithFiles({
			lotUploadId,
			portfolioId,
		});

		// Validate based on provider
		if (lotUpload.supportedAccountLotProvider === 'SCHWAB') {
			await this.applySchwabLotUpload(lotUpload, portfolioId);
		} else if (lotUpload.supportedAccountLotProvider === 'ETRADE') {
			await this.applyEtradeLotUpload(lotUpload, portfolioId);
		} else {
			throw new Error(
				`Unsupported provider: ${lotUpload.supportedAccountLotProvider}`,
			);
		}

		// Mark as applied
		await this.prismaService.rlsPortfolioClient(portfolioId).lotUpload.update({
			where: { id: lotUploadId },
			data: { applied: true },
		});

		await this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotUpload.updateMany({
				where: {
					id: {
						not: lotUploadId,
					},
				},
				data: { applied: false },
			});
	}

	async lotUpload({
		portfolioId,
		accountId,
		select,
	}: {
		portfolioId: string;
		accountId: string;
		select: Prisma.LotUploadSelect;
	}) {
		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotUpload.findMany({
				where: { accountId },
				select,
				orderBy: {
					createdAt: 'desc',
				},
			});
	}

	/**
	 * Applies Schwab lot upload after validating all files are present
	 */
	private async applySchwabLotUpload(
		lotUpload: Awaited<ReturnType<typeof this.getLotUploadWithFiles>>,
		portfolioId: string,
	) {
		// Check that all SCHWAB_LOTS files have been uploaded
		const missingFiles = lotUpload.LotUploadFile.filter(
			(f) => f.type === 'SCHWAB_LOTS' && !f.fileId,
		);

		if (missingFiles.length > 0) {
			throw new Error(
				`Missing ${missingFiles.length} lot detail file(s). Please upload all lot files before applying.`,
			);
		}

		// Process all lot detail files
		const allLots: Prisma.LotCreateManyInput[] = [];

		for (const file of lotUpload.LotUploadFile) {
			if (file.type === 'SCHWAB_LOTS' && file.fileId) {
				const content = await this.googleStorageService.getGCPFileAsString({
					gcpFileName: file.fileId,
				});

				const { lots } = await this.csvService.schwabLotDetailsToLots(content);

				for (const lot of lots) {
					allLots.push({
						assetSymbol: lot.assetSymbol,
						acquiredDate: lot.acquiredDate,
						price: lot.price.toString(),
						remainingQty: lot.remainingQty.toString(),
						accountId: lotUpload.accountId,
						portfolioId,
						fileId: file.fileId,
					});
				}
			}
		}

		// Apply lots to account
		await this.lotService.resetLotsForAccount({
			accountId: lotUpload.accountId,
			lots: allLots,
			portfolioId,
		});
	}

	/**
	 * Applies E*Trade lot upload immediately
	 */
	private async applyEtradeLotUpload(
		lotUpload: Awaited<ReturnType<typeof this.getLotUploadWithFiles>>,
		portfolioId: string,
	) {
		const lotUploadFile = lotUpload.LotUploadFile.find(
			(f) => f.type === 'ETRADE_LOTS',
		);

		if (!lotUploadFile?.file?.gcpFilename) {
			throw new Error('E*Trade lots file not found');
		}

		const content = await this.googleStorageService.getGCPFileAsString({
			gcpFileName: lotUploadFile.file.gcpFilename,
		});

		const { records, lotSeededDate } = await this.csvService.etradeCSVToLots({
			content,
		});

		const transformedLots = this.csvService.etradeTransformCSVRecords({
			records,
			lotSeededDate,
		});

		const lots: Prisma.LotCreateManyInput[] = transformedLots.map((lot) => ({
			...lot,
			price: lot.price.toString(),
			remainingQty: lot.remainingQty.toString(),
			accountId: lotUpload.accountId,
			portfolioId,
			fileId: lotUploadFile.fileId,
		}));

		await this.lotService.resetLotsForAccount({
			accountId: lotUpload.accountId,
			lots,
			lotSeededDate,
			portfolioId,
		});
	}
}
