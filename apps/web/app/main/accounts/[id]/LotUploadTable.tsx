'use client';

import { Button } from '@repo/ui/components/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@repo/ui/components/collapsible';
import { FileUploader } from '@repo/ui/components/file-uploader';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@repo/ui/components/table';
import { toast } from '@repo/ui/components/toast-sonner';
import {
	ChevronDown,
	ChevronRight,
	FileText,
	Loader2,
	RefreshCcw,
	Upload,
} from 'lucide-react';
import { useState } from 'react';
import {
	LotUploadFileType,
	useApplyLotUploadMutation,
	useLotUploadsQuery,
	useUploadLotFileSchwabMutation,
} from '~/generated/gql';
import { useUploadFiles } from '~/modules/fileUpload/useUploadFiles';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { DateFormatter } from '~/modules/utils/DateFormatter';

interface LotUploadTableProps {
	accountId: string;
}

/**
 * Component that displays a table of lot uploads for an account with expandable rows for file uploads
 * @param accountId - The ID of the account to show lot uploads for
 * @example
 * <LotUploadTable accountId="account-123" />
 */
export default function LotUploadTable({ accountId }: LotUploadTableProps) {
	const { data, error, loading, refetch } = useLotUploadsQuery({
		variables: {
			where: {
				accountId: {
					equals: accountId,
				},
			},
		},
	});

	if (error) {
		return (
			<ErrorPage message="Could not load lot uploads at this time. If this issue persists please contact support." />
		);
	}

	if (loading) {
		return <LoadingPage message="Loading lot uploads..." />;
	}

	const lotUploads = data?.lotUploads || [];

	if (lotUploads.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-8 text-center">
				<FileText className="text-muted-foreground mb-4 h-12 w-12" />
				<h3 className="text-lg font-medium">No lot uploads</h3>
				<p className="text-muted-foreground">
					There are no lot uploads for this account yet.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-12"></TableHead>
						<TableHead>Provider</TableHead>
						<TableHead>Files</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{lotUploads.map((upload) => (
						<LotUploadRow
							key={upload.id}
							upload={{
								id: upload.id,
								createdAt: upload.createdAt,
								applied: upload.applied,
								supportedAccountLotProvider: upload.supportedAccountLotProvider,
								LotUploadFile: (upload.LotUploadFile || []).map((file) => ({
									id: file.id,
									type: file.type,
									fileId: file.fileId || null,
									file: file.file
										? {
												id: file.file.id,
												displayName: file.file.displayName,
										  }
										: null,
								})),
							}}
							accountId={accountId}
							onApplied={() => refetch()}
							onFileUploaded={() => refetch()}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

interface LotUploadRowProps {
	upload: {
		id: string;
		createdAt: string;
		applied: boolean;
		supportedAccountLotProvider: string;
		LotUploadFile: Array<{
			id: string;
			type: string;
			fileId: string | null;
			file?: {
				id: string;
				displayName: string;
			} | null;
		}>;
	};
	accountId: string;
	onApplied: () => void;
	onFileUploaded: () => void;
}

/**
 * Individual row component for displaying lot upload information with expandable sub-rows
 * @param upload - The lot upload data to display
 * @param accountId - The account ID for file uploads
 * @param onApplied - Callback when lot upload is applied
 * @param onFileUploaded - Callback when a file is uploaded
 * @example
 * <LotUploadRow upload={upload} accountId="123" onApplied={() => refetch()} onFileUploaded={() => refetch()} />
 */
function LotUploadRow({
	upload,
	accountId,
	onApplied,
	onFileUploaded,
}: LotUploadRowProps) {
	const [isApplying, setIsApplying] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [applyLotUpload] = useApplyLotUploadMutation();

	/**
	 * Handles applying the lot upload to the account
	 */
	const handleApply = async () => {
		try {
			setIsApplying(true);

			const { data, errors } = await applyLotUpload({
				variables: {
					lotUploadId: upload.id,
				},
			});

			if (errors) {
				console.error('GraphQL errors:', errors);
				throw new Error(`Failed to apply lot upload: ${errors[0]?.message}`);
			}

			if (data?.applyLotUpload) {
				toast.success('Lot upload applied successfully');
				onApplied();
			} else {
				throw new Error('Failed to apply lot upload');
			}
		} catch (error) {
			console.error('Apply lot upload error:', error);
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error occurred';
			toast.error(`Failed to apply lot upload: ${errorMessage}`);
		} finally {
			setIsApplying(false);
		}
	};

	// Count uploaded vs total files
	const uploadedFiles = upload.LotUploadFile.filter((f) => f.fileId).length;
	const totalFiles = upload.LotUploadFile.length;
	const isReady = uploadedFiles === totalFiles;
	const hasPendingFiles = uploadedFiles < totalFiles;

	// Check if this is a Schwab upload (which needs individual file uploads)
	const isSchwab = upload.supportedAccountLotProvider === 'SCHWAB';

	return (
		<>
			<TableRow>
				<TableCell>
					{isSchwab && hasPendingFiles && (
						<CollapsibleTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsExpanded(!isExpanded)}
								className="p-0 h-6 w-6"
							>
								{isExpanded ? (
									<ChevronDown className="h-4 w-4" />
								) : (
									<ChevronRight className="h-4 w-4" />
								)}
							</Button>
						</CollapsibleTrigger>
					)}
				</TableCell>
				<TableCell>
					<span className="font-medium">{upload.supportedAccountLotProvider}</span>
				</TableCell>
				<TableCell>
					<div className="flex flex-col space-y-1">
						<span className="text-sm">
							{uploadedFiles} / {totalFiles} files
						</span>
						<div className="text-xs text-muted-foreground">
							{upload.LotUploadFile.map((file) => (
								<div key={file.id}>
									{file.type}: {file.file?.displayName || 'Pending upload'}
								</div>
							)).slice(0, 2)}
							{upload.LotUploadFile.length > 2 && (
								<div>...and {upload.LotUploadFile.length - 2} more</div>
							)}
						</div>
					</div>
				</TableCell>
				<TableCell className="text-muted-foreground">
					{DateFormatter.shortDay(upload.createdAt)}
				</TableCell>
				<TableCell>
					{upload.applied ? (
						<span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
							Applied
						</span>
					) : isReady ? (
						<span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
							Ready to Apply
						</span>
					) : (
						<span className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
							Incomplete
						</span>
					)}
				</TableCell>
				<TableCell className="text-right">
					{isReady && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleApply}
							disabled={isApplying}
							className="flex items-center space-x-1"
						>
							{isApplying ? (
								<Loader2 className="h-3 w-3 animate-spin" />
							) : (
								<RefreshCcw className="h-3 w-3" />
							)}
							<span>
								{isApplying ? 'Applying...' : upload.applied ? 'Reapply' : 'Apply'}
							</span>
						</Button>
					)}
				</TableCell>
			</TableRow>
			{isSchwab && hasPendingFiles && (
				<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
					<CollapsibleContent asChild>
						<>
							{upload.LotUploadFile.filter((file) => !file.fileId).map((file) => (
								<TableRow key={file.id} className="bg-muted/20">
									<TableCell></TableCell>
									<TableCell colSpan={2}>
										<div className="flex items-center space-x-2 pl-4">
											<FileText className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm font-medium">{file.type}</span>
										</div>
									</TableCell>
									<TableCell colSpan={3}>
										<LotFileUploader
											lotUploadFileId={file.id}
											lotUploadId={upload.id}
											fileType={file.type}
											accountId={accountId}
											onUploaded={onFileUploaded}
										/>
									</TableCell>
								</TableRow>
							))}
						</>
					</CollapsibleContent>
				</Collapsible>
			)}
		</>
	);
}

interface LotFileUploaderProps {
	lotUploadFileId: string;
	lotUploadId: string;
	fileType: string;
	accountId: string;
	onUploaded: () => void;
}

/**
 * Component for uploading individual lot files for Schwab
 * @param lotUploadFileId - The ID of the lot upload file placeholder
 * @param lotUploadId - The ID of the parent lot upload
 * @param fileType - The type of file expected
 * @param accountId - The account ID
 * @param onUploaded - Callback when file is uploaded
 */
function LotFileUploader({
	lotUploadFileId,
	lotUploadId,
	fileType,
	accountId,
	onUploaded,
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
								portfolioId: '', // This will be set by the backend
								uploadedBy: '', // This will be set by the backend
							},
							lotUploadFileInput: {
								id: lotUploadFileId,
								lotUploadId,
								accountId,
								portfolioId: '', // This will be set by the backend
								type: fileType as LotUploadFileType,
							},
						},
					},
				});

				toast.success(`${fileType} file uploaded successfully`);
				onUploaded();
			} catch (error) {
				console.error('Upload error:', error);
				toast.error(`Failed to upload ${fileType} file`);
			}
		},
	});

	return (
		<div className="w-full">
			<FileUploader
				title=""
				description={`Upload ${fileType} file`}
				maxSize={1024 * 1024 * 2}
				onUpload={async (files: File[]) => {
					await onUpload(files);
					return;
				}}
				loading={isUploading}
				accept={{
					'text/csv': [],
				}}
				multiple={false}
				className="w-full"
			/>
		</div>
	);
}