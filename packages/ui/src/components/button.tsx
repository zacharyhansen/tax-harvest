import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import type * as React from 'react';

import { cn } from '../utils';

import { buttonVariants } from './button.variants';

export type ButtonProps = {
	asChild?: boolean;
	loading?: boolean;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof buttonVariants>;

const Button = ({
	ref,
	asChild = false,
	children,
	className,
	iconLeft,
	iconRight,
	loading,
	size,
	variant,
	...props
}: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			className={cn(buttonVariants({ className, size, variant }))}
			ref={ref}
			{...props}
		>
			{!iconLeft && !iconRight && !loading ? (
				children
			) : (
				<div className="flex items-center space-x-2">
					{iconLeft ? (
						loading ? (
							<Loader2 className="animate-spin" />
						) : (
							iconLeft
						)
					) : null}
					<div>{children}</div>
					{iconRight ? (
						loading ? (
							<Loader2 className="animate-spin" size={12} />
						) : (
							iconRight
						)
					) : null}
					{!iconLeft && !iconRight && loading ? (
						<Loader2 className="animate-spin" />
					) : null}
				</div>
			)}
		</Comp>
	);
};
Button.displayName = 'Button';

export { Button };
