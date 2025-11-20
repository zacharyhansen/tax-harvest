import { cn } from '@repo/ui/utils';
import type { ReactNode } from 'react';

/**
 * Full-width page wrapper component without sidebar constraints
 * @param children - The content to render
 * @param className - Optional additional CSS classes
 * @example
 * ```tsx
 * <FullWidthPageWrapper>
 *   <MyContent />
 * </FullWidthPageWrapper>
 * ```
 */
export function FullWidthPageWrapper({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={cn('w-full px-6 py-4', className)}>{children}</div>;
}
