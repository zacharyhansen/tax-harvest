import { cva } from 'class-variance-authority';

export const inputVariants = cva(
  'border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-lg border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        ghost:
          'focus-visible:ring-0 focus:outline-none border-none p-0 border-none focus-visible:ring-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
