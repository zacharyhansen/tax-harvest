import type { FileItemFragment, GcpUploadFile } from '~/generated/gql';
import { toast } from '@repo/ui/components/toast-sonner';
import { useState } from 'react';
import { useSignedUrlsForUploadLazyQuery } from '~/generated/gql';
import { getErrorMessage } from '../utils/get-error-message';

interface UseUploadFileOptions {
  defaultUploadedFiles?: FileItemFragment[];
  accountId?: string;
  onFileUploaded?: (files: GcpUploadFile[]) => Promise<void>;
  onUploadError?: (error: Error) => void;
}

export function useUploadFiles({
  accountId,
  defaultUploadedFiles = [],
  onFileUploaded,
  onUploadError,
}: UseUploadFileOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] =
    useState<FileItemFragment[]>(defaultUploadedFiles);
  const [signedUrls] = useSignedUrlsForUploadLazyQuery();

  const onUpload = async (files: File[]) => {
    setIsUploading(true);

    const fileInput: GcpUploadFile[] = files.map(file => ({
      fileName: `${file.name}_${new Date().getTime()}`, // GCP bucket request are PUT - add uuid to ensure unique
      type: file.type,
      displayName: file.name,
    }));

    return signedUrls({
      onCompleted: async results => {
        // Upload files to GCP using signed urls
        await Promise.all(
          files.map((file, i) =>
            fetch(results.generateSignedUrlsForUpload.uploadUrls[i]!, {
              body: file,
              method: 'PUT',
            })
          )
        ).catch(err => {
          setIsUploading(false);
          console.error(err);
          throw err;
        });

        console.log('onFileUploaded', onFileUploaded);
        if (onFileUploaded) {
          await onFileUploaded(fileInput);
        }
        setIsUploading(false);
      },
      onError: err => {
        toast.error(getErrorMessage(err));
        setIsUploading(false);
        onUploadError?.(err);
      },
      variables: {
        files: fileInput,
      },
    });
  };

  return {
    isUploading,
    onUpload,
    uploadedFiles,
  };
}
