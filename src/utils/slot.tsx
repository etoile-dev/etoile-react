/**
 * Slot — enables the `asChild` composition pattern (Radix-style).
 *
 * When a component renders `<Slot>`, it merges its own props onto the single
 * child element instead of rendering its own DOM node. This lets callers swap
 * out the underlying element while keeping all behavior props (event handlers,
 * aria attributes, data-* attributes, ref, className…).
 *
 * Usage:
 *   const Button = ({ asChild, ...props }) => {
 *     const Comp = asChild ? Slot : 'button';
 *     return <Comp {...props} />;
 *   };
 *
 *   // Consumer:
 *   <Button asChild><a href="/search">Search</a></Button>
 *   // Renders: <a href="/search" ...buttonProps>Search</a>
 */

import * as React from "react";
import { composeRefs } from "./composeRefs.js";

type SlotProps = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    if (!React.isValidElement(children)) {
      return null;
    }

    const child = children as React.ReactElement<
      React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
    >;

    return React.cloneElement(child, {
      ...(mergeProps(slotProps as Record<string, unknown>, child.props as Record<string, unknown>) as React.HTMLAttributes<HTMLElement>),
      ref: forwardedRef
        ? composeRefs(forwardedRef, (child as { ref?: React.Ref<HTMLElement> }).ref)
        : (child as { ref?: React.Ref<HTMLElement> }).ref,
    });
  }
);

Slot.displayName = "Slot";

// Merge Slot props onto child props — child props win for most things,
// but event handlers and classNames are composed.
function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...slotProps };

  for (const key of Object.keys(childProps)) {
    const slotVal = slotProps[key];
    const childVal = childProps[key];

    if (key === "className") {
      merged[key] = [slotVal, childVal].filter(Boolean).join(" ") || undefined;
    } else if (
      key.startsWith("on") &&
      typeof slotVal === "function" &&
      typeof childVal === "function"
    ) {
      merged[key] = (...args: unknown[]) => {
        (childVal as (...a: unknown[]) => unknown)(...args);
        (slotVal as (...a: unknown[]) => unknown)(...args);
      };
    } else {
      // Child prop wins (more specific)
      merged[key] = childVal !== undefined ? childVal : slotVal;
    }
  }

  return merged;
}
