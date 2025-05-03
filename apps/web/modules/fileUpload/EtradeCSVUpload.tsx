import { FileUploader } from '@repo/ui/components/file-uploader';

import { useUploadFiles } from './useUploadFiles';

type EtradeCSVUploadProps = {
  accountId: string;
};

export default function EtradeCSVUpload({ accountId }: EtradeCSVUploadProps) {
  const { isUploading, onUpload } = useUploadFiles({
    accountId,
    defaultUploadedFiles: [],
  });

  return (
    <FileUploader
      title="Add Current Etrade Positions"
      description="The positions will replace any existing positions for this account in the portfolio."
      maxSize={1024 * 1024 * 2}
      onUpload={onUpload}
      disabled={isUploading}
      accept={{
        'text/csv': [],
      }}
    />
  );
}
