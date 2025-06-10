'use client';

import type { VariantProps } from 'class-variance-authority';
import { ViewVerticalIcon } from '@radix-ui/react-icons';
import { Slot } from '@radix-ui/react-slot';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';

import { Separator } from '@repo/ui/components/separator';
import { Sheet, SheetContent } from '@repo/ui/components/sheet';

import { Skeleton } from '@repo/ui/components/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { useIsMobile } from '../hooks/use-is-mobile';
import { cn } from '../utils';

const SIDEBAR_COOKIE_NAME = 'sidebar:state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarContextI = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextI | null>(null);

function useSidebar() {
  const context = React.use(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

const SidebarProvider = ({
  ref,
  defaultOpen = true,
  open: openProperty,
  onOpenChange: setOpenProperty,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProperty ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProperty) {
        setOpenProperty(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProperty, open]
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    isMobile ? setOpenMobile(open => !open) : setOpen(open => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? 'expanded' : 'collapsed';

  const contextValue = React.useMemo<SidebarContextI>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={200}>
        <div
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            'group/sidebar-wrapper flex min-h-svh w-full',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
};
SidebarProvider.displayName = 'SidebarProvider';

const Sidebar = ({
  ref,
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
} & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === 'none') {
    return (
      <div
        className={cn(
          'text-sidebar-foreground w-(--sidebar-width) flex h-full flex-col',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-(--sidebar-width) text-sidebar-foreground p-0 [&>button]:hidden"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <div className="flex size-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      ref={ref}
      className="text-sidebar-foreground group peer hidden md:block"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          'w-(--sidebar-width) relative h-svh bg-transparent transition-[width] duration-200 ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
        )}
      />
      <div
        className={cn(
          'w-(--sidebar-width) fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-200 ease-linear md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="group-data-[variant=floating]:border-sidebar-border flex size-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow"
        >
          {children}
        </div>
      </div>
    </div>
  );
};
Sidebar.displayName = 'Sidebar';

const SidebarTrigger = ({
  ref,
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button> & {
  ref?: React.RefObject<React.ElementRef<typeof Button> | null>;
}) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn('h-7 w-7', className)}
      onClick={event => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <ViewVerticalIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarRail = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  ref?: React.RefObject<HTMLButtonElement | null>;
}) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className
      )}
      {...props}
    />
  );
};
SidebarRail.displayName = 'SidebarRail';

const SidebarInset = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'main'> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <main
      ref={ref}
      className={cn(
        'bg-background relative flex h-screen min-h-svh w-full flex-col overflow-x-auto',
        'peer-data-[variant=inset]:min-h-[calc(100svh-(--spacing(4)))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow',
        className
      )}
      {...props}
    />
  );
};
SidebarInset.displayName = 'SidebarInset';

const SidebarInput = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof Input> & {
  ref?: React.RefObject<React.ElementRef<typeof Input> | null>;
}) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        'bg-background focus-visible:ring-sidebar-ring h-8 w-full shadow-none focus-visible:ring-2',
        className
      )}
      {...props}
    />
  );
};
SidebarInput.displayName = 'SidebarInput';

const SidebarHeader = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn('bg-background flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
};
SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
};
SidebarFooter.displayName = 'SidebarFooter';

const SidebarSeparator = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  ref?: React.RefObject<React.ElementRef<typeof Separator> | null>;
}) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn('bg-sidebar-border mx-2 w-auto', className)}
      {...props}
    />
  );
};
SidebarSeparator.displayName = 'SidebarSeparator';

const SidebarContent = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        'bg-background flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className
      )}
      {...props}
    />
  );
};
SidebarContent.displayName = 'SidebarContent';

const SidebarGroup = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
  const { state } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn('relative flex w-full min-w-0 flex-col p-2', className, {
        'px-4': state === 'expanded',
      })}
      {...props}
    />
  );
};
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel = ({
  ref,
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & { asChild?: boolean } & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        'text-sidebar-foreground/70 ring-sidebar-ring outline-hidden flex h-8 shrink-0 items-center rounded-lg px-2 text-xs font-medium transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className
      )}
      {...props}
    />
  );
};
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarGroupAction = ({
  ref,
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean } & {
  ref?: React.RefObject<HTMLButtonElement | null>;
}) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground outline-hidden absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-lg p-0 transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 md:after:hidden',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  );
};
SidebarGroupAction.displayName = 'SidebarGroupAction';

const SidebarGroupContent = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn('w-full text-sm', className)}
    {...props}
  />
);
SidebarGroupContent.displayName = 'SidebarGroupContent';

const SidebarMenu = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'ul'> & {
  ref?: React.RefObject<HTMLUListElement | null>;
}) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn('flex w-full min-w-0 flex-col', className)}
    {...props}
  />
);
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'li'> & {
  ref?: React.RefObject<HTMLLIElement | null>;
}) => {
  return (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn('group/menu-item relative mb-1', className)}
      {...props}
    />
  );
};
SidebarMenuItem.displayName = 'SidebarMenuItem';

const sidebarMenuButtonVariants = cva(
  'cursor-pointer peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-lg p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const SidebarMenuButton = ({
  ref,
  asChild = false,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants> & {
    ref?: React.RefObject<HTMLButtonElement | null>;
  }) => {
  const Comp = asChild ? Slot : 'button';
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== 'collapsed' || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
};
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarMenuAction = ({
  ref,
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean;
  showOnHover?: boolean;
} & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground outline-hidden absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-lg p-0 transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 md:after:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        showOnHover &&
          'peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0',
        className
      )}
      {...props}
    />
  );
};
SidebarMenuAction.displayName = 'SidebarMenuAction';

const SidebarMenuBadge = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      'text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-lg px-1 text-xs font-medium tabular-nums',
      'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsible=icon]:hidden',
      className
    )}
    {...props}
  />
);
SidebarMenuBadge.displayName = 'SidebarMenuBadge';

const SidebarMenuSkeleton = ({
  ref,
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<'div'> & {
  showIcon?: boolean;
} & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn('flex h-8 items-center gap-2 rounded-lg px-2', className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-lg"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="max-w-(--skeleton-width) h-4 flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
    </div>
  );
};
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton';

const SidebarMenuSub = ({
  ref,
  className,
  ...props
}: React.ComponentProps<'ul'> & {
  ref?: React.RefObject<HTMLUListElement | null>;
}) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      'border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
      'group-data-[collapsible=icon]:hidden',
      className
    )}
    {...props}
  />
);
SidebarMenuSub.displayName = 'SidebarMenuSub';

const SidebarMenuSubItem = ({
  ref,
  ...props
}: React.ComponentProps<'li'> & {
  ref?: React.RefObject<HTMLLIElement | null>;
}) => <li ref={ref} {...props} />;
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

const SidebarMenuSubButton = ({
  ref,
  asChild = false,
  size = 'md',
  isActive,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean;
  size?: 'sm' | 'md';
  isActive?: boolean;
} & { ref?: React.RefObject<HTMLAnchorElement | null> }) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground outline-hidden flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-lg px-2 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
        'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  );
};
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  // eslint-disable-next-line react-refresh/only-export-components
  useSidebar,
};
