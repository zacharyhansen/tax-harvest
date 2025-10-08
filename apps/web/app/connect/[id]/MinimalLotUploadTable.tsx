'use client';

import { Button } from '@repo/ui/components/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@repo/ui/components/table';
import { toast } from '@repo/ui/components/toast-sonner';
import { Check, Loader2, Upload } from 'lucide-react';
import { useMemo } from 'react';
import {
	type LotUploadFileType,
	type PortfolioConnectItemDetailFragment,
	useUpdateLotUploadMutation,
	useUploadLotFileSchwabMutation,
} from '~/generated/gql';
import { CSVUploadHelper } from '~/modules/fileUpload/CSVUploadHelper';
import { useUploadFiles } from '~/modules/fileUpload/useUploadFiles';

export const SchwabLotUpload = ({
	portfolioConnectItem,
	onSubmit,
	onAbandon,
}: {
	portfolioConnectItem: PortfolioConnectItemDetailFragment;
	onSubmit: (lotUploadIds: string[]) => void;
	onAbandon: () => void;
}) => {
	const handleNext = async () => {
		onSubmit(
			portfolioConnectItem.account
				?.flatMap(
					(account) =>
						account.lotUpload?.map((lotUpload) => lotUpload.id) ?? [],
				)
				.filter((id) => id !== undefined) ?? [],
		);
	};

	const isComplete = useMemo(() => {
		return portfolioConnectItem.account
			?.flatMap((account) => {
				return (
					account.lotUpload?.map((lotUpload) => {
						return (
							lotUpload.LotUploadFile?.filter((f) => f.fileId).length ===
								lotUpload.LotUploadFile?.map((f) => f).length ||
							lotUpload.usePositionsAsLots
						);
					}) ?? []
				);
			})
			.every((isComplete) => isComplete);
	}, [portfolioConnectItem.account]);

	return (
		<div className="p-8 pt-2">
			<div>
				<div className="mb-6 mt-6">
					<CSVUploadHelper />
				</div>
				{portfolioConnectItem.account?.map((account) => {
					return (
						<div key={account.id} className="mb-6">
							{account.lotUpload?.flatMap((lotUpload) =>
								lotUpload ? (
									<MinimalLotUploadTable
										key={lotUpload.id}
										accountName={`${account.name} ****${account.plaidAccountMask}`}
										lotUpload={lotUpload}
										accountId={account.id}
									/>
								) : null,
							)}
						</div>
					);
				})}
			</div>

			<div className="flex justify-between border-t pt-6">
				<Button variant="destructive" onClick={onAbandon}>
					Abandon Setup
				</Button>
				<Button onClick={handleNext} disabled={!isComplete}>
					Next
				</Button>
			</div>
		</div>
	);
};

interface MinimalLotUploadTableProps {
	accountName: string;
	accountId: string;
	lotUpload: NonNullable<
		NonNullable<
			NonNullable<
				PortfolioConnectItemDetailFragment['account']
			>[number]['lotUpload']
		>[number]
	>;
}

/**
 * Minimal component for uploading lot files during onboarding flow
 * @param accountId - The ID of the account to show lot uploads for
 * @param onProgressChange - Optional callback to report upload progress
 * @param onSkip - Optional callback when user skips the upload
 * @example
 * <MinimalLotUploadTable accountId="account-123" onProgressChange={(completed, total) => console.log(`${completed}/${total}`)} onSkip={() => console.log('skipped')} />
 */
function MinimalLotUploadTable({
	accountName,
	accountId,
	lotUpload,
}: MinimalLotUploadTableProps) {
	const [updateLotUpload] = useUpdateLotUploadMutation();

	const uploaded =
		lotUpload?.LotUploadFile?.filter((f) => f.fileId).length ?? 0;
	const total = lotUpload?.LotUploadFile?.map((f) => f).length ?? 0;
	const isComplete = lotUpload.usePositionsAsLots || uploaded === total;

	if (lotUpload === null || total === 0) {
		return null;
	}

	return (
		<>
			<h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
				{accountName}
				<span className="text-sm font-normal text-muted-foreground">
					( {uploaded} / {total} )
				</span>
				{isComplete && (
					<span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
						Complete
					</span>
				)}
				<Button
					variant={lotUpload.usePositionsAsLots ? 'outline' : 'secondary'}
					className="ml-auto"
					size="sm"
					onClick={() => {
						updateLotUpload({
							variables: {
								lotUploadId: lotUpload.id,
								data: {
									usePositionsAsLots: {
										set: !lotUpload.usePositionsAsLots,
									},
								},
							},
						});
					}}
				>
					{!lotUpload.usePositionsAsLots
						? 'Skip Setup for Account?'
						: 'Setup this Account'}
				</Button>
			</h3>
			<div className="space-y-4">
				<div key={lotUpload.id} className="space-y-2">
					<div className="rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-12"></TableHead>
									<TableHead>Asset</TableHead>
									<TableHead>Upload</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{(lotUpload.LotUploadFile || []).map((file) => (
									<LotFileRow
										key={file.id}
										file={{
											id: file.id,
											type: file.type,
											fileId: file.fileId || null,
											assetSymbol: file.assetSymbol || null,
											file: file.file
												? {
														id: file.file.id,
														displayName: file.file.displayName,
													}
												: null,
										}}
										lotUploadId={lotUpload.id}
										accountId={accountId}
										onFileUploaded={() => {}}
										disabled={lotUpload.usePositionsAsLots}
									/>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</>
	);
}

interface LotFileRowProps {
	file: {
		id: string;
		type: string;
		fileId: string | null;
		assetSymbol: string | null;
		file?: {
			id: string;
			displayName: string;
		} | null;
	};
	lotUploadId: string;
	accountId: string;
	onFileUploaded: () => void;
	disabled?: boolean;
}

/**
 * Table row component for displaying a single lot file upload
 * @param file - The lot upload file data
 * @param lotUploadId - The ID of the parent lot upload
 * @param accountId - The account ID for file uploads
 * @param onFileUploaded - Callback when a file is uploaded
 * @param disabled - Whether the row should be disabled and grayed out
 */
function LotFileRow({
	file,
	lotUploadId,
	accountId,
	onFileUploaded,
	disabled = false,
}: LotFileRowProps) {
	const isUploaded = !!file.fileId;

	return (
		<TableRow className={disabled ? 'opacity-50' : ''}>
			<TableCell>
				{isUploaded && (
					<div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
						<Check className="h-3 w-3 text-green-800 dark:text-green-200" />
					</div>
				)}
			</TableCell>
			<TableCell className="font-medium">
				{file.assetSymbol || (
					<span className="text-muted-foreground text-sm">{file.type}</span>
				)}
			</TableCell>
			<TableCell>
				{isUploaded ? (
					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground">
							{file.file?.displayName}
						</span>
						{!disabled && (
							<LotFileUploader
								lotUploadFileId={file.id}
								lotUploadId={lotUploadId}
								fileType={file.type}
								accountId={accountId}
								onUploaded={onFileUploaded}
								disabled={disabled}
								isReplacement={true}
							/>
						)}
					</div>
				) : (
					<LotFileUploader
						lotUploadFileId={file.id}
						lotUploadId={lotUploadId}
						fileType={file.type}
						accountId={accountId}
						onUploaded={onFileUploaded}
						disabled={disabled}
					/>
				)}
			</TableCell>
		</TableRow>
	);
}

interface LotFileUploaderProps {
	lotUploadFileId: string;
	lotUploadId: string;
	fileType: string;
	accountId: string;
	onUploaded: () => void;
	disabled?: boolean;
	isReplacement?: boolean;
}

/**
 * Minimal file uploader for lot files
 * @param lotUploadFileId - The ID of the lot upload file placeholder
 * @param lotUploadId - The ID of the parent lot upload
 * @param fileType - The type of file expected
 * @param accountId - The account ID
 * @param onUploaded - Callback when file is uploaded
 * @param disabled - Whether the uploader should be disabled
 * @param isReplacement - Whether this is replacing an existing file
 */
function LotFileUploader({
	lotUploadFileId,
	lotUploadId,
	fileType,
	accountId,
	onUploaded,
	disabled = false,
	isReplacement = false,
}: LotFileUploaderProps) {
	const [uploadLotFileSchwab] = useUploadLotFileSchwabMutation();
	const { isUploading, onUpload } = useUploadFiles({
		accountId,
		defaultUploadedFiles: [],
		onUploadError: (err) => {
			toast.error(`Failed to upload file: ${err.message}`);
		},
		onFileUploaded: async (uploadedFiles) => {
			const file = uploadedFiles[0];
			if (!file) return;

			try {
				await uploadLotFileSchwab({
					variables: {
						input: {
							fileInput: {
								gcpFilename: file.fileName,
								displayName: file.displayName,
								type: file.type,
								accountId,
								portfolioId: '',
								uploadedBy: '',
							},
							lotUploadFileInput: {
								id: lotUploadFileId,
								lotUploadId,
								accountId,
								portfolioId: '',
								type: fileType as LotUploadFileType,
							},
						},
					},
				});

				toast.success(`File uploaded successfully`);
				onUploaded();
			} catch (error) {
				console.error('Upload error:', error);
				toast.error(`Failed to upload file`);
			}
		},
	});

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			onUpload(Array.from(files));
		}
	};

	return (
		<div className="flex items-center gap-2">
			<input
				type="file"
				accept=".csv"
				onChange={handleFileSelect}
				disabled={isUploading || disabled}
				className="hidden"
				id={`file-${lotUploadFileId}`}
			/>
			<label
				htmlFor={`file-${lotUploadFileId}`}
				className={isReplacement ? '' : 'flex-1'}
			>
				<Button
					variant="secondary"
					size={'sm'}
					disabled={isUploading || disabled}
					className={'w-full'}
					asChild
				>
					<span>
						{isUploading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{isReplacement ? 'Replacing...' : 'Uploading...'}
							</>
						) : (
							<>
								{!isReplacement && <Upload className="mr-2 h-4 w-4" />}
								{isReplacement ? 'Replace' : 'Choose CSV'}
							</>
						)}
					</span>
				</Button>
			</label>
		</div>
	);
}
