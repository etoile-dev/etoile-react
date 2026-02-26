import * as React from "react";
import type { SearchResult } from "@etoile-dev/client";
import { SearchbarItemDataContext } from "../context.js";
import { Item } from "./Item.js";
import { Empty } from "./Empty.js";
import { Loading } from "./Loading.js";
import { Error as ErrorPrimitive } from "./Error.js";
import type { SearchbarErrorProps } from "./Error.js";

export type SearchbarResultsProps<T = SearchResult> = {
  /** Array of results to render */
  results: readonly T[];
  /**
   * Custom renderer for each result.
   * If omitted, a minimal `Searchbar.Item` is rendered using `getValue`/`getLabel`.
   */
  renderItem?: (result: T, index: number) => React.ReactNode;
  /**
   * Derive the stable item value.
   * Default tries `result.external_id` and falls back to the index.
   */
  getValue?: (result: T, index: number) => string;
  /**
   * Derive the human-readable label for ARIA/debugging.
   * Default tries `result.title` and falls back to the value.
   */
  getLabel?: (result: T, index: number) => string;
  /**
   * Empty-state content. Pass `null` to hide `Searchbar.Empty`.
   * Defaults to the primitive fallback ("No results.").
   */
  empty?: React.ReactNode | null;
  /**
   * Loading-state content. Pass `null` to hide `Searchbar.Loading`.
   * Defaults to the primitive spinner.
   */
  loading?: React.ReactNode | null;
  /**
   * Error-state content. Pass `null` to hide `Searchbar.Error`.
   * Accepts a node or a render function receiving the current error.
   */
  error?: SearchbarErrorProps["children"] | null;
};

function defaultGetValue(result: unknown, index: number): string {
  if (result && typeof result === "object" && "external_id" in result) {
    const externalId = (result as { external_id?: unknown }).external_id;
    if (typeof externalId === "string" && externalId.length > 0) {
      return externalId;
    }
  }
  return String(index);
}

function defaultGetLabel(
  result: unknown,
  _index: number,
  value: string
): string {
  if (result && typeof result === "object" && "title" in result) {
    const title = (result as { title?: unknown }).title;
    if (typeof title === "string" && title.length > 0) {
      return title;
    }
  }
  return value;
}

function toItemData(result: unknown): Record<string, any> | null {
  if (result && typeof result === "object") {
    return result as Record<string, any>;
  }
  return null;
}

/**
 * Fast path for rendering search results inside `Searchbar.List`.
 *
 * Handles mapping + common states (`Empty`, `Loading`, `Error`) in one place.
 * Useful for headless compositions where you want less boilerplate.
 *
 * @example
 * ```tsx
 * <Searchbar.List>
 *   <Searchbar.Results
 *     results={results}
 *     renderItem={(result) => (
 *       <Searchbar.Item value={result.external_id} label={result.title}>
 *         {result.title}
 *       </Searchbar.Item>
 *     )}
 *   />
 * </Searchbar.List>
 * ```
 */
export function Results<T = SearchResult>({
  results,
  renderItem,
  getValue,
  getLabel,
  empty,
  loading,
  error,
}: SearchbarResultsProps<T>) {
  const readValue = React.useCallback(
    (result: T, index: number) =>
      getValue ? getValue(result, index) : defaultGetValue(result, index),
    [getValue]
  );

  return (
    <>
      {results.map((result, index) => {
        const value = readValue(result, index);
        const label = getLabel
          ? getLabel(result, index)
          : defaultGetLabel(result, index, value);

        return (
          <SearchbarItemDataContext.Provider
            key={`${value}-${index}`}
            value={toItemData(result)}
          >
            {renderItem ? (
              renderItem(result, index)
            ) : (
              <Item value={value} label={label}>
                {label}
              </Item>
            )}
          </SearchbarItemDataContext.Provider>
        );
      })}

      {empty === null ? null : <Empty>{empty}</Empty>}
      {loading === null ? null : <Loading>{loading}</Loading>}
      {error === null ? null : <ErrorPrimitive>{error}</ErrorPrimitive>}
    </>
  );
}
