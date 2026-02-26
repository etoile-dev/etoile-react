/**
 * SearchbarStore — external state container for the Searchbar primitives.
 *
 * Uses the subscribe/getSnapshot pattern compatible with useSyncExternalStore,
 * so each component can subscribe to exactly the slice of state it needs and
 * avoid re-rendering on unrelated updates (e.g. a keystroke should not force
 * every item to re-render).
 */

export type ItemMeta = {
  /** Stable identifier matching the `value` prop on Searchbar.Item */
  value: string;
  /** Optional item label (consumer-defined, useful for analytics/debugging). */
  label: string;
  disabled: boolean;
  node: HTMLElement | null;
  /** Per-item select handler — called in addition to root onSelect */
  onSelect?: (value: string) => void;
};

export type SearchbarState = {
  query: string;
  open: boolean;
  selectedValue: string | null;
  isLoading: boolean;
  error: unknown;
  items: Map<string, ItemMeta>;
  /** Registration order — determines keyboard navigation sequence */
  sortedValues: string[];
  /** Subset of enabled items currently rendered in navigation order */
  filteredValues: string[];
  /** Set mirror of filteredValues for O(1) lookup by Item primitives */
  filteredSet: Set<string>;
};

export type SearchbarStore = {
  getState: () => SearchbarState;
  setState: (updater: (prev: SearchbarState) => SearchbarState) => void;
  subscribe: (listener: () => void) => () => void;
};

function deriveFiltered(state: SearchbarState): {
  filteredValues: string[];
  filteredSet: Set<string>;
} {
  const base = state.sortedValues.filter((v) => {
    const item = state.items.get(v);
    return item && !item.disabled;
  });
  return { filteredValues: base, filteredSet: new Set(base) };
}

export function createSearchbarStore(
  initial: Partial<
    Pick<
      SearchbarState,
      "query" | "open" | "selectedValue" | "isLoading"
    >
  > = {}
): SearchbarStore {
  let state: SearchbarState = {
    query: "",
    open: false,
    selectedValue: null,
    isLoading: false,
    error: null,
    items: new Map(),
    sortedValues: [],
    filteredValues: [],
    filteredSet: new Set(),
    ...initial,
  };

  // Compute initial derived state
  const derived = deriveFiltered(state);
  state = { ...state, ...derived };

  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((fn) => fn());

  const shallowEqual = (a: SearchbarState, b: SearchbarState) =>
    a.query === b.query &&
    a.open === b.open &&
    a.selectedValue === b.selectedValue &&
    a.isLoading === b.isLoading &&
    a.error === b.error &&
    a.items === b.items &&
    a.sortedValues === b.sortedValues &&
    a.filteredValues === b.filteredValues;

  return {
    getState: () => state,
    setState: (updater) => {
      const prev = state;
      const next = updater(prev);

      const needsRefilter =
        next.query !== prev.query ||
        next.sortedValues !== prev.sortedValues ||
        next.items !== prev.items;

      const nextState = needsRefilter
        ? { ...next, ...deriveFiltered(next) }
        : next;

      if (shallowEqual(state, nextState)) return;
      state = nextState;
      emit();
    },
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
