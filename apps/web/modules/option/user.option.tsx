import { Avatar, AvatarFallback } from '@repo/ui/components/avatar';
import { cn, stringToTailwindColor } from '@repo/ui/utils';

import type { TablesFoundation } from '~/lib/database/helpers';

export function UserOption({
  user,
}: {
  user: Partial<TablesFoundation<'user'>>;
}) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarFallback
          className={cn(
            'text-xs',
            stringToTailwindColor(user.user_id ?? user.email ?? user.name ?? '')
          )}
        >
          {(user.name ?? user.email)
            ?.split(' ')
            .map(name => name[0])
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      {user.name}
    </div>
  );
}
