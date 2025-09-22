import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { FileUploader } from '@repo/ui/components/file-uploader';
import { toast } from '@repo/ui/components/toast-sonner';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '~/app/main/user.provider';
import { LotUploadsDocument, useInitLotUploadMutation } from '~/generated/gql';
import { usePortfolio } from '../portfolio';
import { getErrorMessage } from '../utils/get-error-message';
import { CSVUploadHelper } from './CSVUploadHelper';
import { useUploadFiles } from './useUploadFiles';

interface EtradeCSVUploadProps {
	accountId: string;
}

export default function EtradeCSVUpload({ accountId }: EtradeCSVUploadProps) {
	const [error, setError] = useState<string | null>(null);
	const [createFiles] = useInitLotUploadMutation();
	const { portfolio } = usePortfolio();
	const { user } = useUser();
	const { isUploading, onUpload } = useUploadFiles({
		accountId,
		defaultUploadedFiles: [],
		onUploadError: (err) => {
			setError(getErrorMessage(err));
		},
		onFileUploaded: async (fileInput) => {
			setError(null);
			const file = fileInput[0];
			if (!file) {
				toast.error('No file uploaded');
				return;
			}
			toast.promise(
				createFiles({
					onCompleted: () => {
						return Promise.resolve();
					},
					onError: (err) => {
						throw err;
					},
					variables: {
						input: {
							accountId,
							displayName: file.displayName,
							gcpFilename: file.fileName,
							type: file.type,
							uploadedBy: user.id,
							portfolioId: portfolio.id,
						},
					},
					refetchQueries: [LotUploadsDocument],
				}),
				{
					loading: 'Uploading files...',
					success: 'Files uploaded successfully',
					error: 'Failed to upload files',
				},
			);
		},
	});

	return (
		<div className="space-y-4">
			<CSVUploadHelper />
			<FileUploader
				title="Add Current Etrade Positions"
				description="The positions will replace any existing positions for this account in the portfolio."
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
			/>
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="size-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
