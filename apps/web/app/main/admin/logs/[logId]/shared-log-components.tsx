'use client';
import ReactJsonView from '@microlink/react-json-view';
import { Button } from '@repo/ui/components/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

/**
 * Props for the JSON viewer with copy functionality
 */
interface JsonViewerWithCopyProps {
	/** Data to display in JSON format */
	// biome-ignore lint/suspicious/noExplicitAny: <ok>
	data: any;
	/** Title for the card */
	title: string;
	/** Unique key for tracking states */
	stateKey: string;
	/** Whether to show raw JSON by default */
	defaultShowJson?: boolean;
	/** Whether to show toggle button */
	showToggle?: boolean;
	/** Additional content to display when JSON is hidden */
	children?: React.ReactNode;
}

/**
 * Reusable JSON viewer component with copy and toggle functionality
 * @param data - The data to display
 * @param title - Card title
 * @param stateKey - Unique key for state management
 * @param defaultShowJson - Show JSON by default
 * @param showToggle - Show toggle button
 * @param children - Content to show when JSON is hidden
 */
export function JsonViewerWithCopy({
	data,
	title,
	defaultShowJson = false,
	showToggle = true,
	children,
}: JsonViewerWithCopyProps) {
	const [copied, setCopied] = useState(false);
	const [showJson, setShowJson] = useState(defaultShowJson);
	const theme = useTheme();

	/**
	 * Copies data to clipboard as formatted JSON
	 */
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
		}
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>{title}</CardTitle>
				<div className="flex gap-2">
					{showToggle && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowJson(!showJson)}
						>
							{showJson ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
							<span className="ml-1">
								{showJson ? 'Hide JSON' : 'Show JSON'}
							</span>
						</Button>
					)}
					<Button variant="outline" size="sm" onClick={handleCopy}>
						{copied ? (
							<Check className="h-4 w-4" />
						) : (
							<Copy className="h-4 w-4" />
						)}
						<span className="ml-1">{copied ? 'Copied!' : 'Copy JSON'}</span>
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{showJson || !children ? (
					<ReactJsonView
						src={data || {}}
						theme={theme.theme === 'dark' ? 'ashes' : 'rjv-default'}
						displayDataTypes={false}
						indentWidth={6}
					/>
				) : (
					children
				)}
			</CardContent>
		</Card>
	);
}

/**
 * Props for the copy button component
 */
interface CopyButtonProps {
	/** Data to copy */
	// biome-ignore lint/suspicious/noExplicitAny: <ok>
	data: any;
	/** Unique key for tracking copy state */
	stateKey: string;
	/** Button size */
	size?: 'sm' | 'default' | 'lg';
	/** Button variant */
	variant?:
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'link';
}

/**
 * Reusable copy button component
 * @param data - Data to copy as JSON
 * @param stateKey - Unique key for state management
 * @param size - Button size
 * @param variant - Button variant
 */
export function CopyButton({
	data,
	size = 'sm',
	variant = 'outline',
}: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
		}
	};

	return (
		<Button variant={variant} size={size} onClick={handleCopy}>
			{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
			<span className="ml-1">{copied ? 'Copied!' : 'Copy JSON'}</span>
		</Button>
	);
}

/**
 * Hook for managing copy states across multiple items
 */
export function useCopyStates() {
	const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

	// biome-ignore lint/suspicious/noExplicitAny: <ok>
	const copyToClipboard = async (data: any, key: string) => {
		try {
			await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
			setCopiedStates((prev) => ({ ...prev, [key]: true }));
			setTimeout(() => {
				setCopiedStates((prev) => ({ ...prev, [key]: false }));
			}, 2000);
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
		}
	};

	return { copiedStates, copyToClipboard };
}

/**
 * Hook for managing JSON visibility states across multiple items
 */
export function useJsonVisibility() {
	const [showRawJson, setShowRawJson] = useState<Record<string, boolean>>({});

	const toggleRawJson = (key: string) => {
		setShowRawJson((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	return { showRawJson, toggleRawJson };
}
