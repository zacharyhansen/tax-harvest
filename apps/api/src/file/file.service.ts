import { Injectable } from '@nestjs/common';
import type { Account, File, Prisma } from '@prisma/client';
import { CsvService } from '../csv/csv.service';
import { GoogleStorageService } from '../google-storage/google-storage.service';
import { LotService } from '../lot/lot.service';
import { LotUploadService } from '../lot-upload/lot-upload.service';
import { PrismaService } from '../prisma/prisma.service';
import type { InitFileUploadPayload } from './file.resolver';

@Injectable()
export class FileService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly googleStorageService: GoogleStorageService,
		private readonly csvService: CsvService,
		private readonly lotService: LotService,
		private readonly lotUploadService: LotUploadService,
	) {}

	/**
	 * Find many files with optional filtering and selection
	 * @param where - Prisma where clause for filtering files
	 * @param select - Prisma select clause for field selection
	 * @param portfolioId - Portfolio ID for security filtering
	 * @returns Promise<File[]> - Array of files matching the criteria
	 * @example
	 * const accountFiles = await fileService.findMany({
	 *   where: { accountId: "account-123" },
	 *   portfolioId: "portfolio-456"
	 * })
	 */
	async findMany({
		where,
		select,
		portfolioId,
	}: {
		where?: Prisma.FileWhereInput;
		select?: Prisma.FileSelect;
		portfolioId: string;
	}) {
		return this.prismaService.rlsPortfolioClient(portfolioId).file.findMany({
			where,
			select,
		});
	}

	/**
	 * Creates and processes files based on their detected CSV type
	 * Routes to appropriate handler based on CSV format
	 * @param params - File creation and processing parameters
	 * @returns Created files
	 */
	async createAndProcessFiles({
		data,
		select,
		portfolioId,
	}: {
		data: Prisma.FileCreateManyInput[];
		select?: Prisma.FileSelect;
		portfolioId: string;
	}) {
		const createdFiles = await this.prismaService
			.rlsPortfolioClient(portfolioId)
			.file.createManyAndReturn({
				data,
				select,
			});

		for (const file of createdFiles) {
			const fileContent = await this.googleStorageService.getGCPFileAsString({
				gcpFileName: file.gcpFilename,
			});

			// Detect CSV type
			const csvType = CsvService.detectCSVType(fileContent);

			if (!csvType) {
				throw new Error(`Unrecognized CSV format for file ${file.displayName}`);
			}

			// Process based on CSV type
			switch (csvType) {
				case 'ETRADE_LOTS': {
					// Original E*Trade processing logic
					await this.processEtradeLots({
						file,
						fileContent,
						portfolioId,
					});
					break;
				}

				case 'SCHWAB_POSITIONS': {
					// Initialize Schwab lot upload
					await this.processSchwabPositions({
						file,
						fileContent,
						portfolioId,
					});
					break;
				}

				case 'SCHWAB_LOTS': {
					throw new Error(
						'Schwab lot detail files should be uploaded through the lot upload API after uploading positions file',
					);
				}

				default:
					throw new Error(`Unsupported CSV type: ${csvType}`);
			}
		}

		return createdFiles;
	}

	/**
	 * Process E*Trade lots file - immediate application
	 */
	private async processEtradeLots({
		file,
		fileContent,
		portfolioId,
	}: {
		file: File;
		fileContent: string;
		portfolioId: string;
	}) {
		const { records, lotSeededDate, accountName } =
			await this.csvService.etradeCSVToLots({
				content: fileContent,
			});

		const lots = this.csvService.etradeTransformCSVRecords({
			records,
			lotSeededDate,
		});

		await this.lotService.resetLotsForAccount({
			accountId: file.accountId,
			lots: lots.map(
				(lot) =>
					({
						...lot,
						fileId: file.id,
						price: lot.price.toString(),
						remainingQty: lot.remainingQty.toString(),
						accountId: file.accountId,
						portfolioId,
					}) satisfies Prisma.LotCreateManyInput,
			),
			lotSeededDate,
			portfolioId,
		});

		await this.prismaService.rlsPortfolioClient(portfolioId).account.update({
			where: { id: file.accountId },
			data: {
				name: accountName,
			},
		});
	}

	/**
	 * Process Schwab positions file - create lot upload with placeholders
	 */
	private async processSchwabPositions({
		file,
		fileContent,
		portfolioId,
	}: {
		file: File;
		fileContent: string;
		portfolioId: string;
	}) {
		// Create lot upload and placeholders for lot detail files
		await this.lotUploadService.initSchwabPositionsUpload({
			content: fileContent,
			accountId: file.accountId,
			portfolioId,
			fileId: file.id,
		});
	}

	async initAccountFileUpload({
		accountCreateInput,
		fileData,
		select,
		portfolioId,
		userId,
		accountId,
	}: {
		accountCreateInput?: Prisma.AccountCreateInput;
		fileData: InitFileUploadPayload[];
		select?: Prisma.FileSelect;
		portfolioId: string;
		userId: string;
		accountId?: string;
	}) {
		let account: Account;
		if (accountId) {
			account = await this.prismaService
				.rlsPortfolioClient(portfolioId)
				.account.findUniqueOrThrow({
					where: {
						id: accountId,
					},
				});
		} else if (accountCreateInput) {
			account = await this.prismaService
				.rlsPortfolioClient(portfolioId)
				.account.create({
					data: accountCreateInput,
				});
		} else {
			throw new Error(
				'Either accountId or accountCreateInput must be provided',
			);
		}

		const files = await this.createAndProcessFiles({
			data: fileData.map((file) => ({
				...file,
				uploadedBy: userId,
				accountId: account.id,
				portfolioId,
			})),
			select,
			portfolioId,
		});
		await this.prismaService.rlsPortfolioClient(portfolioId).account.update({
			where: { id: account.id },
			data: {
				uploadedPositions: true,
			},
		});

		return { files, accountId: account.id };
	}
}
