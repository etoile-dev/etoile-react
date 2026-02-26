import * as React from "react";
import { useSearchbarContext, useSearchbarStore } from "../context.js";
import { Slot } from "../utils/slot.js";

export type SearchbarEmptyProps = {
  /** Defaults to "No results." */
  children?: React.ReactNode;
  className?: string;
  asChild?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "role">;

/**
 * Renders only when the list is open, query is non-empty, no items match the
 * current filter, and a search is not in progress.
 *
 * @example
 * ```tsx
 * <Searchbar.List>
 *   {items.map(…)}
 *   <Searchbar.Empty>No paintings found.</Searchbar.Empty>
 * </Searchbar.List>
 * ```
 */
export const Empty = React.forwardRef<HTMLDivElement, SearchbarEmptyProps>(
  ({ children = "No results.", className, asChild = false, ...props }, forwardedRef) => {
    const { store } = useSearchbarContext();

    const show = useSearchbarStore(
      store,
      (s) => s.open && s.query.trim() !== "" && s.filteredValues.length === 0 && !s.isLoading
    );

    if (!show) return null;

    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        {...props}
        ref={forwardedRef as React.Ref<HTMLDivElement>}
        role="status"
        className={className}
        data-slot="searchbar-empty"
        data-state="empty"
      >
        {children}
      </Comp>
    );
  }
);

Empty.displayName = "Searchbar.Empty";
