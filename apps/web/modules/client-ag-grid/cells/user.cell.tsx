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
import { AvatarGroup } from '@repo/ui/components/avatar-group';
import { stringToTailwindColor } from '@repo/ui/utils';

import type { TablesFoundation } from '~/lib/database/helpers';
const UserCell = ({
  value,
}: CustomCellRendererProps<
  TablesFoundation<'user'>[],
  TablesFoundation<'user'> | TablesFoundation<'user'>[] | null
>) => {
  const users = Array.isArray(value) ? value : value ? [value] : [];

  if (!users.length) {
    return (
      <Button size="sm" variant="outline">
        Unassigned
      </Button>
    );
  }

  if (users.length === 1) {
    const { email, user_id, name } = users[0]!;
    return (
      <div className="flex items-center space-x-2 p-1">
        <div className="flex-shrink-0">
          <Avatar className="h-8 w-8">
            {/* TODO: add image to user model */}
            <AvatarImage src={undefined} alt="avatar" />
            <AvatarFallback
              className={clsx(
                'uppercase opacity-80',
                stringToTailwindColor(user_id)
              )}
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
  }

  return (
    <AvatarGroup
      people={users.map(user => ({
        id: user.user_id ?? '',
        email: user.email ?? '',
        name: user.name ?? '',
        // photo: user?.photo ?? '',
      }))}
    />
  );
};

export default UserCell;
