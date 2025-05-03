import { ChevronRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import { cn } from '../utils';

const Breadcrumb = ({ ref, ...props }: React.ComponentPropsWithoutRef<'nav'> & {
  separator?: React.ReactNode;
} & { ref?: React.RefObject<HTMLElement | null> }) => <nav ref={ref} aria-label="breadcrumb" {...props} />;
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<'ol'> & { ref?: React.RefObject<HTMLOListElement | null> }) => (
  <ol
    ref={ref}
    className={cn(
      'text-muted-foreground flex flex-nowrap items-center gap-1.5 break-words text-sm sm:gap-2.5',
      className,
    )}
    {...props}
  />
);
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<'li'> & { ref?: React.RefObject<HTMLLIElement | null> }) => (
  <li
    ref={ref}
    className={cn('flex items-center gap-1.5 whitespace-nowrap', className)}
    {...props}
  />
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = ({ ref, asChild, className, ...props }: React.ComponentPropsWithoutRef<'a'> & {
  asChild?: boolean;
} & { ref?: React.RefObject<HTMLAnchorElement | null> }) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      ref={ref}
      className={cn(
        'hover:text-foreground inline-block max-w-24 overflow-hidden text-ellipsis transition-colors',
        className,
      )}
      {...props}
    />
  );
};
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<'span'> & { ref?: React.RefObject<HTMLSpanElement | null> }) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn(
      'text-foreground max-w-32 overflow-hidden text-ellipsis font-normal',
      className,
    )}
    {...props}
  />
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  );
}
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      {...props}
    >
      <DotsHorizontalIcon className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis';

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
