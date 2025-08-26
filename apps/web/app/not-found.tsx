'use client';

import { Button } from '@repo/ui/components/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { TypedRoutes } from '~/lib/routes';

export default function NotFoundPage() {
	const router = useRouter();

	return (
		<main className="grid min-h-full place-items-center px-6 py-24 text-card-foreground sm:py-32 lg:px-8">
			<div className="text-center">
				<p className="text-base font-semibold text-accent-foreground">404</p>
				<h1 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-5xl">
					Page not found
				</h1>
				<p className="mt-6 text-base leading-7 text-accent-foreground">
					Sorry, we couldn&apos;t find the page you&apos;re looking for.
				</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<Button iconLeft={<ArrowLeft />} onClick={() => router.back()}>
						Go back
					</Button>

					<button
						className="text-sm font-semibold text-accent-foreground"
						type="button"
						onClick={() => {
							window.open('https://support.repo.com', '_blank');
						}}
					>
						Contact support <span aria-hidden="true">&rarr;</span>
					</button>
				</div>
				<Link href={TypedRoutes.home()}>
					<Button
						variant="secondary"
						onClick={() => router.back()}
						className="my-4 w-full"
					>
						Go Home
					</Button>
				</Link>
			</div>
		</main>
	);
}
