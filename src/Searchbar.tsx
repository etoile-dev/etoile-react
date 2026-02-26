/**
 * Searchbar — primary export of `@etoile-dev/react`.
 *
 * This module exposes three APIs:
 *
 * 1. **Convenience wrapper**: `<Searchbar />` (Etoile-powered, live data).
 *    Pass `apiKey` + `collections` and it handles query state, fetch, loading,
 *    error, and default rendering.
 *
 * 2. **Convenience modal**: `<SearchModal />` (Etoile-powered command palette).
 *    Pass `apiKey` + `collections` and it handles trigger, portal, overlay,
 *    content, and live results.
 *
 * 3. **Headless primitives**: `Searchbar.Root`, `Searchbar.Input`,
 *    `Searchbar.List`, `Searchbar.Item`, etc. are UI-only primitives with no
 *    built-in data fetching. Bring your own data layer.
 */

import * as React from "react";
import { Root } from "./primitives/Root.js";
import { Input } from "./primitives/Input.js";
import { List } from "./primitives/List.js";
import { Item } from "./primitives/Item.js";
import { Results as ResultsPrimitive } from "./primitives/Results.js";
import { Group } from "./primitives/Group.js";
import { Separator } from "./primitives/Separator.js";
import { Empty } from "./primitives/Empty.js";
import { Loading } from "./primitives/Loading.js";
import { Error as ErrorPrimitive } from "./primitives/Error.js";
import { Portal } from "./primitives/Portal.js";
import { Overlay } from "./primitives/Overlay.js";
import { Content } from "./primitives/Content.js";
import { Modal } from "./primitives/Modal.js";
import { ModalInput } from "./primitives/ModalInput.js";
import { Trigger } from "./primitives/Trigger.js";
import { Icon } from "./primitives/Icon.js";
import { Kbd } from "./primitives/Kbd.js";
import { Thumbnail } from "./primitives/Thumbnail.js";
import { useEtoileSearch } from "./hooks/useEtoileSearch.js";
import type { SearchFilter, SearchResult } from "@etoile-dev/client";
import type { SearchbarRootProps } from "./primitives/Root.js";

/** Format hotkey string for display (e.g. "mod+k" → "⌘K" on Mac, "Ctrl+K" elsewhere). */
function formatHotkeyLabel(hotkey: string): string {
  const isMac = typeof navigator !== "undefined" && /mac|darwin/i.test(navigator.platform);
  const parts = hotkey.toLowerCase().trim().split("+");
  const key = parts[parts.length - 1];
  const keyChar = key === "slash" ? "/" : key;
  const mods = parts.slice(0, -1);
  const modLabels: string[] = [];
  if (mods.includes("mod")) modLabels.push(isMac ? "⌘" : "Ctrl");
  if (mods.includes("ctrl")) modLabels.push("Ctrl");
  if (mods.includes("alt")) modLabels.push(isMac ? "⌥" : "Alt");
  if (mods.includes("shift")) modLabels.push(isMac ? "⇧" : "Shift");
  const keyDisplay =
    keyChar === "/" || keyChar.length > 1 ? keyChar : keyChar.toUpperCase();
  return modLabels.length > 0 ? `${modLabels.join("")}${keyDisplay}` : keyDisplay;
}

// ─── Convenience wrapper ─────────────────────────────────────────────────────

export type SearchbarProps = {
  /** Your Etoile API key. Get one at https://etoile.dev */
  apiKey: string;
  /** Collections to search in (e.g., ["paintings", "artists"]) */
  collections: string[];
  /** Maximum results to return (default: 10) */
  limit?: number;
  /** Number of results to skip for pagination (default: 0) */
  offset?: number;
  /** Debounce delay in ms (default: 100) */
  debounceMs?: number;
  /** Placeholder for the search input (default: "Search…") */
  placeholder?: string;
  /**
   * Explicit metadata filters applied to results.
   * Mutually exclusive with `autoFilters`.
   *
   * @example
   * ```tsx
   * filters={[{ key: "artist", operator: "eq", value: "Vincent van Gogh" }]}
   * ```
   */
  filters?: SearchFilter[];
  /**
   * When `true`, the AI extracts filters from the query automatically.
   * Mutually exclusive with `filters`.
   */
  autoFilters?: boolean;
  /**
   * Custom render function for each result item.
   * Return a `Searchbar.Item` with a stable `value`.
   */
  renderItem?: (result: SearchResult) => React.ReactNode;
  /** Called when an item is selected. Receives the result's `external_id`. */
  onSelect?: (value: string) => void;
  /**
   * Called when an item is selected. Receives the full selected result.
   * Ideal for routing, for example:
   * `onSelectResult={(result) => router.push(\`/work/${result.external_id}\`)}`
   */
  onSelectResult?: (result: SearchResult) => void;
  // Internal: override the Etoile API base URL
  baseUrl?: string;
} & Omit<
  SearchbarRootProps,
  | "isLoading"
  | "error"
  | "search"
  | "onSearchChange"
  | "children"
  | "onSelect"
>;

export type SearchModalProps = {
  /** Your Etoile API key. Get one at https://etoile.dev */
  apiKey: string;
  /** Collections to search in (e.g., ["paintings", "artists"]) */
  collections: string[];
  /** Maximum results to return (default: 10) */
  limit?: number;
  /** Number of results to skip for pagination (default: 0) */
  offset?: number;
  /** Debounce delay in ms (default: 100) */
  debounceMs?: number;
  /** Placeholder for the modal input (default: "Search…") */
  placeholder?: string;
  /**
   * Explicit metadata filters applied to results.
   * Mutually exclusive with `autoFilters`.
   */
  filters?: SearchFilter[];
  /**
   * When `true`, the AI extracts filters from the query automatically.
   * Mutually exclusive with `filters`.
   */
  autoFilters?: boolean;
  /**
   * Global keyboard shortcut that opens the modal.
   * Defaults to `"mod+k"` (⌘K on Mac / Ctrl+K elsewhere).
   */
  hotkey?: string;
  /** Accessible label for modal content (default: "Search") */
  modalLabel?: string;
  /**
   * Custom render function for each result item.
   * Return a `Searchbar.Item` with a stable `value`.
   */
  renderItem?: (result: SearchResult) => React.ReactNode;
  /** Called when an item is selected. Receives the result's `external_id`. */
  onSelect?: (value: string) => void;
  /**
   * Called when an item is selected. Receives the full selected result.
   * Ideal for routing, for example:
   * `onSelectResult={(result) => router.push(\`/work/${result.external_id}\`)}`
   */
  onSelectResult?: (result: SearchResult) => void;
  // Internal: override the Etoile API base URL
  baseUrl?: string;
} & Omit<
  SearchbarRootProps,
  | "isLoading"
  | "error"
  | "search"
  | "onSearchChange"
  | "children"
  | "onSelect"
  | "hotkey"
>;

/**
 * All-in-one search component powered by Etoile.
 *
 * Handles data fetching, debounce, keyboard navigation, and ARIA wiring.
 * No default hotkey; pass `hotkey="/"` (or `hotkey="mod+k"`) if you want a global shortcut.
 * Import `@etoile-dev/react/styles.css` for the default theme.
 *
 * @example
 * ```tsx
 * import "@etoile-dev/react/styles.css";
 * import { Searchbar } from "@etoile-dev/react";
 *
 * <Searchbar apiKey="your-api-key" collections={["paintings"]} />
 * ```
 *
 * @example With filters and custom rendering
 * ```tsx
 * <Searchbar
 *   apiKey={process.env.ETOILE_API_KEY!}
 *   collections={["paintings"]}
 *   filters={[{ key: "artist", operator: "eq", value: "Vincent van Gogh" }]}
 *   onSelect={(id) => router.push(`/painting/${id}`)}
 *   renderItem={(result) => (
 *     <Searchbar.Item value={result.external_id} label={result.title}>
 *       <Searchbar.Thumbnail />
 *       <div>
 *         <strong>{result.title}</strong>
 *         <span>{String(result.metadata?.year ?? "")}</span>
 *       </div>
 *     </Searchbar.Item>
 *   )}
 * />
 * ```
 *
 * @example Headless primitives (no Etoile dependency)
 * ```tsx
 * <Searchbar.Root onSelect={handleSelect}>
 *   <Searchbar.Input placeholder="Search paintings…" />
 *   <Searchbar.List>
 *     {paintings.map((p) => (
 *       <Searchbar.Item key={p.id} value={p.id} label={p.title}>
 *         {p.title}
 *       </Searchbar.Item>
 *     ))}
 *     <Searchbar.Empty>No results.</Searchbar.Empty>
 *   </Searchbar.List>
 * </Searchbar.Root>
 * ```
 */
const SearchbarWrapper = React.forwardRef<HTMLDivElement, SearchbarProps>(
  (
    {
      apiKey,
      collections,
      limit,
      offset,
      debounceMs,
      placeholder = "Search…",
      filters,
      autoFilters,
      renderItem,
      onSelect,
      onSelectResult,
      baseUrl,
      hotkey,
      className,
      ...rootProps
    },
    ref
  ) => {
    const [query, setQuery] = React.useState("");

    const { results, isLoading, error } = useEtoileSearch({
      apiKey,
      collections,
      query,
      limit,
      offset,
      debounceMs,
      filters,
      autoFilters,
      baseUrl,
    });

    const handleSelect = React.useCallback(
      (value: string) => {
        onSelect?.(value);
        if (!onSelectResult) return;
        const result = results.find((item) => item.external_id === value);
        if (result) onSelectResult(result);
      },
      [onSelect, onSelectResult, results]
    );

    const renderSearchItem = React.useCallback(
      (result: SearchResult) =>
        renderItem ? renderItem(result) : <DefaultItem result={result} />,
      [renderItem]
    );

    return (
      <Root
        {...rootProps}
        ref={ref}
        hotkey={hotkey}
        hotkeyBehavior={hotkey ? "focus" : undefined}
        search={query}
        onSearchChange={setQuery}
        isLoading={isLoading}
        error={error ?? undefined}
        onSelect={handleSelect}
        className={
          className
            ? `etoile-search ${className}`
            : "etoile-search"
        }
      >
        <div data-slot="searchbar-input-row">
          <Icon />
          <Input placeholder={placeholder} />
          {hotkey ? <Kbd>{formatHotkeyLabel(hotkey)}</Kbd> : null}
        </div>

        <List>
          <ResultsPrimitive
            results={results}
            renderItem={renderSearchItem}
            empty={
              <>
                No results found for{" "}
                <span data-slot="searchbar-empty-query">"{query}"</span>
              </>
            }
          />
        </List>
      </Root>
    );
  }
);

SearchbarWrapper.displayName = "Searchbar";

/**
 * All-in-one command palette powered by Etoile.
 *
 * Handles portal, overlay, modal content, and live search results.
 * Includes built-in open/close logic and defaults to `hotkey="mod+k"`.
 * Import `@etoile-dev/react/styles.css` for the default theme.
 *
 * @example Basic usage
 * ```tsx
 * <SearchModal apiKey="your-api-key" collections={["paintings"]} />
 * ```
 *
 * @example With filters
 * ```tsx
 * <SearchModal
 *   apiKey={process.env.ETOILE_API_KEY!}
 *   collections={["paintings"]}
 *   filters={[{ key: "artist", operator: "eq", value: "Vincent van Gogh" }]}
 * />
 * ```
 *
 * @example With custom rendering
 * ```tsx
 * <SearchModal
 *   apiKey={process.env.ETOILE_API_KEY!}
 *   collections={["paintings", "artists"]}
 *   hotkey="mod+/"
 *   renderItem={(result) => (
 *     <Searchbar.Item value={result.external_id} label={result.title}>
 *       <Searchbar.Thumbnail />
 *       <div>
 *         <strong>{result.title}</strong>
 *         <span>{String(result.metadata?.artist ?? "")}</span>
 *       </div>
 *     </Searchbar.Item>
 *   )}
 * />
 * ```
 */
export const SearchModal = React.forwardRef<HTMLDivElement, SearchModalProps>(
  (
    {
      apiKey,
      collections,
      limit,
      offset,
      debounceMs,
      placeholder = "Search…",
      filters,
      autoFilters,
      hotkey = "mod+k",
      modalLabel = "Search",
      renderItem,
      onSelect,
      onSelectResult,
      baseUrl,
      className,
      ...rootProps
    },
    ref
  ) => {
    const [query, setQuery] = React.useState("");

    const { results, isLoading, error } = useEtoileSearch({
      apiKey,
      collections,
      query,
      limit,
      offset,
      debounceMs,
      filters,
      autoFilters,
      baseUrl,
    });

    const handleSelect = React.useCallback(
      (value: string) => {
        onSelect?.(value);
        if (!onSelectResult) return;
        const result = results.find((item) => item.external_id === value);
        if (result) onSelectResult(result);
      },
      [onSelect, onSelectResult, results]
    );

    const renderSearchItem = React.useCallback(
      (result: SearchResult) =>
        renderItem ? renderItem(result) : <DefaultItem result={result} />,
      [renderItem]
    );

    return (
      <Modal
        {...rootProps}
        ref={ref}
        hotkey={hotkey}
        search={query}
        onSearchChange={setQuery}
        isLoading={isLoading}
        error={error ?? undefined}
        onSelect={handleSelect}
        className={
          className
            ? `etoile-search ${className}`
            : "etoile-search"
        }
        aria-label={modalLabel}
      >
        <ModalInput placeholder={placeholder} />

        <List>
          <ResultsPrimitive
            results={results}
            renderItem={renderSearchItem}
            empty={
              <>
                No results found for{" "}
                <span data-slot="searchbar-empty-query">"{query}"</span>
              </>
            }
          />
        </List>
      </Modal>
    );
  }
);

SearchModal.displayName = "SearchModal";

// ─── Default item renderer ────────────────────────────────────────────────────

const DefaultItem = ({ result }: { result: SearchResult }) => (
  <Item value={result.external_id} label={result.title}>
    <Thumbnail />
    <div data-slot="searchbar-result-content">
      <span data-slot="searchbar-result-title">{result.title}</span>
      <span data-slot="searchbar-result-subtitle">{result.collection}</span>
    </div>
  </Item>
);

// ─── Namespace assembly ───────────────────────────────────────────────────────

export const Searchbar = Object.assign(SearchbarWrapper, {
  Root,
  Input,
  List,
  Item,
  Results: ResultsPrimitive,
  Group,
  Separator,
  Empty,
  Loading,
  Error: ErrorPrimitive,
  Portal,
  Overlay,
  Content,
  Modal,
  ModalInput,
  Trigger,
  Icon,
  Kbd,
  Thumbnail,
});
