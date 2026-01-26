import * as React from "react";
import { SearchProvider } from "../context/SearchContext.js";
import { useSearch } from "../hooks/useSearch.js";

export type SearchRootProps = {
  /** Your Étoile API key. Get one at https://etoile.dev */
  apiKey: string;
  /** Collections to search in (e.g., ["paintings", "artists"]) */
  collections: string[];
  /** Maximum number of results to return (default: 10) */
  limit?: number;
  /** Debounce delay in milliseconds before triggering search (default: 100) */
  debounceMs?: number;
  /** Whether the search input should be focused on mount (default: false) */
  autoFocus?: boolean;
  /** Child components (SearchInput, SearchResults, etc.) */
  children: React.ReactNode;
};

/**
 * Root component for Étoile search that provides context to all child components.
 *
 * Manages search state, keyboard navigation, result selection, and accessibility.
 * Wrap your SearchInput and SearchResults components with this root component.
 *
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <SearchRoot apiKey="your-api-key" collections={["paintings"]}>
 *   <SearchInput />
 *   <SearchResults>
 *     {(result) => <SearchResult>{result.title}</SearchResult>}
 *   </SearchResults>
 * </SearchRoot>
 * ```
 *
 * @example With all options
 * ```tsx
 * <SearchRoot
 *   apiKey="your-api-key"
 *   collections={["paintings", "artists"]}
 *   limit={20}
 *   debounceMs={150}
 *   autoFocus
 * >
 *   <SearchInput placeholder="Search artworks..." />
 *   <SearchResults>
 *     {(result) => (
 *       <SearchResult>
 *         <h3>{result.title}</h3>
 *         <p>{result.metadata?.artist}</p>
 *       </SearchResult>
 *     )}
 *   </SearchResults>
 * </SearchRoot>
 * ```
 */
export const SearchRoot = ({
  apiKey,
  collections,
  limit,
  debounceMs,
  autoFocus = false,
  children,
}: SearchRootProps) => {
  const search = useSearch({ apiKey, collections, limit, debounceMs });
  const listboxId = React.useId();
  const resultRefs = React.useRef(new Map<number, HTMLElement | null>());

  const registerResult = (index: number, node: HTMLElement | null) => {
    resultRefs.current.set(index, node);
  };

  const getResultNode = (index: number) => {
    return resultRefs.current.get(index) ?? null;
  };

  const getResultId = (index: number) => `${listboxId}-option-${index}`;

  const selectActiveResult = () => {
    if (search.selectedIndex < 0) {
      return;
    }
    const node = getResultNode(search.selectedIndex);
    if (node && "click" in node) {
      node.click();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      search.setSelectedIndex(search.selectedIndex + 1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      search.setSelectedIndex(search.selectedIndex - 1);
      return;
    }
    if (event.key === "Enter") {
      if (search.selectedIndex >= 0) {
        event.preventDefault();
        selectActiveResult();
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      search.clear();
    }
  };

  const value = React.useMemo(
    () => ({
      ...search,
      listboxId,
      getResultId,
      registerResult,
      getResultNode,
      selectActiveResult,
      handleKeyDown,
      autoFocus,
    }),
    [search, listboxId, autoFocus]
  );

  return <SearchProvider value={value}>{children}</SearchProvider>;
};
