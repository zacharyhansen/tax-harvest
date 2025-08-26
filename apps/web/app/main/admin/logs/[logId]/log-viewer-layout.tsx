'use client';
import { Button } from '@repo/ui/components/button';
import { type ReactNode, useState } from 'react';

interface LogViewerLayoutProps {
	/** biome-ignore lint/suspicious/noExplicitAny: <ok> */
	data: any;
	children: ReactNode;
}

export function LogViewerLayout({ data, children }: LogViewerLayoutProps) {
	const [showRawJson, setShowRawJson] = useState(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(JSON.stringify(data, null, 2));
	};

	if (showRawJson) {
		return (
			<div className="space-y-4">
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => setShowRawJson(false)}>
						Show Formatted View
					</Button>
					<Button variant="outline" onClick={copyToClipboard}>
						Copy Raw JSON
					</Button>
				</div>
				<pre className="bg-muted overflow-auto rounded-lg p-4 text-sm">
					{JSON.stringify(data, null, 2)}
				</pre>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex gap-2">
				<Button variant="outline" onClick={() => setShowRawJson(true)}>
					Show Raw JSON
				</Button>
				<Button variant="outline" onClick={copyToClipboard}>
					Copy Raw JSON
				</Button>
			</div>
			{children}
		</div>
	);
}
