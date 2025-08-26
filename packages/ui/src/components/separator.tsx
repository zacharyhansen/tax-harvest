'use client';

import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@repo/ui/utils';

import type * as React from 'react';

const Separator = ({
	ref,
	className,
	orientation = 'horizontal',
	decorative = true,
	...props
}: React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
	ref?: React.RefObject<React.ElementRef<
		typeof SeparatorPrimitive.Root
	> | null>;
}) => (
	<SeparatorPrimitive.Root
		ref={ref}
		decorative={decorative}
		orientation={orientation}
		className={cn(
			'bg-border shrink-0',
			orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
			className,
		)}
		{...props}
	/>
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
