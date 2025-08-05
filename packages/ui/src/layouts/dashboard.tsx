import type { ReactNode } from 'react';

import type { NavItem } from './components/nav-main';

import { Separator } from '@repo/ui/components/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@repo/ui/components/sidebar';
import { NavMain } from './components/nav-main';

export type NavGroup = {
  title: string;
  items: NavItem[];
  roles?: string[];
};

export function Dashboard({
  navGroups,
  children,
  pathname,
  header,
  userRole,
  footer,
}: Readonly<{
  navGroups: NavGroup[];
  breadcrumb?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  sidebarOptions?: ReactNode;
  pathname: string;
  header?: ReactNode;
  userRole?: string;
}>) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="h-14">{header ?? null}</SidebarHeader>
        <SidebarContent>
          {navGroups
            .filter(group =>
              group.roles ? group.roles.includes(userRole ?? '') : true
            )
            .map(group => (
              <NavMain
                key={group.title}
                title={group.title}
                items={group.items}
                pathname={pathname}
              />
            ))}
        </SidebarContent>
        <SidebarFooter>
          {footer ?? null}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        {/* <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 sticky top-0 z-50 flex h-14 items-center gap-2 border-b p-2 backdrop-blur-md transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {breadcrumb ?? null}
          </div>
          {sidebarOptions && (
            <div className="ml-auto flex items-center space-x-2 pr-2">
              {sidebarOptions}
            </div>
          )}
        </header> */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
