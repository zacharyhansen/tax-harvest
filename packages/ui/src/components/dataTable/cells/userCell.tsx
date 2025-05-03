import type { CellContext } from '@tanstack/react-table';

import type { UserObject } from '../../avatar-group';
import { Avatar, AvatarFallback, AvatarImage } from '../../avatar';

export default function UserCell<TData, TValue>({
  getValue,
}: CellContext<TData, TValue>) {
  const { email, name, photo } = getValue<UserObject>() || {};

  return (
    <div className="ml-auto flex items-center space-x-2">
      <div className="shrink-0">
        <Avatar>
          <AvatarImage src={photo ?? undefined} alt="avatar" />
          <AvatarFallback>
            {name?.split(' ').map(name => name[0])}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="ms-4 min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-sm">{email}</p>
      </div>
    </div>
  );
}
