import type { FileItemFragment, GcpUploadFile } from '~/generated/gql'
import { toast } from '@repo/ui/components/toast-sonner'

import { useState } from 'react'

import { useUser } from '~/app/main/user.provider'
import {
  useCreateFilesMutation,
  useSignedUrlsForUploadLazyQuery,
} from '~/generated/gql'
import { usePortfolio } from '../portfolio'
import { getErrorMessage } from '../utils/get-error-message'

interface UseUploadFileOptions {
  defaultUploadedFiles?: FileItemFragment[]
  accountId?: string
  onFileUploaded?: (files: GcpUploadFile[]) => Promise<void>
  onUploadError?: (error: Error) => void
}

export function useUploadFiles({
  accountId,
  defaultUploadedFiles = [],
  onFileUploaded,
  onUploadError,
}: UseUploadFileOptions) {
  const { user } = useUser()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles]
    = useState<FileItemFragment[]>(defaultUploadedFiles)
  const { portfolio } = usePortfolio()

  const [signedUrls] = useSignedUrlsForUploadLazyQuery()
  const [createFiles] = useCreateFilesMutation()

  const onUpload = async (files: File[]) => {
    setIsUploading(true)

    const fileInput: GcpUploadFile[] = files.map(file => ({
      fileName: `${file.name}_${new Date().getTime()}`, // GCP bucket request are PUT - add uuid to ensure unique
      type: file.type,
      displayName: file.name,
    }))

    return signedUrls({
      onCompleted: async (results) => {
        // Upload files to GCP using signed urls
        await Promise.all(
          files.map((file, i) =>
            fetch(results.generateSignedUrlsForUpload.uploadUrls[i]!, {
              body: file,
              method: 'PUT',
            }),
          ),
        ).catch((err) => {
          console.error(err)
          throw err
        })

        if (onFileUploaded) {
          await onFileUploaded(fileInput)
        } else {
          if (!accountId) {
            throw new Error('Account ID is required to upload files')
          }

          // Add records to DB for said files
          return createFiles({
            onCompleted: ({ createFiles }) => {
              setIsUploading(false)
              setUploadedFiles(prev =>
                prev ? [...prev, ...createFiles] : createFiles,
              )
            },
            onError: (err) => {
              console.error(err)
              setIsUploading(false)
              throw err
            },
            variables: {
              data: fileInput.map((file, i) => ({
                accountId,
                displayName: files[i]?.name ?? '',
                gcpFilename: file.fileName,
                type: file.type,
                uploadedBy: user.id,
                portfolioId: portfolio.id,
              })),
            },
          })
        }
      },
      onError: (err) => {
        toast.error(getErrorMessage(err))
        setIsUploading(false)
        onUploadError?.(err)
      },
      variables: {
        files: fileInput,
      },
    })
  }

  return {
    isUploading,
    onUpload,
    uploadedFiles,
  }
}
