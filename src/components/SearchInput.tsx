import * as React from "react";
import { useSearchContext } from "../context/SearchContext.js";

export type SearchInputProps = {
  /** Placeholder text for the input field */
  placeholder?: string;
  /** CSS class name for styling the input */
  className?: string;
};

/**
 * Search input component with built-in keyboard navigation and accessibility.
 *
 * Integrates with SearchRoot context to provide debouncing and keyboard controls
 * (ArrowUp, ArrowDown, Enter, Escape). Implements ARIA combobox pattern.
 *
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <SearchInput />
 * ```
 *
 * @example With placeholder and styling
 * ```tsx
 * <SearchInput
 *   placeholder="Search paintings..."
 *   className="px-4 py-2 border rounded-lg"
 * />
 * ```
 */
export const SearchInput = ({ placeholder, className }: SearchInputProps) => {
  const {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    listboxId,
    getResultId,
    handleKeyDown,
    autoFocus,
  } = useSearchContext();

  const hasResults = results.length > 0;
  const activeId =
    selectedIndex >= 0 && hasResults ? getResultId(selectedIndex) : undefined;

  return (
    <input
      type="text"
      placeholder={placeholder}
      className={className}
      value={query}
      autoFocus={autoFocus}
      role="combobox"
      aria-expanded={hasResults}
      aria-controls={listboxId}
      aria-activedescendant={activeId}
      onChange={(event) => {
        const nextValue = event.target.value;
        setQuery(nextValue);
        if (nextValue.trim() !== "") {
          setSelectedIndex(0);
        }
      }}
      onKeyDown={handleKeyDown}
    />
  );
};
