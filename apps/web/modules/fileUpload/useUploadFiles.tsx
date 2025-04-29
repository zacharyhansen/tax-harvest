import { useState } from 'react';
import { toast } from '@repo/ui/components/toast-sonner';

import { getErrorMessage } from '../utils/get-error-message';

import type { FileItemFragment } from '~/generated/gql';
import {
  useCreateFilesMutation,
  useSignedUrlsForUploadLazyQuery,
} from '~/generated/gql';
import { useUser } from '~/app/main/user.provider';

interface UseUploadFileOptions {
  defaultUploadedFiles?: FileItemFragment[];
  accountId: string;
}

export function useUploadFiles({
  accountId,
  defaultUploadedFiles = [],
}: UseUploadFileOptions) {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] =
    useState<FileItemFragment[]>(defaultUploadedFiles);

  const [signedUrls] = useSignedUrlsForUploadLazyQuery();
  const [createFiles] = useCreateFilesMutation();

  const onUpload = async (files: File[]) => {
    return new Promise<void>((resolve, reject) => {
      console.error('started upload');
      setIsUploading(true);
      console.error({ files });

      const fileInput = files.map(file => ({
        fileName: `${file.name}_${new Date().getTime()}`, // GCP bucket request are PUT - add uuid to ensure unique
        type: file.type,
      }));
      console.error({ fileInput });

      void signedUrls({
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
            console.error(err);
            reject(err as Error);
          });

          // Add records to DB for said files
          await createFiles({
            onCompleted: ({ createFiles }) => {
              console.error('setUploadedFiles');

              setUploadedFiles(prev =>
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                prev ? [...prev, ...createFiles] : createFiles
              );
            },
            onError: err => {
              console.error(err);
              reject(err);
            },
            variables: {
              data: fileInput.map((file, i) => ({
                accountId,
                displayName: files[i]?.name ?? '',
                gcpFilename: file.fileName,
                type: file.type,
                uploadedBy: user.id,
              })),
            },
          });
          setIsUploading(false);
          resolve();
        },
        onError: err => {
          toast.error(getErrorMessage(err));
          setIsUploading(false);
          reject(err as Error);
        },
        variables: {
          files: fileInput,
        },
      });
    });
  };

  return {
    isUploading,
    onUpload,
    uploadedFiles,
  };
}
