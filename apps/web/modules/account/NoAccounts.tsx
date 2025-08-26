import { Button } from '@repo/ui/components/button';
import { Wheat } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NoAccounts() {
	const _router = useRouter();

	return (
		<>
			<div className="bg-primary mx-auto flex size-80 items-center justify-center rounded-full">
				<Wheat className="size-[30%]" />
			</div>
			<div className="text-center">
				<h1 className="mt-4 text-lg font-bold tracking-tight sm:text-3xl">
					Connect your first account to start Harvesting
				</h1>
				<p className="text-accent-foreground mt-6 text-base leading-7">
					Once connected, we can harvest tax savings over the lifetime of the
					account.
				</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<Link href="/onboarding/plaid">
						<Button>Connect Account</Button>
					</Link>
					<Link href="https://www.taxharvest.ai/" target="_blank">
						Find out more <span aria-hidden="true">&rarr;</span>
					</Link>
				</div>
			</div>
		</>
	);
}
