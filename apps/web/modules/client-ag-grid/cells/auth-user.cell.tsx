import type { CustomCellRendererProps } from 'ag-grid-react';
import clsx from 'clsx';
import { Copy } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/toast-sonner';
import { stringToTailwindColor } from '@repo/ui/utils';

import type { TablesFoundation } from '~/lib/database/helpers';

const AuthUserCell = ({
  value,
  slim,
}: CustomCellRendererProps<
  TablesFoundation<'auth_user'>[],
  TablesFoundation<'auth_user'> | null
> & {
  slim?: boolean;
}) => {
  if (!value) {
    return (
      <Button size="sm" variant="outline">
        Unassigned
      </Button>
    );
  }

  const { email, clerk_id, name } = value;

  if (slim) {
    return (
      <div className="my-auto flex h-full items-center space-x-2">
        <div className="truncate text-center text-xs font-medium">{name}</div>
        {email ? (
          <Button
            variant="ghost"
            className="my-0 h-[10px] rounded-sm p-0 text-xs"
            onClick={async event => {
              event.preventDefault();
              event.stopPropagation();
              await navigator.clipboard.writeText(email);
              toast.info('Copied email to clipboard.');
            }}
          >
            <Copy size={12} />
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 p-1">
      <div className="flex-shrink-0">
        <Avatar className="h-8 w-8">
          {/* TODO: add image to user model */}
          <AvatarImage src={undefined} alt="avatar" />
          <AvatarFallback
            className={clsx('uppercase', stringToTailwindColor(clerk_id ?? ''))}
          >
            {name
              ?.split(' ')
              .map(name => name[0])
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col items-start">
        <div className="truncate text-xs font-medium">{name}</div>
        {email ? (
          <Button
            variant="ghost"
            className="h-4 rounded-sm p-0 text-xs"
            iconLeft={<Copy size={12} />}
            onClick={async event => {
              event.preventDefault();
              event.stopPropagation();
              await navigator.clipboard.writeText(email);
              toast.info('Copied email to clipboard.');
            }}
          >
            {email}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default AuthUserCell;
