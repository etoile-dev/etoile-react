import * as React from "react";

type ReactRef<T> =
  | React.RefCallback<T>
  | React.RefObject<T>
  | React.MutableRefObject<T>
  | null
  | undefined;

function assignRef<T>(ref: ReactRef<T>, value: T): void {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
  } else {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

/**
 * Merges multiple refs into a single callback ref.
 * Useful for combining a forwarded ref with an internal ref.
 */
export function composeRefs<T>(...refs: ReactRef<T>[]): React.RefCallback<T> {
  return (node: T) => {
    refs.forEach((ref) => assignRef(ref, node));
  };
}

/**
 * Returns a stable composed ref via useMemo.
 */
export function useComposeRefs<T>(...refs: ReactRef<T>[]): React.RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(() => composeRefs(...refs), refs);
}
