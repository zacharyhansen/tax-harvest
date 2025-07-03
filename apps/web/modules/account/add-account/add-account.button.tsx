import { zodResolver } from '@hookform/resolvers/zod';
import { Button, type ButtonProps } from '@repo/ui/components/button';
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
import { Label } from '@repo/ui/components/label';
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@repo/ui/components/reponsive-dialog';
import { defineStepper } from '@repo/ui/components/stepper';
import { toast } from '@repo/ui/components/toast-sonner';
import InputField from '@repo/ui/form-builder/fields/input.field';

import { useStandardForm } from '@repo/ui/hooks/use-standard-form';
import { DollarSign, Plus, Upload, X } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import {
  FileType,
  PortfolioSummaryDocument,
  useInitAccountFileUploadMutation,
  useUpdateAccountMutation,
  useUpdateAccountRealizedPAndLMutation,
} from '~/generated/gql';
import { useUploadFiles } from '~/modules/fileUpload/useUploadFiles';
import { zodNumber } from '~/modules/utils/zod-utils';
import { AnalyzeStep } from './analyze.step';
import { CompleteStep } from './complete.step';
import { OngoingStep } from './ongoing.step';
import { useApolloClient } from '@apollo/client';

const { useStepper } = defineStepper(
  {
    id: 'upload',
    title: 'Upload Portfolio',
    description:
      'Upload your portfolio CSV file to automatically capture your tax lots',
  },
  {
    id: 'analyze',
    title: 'Analyzing Account',
    description:
      'Building the most optimal strategies for your account based on its current tax lots',
  },
  {
    id: 'complete',
    title: 'Complete',
    description: 'Your account is ready to go!',
  },
  {
    id: 'ongoing',
    title: 'Ongoing Harvests',
    description:
      'Dont miss a single opportunity to Tax Harvest. We use Plaid to securely connect to your brokerage and constantly identify opportunities for you to Tax Harvest',
  }
);

const accountFormSchema = z.object({
  deferredLoss: zodNumber,
  description: z.string().nullable().optional(),
  dividend: zodNumber,
  longTerm: zodNumber,
  shortTerm: zodNumber,
  accountName: z.string(),
});

export function AddAccountButton({ ...props }: ButtonProps) {
  const client = useApolloClient();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [areAnimationsComplete, setAreAnimationsComplete] = useState(false);

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);
  const stepper = useStepper();

  const [createFiles] = useInitAccountFileUploadMutation();

  // Check if both upload and animations are complete, then proceed
  useEffect(() => {
    if (isUploadComplete && areAnimationsComplete) {
      stepper.goTo('complete');
    }
  }, [isUploadComplete, areAnimationsComplete, stepper]);

  // Reset completion states when dialog opens or stepper changes
  useEffect(() => {
    if (stepper.current?.id !== 'analyze') {
      setIsUploadComplete(false);
      setAreAnimationsComplete(false);
    }
  }, [stepper.current?.id]);

  const handleAnimationsComplete = useCallback(() => {
    setAreAnimationsComplete(true);
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
    handleSubmit: () => { },
  });

  const { onUpload } = useUploadFiles({
    defaultUploadedFiles: [],
    onUploadError: () => {
      toast.error('Error uploading files');
      stepper.goTo('upload');
    },
    onFileUploaded: async files => {
      await createFiles({
        variables: {
          fileData: files.map(file => ({
            displayName: file.displayName,
            gcpFilename: file.fileName,
            type: file.type,
            fileType: FileType.EtradeLots,
          })),
          accountData: {
            name: form.getValues('accountName'),
            deferredLoss: form.getValues('deferredLoss'),
            dividend: form.getValues('dividend'),
            longTerm: form.getValues('longTerm'),
            shortTerm: form.getValues('shortTerm'),
          },
        },
        onError: () => {
          stepper.goTo('upload');
        },
        onCompleted: () => {
          setIsUploadComplete(true);
        },
      });
    },
  });

  return (
    <ResponsiveDialog
      onOpenChange={() => {
        client.refetchQueries({
          include: [PortfolioSummaryDocument],
        });
      }}
    >
      <ResponsiveDialogTrigger asChild>
        <Button {...props}>
          <Plus className="mr-2 size-4" />
          Add Account
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent
        className="md:max-w-4xl"
        overlayClassName="bg-background"
      >
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {stepper.switch({
              upload: step => <div>{step.title}</div>,
              analyze: step => <div>{step.title}</div>,
              complete: step => <div>{step.title}</div>,
              ongoing: step => <div>{step.title}</div>,
            })}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {stepper.switch({
              upload: step => step.description,
              analyze: step => step.description,
              complete: step => step.description,
              ongoing: step => step.description,
            })}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogBody>
          {stepper.when('upload', _step => (
            <FormProvider {...form}>
              <div className="p-8">
                {/* Upload Section */}
                <div className="mb-6">
                  <h2 className="mb-3 text-lg font-semibold">
                    Upload Portfolio CSV
                  </h2>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-fit"
                        >
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                            >
                              <X />
                            </Button>
                          </FileUploadItemDelete>
                        </FileUploadItem>
                      ))}
                    </FileUploadList>
                  </FileUpload>
                </div>

                <InputField
                  name="accountName"
                  label="Account Name"
                  type="text"
                />
                {/* Tax Information Grid */}
                <div className="mb-6 grid grid-cols-2 gap-4">
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
          ))}
          {stepper.when('analyze', _step => (
            <AnalyzeStep onAnimationsComplete={handleAnimationsComplete} />
          ))}
          {stepper.when('complete', _step => (
            <CompleteStep />
          ))}
          {stepper.when('ongoing', _step => (
            <OngoingStep />
          ))}
        </ResponsiveDialogBody>
        <ResponsiveDialogFooter>
          {stepper.switch({
            upload: _step => (
              <>
                <ResponsiveDialogClose asChild>
                  <Button variant="outline">Close</Button>
                </ResponsiveDialogClose>
                <Button
                  disabled={files.length === 0}
                  onClick={() =>
                    stepper.afterGoTo('analyze', () => {
                      onUpload(files);
                    })
                  }
                >
                  Next
                </Button>
              </>
            ),
            analyze: _step => (
              <>
                <Button variant="outline" onClick={stepper.prev}>
                  Back
                </Button>
                <Button onClick={stepper.next}>Next</Button>
              </>
            ),
            complete: _step => (
              <>
                <Button variant="outline" onClick={stepper.prev}>
                  Back
                </Button>
                <Button onClick={stepper.next}>Connect Plaid</Button>
              </>
            ),
            ongoing: _step => (
              <>
                <Button variant="outline" onClick={stepper.prev}>
                  Back
                </Button>
                <ResponsiveDialogClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      stepper.reset();
                      client.refetchQueries({
                        include: [PortfolioSummaryDocument],
                      });
                    }}
                  >
                    Skip for now
                  </Button>
                </ResponsiveDialogClose>
              </>
            ),
          })}
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
