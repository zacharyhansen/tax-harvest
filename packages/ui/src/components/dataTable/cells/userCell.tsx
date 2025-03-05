import type { CellContext } from '@tanstack/react-table';

import type { UserObject } from '../../../composed/avatars/AvatarGroup';
import { Avatar, AvatarFallback, AvatarImage } from '../../../index';

export default function UserCell<TData, TValue>({
  getValue,
}: CellContext<TData, TValue>) {
  const { email, name, photo } = getValue<UserObject>() || {};

  return (
    <div className="ml-auto flex items-center space-x-2">
      <div className="flex-shrink-0">
        <Avatar>
          <AvatarImage src={photo || undefined} alt="avatar" />
          <AvatarFallback>
            {name?.split(' ').map(name => name[0])}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="ms-4 min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {name}
        </p>
        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
          {email}
        </p>
      </div>
    </div>
  );
}
