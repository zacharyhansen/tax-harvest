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
import { toast } from '@repo/ui/components/toast-sonner';
import { ChevronsUpDown, Wallet2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
	usePortfoliosQuery,
	useSwitchPortfolioMutation,
} from '~/generated/gql';
import CreatePortfolioDialog from './CreatePortfolioDialog';
import { usePortfolio } from './providers/PortfolioProvider';

export function PortfolioSwitcher() {
	const { data } = usePortfoliosQuery();
	const { portfolio, reload } = usePortfolio();
	const [switchPortfolio] = useSwitchPortfolioMutation({
		onError: () => {
			toast.error('Unable to switch porfolio');
		},
	});
	const router = useRouter();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="w-full justify-between data-[state=open]:bg-accent"
				>
					<div className="flex items-center gap-2">
						<div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
							<Wallet2 className="size-4" />
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<div className="text-xs">Portfolio</div>
							<span className="truncate text-sm font-semibold">
								{portfolio.name}
							</span>
						</div>
					</div>
					<ChevronsUpDown className="ml-auto size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="min-w-56 rounded-lg"
				align="start"
				side="bottom"
				sideOffset={4}
			>
				<DropdownMenuLabel className="text-muted-foreground text-xs">
					Portfolios
				</DropdownMenuLabel>
				{data?.portfolios.map((portfolio) => (
					<DropdownMenuItem
						key={portfolio.id}
						onClick={() => {
							router.replace('?');
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
