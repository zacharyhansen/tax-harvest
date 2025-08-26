import { Card } from '@repo/ui/components/card';
import { Skeleton } from '@repo/ui/components/skeleton';

export default function Loading() {
	return (
		<div className="space-y-6">
			{/* Header Loading State */}
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-4 w-96" />
				</div>
				<Skeleton className="h-16 w-48 rounded-lg" />
			</div>

			{/* Cost Basis Pair Cards Loading States */}
			{[1, 2].map((i) => (
				<Card key={i} className="bg-muted overflow-hidden border-0 shadow-sm">
					<div className="bg-muted border-b p-4">
						<Skeleton className="mb-2 h-6 w-48" />
						<Skeleton className="h-4 w-72" />
					</div>

					<div className="divide-border grid gap-0 divide-x md:grid-cols-2">
						{/* Left Position */}
						<LoadingLotCard />
						{/* Right Position */}
						<LoadingLotCard />
					</div>

					<div className="border-t p-4">
						<div className="flex justify-center">
							<Skeleton className="h-10 w-full max-w-xl" />
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}

function LoadingLotCard() {
	return (
		<div className="p-4">
			<div className="mb-2 flex items-center justify-between">
				<div className="flex items-center">
					<Skeleton className="h-8 w-16 rounded-md" />
					<div className="ml-2">
						<Skeleton className="mb-1 h-5 w-24" />
						<Skeleton className="h-4 w-20" />
					</div>
				</div>
				<Skeleton className="h-7 w-24" />
			</div>

			<div className="my-4 grid grid-cols-2 gap-2 text-sm">
				{[1, 2, 3, 4].map((i) => (
					<div key={i}>
						<Skeleton className="mb-1 h-4 w-24" />
						<Skeleton className="h-5 w-20" />
					</div>
				))}
			</div>
		</div>
	);
}
