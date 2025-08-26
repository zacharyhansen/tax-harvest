import { Injectable } from '@nestjs/common';
import type { Account, Prisma } from '@prisma/client';

import { CsvService } from '../csv/csv.service';
import { GoogleStorageService } from '../google-storage/google-storage.service';
import { LotService } from '../lot/lot.service';
import { PrismaService } from '../prisma/prisma.service';
import type { InitFileUploadPayload } from './file.resolver';

@Injectable()
export class FileService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly googleStorageService: GoogleStorageService,
		private readonly csvService: CsvService,
		private readonly lotService: LotService,
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
		return this.prismaService
			.$extends(PrismaService.forPortfolio(portfolioId))
			.file.findMany({
				where,
				select,
			});
	}

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
			.$extends(PrismaService.forPortfolio(portfolioId))
			.file.createManyAndReturn({
				data,
				select,
			});
		for (const file of createdFiles) {
			const fileContent = await this.googleStorageService.getGCPFileAsString({
				gcpFileName: file.gcpFilename,
			});
			await this.csvService
				.etradeCSVToLots({ content: fileContent })
				.then(({ records, lotSeededDate }) => {
					return {
						lots: this.csvService.etradeTransformCSVRecords({
							records,
						}),
						lotSeededDate,
					};
				})
				.then(({ lots, lotSeededDate }) => {
					return this.lotService.resetLotsForAccount({
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
						replace: true,
						portfolioId,
					});
				});
		}

		return createdFiles;
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
				.$extends(PrismaService.forPortfolio(portfolioId))
				.account.findUniqueOrThrow({
					where: {
						id: accountId,
					},
				});
		} else if (accountCreateInput) {
			account = await this.prismaService
				.$extends(PrismaService.forPortfolio(portfolioId))
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
		await this.prismaService
			.$extends(PrismaService.forPortfolio(portfolioId))
			.account.update({
				where: { id: account.id },
				data: {
					uploadedPositions: true,
				},
			});

		return { files, accountId: account.id };
	}
}
