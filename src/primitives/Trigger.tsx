import * as React from "react";
import { useSearchbarContext, useSearchbarStore } from "../context.js";
import { Slot } from "../utils/slot.js";
import { useComposeRefs } from "../utils/composeRefs.js";

export type SearchbarTriggerProps = {
  children?: React.ReactNode;
  className?: string;
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Button that toggles the search open/closed state.
 * Designed for command palette / modal mode.
 *
 * @example
 * ```tsx
 * <Searchbar.Root>
 *   <Searchbar.Trigger>
 *     <Searchbar.Icon /> Search
 *   </Searchbar.Trigger>
 *   <Searchbar.Portal>
 *     <Searchbar.Overlay />
 *     <Searchbar.Content>…</Searchbar.Content>
 *   </Searchbar.Portal>
 * </Searchbar.Root>
 * ```
 */
export const Trigger = React.forwardRef<HTMLButtonElement, SearchbarTriggerProps>(
  ({ children, className, asChild = false, ...props }, forwardedRef) => {
    const { store, triggerRef } = useSearchbarContext();
    const isOpen = useSearchbarStore(store, (s) => s.open);
    const composedRef = useComposeRefs(
      triggerRef as React.Ref<HTMLButtonElement>,
      forwardedRef
    );

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        {...props}
        ref={composedRef as React.Ref<HTMLButtonElement>}
        type={asChild ? undefined : "button"}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={className}
        data-state={isOpen ? "open" : "closed"}
        data-slot="searchbar-trigger"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          props.onClick?.(event);
          if (event.defaultPrevented) return;
          store.setState((s) => ({ ...s, open: !s.open }));
        }}
      >
        {children}
      </Comp>
    );
  }
);

Trigger.displayName = "Searchbar.Trigger";
