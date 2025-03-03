'use client';

import { stringToTailwindColor } from '../utils';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

export interface UserObject {
  id: string;
  email?: string | null;
  name?: string | null;
  photo?: string | null;
}

interface AvatarListProps {
  people: UserObject[];
}

export const AvatarGroup = ({ people }: AvatarListProps) => {
  return (
    <div className="flex -space-x-3">
      {people.map(user => (
        <TooltipProvider key={user.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="border-background border-2" key={user.id}>
                <AvatarImage src={user.photo ?? undefined} alt="avatar" />
                <AvatarFallback className={stringToTailwindColor(user.id)}>
                  {user.name?.split(' ').map(name => name[0])}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent className="TooltipContent" sideOffset={5}>
              {user.name ?? user.email}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
