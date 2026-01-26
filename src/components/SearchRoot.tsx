import * as React from "react";
import { SearchProvider } from "../context/SearchContext.js";
import { useSearch } from "../hooks/useSearch.js";

export type SearchRootProps = {
  apiKey?: string;
  collections: string[];
  limit?: number;
  debounceMs?: number;
  autoFocus?: boolean;
  children: React.ReactNode;
};

export const SearchRoot = ({
  apiKey,
  collections,
  limit,
  debounceMs,
  autoFocus = false,
  children,
}: SearchRootProps) => {
  const search = useSearch({ apiKey, collections, limit, debounceMs });
  const listboxId = React.useId();
  const resultRefs = React.useRef(new Map<number, HTMLElement | null>());

  const registerResult = (index: number, node: HTMLElement | null) => {
    resultRefs.current.set(index, node);
  };

  const getResultNode = (index: number) => {
    return resultRefs.current.get(index) ?? null;
  };

  const getResultId = (index: number) => `${listboxId}-option-${index}`;

  const selectActiveResult = () => {
    if (search.selectedIndex < 0) {
      return;
    }
    const node = getResultNode(search.selectedIndex);
    if (node && "click" in node) {
      node.click();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      search.setSelectedIndex(search.selectedIndex + 1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      search.setSelectedIndex(search.selectedIndex - 1);
      return;
    }
    if (event.key === "Enter") {
      if (search.selectedIndex >= 0) {
        event.preventDefault();
        selectActiveResult();
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      search.clear();
    }
  };

  const value = React.useMemo(
    () => ({
      ...search,
      listboxId,
      getResultId,
      registerResult,
      getResultNode,
      selectActiveResult,
      handleKeyDown,
      autoFocus,
    }),
    [search, listboxId, autoFocus]
  );

  return <SearchProvider value={value}>{children}</SearchProvider>;
};
