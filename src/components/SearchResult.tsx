import * as React from "react";
import { useSearchContext } from "../context/SearchContext.js";
import { SearchResultIndexContext } from "./SearchResults.js";

export type SearchResultProps = {
  className?: string;
  children: React.ReactNode;
};

export const SearchResult = ({ className, children }: SearchResultProps) => {
  const { selectedIndex, registerResult, getResultId } = useSearchContext();
  const index = React.useContext(SearchResultIndexContext);

  if (index === null) {
    return null;
  }

  const isSelected = index === selectedIndex;
  const id = React.useMemo(() => getResultId(index), [getResultId, index]);
  const setRef = React.useCallback(
    (node: HTMLElement | null) => {
      registerResult(index, node);
    },
    [index, registerResult]
  );

  return (
    <div
      ref={setRef}
      id={id}
      role="option"
      aria-selected={isSelected}
      data-selected={isSelected ? "true" : "false"}
      data-index={index}
      tabIndex={isSelected ? 0 : -1}
      className={className}
    >
      {children}
    </div>
  );
};
