import { FileUploader } from '@repo/ui/components/file-uploader'

import { useUploadFiles } from './useUploadFiles'

interface EtradeCSVUploadProps {
  accountId: string
}

export default function EtradeCSVUpload({ accountId }: EtradeCSVUploadProps) {
  const { isUploading, onUpload } = useUploadFiles({
    accountId,
    defaultUploadedFiles: [],
  })

  const handleUpload = async (files: File[]): Promise<void> => {
    await onUpload(files)
  }

  return (
    <FileUploader
      title="Add Current Etrade Positions"
      description="The positions will replace any existing positions for this account in the portfolio."
      maxSize={1024 * 1024 * 2}
      onUpload={handleUpload}
      disabled={isUploading}
      accept={{
        'text/csv': [],
      }}
    />
  )
}
