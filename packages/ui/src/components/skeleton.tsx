import { cn } from '@repo/ui/utils';

function Skeleton({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn('bg-muted animate-pulse rounded-lg', className)}
      {...props}
    />
  );
}

export { Skeleton };
