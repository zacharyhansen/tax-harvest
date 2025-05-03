import type { ReactNode } from 'react';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { EllipsisVerticalIcon } from 'lucide-react';

export default function OptionsCell({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button variant="ghost" className="flex size-full items-center p-0">
          <EllipsisVerticalIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
