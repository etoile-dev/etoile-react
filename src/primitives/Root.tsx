import * as React from "react";
import { createSearchbarStore } from "../store.js";
import {
  SearchbarProvider,
  useSearchbarStore,
  type SearchbarContextValue,
} from "../context.js";
import { Slot } from "../utils/slot.js";

/** Clear query/results only after Content has unmounted (presence is 300ms) */
const CLEAR_AFTER_CLOSE_MS = 350;

const escapeSelectorValue = (value: string) => {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/["\\]/g, "\\$&");
};

export type SearchbarRootProps = {
  // ── Controllable: open ───────────────────────────────────────────────────
  /** Controlled open state */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  // ── Controllable: query ──────────────────────────────────────────────────
  /** Controlled search query */
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;

  // ── Controllable: selected value ─────────────────────────────────────────
  /** Controlled selected item value */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;

  // ── Data state (injected by wrappers) ────────────────────────────────────
  /** Whether a search is currently in progress */
  isLoading?: boolean;
  /** Current error, if any */
  error?: unknown;

  // ── Behaviour ─────────────────────────────────────────────────────────────
  /**
   * Global keyboard shortcut.
   * Use `"mod+k"` for ⌘K on Mac / Ctrl+K elsewhere, or `"/"` for the widely used search shortcut.
   * Supports: `mod`, `ctrl`, `shift`, `alt` modifiers + any key (e.g. `"mod+k"`, `"/"`).
   *
   * @example `hotkey="mod+k"` — command palette (toggle modal)
   * @example `hotkey="/"` with `hotkeyBehavior="focus"` — focus input (inline searchbar)
   */
  hotkey?: string;
  /**
   * What the hotkey does: `"toggle"` (default) opens/closes the modal; `"focus"` focuses the input.
   * Use `"focus"` for inline Searchbar so the hotkey focuses the input instead of toggling.
   */
  hotkeyBehavior?: "focus" | "toggle";

  // ── Events ────────────────────────────────────────────────────────────────
  /** Called when an item is selected. Receives the item's `value`. */
  onSelect?: (value: string) => void;

  // ── DOM ───────────────────────────────────────────────────────────────────
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect">;

/**
 * Root of the Searchbar component tree. Manages all search state and provides
 * it to child primitives via an external store (`useSyncExternalStore`).
 *
 * Supports fully controlled, fully uncontrolled, and mixed modes for `open`,
 * `search`, and `value`. Handles keyboard navigation, selection, escape
 * behavior, outside click close, and portal-aware focus boundaries.
 *
 * @example
 * ```tsx
 * <Searchbar.Root onSelect={(value) => console.log(value)}>
 *   <Searchbar.Input />
 *   <Searchbar.List>
 *     {items.map((item) => (
 *       <Searchbar.Item key={item.id} value={item.id}>{item.title}</Searchbar.Item>
 *     ))}
 *     <Searchbar.Empty>No results</Searchbar.Empty>
 *   </Searchbar.List>
 * </Searchbar.Root>
 * ```
 *
 * @example Command palette
 * ```tsx
 * <Searchbar.Root hotkey="mod+k" className="etoile-search">
 *   <Searchbar.Trigger>
 *     <Searchbar.Icon />
 *     Search paintings…
 *     <Searchbar.Kbd />
 *   </Searchbar.Trigger>
 *   <Searchbar.Portal>
 *     <Searchbar.Overlay />
 *     <Searchbar.Content aria-label="Search paintings">
 *       <Searchbar.Input />
 *       <Searchbar.List>
 *         <Searchbar.Item value="starry-night">The Starry Night</Searchbar.Item>
 *       </Searchbar.List>
 *     </Searchbar.Content>
 *   </Searchbar.Portal>
 * </Searchbar.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, SearchbarRootProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      search: controlledSearch,
      defaultSearch = "",
      onSearchChange,
      value: controlledValue,
      defaultValue = null,
      onValueChange,
      isLoading = false,
      error,
      hotkey,
      hotkeyBehavior = "toggle",
      onSelect,
      children,
      className,
      asChild = false,
      ...domProps
    },
    forwardedRef
  ) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLElement | null>(null);
    const listId = React.useId();
    const baseId = React.useId();
    const rootId = React.useId();

    const isOpenControlled = controlledOpen !== undefined;
    const isSearchControlled = controlledSearch !== undefined;
    const isValueControlled = controlledValue !== undefined;

    // Create the store once; never recreate it
    const [store] = React.useState(() =>
      createSearchbarStore({
        open: isOpenControlled ? controlledOpen : defaultOpen,
        query: isSearchControlled ? controlledSearch : defaultSearch,
        selectedValue: isValueControlled ? (controlledValue ?? null) : defaultValue,
      })
    );

    // ── Sync controlled props into the store ─────────────────────────────
    React.useEffect(() => {
      if (isOpenControlled) {
        store.setState((s) => ({ ...s, open: controlledOpen! }));
      }
    }, [isOpenControlled, controlledOpen, store]);

    React.useEffect(() => {
      if (isSearchControlled) {
        store.setState((s) => ({ ...s, query: controlledSearch! }));
      }
    }, [isSearchControlled, controlledSearch, store]);

    React.useEffect(() => {
      if (isValueControlled) {
        store.setState((s) => ({ ...s, selectedValue: controlledValue ?? null }));
      }
    }, [isValueControlled, controlledValue, store]);

    // ── Sync loading / error from external source ────────────────────────
    React.useEffect(() => {
      store.setState((s) => ({ ...s, isLoading, error: error ?? null }));
    }, [isLoading, error, store]);

    // ── Store subscriber: fire callbacks + auto-open/close ────────────────
    const prevQueryRef = React.useRef(store.getState().query);
    const prevOpenRef = React.useRef(store.getState().open);
    const prevValueRef = React.useRef(store.getState().selectedValue);

    React.useEffect(() => {
      let clearTimeoutId: ReturnType<typeof setTimeout> | null = null;

      const unsub = store.subscribe(() => {
        const state = store.getState();

        // Capture previous values before updating refs
        const prevQuery = prevQueryRef.current;
        const prevOpen = prevOpenRef.current;

        // Fire callbacks only for uncontrolled props (single source of truth).
        // Controlled props: setter calls the callback when requesting a change.
        const queryChanged = state.query !== prevQuery;

        if (queryChanged) {
          prevQueryRef.current = state.query;
          if (!isSearchControlled) onSearchChange?.(state.query);
        }

        if (state.open !== prevOpen) {
          prevOpenRef.current = state.open;
          if (!isOpenControlled) onOpenChange?.(state.open);

          if (prevOpen && !state.open) {
            // Defer clearing query/selection until close animation finishes.
            // Avoids flash of empty state during exit.
            clearTimeoutId = window.setTimeout(() => {
              if (!isSearchControlled) {
                store.setState((s) => ({ ...s, query: "" }));
              } else {
                onSearchChange?.("");
              }
              if (!isValueControlled) {
                store.setState((s) => ({ ...s, selectedValue: null }));
              } else {
                onValueChange?.(null);
              }
              clearTimeoutId = null;
            }, CLEAR_AFTER_CLOSE_MS);
          } else if (!prevOpen && state.open && clearTimeoutId) {
            // Reopened before clear fired — cancel it.
            window.clearTimeout(clearTimeoutId);
            clearTimeoutId = null;
          }
        }

        if (state.selectedValue !== prevValueRef.current) {
          prevValueRef.current = state.selectedValue;
          if (!isValueControlled) onValueChange?.(state.selectedValue);
        }

        // Auto-open only when query actually changes to non-empty. This avoids
        // immediate reopen after explicit close actions (Escape / outside click).
        if (queryChanged && state.query.trim() !== "" && !state.open && !isOpenControlled) {
          store.setState((s) => ({ ...s, open: true }));
        }

        // Auto-close when query becomes empty (e.g. user deletes all letters).
        if (queryChanged && state.query.trim() === "" && state.open && !isOpenControlled) {
          store.setState((s) => ({ ...s, open: false }));
        }
      });

      return () => {
        if (clearTimeoutId) window.clearTimeout(clearTimeoutId);
        unsub();
      };
    }, [store]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Helpers ───────────────────────────────────────────────────────────
    const getItemId = React.useCallback(
      (value: string) => `${baseId}-item-${value}`,
      [baseId]
    );

    // Setters update store (uncontrolled) or notify parent (controlled).
    // Subscriber fires callbacks when store changes — avoid firing from both.
    const setOpen = React.useCallback(
      (next: boolean) => {
        if (isOpenControlled) {
          onOpenChange?.(next);
        } else {
          store.setState((s) => ({ ...s, open: next }));
        }
      },
      [isOpenControlled, store, onOpenChange]
    );

    // ── Global hotkey (e.g. "mod+k", "/") ─────────────────────────────────
    React.useEffect(() => {
      if (!hotkey) return;
      const parts = hotkey.toLowerCase().split("+");
      const key = parts[parts.length - 1];
      const needsMod = parts.includes("mod");
      const needsCtrl = parts.includes("ctrl");
      const needsShift = parts.includes("shift");
      const needsAlt = parts.includes("alt");

      const normalizeKey = (k: string) => (k === "slash" ? "/" : k);

      const handler = (e: KeyboardEvent) => {
        if (
          e.target instanceof HTMLElement &&
          (e.target.closest("input") || e.target.closest("textarea") || e.target.closest("[contenteditable]"))
        ) {
          return;
        }
        const isMac = /mac/i.test(navigator.platform);
        if (needsMod && !(isMac ? e.metaKey : e.ctrlKey)) return;
        if (needsCtrl && !e.ctrlKey) return;
        if (needsShift && !e.shiftKey) return;
        if (needsAlt && !e.altKey) return;
        const eventKey = normalizeKey(e.key.toLowerCase());
        const expectedKey = normalizeKey(key);
        if (eventKey !== expectedKey) return;
        e.preventDefault();

        if (hotkeyBehavior === "focus") {
          const input = rootRef.current?.querySelector<HTMLInputElement>('input[role="combobox"]');
          input?.focus();
        } else {
          setOpen(!store.getState().open);
        }
      };

      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [hotkey, hotkeyBehavior, store, setOpen]);

    const setQuery = React.useCallback(
      (next: string) => {
        if (isSearchControlled) {
          onSearchChange?.(next);
        } else {
          store.setState((s) => ({ ...s, query: next }));
        }
      },
      [isSearchControlled, store, onSearchChange]
    );

    const setSelectedValue = React.useCallback(
      (next: string | null) => {
        if (isValueControlled) {
          onValueChange?.(next);
        } else {
          store.setState((s) => ({ ...s, selectedValue: next }));
        }
      },
      [isValueControlled, store, onValueChange]
    );

    const handleSelect = React.useCallback(
      (value: string) => {
        const item = store.getState().items.get(value);
        item?.onSelect?.(value);
        onSelect?.(value);
        setSelectedValue(value);
        setOpen(false);
      },
      [store, onSelect, setSelectedValue, setOpen]
    );

    const registerItem = React.useCallback(
      (meta: {
        value: string;
        label: string;
        disabled: boolean;
        node: HTMLElement | null;
        onSelect?: (value: string) => void;
      }) => {
        store.setState((s) => {
          const items = new Map(s.items);
          items.set(meta.value, meta);
          const sortedValues = s.sortedValues.includes(meta.value)
            ? s.sortedValues
            : [...s.sortedValues, meta.value];
          return { ...s, items, sortedValues };
        });
      },
      [store]
    );

    const unregisterItem = React.useCallback(
      (value: string) => {
        store.setState((s) => {
          const items = new Map(s.items);
          items.delete(value);
          const sortedValues = s.sortedValues.filter((v) => v !== value);
          return { ...s, items, sortedValues };
        });
      },
      [store]
    );

    // Defer scroll so it runs after React commits.
    // Two RAFs are intentionally used here so DOM updates from selection state
    // are reflected before calling scrollIntoView (prevents missed scrolls).
    const scheduleScrollSelectedIntoView = React.useCallback(() => {
      const tryScroll = () => {
        const state = store.getState();
        if (!state.open || !state.selectedValue) return false;
        const node = state.items.get(state.selectedValue)?.node;
        if (!node) return false;
        node.scrollIntoView({ block: "nearest", inline: "nearest" });
        return true;
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (tryScroll()) return;
          // Fallback for slower renders where the node reference lands later.
          window.setTimeout(() => {
            tryScroll();
          }, 0);
        });
      });
    }, [store]);

    // ── Keyboard navigation (cmdk-inspired: IME guard, Home/End) ─────────────
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        // Don't trigger navigation while IME composition is active (CJK input).
        // keyCode 229 = IME composition in legacy browsers.
        const isComposing =
          (event.nativeEvent as KeyboardEvent).isComposing ||
          (event.nativeEvent as KeyboardEvent).keyCode === 229;
        if (event.defaultPrevented || isComposing) return;

        const state = store.getState();
        const values = state.filteredValues;

        if (event.key === "ArrowDown") {
          event.preventDefault();
          setOpen(true);
          const currentIdx = values.indexOf(state.selectedValue ?? "");
          const nextIdx = currentIdx < values.length - 1 ? currentIdx + 1 : 0;
          const nextValue = values[nextIdx];
          if (nextValue !== undefined) {
            store.setState((s) => ({ ...s, selectedValue: nextValue }));
            scheduleScrollSelectedIntoView();
          }
          return;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          setOpen(true);
          const currentIdx = values.indexOf(state.selectedValue ?? "");
          const prevIdx = currentIdx > 0 ? currentIdx - 1 : values.length - 1;
          const prevValue = values[prevIdx];
          if (prevValue !== undefined) {
            store.setState((s) => ({ ...s, selectedValue: prevValue }));
            scheduleScrollSelectedIntoView();
          }
          return;
        }

        if (event.key === "Home") {
          event.preventDefault();
          setOpen(true);
          const first = values[0];
          if (first !== undefined) {
            store.setState((s) => ({ ...s, selectedValue: first }));
            scheduleScrollSelectedIntoView();
          }
          return;
        }

        if (event.key === "End") {
          event.preventDefault();
          setOpen(true);
          const last = values[values.length - 1];
          if (last !== undefined) {
            store.setState((s) => ({ ...s, selectedValue: last }));
            scheduleScrollSelectedIntoView();
          }
          return;
        }

        if (event.key === "Enter") {
          if (state.selectedValue && state.open) {
            event.preventDefault();
            handleSelect(state.selectedValue);
          }
          return;
        }

        if (event.key === "Escape") {
          event.preventDefault();
          if (state.open) {
            setOpen(false);
          }
          return;
        }
      },
      [store, setOpen, handleSelect]
    );

    // ── Click-outside (portal-aware) ──────────────────────────────────────
    // We tag every DOM node belonging to this instance with data-searchbar-root
    // (including portaled Content). The check uses .closest() so portal nodes
    // that aren't inside rootRef are still recognised as "inside" the searchbar.
    React.useEffect(() => {
      const escapedRootId = escapeSelectorValue(rootId);
      const handlePointerDown = (event: PointerEvent) => {
        if (!(event.target instanceof Element)) return;
        const inside = event.target.closest(`[data-searchbar-root="${escapedRootId}"]`);
        if (!inside) {
          setOpen(false);
        }
      };
      document.addEventListener("pointerdown", handlePointerDown);
      return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [rootId, setOpen]);

    // Focus-out for the inline (non-portal) case.
    // In portal mode the Input is outside rootRef so this is a no-op there;
    // the click-outside and Escape handlers cover that path instead.
    const handleBlur = (event: React.FocusEvent) => {
      const related = event.relatedTarget;
      if (!related) {
        setOpen(false);
        return;
      }
      if (related instanceof Element) {
        const escapedRootId = escapeSelectorValue(rootId);
        const inside = related.closest(`[data-searchbar-root="${escapedRootId}"]`);
        if (!inside) setOpen(false);
      }
    };

    // ── Context value ─────────────────────────────────────────────────────
    const ctx: SearchbarContextValue = React.useMemo(
      () => ({
        store,
        listId,
        rootId,
        rootClassName: className,
        isSearchControlled,
        onSearchChange,
        triggerRef,
        getItemId,
        onSelect: handleSelect,
        setOpen,
        handleKeyDown,
        registerItem,
        unregisterItem,
      }),
      [store, listId, rootId, className, isSearchControlled, onSearchChange, triggerRef, getItemId, handleSelect, setOpen, handleKeyDown, registerItem, unregisterItem]
    );

    const Comp = asChild ? Slot : "div";

    return (
      <SearchbarProvider value={ctx}>
        <RootInner
          comp={Comp}
          store={store}
          domProps={domProps}
          forwardedRef={forwardedRef}
          rootRef={rootRef}
          rootId={rootId}
          className={className}
          handleBlur={handleBlur}
          handleKeyDown={handleKeyDown}
        >
          {children}
        </RootInner>
      </SearchbarProvider>
    );
  }
);

Root.displayName = "Searchbar.Root";

// Inner component so we can legally call useSearchbarStore inside JSX
const RootInner = ({
  comp: Comp,
  store,
  domProps,
  forwardedRef,
  rootRef,
  rootId,
  className,
  handleBlur,
  handleKeyDown,
  children,
}: {
  comp: "div" | typeof Slot;
  store: ReturnType<typeof createSearchbarStore>;
  domProps: React.HTMLAttributes<HTMLDivElement>;
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  rootRef: React.MutableRefObject<HTMLDivElement | null>;
  rootId: string;
  className?: string;
  handleBlur: (e: React.FocusEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  children: React.ReactNode;
}) => {
  const dataState = useSearchbarStore(store, (s) => (s.open ? "open" : "closed"));

  return (
    <Comp
      {...domProps}
      ref={(node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      className={className}
      onBlur={handleBlur}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        (domProps as React.HTMLAttributes<HTMLDivElement>).onKeyDown?.(event);
        handleKeyDown(event);
      }}
      data-slot="searchbar-root"
      data-state={dataState}
      data-searchbar-root={rootId}
    >
      {children}
    </Comp>
  );
};
