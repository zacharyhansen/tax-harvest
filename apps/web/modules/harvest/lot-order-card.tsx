import { cn } from '@repo/ui/utils';
import { ArrowUpCircle, TrendingDown } from 'lucide-react';
import { Format, MoneyUtil } from '../utils';

export function LotOrderCard({
	assetSymbol,
	pAndL,
	shares,
	totalShares,
	aquiredDate,
	costBasisPerShare,
	currentPricePerShare,
}: {
	assetSymbol: string;
	pAndL: number;
	shares: number;
	totalShares: number;
	aquiredDate: Date;
	costBasisPerShare: number;
	currentPricePerShare: number;
}) {
	const moneyClass = MoneyUtil.colored(pAndL);

	return (
		<div className="p-4">
			<div className="mb-2 flex items-center justify-between">
				<div className="flex items-center">
					<div
						className={cn(
							'flex h-8 items-center justify-center rounded-md px-1 text-xs font-bold',
							moneyClass,
							pAndL > 0 ? 'bg-green-100' : 'bg-red-100',
						)}
					>
						{assetSymbol}
					</div>
					<div className="ml-2">
						<h4 className="font-semibold">{assetSymbol}</h4>
						<div className={`flex items-center text-xs ${moneyClass}`}>
							{pAndL > 0 ? (
								<ArrowUpCircle className="mr-1 size-3" />
							) : (
								<TrendingDown className="mr-1 size-3" />
							)}
							<span>{pAndL > 0 ? 'Gain' : 'Loss'} Position</span>
						</div>
					</div>
				</div>
				<span className={`text-xl font-bold ${moneyClass}`}>
					{Format.money(pAndL, 2)}
				</span>
			</div>

			<div className="my-4 grid grid-cols-2 gap-2 text-sm">
				<div>
					<div className="text-muted-foreground">Quantity</div>
					<div className="font-medium">
						{shares === totalShares ? shares : `${shares} / ${totalShares}`}{' '}
						shares
					</div>
				</div>
				<div>
					<div className="text-muted-foreground">Held For</div>
					<div className="font-medium">{Format.relativeDays(aquiredDate)}</div>
				</div>
				<div>
					<div className="text-muted-foreground">Purchase Price</div>
					<div className="font-medium">
						{Format.money(costBasisPerShare, 2)}
					</div>
				</div>
				<div>
					<div className="text-muted-foreground">Current Price</div>
					<div className="font-medium">
						{Format.money(currentPricePerShare, 2)}
					</div>
				</div>
			</div>
		</div>
	);
}
