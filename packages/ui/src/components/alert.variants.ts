import { cva } from 'class-variance-authority';

export const alertVariants = cva(
	'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
	{
		variants: {
			variant: {
				default: 'bg-background text-foreground',
				info: 'border-primary/50 bg-primary/10 text-foreground dark:border-primary',
				destructive:
					'border-destructive/50 bg-destructive/5 text-destructive dark:border-destructive [&>svg]:text-destructive',
				warn: 'border-yellow-600 bg-yellow-300/5 text-yellow-600 dark:border-yellow-600 [&>svg]:text-yellow-600',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);
