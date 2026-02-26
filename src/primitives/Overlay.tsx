import * as React from "react";
import { useSearchbarContext, useSearchbarStore } from "../context.js";
import { Slot } from "../utils/slot.js";

const PRESENCE_DURATION_MS = 300;

export type SearchbarOverlayProps = {
  className?: string;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Backdrop overlay for command palette / modal mode.
 * Only renders when the search is open.
 *
 * @example
 * ```tsx
 * <Searchbar.Portal>
 *   <Searchbar.Overlay className="fixed inset-0 bg-black/40" />
 *   <Searchbar.Content>…</Searchbar.Content>
 * </Searchbar.Portal>
 * ```
 */
export const Overlay = React.forwardRef<HTMLDivElement, SearchbarOverlayProps>(
  ({ className, asChild = false, ...props }, forwardedRef) => {
    const { store, rootId, rootClassName, setOpen } = useSearchbarContext();
    const isOpen = useSearchbarStore(store, (s) => s.open);
    const [present, setPresent] = React.useState(isOpen);
    const mergedClassName = [rootClassName, className].filter(Boolean).join(" ") || undefined;

    React.useEffect(() => {
      if (isOpen) {
        setPresent(true);
        return;
      }
      const timeout = window.setTimeout(() => setPresent(false), PRESENCE_DURATION_MS);
      return () => window.clearTimeout(timeout);
    }, [isOpen]);

    if (!present) return null;

    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        {...props}
        ref={forwardedRef as React.Ref<HTMLDivElement>}
        aria-hidden="true"
        className={mergedClassName}
        data-state={isOpen ? "open" : "closed"}
        data-slot="searchbar-overlay"
        data-searchbar-root={rootId}
        onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
          props.onPointerDown?.(event);
          if (event.defaultPrevented) return;
          setOpen(false);
        }}
      />
    );
  }
);

Overlay.displayName = "Searchbar.Overlay";
