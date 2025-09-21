import {
	Args,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from '@nestjs/graphql';
import { LotUpload } from '@prisma/client';
import { ClerkContext } from '../auth/decorators/clerk-context.decorator';
import type { ClerkClaims } from '../auth/types';
import { CsvService } from '../csv/csv.service';
import { GoogleStorageService } from '../google-storage/google-storage.service';
import { PrismaService } from '../prisma/prisma.service';
import { LotUploadService } from './lot-upload.service';

@InputType()
class InitLotUploadInput {
	@Field(() => String)
	accountId: string;

	@Field(() => String)
	gcpFileName: string;

	@Field(() => String)
	displayName: string;
}

@InputType()
class UploadLotFileInput {
	@Field(() => String)
	lotUploadId: string;

	@Field(() => String)
	gcpFileName: string;

	@Field(() => String)
	displayName: string;

	@Field(() => String)
	symbol: string;
}

@ObjectType()
class LotUploadStatus {
	@Field(() => String)
	id: string;

	@Field(() => Boolean)
	applied: boolean;

	@Field(() => Number)
	missingFilesCount: number;

	@Field(() => Boolean)
	isReady: boolean;
}

/**
 * GraphQL resolver for lot upload operations
 * Handles staged uploads for different CSV providers
 */
@Resolver()
export class LotUploadResolver {
	constructor(
		private readonly lotUploadService: LotUploadService,
		readonly _csvService: CsvService,
		private readonly googleStorageService: GoogleStorageService,
		private readonly prismaService: PrismaService,
	) {}

	/**
	 * Initializes a lot upload based on the CSV type
	 * For E*Trade: Creates lot upload and immediately marks ready
	 * For Schwab positions: Creates lot upload with placeholders for lot files
	 * For Schwab lots: Returns error directing to upload positions first
	 */
	@Mutation(() => LotUploadStatus, {
		name: 'initLotUpload',
		description: 'Initialize a lot upload from a CSV file',
	})
	async initLotUpload(
		@ClerkContext() clerkContext: ClerkClaims,
		@Args('input') input: InitLotUploadInput,
	): Promise<LotUploadStatus> {
		const portfolioId = clerkContext.metadata.portfolioId;
		const userId = clerkContext.sub;

		// Get CSV content
		const content = await this.googleStorageService.getGCPFileAsString({
			gcpFileName: input.gcpFileName,
		});

		// Detect CSV type
		const csvType = CsvService.detectCSVType(content);

		if (!csvType) {
			throw new Error(
				'Unrecognized CSV format. Please upload a valid E*Trade or Schwab CSV file.',
			);
		}

		// First, create the file record
		const file = await this.prismaService
			.rlsPortfolioClient(portfolioId)
			.file.create({
				data: {
					gcpFilename: input.gcpFileName,
					displayName: input.displayName,
					type: csvType,
					uploadedBy: userId,
					accountId: input.accountId,
					portfolioId,
				},
			});

		let lotUpload: LotUpload | null = null;

		switch (csvType) {
			case 'ETRADE_LOTS': {
				// Create lot upload and mark ready immediately
				lotUpload = await this.prismaService
					.rlsPortfolioClient(portfolioId)
					.$transaction(async (trx) => {
						const upload = await trx.lotUpload.create({
							data: {
								portfolioId,
								accountId: input.accountId,
								fileId: file.id,
								supportedAccountLotProvider: 'ETRADE',
								applied: false,
							},
						});

						await trx.lotUploadFile.create({
							data: {
								portfolioId,
								accountId: input.accountId,
								fileId: file.id,
								type: 'ETRADE_LOTS',
								lotUploadId: upload.id,
							},
						});

						// Auto-apply E*Trade uploads
						await this.lotUploadService.applyLotUpload({
							lotUploadId: upload.id,
							portfolioId,
						});

						return upload;
					});
				break;
			}

			case 'SCHWAB_POSITIONS': {
				// Initialize Schwab upload with placeholders
				lotUpload = await this.lotUploadService.initSchwabPositionsUpload({
					content,
					accountId: input.accountId,
					portfolioId,
					fileId: file.id,
				});
				break;
			}

			case 'SCHWAB_LOTS': {
				throw new Error(
					'Please upload the Schwab positions file first before uploading individual lot detail files.',
				);
			}

			default:
				throw new Error(`Unsupported CSV type: ${csvType}`);
		}

		// Get status
		return this.lotUploadService.getLotUploadStatus({
			lotUploadId: lotUpload.id,
			portfolioId,
		});
	}

	/**
	 * Uploads an individual lot file for Schwab
	 * Updates the placeholder created during initialization
	 */
	@Mutation(() => LotUploadStatus, {
		name: 'uploadLotFile',
		description: 'Upload an individual lot file for a Schwab lot upload',
	})
	async uploadLotFile(
		@ClerkContext() clerkContext: ClerkClaims,
		@Args('input') input: UploadLotFileInput,
	): Promise<LotUploadStatus> {
		const portfolioId = clerkContext.metadata.portfolioId;
		const userId = clerkContext.sub;

		// Verify this is a Schwab lot details file
		const content = await this.googleStorageService.getGCPFileAsString({
			gcpFileName: input.gcpFileName,
		});

		const csvType = CsvService.detectCSVType(content);
		if (csvType !== 'SCHWAB_LOTS') {
			throw new Error(
				'Invalid file type. Expected a Schwab lot details CSV file.',
			);
		}

		// Get lot upload to find account ID
		const lotUpload = await this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotUpload.findUniqueOrThrow({
				where: { id: input.lotUploadId },
			});

		// Create file record
		const file = await this.prismaService
			.rlsPortfolioClient(portfolioId)
			.file.create({
				data: {
					gcpFilename: input.gcpFileName,
					displayName: input.displayName,
					type: 'SCHWAB_LOTS',
					uploadedBy: userId,
					accountId: lotUpload.accountId,
					portfolioId,
				},
			});

		// Update the placeholder
		await this.lotUploadService.uploadSchwabLotFile({
			lotUploadId: input.lotUploadId,
			fileId: file.id,
			symbol: input.symbol,
			portfolioId,
		});

		// Return updated status
		return this.lotUploadService.getLotUploadStatus({
			lotUploadId: input.lotUploadId,
			portfolioId,
		});
	}

	/**
	 * Applies a lot upload to the account
	 * Validates all required files are present and processes lots
	 */
	@Mutation(() => Boolean, {
		name: 'applyLotUpload',
		description: 'Apply a lot upload to the account',
	})
	async applyLotUpload(
		@ClerkContext() clerkContext: ClerkClaims,
		@Args('lotUploadId') lotUploadId: string,
	): Promise<boolean> {
		const portfolioId = clerkContext.metadata.portfolioId;

		await this.lotUploadService.applyLotUpload({
			lotUploadId,
			portfolioId,
		});

		return true;
	}

	/**
	 * Gets the status of a lot upload including missing files
	 */
	@Query(() => LotUploadStatus, {
		name: 'lotUploadStatus',
		description: 'Get the status of a lot upload',
	})
	async lotUploadStatus(
		@ClerkContext() clerkContext: ClerkClaims,
		@Args('lotUploadId') lotUploadId: string,
	): Promise<LotUploadStatus> {
		const portfolioId = clerkContext.metadata.portfolioId;

		return this.lotUploadService.getLotUploadStatus({
			lotUploadId,
			portfolioId,
		});
	}
}
