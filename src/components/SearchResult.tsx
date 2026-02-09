import * as React from "react";
import { useSearchContext } from "../context/SearchContext.js";
import { SearchResultIndexContext } from "./SearchResults.js";

export type SearchResultProps = {
  /** CSS class name for styling the result item */
  className?: string;
  /** Content to render inside the result */
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Individual search result item with selection state and keyboard navigation.
 *
 * Manages selection state and accessibility attributes. Provides `data-selected`
 * attribute for styling the active result. Must be used inside SearchResults.
 * Accepts standard div props like onClick for custom behavior.
 *
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <SearchResult>{result.title}</SearchResult>
 * ```
 *
 * @example With selection styling
 * ```tsx
 * <SearchResult className="result-item">
 *   <h3>{result.title}</h3>
 * </SearchResult>
 *
 * // CSS: .result-item[data-selected="true"] { background: #f0f9ff; }
 * ```
 */
export const SearchResult = ({
  className,
  children,
  ...props
}: SearchResultProps) => {
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
      {...props}
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
