import * as React from "react";
import type { SearchbarStore, SearchbarState } from "./store.js";

export type SearchbarContextValue = {
  store: SearchbarStore;
  /** Stable listbox DOM id — wired to aria-controls on Input */
  listId: string;
  /**
   * Unique id for the Root instance. Used as `data-searchbar-root` on every
   * DOM node that belongs to this searchbar (including portaled content) so
   * the click-outside handler can correctly ignore clicks inside portals.
   */
  rootId: string;
  /** Theme class names forwarded to portaled Content/Overlay. */
  rootClassName?: string;
  /** Whether search is controlled (Input must not mutate store) */
  isSearchControlled?: boolean;
  /** Called when query changes (for controlled mode, Input calls this) */
  onSearchChange?: (query: string) => void;
  /** Ref for the Trigger — Content restores focus here on close */
  triggerRef?: React.RefObject<HTMLElement | null>;
  /** Derive a stable DOM id for a given item value */
  getItemId: (value: string) => string;
  /** Trigger selection of an item by value — handles callbacks + state update */
  onSelect: (value: string) => void;
  /** Set open state — respects controlled mode (Overlay/Escape use this) */
  setOpen: (open: boolean) => void;
  /** Keyboard handler — Input calls this so portal-rendered Inputs get navigation */
  handleKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  /** Register an item's DOM node — called by Item on mount/unmount */
  registerItem: (meta: {
    value: string;
    label: string;
    disabled: boolean;
    node: HTMLElement | null;
    onSelect?: (value: string) => void;
  }) => void;
  /** Unregister an item on unmount */
  unregisterItem: (value: string) => void;
};

const SearchbarContext = React.createContext<SearchbarContextValue | null>(null);

export const SearchbarProvider = SearchbarContext.Provider;

export function useSearchbarContext(): SearchbarContextValue {
  const ctx = React.useContext(SearchbarContext);
  if (!ctx) {
    throw new Error("Searchbar primitives must be used within Searchbar.Root.");
  }
  return ctx;
}

/**
 * Subscribe to a slice of the searchbar store.
 * Re-renders only when the selected slice changes (reference equality).
 *
 * @example
 * const query = useSearchbarStore(ctx.store, (s) => s.query);
 */
export function useSearchbarStore<T>(
  store: SearchbarStore,
  selector: (state: SearchbarState) => T
): T {
  return React.useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState())
  );
}

/** Convenience: read a slice within a component that already has context */
export function useSearchbarState<T>(
  selector: (state: SearchbarState) => T
): T {
  const { store } = useSearchbarContext();
  return useSearchbarStore(store, selector);
}

/** When true, List hides when query is empty (command palette mode) */
export const SearchbarHideListWhenQueryEmptyContext = React.createContext(false);

/** Context for the item currently being rendered (set by Searchbar.Item) */
export const SearchbarItemContext = React.createContext<string | null>(null);

/** Context providing the raw SearchResult when rendered via the Etoile wrapper */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SearchbarItemDataContext = React.createContext<Record<string, any> | null>(null);
