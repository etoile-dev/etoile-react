import * as React from "react";
import type { SearchResultData } from "../types.js";

type SearchContextValue = {
    query: string;
    setQuery: (q: string) => void;
    results: SearchResultData[];
    isLoading: boolean;
    selectedIndex: number;
    setSelectedIndex: (i: number) => void;
    clear: () => void;
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

export const useSearchContext = () => {
    const ctx = React.useContext(SearchContext);
    if (!ctx) {
        throw new Error("Search components must be used within SearchRoot.");
    }
    return ctx;
};
