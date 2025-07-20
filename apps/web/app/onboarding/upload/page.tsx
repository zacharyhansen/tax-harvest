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
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { FileType, useInitAccountFileUploadMutation } from '~/generated/gql';
import { useUploadFiles } from '~/modules/fileUpload/useUploadFiles';
import { zodNumber } from '~/modules/utils/zod-utils';
import { CSVUploadHelper } from '~/modules/fileUpload/CSVUploadHelper';

const accountFormSchema = z.object({
  deferredLoss: zodNumber,
  description: z.string().nullable().optional(),
  dividend: zodNumber,
  longTerm: zodNumber,
  shortTerm: zodNumber,
  accountName: z.string(),
});

export default function UploadPage() {
  const router = useRouter();
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
      longTerm: 0,
      shortTerm: 0,
      accountName: 'My First Account',
    },
    resolver: zodResolver(accountFormSchema),
    handleSubmit: () => {},
  });

  const { onUpload } = useUploadFiles({
    defaultUploadedFiles: [],
    onUploadError: () => {
      toast.error('Error uploading files');
    },
    onFileUploaded: async files => {
      form.trigger();
      if (Object.keys(form.formState.errors).length > 0) {
        toast.error('Please fill out all fields');
        return;
      }
      const { deferredLoss, dividend, longTerm, shortTerm, accountName } =
        accountFormSchema.parse(form.getValues());
      await createFiles({
        variables: {
          fileData: files.map(file => ({
            displayName: file.displayName,
            gcpFilename: file.fileName,
            type: file.type,
            fileType: FileType.EtradeLots,
          })),
          accountData: {
            name: accountName,
            deferredLoss,
            dividend,
            longTerm,
            shortTerm,
          },
        },
        onError: () => {
          toast.error('Failed to create account');
        },
        onCompleted: (data) => {
          // Store the account ID in localStorage for later use in Plaid linking
          if (data?.initAccountFileUpload?.accountId) {
            localStorage.setItem('onboardingAccountId', data.initAccountFileUpload.accountId);
          }
          router.push('/onboarding/analyze');
        },
      });
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
    <div className="mx-auto max-h-screen w-full max-w-4xl overflow-y-auto">
      <div className="bg-card rounded-lg border">
        <div className="border-b p-6">
          <h1 className="text-2xl font-semibold">Upload Positions</h1>
          <p className="text-muted-foreground mt-1">
            Upload your portfolio CSV file to automatically capture your tax
            lots
          </p>
        </div>

        <FormProvider {...form}>
          <div className="p-8">
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold">
                Upload Positions CSV
              </h2>

              <div className="mb-4">
                <CSVUploadHelper />
              </div>

              <FileUpload
                maxFiles={2}
                maxSize={5 * 1024 * 1024}
                className="w-full"
                value={files}
                onValueChange={setFiles}
                onFileReject={onFileReject}
                multiple
                accept="text/csv"
              >
                <FileUploadDropzone>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="flex items-center justify-center rounded-full border p-2.5">
                      <Upload className="text-muted-foreground size-6" />
                    </div>
                    <p className="text-sm font-medium">
                      Drag & drop files here
                    </p>
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
                  {files.map(file => (
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
                  name="shortTerm"
                  label="Short Term Realized P & L"
                  type="number"
                  description="Find yours by navigating to your Etrade Settings"
                />
              </div>
              <div>
                <InputField
                  startIcon={DollarSign}
                  name="longTerm"
                  label="Long Term Realized P & L"
                  type="number"
                  description="Find yours by navigating to your Etrade Settings"
                />
              </div>
              <div>
                <InputField
                  startIcon={DollarSign}
                  name="dividend"
                  label="Dividend"
                  type="number"
                  description="Find yours by navigating to your Etrade Settings"
                />
              </div>
              <div>
                <InputField
                  startIcon={DollarSign}
                  name="deferredLoss"
                  label="Deferred Loss"
                  type="number"
                  description="Find yours by navigating to your Etrade Settings"
                />
              </div>
            </div>
          </div>
        </FormProvider>

        <div className="flex justify-end gap-2 border-t p-6">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleNext} disabled={files.length === 0}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
