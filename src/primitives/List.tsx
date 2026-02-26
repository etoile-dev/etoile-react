import * as React from "react";
import {
  useSearchbarContext,
  useSearchbarStore,
  SearchbarHideListWhenQueryEmptyContext,
} from "../context.js";
import { Slot } from "../utils/slot.js";

export type SearchbarListProps = {
  /** Additional CSS class name */
  className?: string;
  /** Render as child element instead of <div> */
  asChild?: boolean;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "role">;

/**
 * Container for search result items implementing the ARIA listbox role.
 *
 * Renders while the list is open. This allows command-palette flows where
 * the list stays visible even with an empty query (default actions).
 *
 * Place Searchbar.Item, Searchbar.Empty, Searchbar.Loading, and
 * Searchbar.Error inside it.
 *
 * @example
 * ```tsx
 * <Searchbar.List>
 *   {items.map((item) => (
 *     <Searchbar.Item key={item.id} value={item.id}>{item.title}</Searchbar.Item>
 *   ))}
 *   <Searchbar.Empty>No results</Searchbar.Empty>
 *   <Searchbar.Loading>Searching…</Searchbar.Loading>
 * </Searchbar.List>
 * ```
 */
export const List = React.forwardRef<HTMLDivElement, SearchbarListProps>(
  ({ className, asChild = false, children, ...props }, forwardedRef) => {
    const { store, listId } = useSearchbarContext();
    const hideWhenQueryEmpty = React.useContext(SearchbarHideListWhenQueryEmptyContext);

    const isOpen = useSearchbarStore(store, (s) => s.open);
    const query = useSearchbarStore(store, (s) => s.query);

    if (!isOpen) return null;
    if (hideWhenQueryEmpty && query.trim() === "") return null;

    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        {...props}
        ref={forwardedRef as React.Ref<HTMLDivElement>}
        id={listId}
        role="listbox"
        className={className}
        data-state="open"
        data-slot="searchbar-list"
      >
        {children}
      </Comp>
    );
  }
);

List.displayName = "Searchbar.List";
