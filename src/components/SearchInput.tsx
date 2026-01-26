import * as React from "react";
import { useSearchContext } from "../context/SearchContext.js";

export type SearchInputProps = {
  placeholder?: string;
  className?: string;
};

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
