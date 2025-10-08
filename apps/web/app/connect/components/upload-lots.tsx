'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import {
	FileUpload,
	FileUploadDropzone,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadItemMetadata,
	FileUploadItemPreview,
	FileUploadList,
	FileUploadTrigger,
} from '@repo/ui/components/file-upload';
import { toast } from '@repo/ui/components/toast-sonner';
import InputField from '@repo/ui/form-builder/fields/input.field';
import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import { DollarSign, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { useInitAccountFileUploadMutation } from '~/generated/gql';
import { CSVUploadHelper } from '~/modules/fileUpload/CSVUploadHelper';
import { useUploadFiles } from '~/modules/fileUpload/useUploadFiles';
import { zodNumber } from '~/modules/utils/zod-utils';

const accountFormSchema = z.object({
	deferredLoss: zodNumber,
	description: z.string().nullable().optional(),
	dividend: zodNumber,
	longTermCapitalGain: zodNumber,
	shortTermCapitalGain: zodNumber,
	accountName: z.string(),
});

interface UploadLotsProps {
	onSubmit: (accountId: string) => void;
	onBack: () => void;
	portfolioConnectId: string;
}

/**
 * Upload lots component for CSV file upload
 * Used for both Schwab and E*TRADE flows
 *
 * @example
 * ```tsx
 * <UploadLots
 *   accountId={accountId}
 *   onSubmit={(accountId) => {
 *     send({ type: 'schwab.submit' }); // or 'etrade.submit'
 *   }}
 * />
 * ```
 */
export function UploadLots({
	onSubmit,
	onBack,
	portfolioConnectId,
}: UploadLotsProps) {
	const [files, setFiles] = useState<File[]>([]);
	const [createFiles] = useInitAccountFileUploadMutation();

	const onFileReject = useCallback((file: File, message: string) => {
		toast(message, {
			description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
		});
	}, []);

	const { form } = useStandardForm<z.infer<typeof accountFormSchema>>({
		defaultValues: {
			deferredLoss: 0,
			description: '',
			dividend: 0,
			longTermCapitalGain: 0,
			shortTermCapitalGain: 0,
			accountName: 'My Account',
		},
		resolver: zodResolver(accountFormSchema),
		handleSubmit: () => {},
	});

	const { onUpload, isUploading } = useUploadFiles({
		defaultUploadedFiles: [],
		onUploadError: (error) => {
			console.error(error);
			toast.error('Error uploading files');
		},
		onFileUploaded: async (uploadedFiles) => {
			form.trigger();
			if (Object.keys(form.formState.errors).length > 0) {
				toast.error('Please fill out all fields');
				return;
			}
			const {
				deferredLoss,
				dividend,
				longTermCapitalGain,
				shortTermCapitalGain,
				accountName,
			} = accountFormSchema.parse(form.getValues());

			await toast.promise(
				createFiles({
					variables: {
						fileData: uploadedFiles.map((file) => ({
							displayName: file.displayName,
							gcpFilename: file.fileName,
							type: file.type,
						})),
						accountData: {
							name: accountName,
							deferredLoss,
							dividend,
							longTermCapitalGain,
							shortTermCapitalGain,
							portfolioConnectId,
						},
					},
					onCompleted: (data) => {
						const createdAccountId = data?.initAccountFileUpload?.accountId;
						if (createdAccountId) {
							onSubmit(createdAccountId);
						}
					},
				}),
				{
					loading: 'Creating account',
					success: 'Uploaded files successfully',
					error: (error) => {
						setFiles([]);
						return `Failed to upload files: ${error.message}`;
					},
				},
			);
		},
	});

	const handleNext = () => {
		if (files.length === 0) {
			toast.error('Please upload at least one file');
			return;
		}
		onUpload(files);
	};

	return (
		<FormProvider {...form}>
			<div className="p-8">
				<div className="mb-6">
					<h2 className="mb-3 text-lg font-semibold">Upload Positions CSV</h2>

					<div className="mb-4">
						<CSVUploadHelper />
					</div>

					<FileUpload
						maxFiles={2}
						maxSize={5 * 1024 * 1024}
						className="w-full"
						value={files}
						onValueChange={(newFiles) => {
							setFiles(newFiles);
							if (newFiles?.length > 0 && newFiles[0]?.name) {
								form.setValue('accountName', newFiles[0].name);
							}
						}}
						onFileReject={onFileReject}
						multiple
						accept="text/csv"
					>
						<FileUploadDropzone>
							<div className="flex flex-col items-center gap-1 text-center">
								<div className="flex items-center justify-center rounded-full border p-2.5">
									<Upload className="text-muted-foreground size-6" />
								</div>
								<p className="text-sm font-medium">Drag & drop files here</p>
								<p className="text-muted-foreground text-xs">
									Or click to browse (max 2 files, up to 5MB each)
								</p>
							</div>
							<FileUploadTrigger asChild>
								<Button variant="outline" size="sm" className="mt-2 w-fit">
									Browse files
								</Button>
							</FileUploadTrigger>
						</FileUploadDropzone>
						<FileUploadList>
							{files.map((file) => (
								<FileUploadItem key={file.name} value={file}>
									<FileUploadItemPreview />
									<FileUploadItemMetadata />
									<FileUploadItemDelete asChild>
										<Button variant="ghost" size="icon" className="size-7">
											<X />
										</Button>
									</FileUploadItemDelete>
								</FileUploadItem>
							))}
						</FileUploadList>
					</FileUpload>
				</div>

				<InputField name="accountName" label="Account Name" type="text" />

				<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<InputField
							startIcon={DollarSign}
							name="shortTermCapitalGain"
							label="Short Term Realized P & L"
							type="number"
							description="Find yours by navigating to your brokerage settings"
						/>
					</div>
					<div>
						<InputField
							startIcon={DollarSign}
							name="longTermCapitalGain"
							label="Long Term Realized P & L"
							type="number"
							description="Find yours by navigating to your brokerage settings"
						/>
					</div>
					<div>
						<InputField
							startIcon={DollarSign}
							name="dividend"
							label="Dividend"
							type="number"
							description="Find yours by navigating to your brokerage settings"
						/>
					</div>
				</div>

				<div className="flex justify-between border-t pt-6">
					<Button variant="outline" onClick={onBack}>
						Back
					</Button>
					<Button
						onClick={handleNext}
						disabled={files.length === 0 || isUploading}
					>
						Next
					</Button>
				</div>
			</div>
		</FormProvider>
	);
}
