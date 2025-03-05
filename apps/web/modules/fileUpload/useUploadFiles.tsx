import { useState } from 'react';
import { toast } from '@repo/ui/components/toast-sonner';
import { useInsertMutation } from '@supabase-cache-helpers/postgrest-react-query';

import { getErrorMessage } from '~/lib/getErrorMessage';
import { useUser } from '~/modules/user';
import type { Database, Tables } from '~/lib/database/database.types';
import postgrest from '~/lib/database/postgrest';

interface UseUploadFileOptions {
  defaultUploadedFiles?: Tables<'File'>[];
  accountId: string;
}

export function useUploadFiles({
  accountId,
  defaultUploadedFiles = [],
}: UseUploadFileOptions) {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] =
    useState<Tables<'File'>[]>(defaultUploadedFiles);

  const [signedUrls] = useSignedUrlsForUploadLazyQuery();

  const insertFile = useInsertMutation<
    Database,
    Tables<'File'>,
    'File',
    'File',
    '*',
    Tables<'File'>[]
  >(postgrest.from('File'), ['id'], '*', {
    onSuccess: results => {
      results.map(result => {
        result.setUploadedFiles(prev => (prev ? [...prev, result] : [result]));
      });
    },
  });

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

      signedUrls({
        onCompleted: async results => {
          // Upload files to GCP using signed urls
          await Promise.all(
            files.map((file, i) =>
              fetch(results.generateSignedUrlsForUpload.uploadUrls[i], {
                body: file,
                method: 'PUT',
              })
            )
          ).catch(err => {
            console.error(err);
            reject(err);
          });

          // Add records to DB for said files
          const result = await insertFile
            .mutateAsync(
              fileInput.map((file, i) => ({
                accountId,
                displayName: files[i]?.name ?? 'unknown',
                gcpFilename: file.fileName,
                type: file.type,
                uploadedBy: user.id,
              }))
            )
            .then(result => {
              setUploadedFiles(prev => (prev ? [...prev, ...result] : result));
            });

          setIsUploading(false);
          resolve();
        },
        onError: err => {
          toast.error(getErrorMessage(err));
          setIsUploading(false);
          reject();
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
