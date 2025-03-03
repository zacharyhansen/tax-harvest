import { AudioWaveform, GalleryVerticalEnd } from 'lucide-react';
import type { ReactNode } from 'react';

import { TeamSwitcher } from './components/team-switcher';
import { NavMain, type NavItem } from './components/nav-main';
import { NavUser } from './components/nav-user';

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

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export function Dashboard({
  navGroups,
  breadcrumb,
  children,
  sidebarOptions,
  pathname,
}: Readonly<{
  navGroups: NavGroup[];
  breadcrumb: ReactNode;
  children: ReactNode;
  sidebarOptions: ReactNode;
  pathname: string;
}>) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <TeamSwitcher
            teams={[
              {
                name: 'Acme Inc',
                logo: GalleryVerticalEnd,
                plan: 'Enterprise',
              },
              {
                name: 'Acme Corp.',
                logo: AudioWaveform,
                plan: 'Startup',
              },
            ]}
          />
        </SidebarHeader>
        <SidebarContent>
          {navGroups.map(group => (
            <NavMain
              key={group.title}
              title={group.title}
              items={group.items}
              pathname={pathname}
            />
          ))}
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              name: 'shadcn',
              email: 'm@example.com',
              avatar: 'https://avatars.githubusercontent.com/u/21320719?v=4',
            }}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b backdrop-blur-md transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
