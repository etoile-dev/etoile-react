import * as React from "react";
import type { SearchResultData } from "./types.js";
import { SearchRoot } from "./components/SearchRoot.js";
import { SearchInput } from "./components/SearchInput.js";
import { SearchResults } from "./components/SearchResults.js";
import { SearchResult } from "./components/SearchResult.js";
import { SearchResultThumbnail } from "./components/SearchResultThumbnail.js";
import { SearchIcon } from "./components/SearchIcon.js";
import { SearchKbd } from "./components/SearchKbd.js";

export type SearchProps = {
    /** Your Étoile API key. Get one at https://etoile.dev */
    apiKey: string;
    /** Collections to search in (e.g., ["paintings", "artists"]) */
    collections: string[];
    /** Maximum number of results to return (default: 10) */
    limit?: number;
    /** Placeholder text for the search input */
    placeholder?: string;
    /** Additional CSS class name (e.g., "dark" for dark mode) */
    className?: string;
    /** Custom render function for each result (optional) */
    renderResult?: (result: SearchResultData) => React.ReactNode;
    // Internal: custom API base URL for Étoile developers
    baseUrl?: string;
};

const DefaultResult = (result: SearchResultData) => (
    <SearchResult>
        <SearchResultThumbnail />
        <div className="etoile-result-content">
            <span className="etoile-result-title">{result.title}</span>
            <span className="etoile-result-subtitle">{result.collection}</span>
        </div>
    </SearchResult>
);

/**
 * All-in-one search component with sensible defaults.
 *
 * Provides a complete, polished search experience out of the box including
 * search icon, keyboard shortcut badge, and result thumbnails. Just import
 * `@etoile-dev/react/styles.css` for styling - no wrapper needed.
 *
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <Search apiKey="your-api-key" collections={["paintings"]} />
 * ```
 *
 * @example Dark mode
 * ```tsx
 * <Search apiKey="your-api-key" collections={["paintings"]} className="dark" />
 * ```
 */
export const Search = ({
    apiKey,
    collections,
    limit,
    placeholder = "Search...",
    className,
    renderResult,
    baseUrl,
}: SearchProps) => {
    return (
        <SearchRoot apiKey={apiKey} collections={collections} limit={limit} className={className} baseUrl={baseUrl}>
            <div className="etoile-input-wrapper">
                <SearchIcon />
                <SearchInput placeholder={placeholder} />
                <SearchKbd />
            </div>
            <SearchResults>{renderResult ?? DefaultResult}</SearchResults>
        </SearchRoot>
    );
};
