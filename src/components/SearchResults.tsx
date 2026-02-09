import * as React from "react";
import { useSearchContext } from "../context/SearchContext.js";
import type { SearchResultData } from "../types.js";

export type SearchResultsProps = {
  /** CSS class name for the results container */
  className?: string;
  /** Render function that receives each search result */
  children: (result: SearchResultData) => React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const SearchResultIndexContext = React.createContext<number | null>(null);
export const SearchResultDataContext = React.createContext<SearchResultData | null>(null);

/**
 * Container component for rendering search results with keyboard navigation.
 *
 * Accepts a render function that receives each result. Automatically hides
 * when query is empty or no results found. Includes ARIA listbox role.
 * Accepts standard div props like onScroll and style.
 *
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <SearchResults>
 *   {(result) => <SearchResult>{result.title}</SearchResult>}
 * </SearchResults>
 * ```
 *
 * @example With styling and metadata
 * ```tsx
 * <SearchResults className="mt-2 border rounded-lg">
 *   {(result) => (
 *     <SearchResult className="p-4 hover:bg-gray-50">
 *       <h3>{result.title}</h3>
 *       <p>{result.metadata?.artist}</p>
 *     </SearchResult>
 *   )}
 * </SearchResults>
 * ```
 */
export const SearchResults = ({
  className,
  children,
  ...props
}: SearchResultsProps) => {
  const { query, results, isOpen, selectedIndex, listboxId, getResultNode } =
    useSearchContext();
  const listboxRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (selectedIndex < 0) {
      return;
    }
    const activeNode = getResultNode(selectedIndex);
    activeNode?.scrollIntoView({ block: "nearest" });
    if (
      activeNode &&
      listboxRef.current &&
      listboxRef.current.contains(document.activeElement)
    ) {
      activeNode.focus();
    }
  }, [getResultNode, selectedIndex]);

  if (!isOpen || query.trim() === "" || results.length === 0) {
    return null;
  }

  return (
    <div
      {...props}
      role="listbox"
      id={listboxId}
      className={className}
      ref={listboxRef}
    >
      {results.map((result, index) => (
        <SearchResultIndexContext.Provider value={index} key={result.external_id}>
          <SearchResultDataContext.Provider value={result}>
            {children(result)}
          </SearchResultDataContext.Provider>
        </SearchResultIndexContext.Provider>
      ))}
    </div>
  );
};
