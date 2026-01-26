import * as React from "react";
import { useSearchContext } from "../context/SearchContext.js";
import type { SearchResultData } from "../types.js";

export type SearchResultsProps = {
  className?: string;
  children: (result: SearchResultData) => React.ReactNode;
};

export const SearchResultIndexContext = React.createContext<number | null>(null);

export const SearchResults = ({ className, children }: SearchResultsProps) => {
  const { query, results, selectedIndex, listboxId, getResultNode } =
    useSearchContext();
  const listboxRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (selectedIndex < 0) {
      return;
    }
    const activeNode = getResultNode(selectedIndex);
    activeNode?.scrollIntoView({ block: "nearest" });
    if (
      activeNode &&
      listboxRef.current &&
      listboxRef.current.contains(document.activeElement)
    ) {
      activeNode.focus();
    }
  }, [getResultNode, selectedIndex]);

  if (query.trim() === "" || results.length === 0) {
    return null;
  }

  return (
    <div
      role="listbox"
      id={listboxId}
      className={className}
      ref={listboxRef}
    >
      {results.map((result, index) => (
        <SearchResultIndexContext.Provider value={index} key={result.external_id}>
          {children(result)}
        </SearchResultIndexContext.Provider>
      ))}
    </div>
  );
};
