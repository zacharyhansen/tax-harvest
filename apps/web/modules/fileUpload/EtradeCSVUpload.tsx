import { FileUploader } from '@repo/ui/components/file-uploader';
import { useUploadFiles } from './useUploadFiles';
import { CSVUploadHelper } from './CSVUploadHelper';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert } from '@repo/ui/components/alert';
import { AlertTitle } from '@repo/ui/components/alert';
import { AlertDescription } from '@repo/ui/components/alert';
import { getErrorMessage } from '../utils/get-error-message';
import { useCreateFilesMutation } from '~/generated/gql';
import { toast } from '@repo/ui/components/toast-sonner';
import { usePortfolio } from '../portfolio';
import { useUser } from '~/app/main/user.provider';

interface EtradeCSVUploadProps {
  accountId: string;
}

export default function EtradeCSVUpload({ accountId }: EtradeCSVUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [createFiles] = useCreateFilesMutation();
  const { portfolio } = usePortfolio();
  const { user } = useUser();
  const { isUploading, onUpload } = useUploadFiles({
    accountId,
    defaultUploadedFiles: [],
    onUploadError: err => {
      setError(getErrorMessage(err));
    },
    onFileUploaded: async fileInput => {
      setError(null);
      createFiles({
        onCompleted: () => {
          toast.success('Files uploaded successfully');
        },
        onError: err => {
          console.error(err);
          toast.error(getErrorMessage(err));
        },
        variables: {
          data: fileInput.map((file, i) => ({
            accountId,
            displayName: fileInput[i]?.displayName ?? '',
            gcpFilename: file.fileName,
            type: file.type,
            uploadedBy: user.id,
            portfolioId: portfolio.id,
          })),
        },
      });
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
