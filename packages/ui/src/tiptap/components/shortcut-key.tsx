import { cn } from '@repo/ui/utils';

import type * as React from 'react';

import { getShortcutKey } from '../utils';

export type ShortcutKeyProps = {
	keys: string[];
} & React.HTMLAttributes<HTMLSpanElement>;

export const ShortcutKey = ({
	ref,
	className,
	keys,
	...props
}: ShortcutKeyProps & { ref?: React.RefObject<HTMLSpanElement | null> }) => {
	const modifiedKeys = keys.map((key) => getShortcutKey(key));
	const ariaLabel = modifiedKeys
		.map((shortcut) => shortcut.readable)
		.join(' + ');

	return (
		// biome-ignore lint/a11y/useAriaPropsSupportedByRole: <ok>
		<span
			aria-label={ariaLabel}
			className={cn('inline-flex items-center gap-0.5', className)}
			{...props}
			ref={ref}
		>
			{modifiedKeys.map((shortcut) => (
				<kbd
					key={shortcut.symbol}
					className={cn(
						'inline-block min-w-2.5 text-center align-baseline font-sans text-xs font-medium capitalize text-[rgb(156,157,160)]',

						className,
					)}
					{...props}
					ref={ref}
				>
					{shortcut.symbol}
				</kbd>
			))}
		</span>
	);
};

ShortcutKey.displayName = 'ShortcutKey';
