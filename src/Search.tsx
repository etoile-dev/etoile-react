import * as React from "react";
import type { SearchResultData } from "./types.js";
import { SearchRoot } from "./components/SearchRoot.js";
import { SearchInput } from "./components/SearchInput.js";
import { SearchResults } from "./components/SearchResults.js";
import { SearchResult } from "./components/SearchResult.js";

export type SearchProps = {
    apiKey?: string;
    collections: string[];
    limit?: number;
    renderResult?: (result: SearchResultData) => React.ReactNode;
};

const DefaultResult = (result: SearchResultData) => (
    <SearchResult>{result.title}</SearchResult>
);

export const Search = ({
    apiKey,
    collections,
    limit,
    renderResult,
}: SearchProps) => {
    return (
        <SearchRoot apiKey={apiKey} collections={collections} limit={limit}>
            <SearchInput />
            <SearchResults>{renderResult ?? DefaultResult}</SearchResults>
        </SearchRoot>
    );
};
