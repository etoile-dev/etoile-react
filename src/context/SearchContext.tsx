import * as React from "react";
import type { SearchResultData } from "../types.js";

/**
 * Internal context value for search state and controls.
 * @internal
 */
type SearchContextValue = {
    query: string;
    setQuery: (q: string) => void;
    results: SearchResultData[];
    isLoading: boolean;
    selectedIndex: number;
    setSelectedIndex: (i: number) => void;
    clear: () => void;
    /** Whether the results list is currently open/visible */
    isOpen: boolean;
    /** Open or close the results list */
    setOpen: (open: boolean) => void;
    listboxId: string;
    getResultId: (index: number) => string;
    registerResult: (index: number, node: HTMLElement | null) => void;
    getResultNode: (index: number) => HTMLElement | null;
    selectActiveResult: () => void;
    handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    autoFocus: boolean;
};

const SearchContext = React.createContext<SearchContextValue | null>(null);

export const SearchProvider = SearchContext.Provider;

/**
 * Hook to access search context from child components.
 *
 * Must be used within SearchRoot component. Provides access to search state,
 * results, loading status, and keyboard navigation controls.
 *
 * @throws Error if used outside of SearchRoot
 *
 * @example
 * ```tsx
 * import { useSearchContext } from "@etoile-dev/react";
 *
 * function CustomSearchComponent() {
 *   const { query, results, isLoading, clear } = useSearchContext();
 *
 *   return (
 *     <div>
 *       <p>Searching for: {query}</p>
 *       {isLoading && <span>Loading...</span>}
 *       <button onClick={clear}>Clear</button>
 *       <p>Found {results.length} results</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useSearchContext = () => {
    const ctx = React.useContext(SearchContext);
    if (!ctx) {
        throw new Error("Search components must be used within SearchRoot.");
    }
    return ctx;
};
