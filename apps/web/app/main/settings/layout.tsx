import type React from 'react';
import { Sidebar } from './sidebar';

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col space-y-6 md:flex-row md:space-x-8 md:space-y-0">
				<aside className="w-56">
					<Sidebar />
				</aside>
				<main className="flex-1 overflow-auto max-h-[calc(100vh-100px)] p-4">
					{children}
				</main>
			</div>
		</div>
	);
}
