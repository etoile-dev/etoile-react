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
  /** Additional CSS class name (appended to "etoile-search") */
  className?: string;
  /** Child components (SearchInput, SearchResults, etc.) */
  children: React.ReactNode;
  // Internal: custom API base URL for Étoile developers
  baseUrl?: string;
};

/**
 * Root component for Étoile search that provides context to all child components.
 *
 * Manages search state, keyboard navigation, result selection, and accessibility.
 * Automatically applies `etoile-search` class for styling when using the theme.
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
 * @example Dark mode
 * ```tsx
 * <SearchRoot apiKey="your-api-key" collections={["paintings"]} className="dark">
 *   ...
 * </SearchRoot>
 * ```
 */
export const SearchRoot = ({
  apiKey,
  collections,
  limit,
  debounceMs,
  autoFocus = false,
  className,
  children,
  baseUrl,
}: SearchRootProps) => {
  const search = useSearch({ apiKey, collections, limit, debounceMs, baseUrl });
  const listboxId = React.useId();
  const resultRefs = React.useRef(new Map<number, HTMLElement | null>());
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [isOpen, setOpen] = React.useState(false);

  // Open the results list whenever results arrive and query is non-empty
  React.useEffect(() => {
    if (search.results.length > 0 && search.query.trim() !== "") {
      setOpen(true);
    }
  }, [search.results, search.query]);

  // Close results when query is cleared
  React.useEffect(() => {
    if (search.query.trim() === "") {
      setOpen(false);
    }
  }, [search.query]);

  // Click-outside: close results when clicking outside the root element
  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  // Focus-out: close results when focus leaves the component entirely
  const handleFocusOut = (event: React.FocusEvent) => {
    if (
      rootRef.current &&
      event.relatedTarget instanceof Node &&
      !rootRef.current.contains(event.relatedTarget)
    ) {
      setOpen(false);
    }
    // relatedTarget is null when focus moves outside the document (e.g. address bar)
    if (!event.relatedTarget) {
      setOpen(false);
    }
  };

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
      setOpen(true);
      search.setSelectedIndex(search.selectedIndex + 1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
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
      // First Escape closes results, second clears the query
      if (isOpen) {
        setOpen(false);
      } else {
        search.clear();
      }
    }
  };

  const value = React.useMemo(
    () => ({
      ...search,
      isOpen,
      setOpen,
      listboxId,
      getResultId,
      registerResult,
      getResultNode,
      selectActiveResult,
      handleKeyDown,
      autoFocus,
    }),
    [search, isOpen, listboxId, autoFocus]
  );

  return (
    <SearchProvider value={value}>
      <div
        ref={rootRef}
        className={className ? `etoile-search ${className}` : "etoile-search"}
        onBlur={handleFocusOut}
      >
        {children}
      </div>
    </SearchProvider>
  );
};
