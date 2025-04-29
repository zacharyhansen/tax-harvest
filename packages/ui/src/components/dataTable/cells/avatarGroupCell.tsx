import type { CellContext } from '@tanstack/react-table';

import { AvatarGroup, type UserObject } from '../../avatar-group';

export default function AvatarGroupCell<TData, TValue extends UserObject>({
  getValue,
}: CellContext<TData, TValue>) {
  const users = getValue<UserObject[]>();

  return (
    <div className="ml-auto flex items-center space-x-2">
      <div className="flex-shrink-0">
        <AvatarGroup people={users} />
      </div>
    </div>
  );
}
