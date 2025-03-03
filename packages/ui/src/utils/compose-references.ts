// @see https://github.com/radix-ui/primitives/blob/main/packages/react/compose-refs/src/composeRefs.tsx

import * as React from 'react';

type PossibleReference<T> = React.Ref<T> | undefined;

/**
 * Set a given ref to a given value
 * This utility takes care of different types of refs: callback refs and RefObject(s)
 */
function setReference<T>(ref: PossibleReference<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

/**
 * A utility to compose multiple refs together
 * Accepts callback refs and RefObject(s)
 */
function composeReferences<T>(...references: PossibleReference<T>[]) {
  return (node: T) => {
    for (const ref of references) setReference(ref, node);
  };
}

/**
 * A custom hook that composes multiple refs
 * Accepts callback refs and RefObject(s)
 */
function useComposedReferences<T>(...references: PossibleReference<T>[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeReferences(...references), references);
}

export {
  composeReferences as composeRefs,
  useComposedReferences as useComposedRefs,
};
