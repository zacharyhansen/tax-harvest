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
import { FileText, Loader2, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import {
	useApplyLotUploadMutation,
	useLotUploadsQuery,
} from '~/generated/gql';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { DateFormatter } from '~/modules/utils/DateFormatter';

interface LotUploadTableProps {
	accountId: string;
}

/**
 * Component that displays a table of lot uploads for an account
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
							upload={upload}
							onApplied={() => refetch()}
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
	onApplied: () => void;
}

/**
 * Individual row component for displaying lot upload information
 * @param upload - The lot upload data to display
 * @param onApplied - Callback when lot upload is applied
 * @example
 * <LotUploadRow upload={upload} onApplied={() => refetch()} />
 */
function LotUploadRow({ upload, onApplied }: LotUploadRowProps) {
	const [isApplying, setIsApplying] = useState(false);
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

	return (
		<TableRow>
			<TableCell>
				<span className="font-medium">{upload.supportedAccountLotProvider}</span>
			</TableCell>
			<TableCell>
				<div className="flex flex-col space-y-1">
					<span className="text-sm">
						{uploadedFiles} / {totalFiles} files
					</span>
					{upload.LotUploadFile.map((file) => (
						<div key={file.id} className="text-xs text-muted-foreground">
							{file.type}: {file.file?.displayName || 'Pending upload'}
						</div>
					))}
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
	);
}