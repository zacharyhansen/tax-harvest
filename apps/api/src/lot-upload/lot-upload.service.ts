import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { Insertable } from 'kysely';
import { LotUploadFile } from '~/database/db';
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

	async initSchwabPositionsUploadForOnboarding({
		portfolioId,
		accountIds,
	}: {
		accountIds: string[];
		portfolioId: string;
	}) {
		const positions = await this.prismaService
			.rlsPortfolioClient(portfolioId)
			.position.findMany({
				where: {
					accountId: { in: accountIds },
				},
			});

		console.log({ positions, accountIds });

		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.$transaction(async (trx) => {
				for (const accountId of accountIds) {
					// Get unique symbols that need lot detail files
					const symbols = new Set(
						positions
							.filter(
								(p) =>
									p.accountId === accountId &&
									p.assetSymbol !== 'CUR:USD' &&
									p.assetSymbol !== 'UNKNOWN',
							)
							.map((p) => p.assetSymbol),
					);
					console.log({ symbols: Array.from(symbols) });
					// Create the lot upload
					const lotUpload = await trx.lotUpload.create({
						data: {
							portfolioId,
							accountId,
							supportedAccountLotProvider: 'SCHWAB',
							applied: false,
						},
					});

					// Create placeholder entries for each lot detail file needed
					const lotFileEntries: Insertable<LotUploadFile>[] = [];
					for (const symbol of symbols) {
						lotFileEntries.push({
							portfolioId,
							accountId,
							fileId: null, // Will be filled when file is uploaded
							type: 'SCHWAB_LOTS' as const,
							lotUploadId: lotUpload.id,
							assetSymbol: symbol,
						});
					}
					console.log({ lotFileEntries });
					if (lotFileEntries.length > 0) {
						await trx.lotUploadFile.createMany({
							data: lotFileEntries,
						});
					}
				}
			});
	}

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
		const internalAccount = await this.prismaService
			.rlsPortfolioClient(portfolioId)
			.account.findUniqueOrThrow({
				where: {
					id: accountId,
				},
			});

		const { accounts } =
			await this.csvService.schwabPositionsToRecords(content);

		// Find the account in the parsed data
		const accountData = accounts.find((a) =>
			a.accountName.includes(internalAccount.plaidAccountMask || '__________'),
		);

		if (!accountData) {
			throw new Error(
				`No account data found in Schwab positions file for account: ${internalAccount.name}`,
			);
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
		lotUploadIds,
		portfolioId,
	}: {
		lotUploadIds: string[];
		portfolioId: string;
	}) {
		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotUpload.findMany({
				where: { id: { in: lotUploadIds } },
				include: {
					LotUploadFile: {
						include: {
							file: true,
						},
					},
				},
			});
	}

	async applyLotUploads({
		lotUploadIds,
		portfolioId,
	}: {
		lotUploadIds: string[];
		portfolioId: string;
	}) {
		const lotUploads = await this.getLotUploadWithFiles({
			lotUploadIds,
			portfolioId,
		});

		for (const lotUpload of lotUploads) {
			if (lotUpload.supportedAccountLotProvider === 'SCHWAB') {
				await this.applySchwabLotUpload(lotUpload, portfolioId);
			} else if (lotUpload.supportedAccountLotProvider === 'ETRADE') {
				await this.applyEtradeLotUpload(lotUpload, portfolioId);
			} else {
				throw new Error(
					`Unsupported provider: ${lotUpload.supportedAccountLotProvider}`,
				);
			}

			await this.prismaService
				.rlsPortfolioClient(portfolioId)
				.lotUpload.updateMany({
					where: { id: { in: lotUploadIds } },
					data: { applied: true },
				});

			await this.prismaService
				.rlsPortfolioClient(portfolioId)
				.lotUpload.updateMany({
					where: {
						id: { notIn: lotUploadIds },
						accountId: { in: lotUploads.map((l) => l.accountId) },
					},
					data: { applied: false },
				});
		}
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
		lotUpload: Awaited<ReturnType<typeof this.getLotUploadWithFiles>>[number],
		portfolioId: string,
	) {
		if (lotUpload.usePositionsAsLots) {
			await this.applyPositionsAsLots(lotUpload, portfolioId);
			return;
		}

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
			if (file.type === 'SCHWAB_LOTS' && file.file?.gcpFilename) {
				const content = await this.googleStorageService.getGCPFileAsString({
					gcpFileName: file.file.gcpFilename,
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

	async applyPositionsAsLots(
		lotUpload: Awaited<ReturnType<typeof this.getLotUploadWithFiles>>[number],
		portfolioId: string,
	) {
		const allLots: Prisma.LotCreateManyInput[] = [];

		const positions = await this.prismaService
			.rlsPortfolioClient(portfolioId)
			.position.findMany({
				where: { accountId: lotUpload.accountId },
			});

		for (const position of positions) {
			allLots.push({
				assetSymbol: position.assetSymbol,
				acquiredDate: position.dateAcquired ?? new Date(),
				price: position.costPerShare ?? 0,
				remainingQty: position.quantity,
				accountId: lotUpload.accountId,
				portfolioId,
			});
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
		lotUpload: Awaited<ReturnType<typeof this.getLotUploadWithFiles>>[number],
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
