import * as React from "react";
import { Etoile } from "@etoile-dev/client";
import type { SearchResultData } from "../types.js";

export type UseSearchOptions = {
    apiKey?: string;
    collections: string[];
    limit?: number;
    debounceMs?: number;
};

export type UseSearchReturn = {
    query: string;
    setQuery: (q: string) => void;
    results: SearchResultData[];
    isLoading: boolean;
    selectedIndex: number;
    setSelectedIndex: (i: number) => void;
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

export const useSearch = ({
    apiKey,
    collections,
    limit = 10,
    debounceMs = 200,
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
                if (!apiKey) {
                    setResults([]);
                    setIsLoading(false);
                    return;
                }
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
