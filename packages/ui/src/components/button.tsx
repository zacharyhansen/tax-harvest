import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '../utils';

import { buttonVariants } from './button.variants';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      children,
      className,
      iconLeft,
      iconRight,
      loading,
      size,
      variant,
      ...props
    },
    ref
  ) => {
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
  }
);
Button.displayName = 'Button';

export { Button };
