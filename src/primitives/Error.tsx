import * as React from "react";
import { useSearchbarContext, useSearchbarStore } from "../context.js";
import { Slot } from "../utils/slot.js";

export type SearchbarErrorProps = {
  /**
   * Content to render. Can be a node or a render function that receives the
   * current error value.
   */
  children?: React.ReactNode | ((error: unknown) => React.ReactNode);
  className?: string;
  asChild?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "role" | "children">;

/**
 * Renders only when `error` is set on Searchbar.Root.
 *
 * @example
 * ```tsx
 * <Searchbar.Error>
 *   {(err) => `Search failed: ${String(err)}`}
 * </Searchbar.Error>
 * ```
 */
export const Error = React.forwardRef<HTMLDivElement, SearchbarErrorProps>(
  ({ children = "Something went wrong.", className, asChild = false, ...props }, forwardedRef) => {
    const { store } = useSearchbarContext();

    const error = useSearchbarStore(store, (s) => s.error);

    if (!error) return null;

    const Comp = asChild ? Slot : "div";

    const content =
      typeof children === "function"
        ? (children as (err: unknown) => React.ReactNode)(error)
        : children;

    return (
      <Comp
        {...props}
        ref={forwardedRef as React.Ref<HTMLDivElement>}
        role="alert"
        className={className}
        data-slot="searchbar-error"
        data-state="error"
      >
        {content}
      </Comp>
    );
  }
);

Error.displayName = "Searchbar.Error";
