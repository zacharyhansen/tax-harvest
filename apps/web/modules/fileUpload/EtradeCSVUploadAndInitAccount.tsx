import { FileUploader } from '@repo/ui/components/file-uploader';

// import { useUploadFiles } from './useUploadFiles'
// import { useInitAccountFileUploadMutation } from '~/generated/gql'
// import { usePortfolio } from '~/portfolio/usePortfolio'

interface EtradeCSVUploadProps {
	accountId: string;
}

export default function EtradeCSVUploadAndInitAccount({
	// biome-ignore lint/correctness/noUnusedFunctionParameters: <ok>
	accountId,
}: EtradeCSVUploadProps) {
	// const { portfolioId } = usePortfolio()
	// const [createFiles] = useInitAccountFileUploadMutation()

	// const { isUploading, onUpload } = useUploadFiles({
	//   defaultUploadedFiles: [],
	//   onFileUploaded: async (files) => {
	//     createFiles({
	//       variables: {
	//         data: files.map((file) => ({
	//           accountId,
	//           displayName: file.displayName,
	//           gcpFilename: file.fileName,
	//           type: 'ETRADE_CSV',
	//           uploadedBy: 'ETRADE_CSV_UPLOAD',
	//           portfolioId: portfolioId,
	//         })),
	//       },
	//     })
	//   },
	// })

	return (
		<FileUploader
			title="Add Current Etrade Positions"
			description="The positions will replace any existing positions for this account in the portfolio."
			maxSize={1024 * 1024 * 2}
			onUpload={async () => {}}
			disabled={false}
			accept={{
				'text/csv': [],
			}}
		/>
	);
}
