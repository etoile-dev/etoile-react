import * as React from "react";
import { useSearchContext } from "../context/SearchContext.js";

export type SearchInputProps = {
  /** Placeholder text for the input field */
  placeholder?: string;
  /** CSS class name for styling the input */
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Search input component with built-in keyboard navigation and accessibility.
 *
 * Integrates with SearchRoot context to provide debouncing and keyboard controls
 * (ArrowUp, ArrowDown, Enter, Escape). Implements ARIA combobox pattern.
 * Accepts standard input props like aria-label and autoComplete.
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
export const SearchInput = ({
  placeholder,
  className,
  ...props
}: SearchInputProps) => {
  const {
    query,
    setQuery,
    results,
    isOpen,
    setOpen,
    selectedIndex,
    setSelectedIndex,
    listboxId,
    getResultId,
    handleKeyDown,
    autoFocus,
  } = useSearchContext();

  const showResults = isOpen && results.length > 0;
  const activeId =
    selectedIndex >= 0 && showResults ? getResultId(selectedIndex) : undefined;

  return (
    <>
    <input
      {...props}
        type="text"
        placeholder={placeholder}
        className={className}
        value={query}
        autoFocus={autoFocus}
        role="combobox"
        aria-expanded={showResults}
        aria-controls={listboxId}
        aria-activedescendant={activeId}
        aria-autocomplete="list"
      onChange={(event) => {
        props.onChange?.(event);
          const nextValue = event.target.value;
          setQuery(nextValue);
          if (nextValue.trim() !== "") {
            setSelectedIndex(0);
          }
        }}
      onFocus={(event) => {
        props.onFocus?.(event);
        if (!event.defaultPrevented && query.trim() !== "" && results.length > 0) {
          setOpen(true);
        }
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (!event.defaultPrevented) {
          handleKeyDown(event);
        }
      }}
      />
      {/* Screen reader live region for result count announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {showResults
          ? `${results.length} result${results.length === 1 ? "" : "s"} available`
          : ""}
      </div>
    </>
  );
};
