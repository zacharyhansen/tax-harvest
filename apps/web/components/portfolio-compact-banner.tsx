'use client';

import NumberFlow from '@number-flow/react';
import { Card, CardContent } from '@repo/ui/components/card';
import { cn } from '@repo/ui/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useOpenHarvests } from '~/modules/hooks/use-open-harvests';
import { MoneyUtil } from '~/modules/utils';

interface PortfolioCompactBannerProps {
	netPosition: number;
	unrealizedGain: number;
	unrealizedLoss: number;
	isVisible?: boolean;
}

export function PortfolioCompactBanner({
	netPosition,
	unrealizedGain,
	unrealizedLoss,
	isVisible = true,
}: PortfolioCompactBannerProps) {
	const { openHarvestCount, hasOpenHarvests } = useOpenHarvests();
	const [shouldShow, setShouldShow] = useState(false);

	useEffect(() => {
		setShouldShow(isVisible);
	}, [isVisible]);

	return (
		<AnimatePresence>
			{shouldShow && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
					className="sticky top-0 z-50 w-full"
				>
					<Card className="shadow-lg border-border/20 backdrop-blur-sm bg-background/95">
						<CardContent className="p-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-4">
									<div className="flex items-center space-x-2">
										<BarChart3 className="text-primary size-4" />
										<span className="text-sm font-medium">
											Portfolio Tax Status
										</span>
									</div>

									<div className="flex items-center space-x-4 text-xs">
										{/* Net Position */}
										<div>
											<span className="text-muted-foreground">
												Net Position
											</span>
											<div
												className={cn(
													'font-semibold',
													MoneyUtil.colored(netPosition),
												)}
											>
												<NumberFlow
													value={netPosition}
													format={{ currency: 'USD', style: 'currency' }}
												/>
											</div>
										</div>

										{/* Unrealized Gain */}
										<div>
											<span className="text-muted-foreground">
												Unrealized Gain
											</span>
											<div
												className={cn(
													'font-semibold',
													MoneyUtil.colored(unrealizedGain),
												)}
											>
												<NumberFlow
													value={unrealizedGain}
													format={{ currency: 'USD', style: 'currency' }}
												/>
											</div>
										</div>

										{/* Unrealized Loss */}
										<div>
											<span className="text-muted-foreground">
												Unrealized Loss
											</span>
											<div
												className={cn(
													'font-semibold',
													MoneyUtil.colored(unrealizedLoss),
												)}
											>
												<NumberFlow
													value={unrealizedLoss}
													format={{ currency: 'USD', style: 'currency' }}
												/>
											</div>
										</div>
									</div>
								</div>

								{/* Pending Harvests Section */}
								{hasOpenHarvests && (
									<div className="flex items-center gap-2">
										<AlertCircle className="h-4 w-4 text-blue-500" />
										<div className="text-xs">
											<span className="text-muted-foreground">
												Pending Harvests:{' '}
											</span>
											<span className="font-semibold text-blue-600">
												{openHarvestCount}
											</span>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
