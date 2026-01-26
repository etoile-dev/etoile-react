import * as React from "react";
import { Etoile } from "@etoile-dev/client";
import type { SearchResultData } from "../types.js";

export type UseSearchOptions = {
    /** Your Étoile API key. Get one at https://etoile.dev */
    apiKey: string;
    /** Collections to search in (e.g., ["paintings", "artists"]) */
    collections: string[];
    /** Maximum number of results to return (default: 10) */
    limit?: number;
    /** Debounce delay in milliseconds before triggering search (default: 100) */
    debounceMs?: number;
};

export type UseSearchReturn = {
    /** Current search query string */
    query: string;
    /** Update the search query */
    setQuery: (q: string) => void;
    /** Array of search results */
    results: SearchResultData[];
    /** Whether a search is currently in progress */
    isLoading: boolean;
    /** Index of the currently selected result (-1 if none) */
    selectedIndex: number;
    /** Set the selected result index */
    setSelectedIndex: (i: number) => void;
    /** Clear the search query and results */
    clear: () => void;
};

const clampIndex = (index: number, length: number) => {
    if (length <= 0) {
        return -1;
    }
    if (index < 0) {
        return 0;
    }
    if (index > length - 1) {
        return length - 1;
    }
    return index;
};

/**
 * React hook for managing search state with automatic debouncing and API integration.
 *
 * Handles search queries, debouncing, API calls, loading states, and result management.
 * Works seamlessly with Étoile's search API.
 *
 * @param options - Search configuration options
 * @returns Search state and control functions
 *
 * @example
 * ```tsx
 * const { query, setQuery, results } = useSearch({
 *   apiKey: "your-api-key",
 *   collections: ["paintings"],
 * });
 * ```
 *
 * @example With all options
 * ```tsx
 * const { query, setQuery, results, isLoading, clear } = useSearch({
 *   apiKey: "your-api-key",
 *   collections: ["paintings", "artists"],
 *   limit: 20,
 *   debounceMs: 150,
 * });
 * ```
 */
export const useSearch = ({
    apiKey,
    collections,
    limit = 10,
    debounceMs = 100,
}: UseSearchOptions): UseSearchReturn => {
    const [query, setQuery] = React.useState("");
    const [debouncedQuery, setDebouncedQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchResultData[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedIndex, setSelectedIndexState] = React.useState(-1);

    React.useEffect(() => {
        const handle = setTimeout(() => {
            setDebouncedQuery(query);
        }, debounceMs);

        return () => clearTimeout(handle);
    }, [query, debounceMs]);

    React.useEffect(() => {
        let isActive = true;

        if (debouncedQuery.trim() === "") {
            setResults([]);
            setIsLoading(false);
            return () => {
                isActive = false;
            };
        }

        const runSearch = async () => {
            setIsLoading(true);
            try {
                const client = new Etoile({ apiKey });
                const response = await client.search({
                    collections,
                    query: debouncedQuery,
                    limit,
                });
                if (!isActive) {
                    return;
                }
                setResults(Array.isArray(response.results) ? response.results : []);
            } catch {
                if (!isActive) {
                    return;
                }
                setResults([]);
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        runSearch();

        return () => {
            isActive = false;
        };
    }, [apiKey, collections, debouncedQuery, limit]);

    React.useEffect(() => {
        setSelectedIndexState((current: number) => clampIndex(current, results.length));
    }, [results.length]);

    const setSelectedIndex = React.useCallback(
        (index: number) => {
            setSelectedIndexState(clampIndex(index, results.length));
        },
        [results.length]
    );

    const clear = React.useCallback(() => {
        setQuery("");
        setDebouncedQuery("");
        setResults([]);
        setIsLoading(false);
        setSelectedIndexState(-1);
    }, []);

    return {
        query,
        setQuery,
        results,
        isLoading,
        selectedIndex,
        setSelectedIndex,
        clear,
    };
};
