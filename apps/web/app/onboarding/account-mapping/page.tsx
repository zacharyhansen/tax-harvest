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
import {
  Building2,
  Upload,
  X,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { useApolloClient } from '@apollo/client';
import {
  FileType,
  useInitAccountFileUploadMutation,
  AccountProvider,
  useAccountMappingQuery,
  useProcessCsvAccountsMutation,
} from '~/generated/gql';
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

interface AccountMapping {
  accountId: string;
  accountName: string;
  accountMask?: string;
  accountType?: string;
  hasCSV: boolean;
  files: File[];
  uploadProgress: 'none' | 'uploading' | 'completed' | 'error';
}

/**
 * Account Mapping step that appears after Plaid connection when multiple accounts are linked.
 * Allows users to assign CSV files to each connected account or skip accounts without CSVs.
 */
export default function AccountMappingPage() {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [createFiles] = useInitAccountFileUploadMutation();
  const [processCsvAccounts] = useProcessCsvAccountsMutation();
  const [currentAccountId, setCurrentAccountId] = useState<string | null>(null);
  const [accountMappings, setAccountMappings] = useState<AccountMapping[]>([]);

  // Get recently connected accounts from Plaid
  const { data: accountsData, loading: accountsLoading } =
    useAccountMappingQuery({
      variables: {
        where: {
          provider: { equals: AccountProvider.Plaid },
        },
      },
    });

  // Initialize account mappings when accounts data loads
  useEffect(() => {
    if (accountsData?.accounts && accountMappings.length === 0) {
      const mappings: AccountMapping[] = accountsData.accounts.map(account => {
        const hasFiles = account.files && account.files.length > 0;
        return {
          accountId: account.id,
          accountName: account.name || `Account ${account.plaidAccountMask}`,
          accountMask: account.plaidAccountMask || '',
          accountType: account.type,
          hasCSV: hasFiles,
          files: [], // Keep local files for upload UI
          uploadProgress:
            hasFiles || account.lotSeededDate ? 'completed' : 'none',
        };
      });
      setAccountMappings(mappings);
    }
  }, [accountsData, accountMappings.length]);

  const { form } = useStandardForm<z.infer<typeof accountFormSchema>>({
    defaultValues: {
      deferredLoss: 0,
      description: '',
      dividend: 0,
      longTerm: 0,
      shortTerm: 0,
      accountName: '',
    },
    resolver: zodResolver(accountFormSchema),
    handleSubmit: () => {},
  });

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  const { onUpload } = useUploadFiles({
    defaultUploadedFiles: [],
    onUploadError: () => {
      toast.error('Error uploading files');
      if (currentAccountId) {
        updateAccountMapping(currentAccountId, { uploadProgress: 'error' });
      }
    },
    onFileUploaded: async files => {
      if (!currentAccountId) return;

      form.trigger();
      if (Object.keys(form.formState.errors).length > 0) {
        toast.error('Please fill out all fields');
        updateAccountMapping(currentAccountId, { uploadProgress: 'error' });
        return;
      }

      const { deferredLoss, dividend, longTerm, shortTerm, accountName } =
        accountFormSchema.parse(form.getValues());

      updateAccountMapping(currentAccountId, { uploadProgress: 'uploading' });

      await createFiles({
        variables: {
          fileData: files.map(file => ({
            displayName: file.displayName,
            gcpFilename: file.fileName,
            type: file.type,
            fileType: FileType.EtradeLots,
          })),
          accountId: currentAccountId,
          accountData: {
            name: accountName,
            deferredLoss,
            dividend,
            longTerm,
            shortTerm,
          },
        },
        onError: () => {
          toast.error('Failed to upload CSV for account');
          updateAccountMapping(currentAccountId, { uploadProgress: 'error' });
        },
        onCompleted: () => {
          toast.success(`CSV uploaded successfully for ${accountName}`);
          updateAccountMapping(currentAccountId, {
            uploadProgress: 'completed',
            hasCSV: true,
          });
          // Refetch the query to get updated files
          apolloClient.refetchQueries({
            include: ['AccountMapping'],
          });
          setCurrentAccountId(null);
          form.reset();
        },
      });
    },
  });

  const updateAccountMapping = (
    accountId: string,
    updates: Partial<AccountMapping>
  ) => {
    setAccountMappings(prev =>
      prev.map(mapping =>
        mapping.accountId === accountId ? { ...mapping, ...updates } : mapping
      )
    );
  };

  const handleFileChange = (accountId: string, files: File[]) => {
    updateAccountMapping(accountId, { files });
    if (files.length > 0 && files[0]?.name) {
      const mapping = accountMappings.find(m => m.accountId === accountId);
      if (mapping) {
        form.setValue('accountName', mapping.accountName);
      }
    }
  };

  const handleUploadForAccount = (accountId: string) => {
    const mapping = accountMappings.find(m => m.accountId === accountId);
    if (!mapping || mapping.files.length === 0) {
      toast.error('Please select files first');
      return;
    }

    setCurrentAccountId(accountId);
    form.setValue('accountName', mapping.accountName);
    onUpload(mapping.files);
  };

  const handleSkipAccount = (accountId: string) => {
    updateAccountMapping(accountId, {
      hasCSV: false,
      uploadProgress: 'completed',
    });
  };

  /**
   * Allows users to revert a skipped account back to pending status for CSV upload
   */
  const handleRevertSkip = (accountId: string) => {
    updateAccountMapping(accountId, {
      hasCSV: false,
      uploadProgress: 'none',
      files: [],
    });
  };

  const handleFinish = async () => {
    const incompleteAccounts = accountMappings.filter(
      mapping => mapping.uploadProgress !== 'completed'
    );

    if (incompleteAccounts.length > 0) {
      toast.error('Please complete or skip all accounts before continuing');
      return;
    }

    // Get accounts that have CSV files uploaded
    const accountsWithCsv = accountMappings
      .filter(
        mapping =>
          mapping.uploadProgress === 'completed' &&
          getCurrentCsvFile(mapping.accountId)
      )
      .map(mapping => mapping.accountId);

    if (accountsWithCsv.length > 0) {
      try {
        toast.promise(
          processCsvAccounts({
            variables: { accountIds: accountsWithCsv },
          }),
          {
            loading: 'Processing CSV transactions...',
            success: () => {
              // Refresh all Apollo queries
              apolloClient.refetchQueries({ include: 'all' });
              return 'CSV transactions processed successfully!';
            },
            error: 'Failed to process CSV transactions',
          }
        );
      } catch (error) {
        console.error('Error processing CSV accounts:', error);
        return;
      }
    }

    // Clear any stored onboarding data
    localStorage.removeItem('onboardingAccountId');
    router.push('/main/home');
  };

  const handleSkipAll = () => {
    router.push('/main/home');
  };

  // Helper function to get the current CSV file for an account
  const getCurrentCsvFile = (accountId: string) => {
    const account = accountsData?.accounts.find(acc => acc.id === accountId);
    if (!account?.files || account.files.length === 0) return null;

    // Sort files by creation date (most recent first) and return the first one
    const sortedFiles = [...account.files].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sortedFiles[0];
  };

  if (accountsLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-card rounded-lg border p-8">
          <div className="text-center">
            <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <p className="text-muted-foreground mt-2">Loading accounts...</p>
          </div>
        </div>
      </div>
    );
  }

  // If no accounts need mapping, redirect to complete
  if (!accountsData?.accounts || accountsData.accounts.length === 0) {
    router.push('/main/home');
    return null;
  }

  const completedCount = accountMappings.filter(
    mapping => mapping.uploadProgress === 'completed'
  ).length;

  return (
    <div className="mx-auto max-h-screen w-full max-w-5xl overflow-y-auto">
      <div className="bg-card rounded-lg border">
        <div className="border-b p-6">
          <h1 className="text-2xl font-semibold">Map CSV Files to Accounts</h1>
          <p className="text-muted-foreground mt-1">
            You connected multiple accounts. Please assign CSV files to each
            account or skip accounts without CSV data.
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Progress:</span>
            <span className="font-medium">
              {completedCount} of {accountMappings.length} accounts completed
            </span>
          </div>
        </div>

        <FormProvider {...form}>
          <div className="p-8">
            <div className="space-y-6">
              {accountMappings.map(mapping => (
                <div
                  key={mapping.accountId}
                  className={`rounded-lg border p-6 transition-all ${
                    mapping.uploadProgress === 'completed'
                      ? ''
                      : mapping.uploadProgress === 'error'
                        ? 'border-red-200'
                        : 'border-border'
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="text-primary h-5 w-5" />
                      <div>
                        <h3 className="font-semibold">{mapping.accountName}</h3>
                        <p className="text-muted-foreground text-sm">
                          {mapping.accountType} • ****{mapping.accountMask}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {mapping.uploadProgress === 'completed' && (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      )}
                      {mapping.uploadProgress === 'error' && (
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                      {mapping.uploadProgress === 'uploading' && (
                        <div className="border-primary h-5 w-5 animate-spin rounded-full border-b-2"></div>
                      )}
                    </div>
                  </div>

                  {mapping.uploadProgress === 'completed' && (
                    <div className="mb-4 space-y-3">
                      <div className="text-sm text-green-700 dark:text-green-300">
                        {(() => {
                          const currentFile = getCurrentCsvFile(
                            mapping.accountId
                          );
                          return currentFile ? (
                            <div className="space-y-1">
                              <span className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                CSV file uploaded successfully
                              </span>
                              <div className="text-muted-foreground text-xs">
                                Current file: {currentFile.displayName}
                              </div>
                            </div>
                          ) : (
                            <span>Skipped - no CSV file needed</span>
                          );
                        })()}
                      </div>

                      {getCurrentCsvFile(mapping.accountId) && (
                        <details className="text-sm">
                          <summary className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400">
                            Upload new file
                          </summary>
                          <div className="mt-3 space-y-3 rounded-md border p-3">
                            <div className="text-muted-foreground text-xs">
                              Upload a new CSV file to replace the current one
                            </div>
                            <FileUpload
                              maxFiles={2}
                              maxSize={5 * 1024 * 1024}
                              className="w-full"
                              value={mapping.files}
                              onValueChange={files =>
                                handleFileChange(mapping.accountId, files)
                              }
                              onFileReject={onFileReject}
                              multiple
                              accept="text/csv"
                              // @ts-expect-error not sure why this is complaining
                              disabled={mapping.uploadProgress === 'uploading'}
                            >
                              <FileUploadDropzone className="cursor-pointer py-3">
                                <div className="flex items-center gap-3">
                                  <Upload className="text-muted-foreground h-4 w-4" />
                                  <div className="text-left">
                                    <p className="text-sm">
                                      Drop CSV files or browse files
                                    </p>
                                  </div>
                                </div>
                              </FileUploadDropzone>
                              <FileUploadList>
                                {mapping.files.map(file => (
                                  <FileUploadItem key={file.name} value={file}>
                                    <FileUploadItemPreview />
                                    <FileUploadItemMetadata />
                                    <FileUploadItemDelete asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-7"
                                        disabled={
                                          mapping.uploadProgress === 'uploading'
                                        }
                                      >
                                        <X />
                                      </Button>
                                    </FileUploadItemDelete>
                                  </FileUploadItem>
                                ))}
                              </FileUploadList>
                            </FileUpload>
                          </div>
                        </details>
                      )}
                    </div>
                  )}

                  {mapping.uploadProgress !== 'completed' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-medium">
                          Upload CSV for this account
                        </h4>
                        {(() => {
                          const currentFile = getCurrentCsvFile(
                            mapping.accountId
                          );
                          return currentFile ? (
                            <div className="mb-3 rounded-md border p-3">
                              <div className="text-sm">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span>
                                    Current file: {currentFile.displayName}
                                  </span>
                                </div>
                                <div className="mt-1 text-xs">
                                  This file will be used for processing. Upload
                                  a new file to replace it.
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })()}
                        <div className="mb-3">
                          <CSVUploadHelper />
                        </div>

                        <FileUpload
                          maxFiles={2}
                          maxSize={5 * 1024 * 1024}
                          className="w-full"
                          value={mapping.files}
                          onValueChange={files =>
                            handleFileChange(mapping.accountId, files)
                          }
                          onFileReject={onFileReject}
                          multiple
                          accept="text/csv"
                          disabled={mapping.uploadProgress === 'uploading'}
                        >
                          <FileUploadDropzone className="cursor-pointer py-4">
                            <div className="flex items-center gap-3">
                              <Upload className="text-muted-foreground h-4 w-4" />
                              <div className="flex text-left">
                                <p className="text-sm">
                                  Drop CSV files or browse files
                                </p>
                              </div>
                            </div>
                          </FileUploadDropzone>
                          <FileUploadList>
                            {mapping.files.map(file => (
                              <FileUploadItem key={file.name} value={file}>
                                <FileUploadItemPreview />
                                <FileUploadItemMetadata />
                                <FileUploadItemDelete asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    disabled={
                                      mapping.uploadProgress === 'uploading'
                                    }
                                  >
                                    <X />
                                  </Button>
                                </FileUploadItemDelete>
                              </FileUploadItem>
                            ))}
                          </FileUploadList>
                        </FileUpload>
                      </div>

                      {currentAccountId === mapping.accountId && (
                        <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2">
                          <div>
                            <InputField
                              startIcon={DollarSign}
                              name="shortTerm"
                              label="Short Term Realized P & L"
                              type="number"
                              description="Find yours by navigating to your brokerage settings"
                            />
                          </div>
                          <div>
                            <InputField
                              startIcon={DollarSign}
                              name="longTerm"
                              label="Long Term Realized P & L"
                              type="number"
                              description="Find yours by navigating to your brokerage settings"
                            />
                          </div>
                          <div>
                            <InputField
                              startIcon={DollarSign}
                              name="dividend"
                              label="Dividend"
                              type="number"
                              description="Find yours by navigating to your brokerage settings"
                            />
                          </div>
                          <div>
                            <InputField
                              startIcon={DollarSign}
                              name="deferredLoss"
                              label="Deferred Loss"
                              type="number"
                              description="Find yours by navigating to your brokerage settings"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {/* @ts-expect-error not sure why this is complaining */}
                        {mapping.uploadProgress !== 'completed' ? (
                          <Button
                            variant="outline"
                            onClick={() => handleSkipAccount(mapping.accountId)}
                            disabled={Boolean(
                              mapping.uploadProgress === 'uploading' ||
                                (currentAccountId &&
                                  currentAccountId !== mapping.accountId)
                            )}
                            size="sm"
                          >
                            Skip This Account
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FormProvider>

        <div className="flex justify-between gap-2 border-t p-6">
          <Button
            variant="outline"
            onClick={() => router.push('/onboarding/plaid')}
          >
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSkipAll}>
              Skip for now
            </Button>
            <Button
              onClick={handleFinish}
              disabled={completedCount < accountMappings.length}
            >
              Continue to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
