import * as React from 'react';

import { useContainerSize } from '../hooks/use-container-size';

interface MeasuredContainerProps<T extends React.ElementType> {
  as: T;
  name: string;
  children?: React.ReactNode;
}

export const MeasuredContainer = React.forwardRef(
  <T extends React.ElementType>(
    {
      as: Component,
      name,
      children,
      style = {},
      ...props
    }: MeasuredContainerProps<T> & React.ComponentProps<T>,
    ref: React.Ref<HTMLElement>
  ) => {
    const innerReference = React.useRef<HTMLElement>(null);
    const rect = useContainerSize(innerReference.current);

    React.useImperativeHandle(ref, () => innerReference.current!);

    const customStyle = {
      [`--${name}-width`]: `${rect.width}px`,
      [`--${name}-height`]: `${rect.height}px`,
    };

    return (
      <Component
        {...props}
        ref={innerReference}
        style={{ ...customStyle, ...style }}
      >
        {children}
      </Component>
    );
  }
);

MeasuredContainer.displayName = 'MeasuredContainer';
