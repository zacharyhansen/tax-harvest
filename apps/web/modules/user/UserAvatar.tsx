import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/avatar';

interface UserAvatarProps {
  user?: object;
}

export default function UserAvatar({}: UserAvatarProps) {
  const avatar = (
    <Avatar>
      <AvatarImage src={undefined} alt="avatar" />
      <AvatarFallback>Profile</AvatarFallback>
    </Avatar>
  );

  // if (user?.name || user?.email) {
  //     <Tooltip>
  //       <TooltipTrigger>{avatar}</TooltipTrigger>
  //       <TooltipContent>{user.name || user.email}</TooltipContent>
  //     </Tooltip>
  // }

  return avatar;
}
