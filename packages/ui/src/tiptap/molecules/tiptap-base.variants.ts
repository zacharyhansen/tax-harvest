import { cva } from 'class-variance-authority';

export const tiptapBaseVariants = cva(
  'flex h-auto w-full flex-col rounded-lg border border-input shadow-sm focus-within:border-primary',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'min-h-56',
        mini: 'min-h-44',
        max: 'min-h-72',
      },
    },
  },
);
