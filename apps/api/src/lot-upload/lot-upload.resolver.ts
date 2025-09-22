import {
	Args,
	Field,
	Info,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import {
	FileCreateManyInput,
	LotUpload,
	LotUploadFile,
	LotUploadFileCreateManyInput,
	LotUploadWhereInput,
} from '~/generated/graphql';
import { PrismaSelect } from '~/utilities/prisma/prisma-select';
import { ClerkContext } from '../auth/decorators/clerk-context.decorator';
import type { ClerkClaims } from '../auth/types';
import { CsvService } from '../csv/csv.service';
import { GoogleStorageService } from '../google-storage/google-storage.service';
import { PrismaService } from '../prisma/prisma.service';
import { LotUploadService } from './lot-upload.service';

@InputType()
class UploadLotFileInput {
	@Field(() => FileCreateManyInput)
	fileInput: FileCreateManyInput;

	@Field(() => LotUploadFileCreateManyInput)
	lotUploadFileInput: LotUploadFileCreateManyInput;
}

/**
 * GraphQL resolver for lot upload operations
 * Handles staged uploads for different CSV providers
 */
@Resolver()
export class LotUploadResolver {
	constructor(
		readonly _csvService: CsvService,
		private readonly prismaService: PrismaService,
		private readonly lotUploadService: LotUploadService,
		private readonly googleStorageService: GoogleStorageService,
	) {}

	/**
	 * Initializes a lot upload based on the CSV type
	 * For E*Trade: Creates lot upload and immediately marks ready
	 * For Schwab positions: Creates lot upload with placeholders for lot files
	 * For Schwab lots: Returns error directing to upload positions first
	 */
	@Mutation(() => [LotUpload], {
		name: 'initLotUpload',
		description: 'Initialize a lot upload from a CSV file',
	})
	async initLotUpload(
		@Info() info: GraphQLResolveInfo,
		@ClerkContext() clerkContext: ClerkClaims,
		@Args('input') input: FileCreateManyInput,
	): Promise<LotUpload[]> {
		const { select } = new PrismaSelect<Prisma.LotUploadSelect>(info).value;
		const portfolioId = clerkContext.metadata.portfolioId;
		const userId = clerkContext.sub;

		// Get CSV content
		const content = await this.googleStorageService.getGCPFileAsString({
			gcpFileName: input.gcpFilename,
		});

		// Detect CSV type
		const csvType = CsvService.detectCSVType(content);

		if (!csvType) {
			throw new Error(
				'Unrecognized CSV format. Please upload a valid E*Trade or Schwab CSV file.',
			);
		}

		let upload: LotUpload;
		// First, create the file record
		const file = await this.prismaService
			.rlsPortfolioClient(portfolioId)
			.file.create({
				data: {
					gcpFilename: input.gcpFilename,
					displayName: input.displayName,
					type: input.type,
					uploadedBy: userId,
					accountId: input.accountId,
					portfolioId,
				},
			});

		switch (csvType) {
			case 'ETRADE_LOTS': {
				// Create lot upload and mark ready immediately
				upload = await this.prismaService
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

						return upload;
					});
				break;
			}

			case 'SCHWAB_POSITIONS': {
				// Initialize Schwab upload with placeholders
				upload = await this.lotUploadService.initSchwabPositionsUpload({
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

		if (csvType === 'ETRADE_LOTS' && upload) {
			// Auto-apply E*Trade uploads
			await this.lotUploadService.applyLotUpload({
				lotUploadId: upload.id,
				portfolioId,
			});
		}

		// Get status
		return this.lotUploadService.lotUpload({
			portfolioId,
			accountId: input.accountId,
			select,
		});
	}

	/**
	 * Uploads an individual lot file for Schwab
	 * Updates the placeholder created during initialization
	 */
	@Mutation(() => LotUploadFile, {
		name: 'uploadLotFileSchwab',
		description: 'Upload an individual lot file for a Schwab lot upload',
	})
	async uploadLotFileSchwab(
		@ClerkContext() clerkContext: ClerkClaims,
		@Args('input') input: UploadLotFileInput,
	): Promise<LotUploadFile> {
		const { fileInput, lotUploadFileInput } = input;
		const portfolioId = clerkContext.metadata.portfolioId;
		const userId = clerkContext.sub;

		// Verify this is a Schwab lot details file
		const content = await this.googleStorageService.getGCPFileAsString({
			gcpFileName: fileInput.gcpFilename,
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
				where: { id: lotUploadFileInput.lotUploadId },
			});

		// Create file record
		const file = await this.prismaService
			.rlsPortfolioClient(portfolioId)
			.file.create({
				data: {
					gcpFilename: fileInput.gcpFilename,
					displayName: fileInput.displayName,
					type: fileInput.type,
					uploadedBy: userId,
					accountId: lotUpload.accountId,
					portfolioId,
				},
			});

		// Update the placeholder
		await this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotUploadFile.update({
				where: { id: lotUploadFileInput.id },
				data: { fileId: file.id },
			});

		// Return updated status
		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotUploadFile.findUniqueOrThrow({
				where: { id: lotUploadFileInput.id },
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

	@Query(() => [LotUpload], {
		name: 'lotUploads',
		description: 'Get all lot uploads',
	})
	async lotUploads(
		@ClerkContext() clerkContext: ClerkClaims,
		@Info() info: GraphQLResolveInfo,
		@Args('where', { type: () => LotUploadWhereInput })
		where: Prisma.LotUploadWhereInput,
	) {
		const { select } = new PrismaSelect<Prisma.LotUploadSelect>(info).value;
		const portfolioId = clerkContext.metadata.portfolioId;

		return this.prismaService
			.rlsPortfolioClient(portfolioId)
			.lotUpload.findMany({ select, orderBy: { createdAt: 'desc' }, where });
	}
}
