'use client';

import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import {
  SidebarMenuButton,
  useSidebar,
} from '@repo/ui/components/sidebar';
import { toast } from '@repo/ui/components/toast-sonner';
import { ChevronsUpDown, Wallet2 } from 'lucide-react';

import {
  usePortfoliosQuery,
  useSwitchPortfolioMutation,
} from '~/generated/gql';
import CreatePortfolioDialog from './CreatePortfolioDialog';

import { usePortfolio } from './providers/PortfolioProvider';

export function PortfolioSwitcher() {
  const { isMobile } = useSidebar();
  const { data } = usePortfoliosQuery();
  const { portfolio, reload } = usePortfolio();
  const [switchPortfolio] = useSwitchPortfolioMutation({
    onError: () => {
      toast.error('Unable to switch porfolio');
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="mb-0 py-0 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
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
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Portfolios
        </DropdownMenuLabel>
        {data?.portfolios.map(portfolio => (
          <DropdownMenuItem
            key={portfolio.id}
            onClick={() => {
              void switchPortfolio({
                onCompleted: reload,
                variables: {
                  porfolioId: portfolio.id,
                },
              });
            }}
            className="gap-2 p-2"
          >
            {/* <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div> */}
            {portfolio.name}
            {/* <DropdownMenuShortcut>
                  ⌘
                  {index + 1}
                </DropdownMenuShortcut> */}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <CreatePortfolioDialog>
          <Button className="w-full" variant="outline">
            Create Portfolio
          </Button>
        </CreatePortfolioDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
