import * as React from "react";
import { useSearchbarContext, useSearchbarStore } from "../context.js";
import { Slot } from "../utils/slot.js";

export type SearchbarInputProps = {
  /** Placeholder text */
  placeholder?: string;
  /** Additional CSS class name */
  className?: string;
  /** Render as child element instead of <input> */
  asChild?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

/**
 * Combobox input primitive.
 *
 * Wires to Searchbar.Root state and applies ARIA combobox attributes.
 * In uncontrolled mode, it updates internal query/open state.
 * In controlled mode (`search` prop on Root), it emits `onSearchChange`
 * without mutating the internal query directly.
 *
 * @example
 * ```tsx
 * <Searchbar.Root>
 *   <Searchbar.Input placeholder="Search paintings…" />
 * </Searchbar.Root>
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, SearchbarInputProps>(
  ({ placeholder, className, asChild = false, ...props }, forwardedRef) => {
    const { store, listId, getItemId, isSearchControlled, onSearchChange, handleKeyDown } =
      useSearchbarContext();

    const query = useSearchbarStore(store, (s) => s.query);
    const isOpen = useSearchbarStore(store, (s) => s.open);
    const selectedValue = useSearchbarStore(store, (s) => s.selectedValue);
    const hasItems = useSearchbarStore(store, (s) => s.filteredValues.length > 0);

    const showResults = isOpen && hasItems;
    const activeId = selectedValue && showResults ? getItemId(selectedValue) : undefined;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      (props as React.InputHTMLAttributes<HTMLInputElement>).onChange?.(event);

      const nextQuery = event.target.value;
      if (isSearchControlled) {
        onSearchChange?.(nextQuery);
      } else {
        store.setState((s) => ({
          ...s,
          query: nextQuery,
          open: nextQuery.trim() !== "",
        }));
      }
    };

    const Comp = asChild ? Slot : "input";

    return (
      <>
        <Comp
          {...props}
          ref={forwardedRef as React.Ref<HTMLInputElement>}
          type={asChild ? undefined : "text"}
          role="combobox"
          aria-expanded={showResults}
          aria-controls={listId}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={placeholder}
          className={className}
          value={query}
          data-slot="searchbar-input"
          data-state={isOpen ? "open" : "closed"}
          onChange={handleChange}
          onKeyDown={(e) => {
            handleKeyDown(e);
            (props as React.InputHTMLAttributes<HTMLInputElement>).onKeyDown?.(e);
          }}
          onFocus={(event) => {
            props.onFocus?.(event);
            if (!event.defaultPrevented && query.trim() !== "" && hasItems) {
              store.setState((s) => ({ ...s, open: true }));
            }
          }}
        />
        {/* Screen reader live region for result count announcements */}
        <span
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
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          <ResultCount store={store} isOpen={showResults} />
        </span>
      </>
    );
  }
);

Input.displayName = "Searchbar.Input";

// Isolated component so only it re-renders for the count announcement
const ResultCount = ({
  store,
  isOpen,
}: {
  store: ReturnType<typeof useSearchbarContext>["store"];
  isOpen: boolean;
}) => {
  const count = useSearchbarStore(store, (s) => s.filteredValues.length);
  if (!isOpen) return null;
  return <>{count === 1 ? "1 result" : `${count} results`} available</>;
};
