import { cn, stringToInitials, stringToTailwindColor } from '@repo/ui/utils';
import type { CellContext } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '../../avatar';
import type { UserObject } from '../../avatar-group';

export default function UserCell<TData, TValue>({
	getValue,
}: CellContext<TData, TValue>) {
	const { email, name, photo } = getValue<UserObject>() || {};

	return (
		<div className="ml-auto flex items-center space-x-2">
			<div className="shrink-0">
				<Avatar>
					<AvatarImage src={photo ?? undefined} alt="avatar" />
					<AvatarFallback
						className={cn(
							'uppercase opacity-80',
							stringToTailwindColor(name ?? email ?? ''),
						)}
					>
						{stringToInitials(name)}
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
