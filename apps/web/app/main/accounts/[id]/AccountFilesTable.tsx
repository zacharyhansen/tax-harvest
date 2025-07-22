'use client';

import type { AccountFileItemFragment } from '~/generated/gql';
import { Button } from '@repo/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import { Download, FileText } from 'lucide-react';
import { useAccountFilesQuery } from '~/generated/gql';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';
import { DateFormatter } from '~/modules/utils/DateFormatter';

interface AccountFilesTableProps {
  accountId: string;
}

/**
 * Component that displays a table of files attached to an account
 * @param accountId - The ID of the account to show files for
 * @example
 * <AccountFilesTable accountId="account-123" />
 */
export default function AccountFilesTable({
  accountId,
}: AccountFilesTableProps) {
  const { data, error, loading } = useAccountFilesQuery({
    variables: { accountId },
  });

  if (error) {
    return (
      <ErrorPage message="Could not load files at this time. If this issue persists please contact support." />
    );
  }

  if (loading) {
    return <LoadingPage message="Loading files..." />;
  }

  const files = data?.files || [];

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileText className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="text-lg font-medium">No files attached</h3>
        <p className="text-muted-foreground">
          There are no files currently attached to this account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map(file => (
            <FileRow key={file.id} file={file} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface FileRowProps {
  file: AccountFileItemFragment;
}

/**
 * Individual row component for displaying file information
 * @param file - The file data to display
 */
function FileRow({ file }: FileRowProps) {
  const handleDownload = () => {
    // TODO: Implement file download functionality
    console.log('Download file:', file.gcpFilename);
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-2">
          <FileText className="text-muted-foreground h-4 w-4" />
          <span className="font-medium">{file.displayName}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="bg-secondary text-secondary-foreground inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
          {file.type}
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {DateFormatter.shortDay(file.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex items-center space-x-1"
        >
          <Download className="h-3 w-3" />
          <span>Download</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}
