'use client';

import { Button } from '@repo/ui/components/button';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, ExternalLink, HelpCircle } from 'lucide-react';
import { useState } from 'react';

type ViewState = 'initial' | 'broker-selection' | 'instructions';

type Broker = {
	id: string;
	name: string;
	logo?: string;
	instructions: {
		title: string;
		description?: string;
		steps: Array<{
			text: string;
			image?: string;
			link?: string;
		}>;
	};
};

const brokers: Broker[] = [
	{
		id: 'etrade',
		name: 'E*TRADE',
		instructions: {
			title: 'How to download your E*TRADE positions CSV',
			description:
				'Follow these steps to export your portfolio data from E*TRADE',
			steps: [
				{
					text: 'Log into E*TRADE and navigate to your portfolio',
					link: 'https://us.etrade.com/etx/pxy/portfolios/positions',
				},
				{
					text: 'Expand lot data for each position using the double arrow button in the top left of the positions table',
					image: '/images/etrade/instruction.expand.png',
				},
				{
					text: 'Lots should now show dates.',
					image: '/images/etrade/instruction.expanded.png',
				},
				{
					text: 'Click the download icon in the top right corner of the positions table to export as CSV',
					image: '/images/etrade/instruction.download.png',
				},
			],
		},
	},
	{
		id: 'schwab',
		name: 'Charles Schwab',
		instructions: {
			title: 'How to download your Schwab positions CSV',
			description:
				'Follow these steps to export your portfolio data from Charles Schwab',
			steps: [
				{
					text: 'Log into Schwab and navigate to your Positions page',
					link: 'https://client.schwab.com/app/accounts/positions',
				},
				{
					text: 'Click the "Export" button in the top right corner of the positions table',
				},
				{
					text: 'Select "Tax Lots" from the export options to download the CSV file with complete lot information',
				},
			],
		},
	},
];

export function CSVUploadHelper() {
	const [viewState, setViewState] = useState<ViewState>('initial');
	const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);

	const handleInitialClick = () => {
		setViewState('broker-selection');
	};

	const handleSelectBroker = (broker: Broker) => {
		setSelectedBroker(broker);
		setViewState('instructions');
	};

	const handleBack = () => {
		if (viewState === 'instructions') {
			setViewState('broker-selection');
			setSelectedBroker(null);
		} else if (viewState === 'broker-selection') {
			setViewState('initial');
		}
	};

	return (
		<AnimatePresence mode="wait">
			{viewState === 'initial' ? (
				<motion.button
					key="initial"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={handleInitialClick}
					className="border-muted bg-muted hover:bg-muted hover:text-foreground flex w-full cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors"
				>
					<HelpCircle className="h-4 w-4" />
					<span>Need help finding your CSV?</span>
					<ChevronRight className="ml-auto h-4 w-4" />
				</motion.button>
			) : (
				<motion.div
					key="expanded"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.2 }}
					className="bg-card rounded-lg border p-4"
				>
					<AnimatePresence mode="wait">
						{viewState === 'broker-selection' ? (
							<motion.div
								key="broker-selection"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.2 }}
							>
								<div className="mb-4 flex items-center justify-between">
									<h3 className="font-semibold">Select your broker</h3>
									<Button variant="ghost" size="sm" onClick={handleBack}>
										Back
									</Button>
								</div>
								<div className="grid gap-2">
									{brokers.map((broker) => (
										<Button
											key={broker.id}
											variant="outline"
											className="justify-start"
											onClick={() => handleSelectBroker(broker)}
										>
											{broker.name}
										</Button>
									))}
								</div>
							</motion.div>
						) : viewState === 'instructions' && selectedBroker ? (
							<motion.div
								key="broker-instructions"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{ duration: 0.2 }}
							>
								<div className="mb-4 flex items-center justify-between">
									<h3 className="font-semibold">
										{selectedBroker.instructions.title}
									</h3>
									<Button variant="ghost" size="sm" onClick={handleBack}>
										Back
									</Button>
								</div>

								{selectedBroker.instructions.description && (
									<p className="text-muted-foreground mb-4 text-sm">
										{selectedBroker.instructions.description}
									</p>
								)}

								<ol className="space-y-4">
									{selectedBroker.instructions.steps.map((step, index) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: <ok>
										<li key={index} className="flex gap-3">
											<span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs">
												{index + 1}
											</span>
											<div className="flex-1 space-y-2">
												<p className="text-sm">{step.text}</p>

												{step.link && (
													<a
														href={step.link}
														target="_blank"
														rel="noopener noreferrer"
														className="text-primary inline-flex items-center gap-1 text-xs hover:underline"
													>
														Open in {selectedBroker.name}
														<ExternalLink className="h-3 w-3" />
													</a>
												)}

												{step.image && (
													// biome-ignore lint/performance/noImgElement: <ok>
													<img
														src={step.image}
														alt={`Step ${index + 1}`}
														className="rounded-md border"
													/>
												)}
											</div>
										</li>
									))}
								</ol>

								<div className="bg-muted/50 mt-4 rounded-md p-3">
									<p className="text-muted-foreground text-xs">
										<strong>Tip:</strong> Make sure to expand all lot data
										before downloading to get complete tax lot information.
									</p>
								</div>
							</motion.div>
						) : null}
					</AnimatePresence>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
