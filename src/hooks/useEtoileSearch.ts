import * as React from "react";
import { Etoile } from "@etoile-dev/client";
import type { SearchFilter, SearchResult } from "@etoile-dev/client";

export type UseEtoileSearchOptions = {
  /** Your Etoile API key */
  apiKey: string;
  /** Collections to search */
  collections: string[];
  /** Current search query (controlled externally, e.g. from Searchbar.Root) */
  query: string;
  /** Maximum results to return (default: 10) */
  limit?: number;
  /** Number of results to skip for pagination (default: 0) */
  offset?: number;
  /** Debounce delay in ms before firing the request (default: 100) */
  debounceMs?: number;
  /**
   * Explicit metadata filters applied to results.
   * Mutually exclusive with `autoFilters`.
   *
   * @example
   * ```tsx
   * filters={[
   *   { key: "artist", operator: "eq", value: "Vincent van Gogh" },
   *   { key: "year", operator: "lte", value: 1900 },
   * ]}
   * ```
   */
  filters?: SearchFilter[];
  /**
   * When true, the AI extracts filters from the query automatically.
   * Returns `appliedFilters` and `refinedQuery` in the result.
   * Mutually exclusive with `filters`.
   *
   * @example
   * ```tsx
   * // Query: "Van Gogh paintings after 1888"
   * // → refinedQuery: "paintings"
   * // → appliedFilters: [{ key: "artist", operator: "eq", value: "Vincent van Gogh" }, ...]
   * autoFilters={true}
   * ```
   */
  autoFilters?: boolean;
  // Internal: override the Etoile API base URL
  baseUrl?: string;
};

export type UseEtoileSearchReturn = {
  /** Results returned by the last successful search. Empty while loading or on error. */
  results: SearchResult[];
  /** True while a fetch is in flight. */
  isLoading: boolean;
  /** Set when the last request failed; null otherwise. */
  error: unknown;
  /** Filters that were applied. Populated when `filters` or `autoFilters` is used. */
  appliedFilters?: SearchFilter[];
  /**
   * Query rewritten by the AI after extracting filters.
   * Only populated when `autoFilters` is `true`.
   */
  refinedQuery?: string;
};

/**
 * Fetch live Etoile results for a query.
 *
 * Handles debouncing, in-flight cancellation, loading, and error state.
 * Use this hook when composing headless primitives with your own layout.
 *
 * @param options - Hook options.
 * @param options.apiKey - Your Etoile API key.
 * @param options.collections - Collections to search in (e.g. `["paintings", "artists"]`).
 * @param options.query - Current query string (controlled externally).
 * @param options.limit - Maximum results to return (default: `10`).
 * @param options.offset - Number of results to skip for pagination (default: `0`).
 * @param options.debounceMs - Debounce delay in ms before firing the request (default: `100`).
 * @param options.filters - Explicit metadata filters. Mutually exclusive with `autoFilters`.
 * @param options.autoFilters - When `true`, the AI extracts filters from the query automatically.
 * @returns Current search state: `results`, `isLoading`, `error`, `appliedFilters`, `refinedQuery`.
 *
 * @example Basic usage
 * ```tsx
 * const [query, setQuery] = useState("");
 * const { results, isLoading } = useEtoileSearch({
 *   apiKey: process.env.ETOILE_API_KEY!,
 *   collections: ["paintings"],
 *   query,
 * });
 * ```
 *
 * @example With explicit filters
 * ```tsx
 * const { results } = useEtoileSearch({
 *   apiKey: process.env.ETOILE_API_KEY!,
 *   collections: ["paintings"],
 *   query,
 *   filters: [{ key: "artist", operator: "eq", value: "Vincent van Gogh" }],
 * });
 * ```
 *
 * @example With AI-powered auto-filters
 * ```tsx
 * // Query: "Van Gogh paintings after 1888"
 * // → refinedQuery: "paintings"
 * // → appliedFilters: [{ key: "artist", operator: "eq", value: "Vincent van Gogh" }, ...]
 * const { results, refinedQuery, appliedFilters } = useEtoileSearch({
 *   apiKey: process.env.ETOILE_API_KEY!,
 *   collections: ["paintings"],
 *   query,
 *   autoFilters: true,
 * });
 * ```
 */
export function useEtoileSearch({
  apiKey,
  collections,
  query,
  limit = 10,
  offset,
  debounceMs = 100,
  filters,
  autoFilters,
  baseUrl,
}: UseEtoileSearchOptions): UseEtoileSearchReturn {
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);
  const [appliedFilters, setAppliedFilters] = React.useState<SearchFilter[] | undefined>(undefined);
  const [refinedQuery, setRefinedQuery] = React.useState<string | undefined>(undefined);

  const client = React.useMemo(
    () => new Etoile({ apiKey, baseUrl }),
    [apiKey, baseUrl]
  );

  // Stable refs so the effect dep array doesn't need filters/autoFilters arrays
  const filtersRef = React.useRef(filters);
  filtersRef.current = filters;
  const autoFiltersRef = React.useRef(autoFilters);
  autoFiltersRef.current = autoFilters;

  // Debounce the raw query
  const [debouncedQuery, setDebouncedQuery] = React.useState(query);
  React.useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(handle);
  }, [query, debounceMs]);

  // Show loading as soon as user types (avoids "no results" flash before debounced fetch)
  React.useEffect(() => {
    if (query.trim() !== "") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [query]);

  // Fetch on debounced query / filter change
  React.useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setResults([]);
      setAppliedFilters(undefined);
      setRefinedQuery(undefined);
      setIsLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setError(null);

    client
      .search({
        collections,
        query: debouncedQuery,
        limit,
        ...(offset !== undefined && { offset }),
        ...(filtersRef.current !== undefined && { filters: filtersRef.current }),
        ...(autoFiltersRef.current !== undefined && { autoFilters: autoFiltersRef.current }),
      })
      .then((res) => {
        if (!active) return;
        setResults(Array.isArray(res.results) ? res.results : []);
        setAppliedFilters(res.appliedFilters);
        setRefinedQuery(res.refinedQuery);
      })
      .catch((err) => {
        if (!active) return;
        setResults([]);
        setAppliedFilters(undefined);
        setRefinedQuery(undefined);
        setError(err);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [client, collections, debouncedQuery, limit, offset]);

  return { results, isLoading, error, appliedFilters, refinedQuery };
}

/**
 * Alias of `useEtoileSearch` for ergonomic imports in examples.
 *
 * @example
 * ```tsx
 * const { results } = useSearch({
 *   apiKey: process.env.ETOILE_API_KEY!,
 *   collections: ["paintings"],
 *   query,
 * });
 * ```
 */
export const useSearch = useEtoileSearch;
