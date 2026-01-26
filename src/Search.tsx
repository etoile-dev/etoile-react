import * as React from "react";
import type { SearchResultData } from "./types.js";
import { SearchRoot } from "./components/SearchRoot.js";
import { SearchInput } from "./components/SearchInput.js";
import { SearchResults } from "./components/SearchResults.js";
import { SearchResult } from "./components/SearchResult.js";

export type SearchProps = {
    /** Your Étoile API key. Get one at https://etoile.dev */
    apiKey: string;
    /** Collections to search in (e.g., ["paintings", "artists"]) */
    collections: string[];
    /** Maximum number of results to return (default: 10) */
    limit?: number;
    /** Custom render function for each result (optional) */
    renderResult?: (result: SearchResultData) => React.ReactNode;
};

const DefaultResult = (result: SearchResultData) => (
    <SearchResult>{result.title}</SearchResult>
);

/**
 * All-in-one search component with sensible defaults.
 *
 * Provides a complete search experience out of the box. For more customization,
 * use SearchRoot, SearchInput, and SearchResults components individually.
 *
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <Search apiKey="your-api-key" collections={["paintings"]} />
 * ```
 *
 * @example With custom result rendering
 * ```tsx
 * <Search
 *   apiKey="your-api-key"
 *   collections={["paintings"]}
 *   renderResult={(result) => (
 *     <SearchResult>
 *       <h3>{result.title}</h3>
 *       <p>{result.metadata?.artist}</p>
 *     </SearchResult>
 *   )}
 * />
 * ```
 *
 * @example For full customization, use individual components
 * ```tsx
 * <SearchRoot apiKey="your-api-key" collections={["paintings"]}>
 *   <SearchInput placeholder="Search artworks..." />
 *   <SearchResults>
 *     {(result) => <SearchResult>{result.title}</SearchResult>}
 *   </SearchResults>
 * </SearchRoot>
 * ```
 */
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
