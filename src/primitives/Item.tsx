import * as React from "react";
import { useSearchbarContext, useSearchbarStore, SearchbarItemContext } from "../context.js";
import { Slot } from "../utils/slot.js";
import { useComposeRefs } from "../utils/composeRefs.js";

export type SearchbarItemProps = {
  /**
   * Stable identifier for this item. Used for selection, keyboard navigation,
   * and ARIA relationships. Must be unique within the list.
   */
  value: string;
  /**
   * Optional human-readable label. Useful when `value` is an opaque ID.
   */
  label?: string;
  /** Whether this item can be selected */
  disabled?: boolean;
  /**
   * Called when this specific item is selected (in addition to root onSelect).
   * Receives the item's `value`.
   */
  onSelect?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect">;

/**
 * Individual search result item with stable value-based identity.
 *
 * Registers itself in the store on mount and de-registers on unmount.
 * Visibility is controlled by what you render in `Searchbar.List`
 * (UI-only primitive; no internal filtering).
 *
 * When rendered inside the Etoile `<Searchbar />` wrapper, children can read
 * result data via `SearchbarItemDataContext` (used by `Searchbar.Thumbnail`).
 *
 * @example
 * ```tsx
 * <Searchbar.Item value="starry-night" label="The Starry Night">
 *   <img src={thumbnail} />
 *   The Starry Night
 * </Searchbar.Item>
 * ```
 */
export const Item = React.forwardRef<HTMLDivElement, SearchbarItemProps>(
  (
    {
      value,
      label,
      disabled = false,
      onSelect,
      children,
      className,
      asChild = false,
      ...props
    },
    forwardedRef
  ) => {
    const { store, getItemId, onSelect: ctxOnSelect, registerItem, unregisterItem } =
      useSearchbarContext();
    const internalRef = React.useRef<HTMLDivElement | null>(null);
    const composedRef = useComposeRefs(internalRef, forwardedRef as React.Ref<HTMLDivElement>);

    const effectiveLabel = label ?? value;

    // Register on mount, update when meta changes, unregister on unmount
    React.useLayoutEffect(() => {
      registerItem({
        value,
        label: effectiveLabel,
        disabled,
        node: internalRef.current,
        onSelect,
      });
      return () => unregisterItem(value);
    }, [value, effectiveLabel, disabled]); // eslint-disable-line react-hooks/exhaustive-deps

    // Update onSelect callback reference without full re-register
    React.useEffect(() => {
      store.setState((s) => {
        const items = new Map(s.items);
        const existing = items.get(value);
        if (existing) {
          items.set(value, { ...existing, onSelect });
        }
        return { ...s, items };
      });
    }, [onSelect, value, store]);

    const isSelected = useSearchbarStore(store, (s) => s.selectedValue === value);
    const isVisible = useSearchbarStore(store, (s) => s.filteredSet.has(value));

    if (!isVisible) {
      return null;
    }

    const id = getItemId(value);

    const handleClick = () => {
      if (!disabled) {
        ctxOnSelect(value);
      }
    };

    const handlePointerMove = () => {
      if (!disabled) {
        store.setState((s) => ({ ...s, selectedValue: value }));
      }
    };

    const Comp = asChild ? Slot : "div";

    return (
      <SearchbarItemContext.Provider value={value}>
        <Comp
          {...props}
          ref={composedRef as React.Ref<HTMLDivElement>}
          id={id}
          role="option"
          aria-selected={isSelected}
          aria-disabled={disabled || undefined}
          data-selected={isSelected ? "true" : "false"}
          data-disabled={disabled ? "true" : undefined}
          data-value={value}
          data-slot="searchbar-item"
          tabIndex={isSelected ? 0 : -1}
          className={className}
          onClick={(e) => {
            props.onClick?.(e);
            handleClick();
          }}
          onPointerMove={(e) => {
            props.onPointerMove?.(e);
            handlePointerMove();
          }}
        >
          {children}
        </Comp>
      </SearchbarItemContext.Provider>
    );
  }
);

Item.displayName = "Searchbar.Item";
