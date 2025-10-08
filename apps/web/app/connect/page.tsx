'use client';

import { InstitutionCardList } from './components/institution-card-list';

/**
 * Main connect page that shows existing portfolio connections and new connection options
 *
 * @example
 * User can resume existing connections or start a new connection for a specific institution
 */
export default function ConnectPage() {
	return (
		<div className="bg-background/50 min-h-screen backdrop-blur-sm">
			<div className="flex min-h-screen items-center justify-center p-4">
				<div className="mx-auto max-h-screen w-full max-w-4xl overflow-auto">
					<div className="bg-card rounded-lg border">
						<div className="border-b p-6">
							<h1 className="text-2xl font-semibold">Connect Your Accounts</h1>
							<p className="text-muted-foreground mt-1">
								Resume an existing connection or start a new one
							</p>
						</div>
						<div className="p-8">
							<InstitutionCardList />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
