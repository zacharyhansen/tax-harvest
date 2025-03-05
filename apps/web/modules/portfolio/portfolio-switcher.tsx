'use client';

import {
  ChevronsUpDown,
  GalleryHorizontal,
  Plus,
  Wallet,
  Wallet2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@repo/ui/components/sidebar';
import { toast } from '@repo/ui/components/toast-sonner';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';

import { usePortfolio } from './providers/PortfolioProvider';

import { trpc } from '~/lib/trpc';
import postgrest from '~/lib/database/postgrest';

export function PortfolioSwitcher() {
  const { isMobile } = useSidebar();
  const { data } = useQuery(postgrest.from('Portfolio').select('*'));
  const { portfolio, reload } = usePortfolio();
  const mutate = trpc.portfolio.switchPortfolio.useMutation({
    onSuccess: () => {
      reload();
    },
    onError: () => {
      toast.error('Unable to switch porfolio');
    },
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Wallet2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="text-xs">Portfolio</div>
                <span className="truncate text-sm font-semibold">
                  {portfolio.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Portfolios
            </DropdownMenuLabel>
            {data?.map((portfolio, index) => (
              <DropdownMenuItem
                key={portfolio.name}
                onClick={() => {
                  void mutate.mutateAsync({
                    porfolioId: portfolio.id,
                  });
                }}
                className="gap-2 p-2"
              >
                {/* <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div> */}
                {portfolio.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-lg border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Create Portfolio
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
