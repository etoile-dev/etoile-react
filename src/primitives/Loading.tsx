import * as React from "react";
import { useSearchbarContext, useSearchbarStore } from "../context.js";
import { Slot } from "../utils/slot.js";

export type SearchbarLoadingProps = {
  /** Defaults to a built-in spinner */
  children?: React.ReactNode;
  className?: string;
  asChild?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "role">;

/**
 * Renders only while a search is in progress (isLoading=true).
 * Designed to be placed inside or alongside Searchbar.List.
 *
 * @example
 * ```tsx
 * <Searchbar.List>
 *   {items.map(…)}
 *   <Searchbar.Loading>Searching…</Searchbar.Loading>
 * </Searchbar.List>
 * ```
 */
export const Loading = React.forwardRef<HTMLDivElement, SearchbarLoadingProps>(
  ({ children, className, asChild = false, ...props }, forwardedRef) => {
    const { store } = useSearchbarContext();

    const show = useSearchbarStore(
      store,
      (s) => s.isLoading && s.open && s.query.trim() !== ""
    );

    if (!show) return null;

    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        {...props}
        ref={forwardedRef as React.Ref<HTMLDivElement>}
        role="status"
        aria-label="Loading results"
        className={className}
        data-slot="searchbar-loading"
        data-state="loading"
      >
        {children ?? <DefaultSpinner />}
      </Comp>
    );
  }
);

Loading.displayName = "Searchbar.Loading";

const DefaultSpinner = () => (
  <svg
    data-slot="searchbar-spinner"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
