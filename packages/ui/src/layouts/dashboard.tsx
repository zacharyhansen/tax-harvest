import type { ReactNode } from "react";

import type { NavItem } from "./components/nav-main";

import { Separator } from "@repo/ui/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@repo/ui/components/sidebar";
import { NavMain } from "./components/nav-main";

export type NavGroup = {
  title: string;
  items: NavItem[];
  roles?: string[];
};

export function Dashboard({
  navGroups,
  breadcrumb,
  children,
  sidebarOptions,
  pathname,
  header,
  userRole,
}: Readonly<{
  navGroups: NavGroup[];
  breadcrumb: ReactNode;
  children: ReactNode;
  sidebarOptions: ReactNode;
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
            .filter((group) =>
              group.roles ? group.roles.includes(userRole ?? "") : true,
            )
            .map((group) => (
              <NavMain
                key={group.title}
                title={group.title}
                items={group.items}
                pathname={pathname}
              />
            ))}
        </SidebarContent>
        <SidebarFooter>
          {/* <NavUser
            user={{
              name: 'shadcn',
              email: 'm@example.com',
              avatar: 'https://avatars.githubusercontent.com/u/21320719?v=4',
            }}
          /> */}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b p-2 backdrop-blur-md transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {breadcrumb}
          </div>
          <div className="ml-auto flex items-center space-x-2 pr-2">
            {sidebarOptions ?? null}
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
