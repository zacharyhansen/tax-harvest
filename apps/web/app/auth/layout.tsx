import { ClerkProvider } from '@clerk/nextjs';
import MediaProvider from '@repo/ui/providers/media-provider';
import { ThemeProvider } from '@repo/ui/providers/theme-provider';
import { Tractor } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { AuthInfoOverlay } from './components/AuthInfoOverlay';

export default function AuthLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<ClerkProvider>
			<MediaProvider>
				<ThemeProvider attribute="class">
					<div className="container grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
						<div className="relative hidden h-full flex-col p-14 lg:flex">
							<Link href="/en">
								<div className="relative z-20 flex items-center text-lg font-medium text-white">
									<Tractor className="mr-2" />
									TaxHarvest.ai
								</div>
							</Link>
							<div className="absolute inset-0 m-8 rounded-3xl bg-[url('/images/coverImage.jpg')] bg-cover bg-center bg-no-repeat">
								<AuthInfoOverlay />
							</div>
						</div>
						<div className="flex justify-center lg:p-8">{children}</div>
					</div>
				</ThemeProvider>
			</MediaProvider>
		</ClerkProvider>
	);
}
