import { cva } from 'class-variance-authority';

export const tiptapBaseVariants = cva(
  'border-input focus-within:border-primary flex h-auto w-full flex-col rounded-lg border shadow-sm',
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
  }
);
