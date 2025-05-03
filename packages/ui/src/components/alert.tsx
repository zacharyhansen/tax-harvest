import type { VariantProps } from 'class-variance-authority';
import { cn } from '@repo/ui/utils';

import * as React from 'react';

import { alertVariants } from './alert.variants';

const Alert = ({ ref, className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
);
Alert.displayName = 'Alert';

const AlertTitle = ({ ref, className, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { ref?: React.RefObject<HTMLParagraphElement | null> }) => (
  // eslint-disable-next-line jsx-a11y/heading-has-content
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = ({ ref, className, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.RefObject<HTMLParagraphElement | null> }) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription, AlertTitle };
