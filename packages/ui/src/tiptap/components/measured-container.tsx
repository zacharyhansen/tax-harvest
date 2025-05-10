import * as React from "react";

import { useContainerSize } from "../hooks/use-container-size";

// type MeasuredContainerProps<T extends React.ElementType> = {
//   as: T;
//   name: string;
//   children?: React.ReactNode;
// };

export const MeasuredContainer = (
  // @ts-expect-error - no idea what this is
  { ref, as: Component, name, children, style = {}, ...props },
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
};

MeasuredContainer.displayName = "MeasuredContainer";
