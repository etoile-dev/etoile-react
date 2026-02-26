import * as React from "react";
import {
  useSearchbarContext,
  useSearchbarStore,
  SearchbarHideListWhenQueryEmptyContext,
} from "../context.js";
import { Slot } from "../utils/slot.js";

const PRESENCE_DURATION_MS = 300;

export type SearchbarContentProps = {
  /** Accessible label for the dialog */
  "aria-label"?: string;
  className?: string;
  asChild?: boolean;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "role">;

/**
 * Floating content panel for command palette / modal mode.
 *
 * Implements `role="dialog"` with `aria-modal`, focus trapping (focus stays
 * inside when open), and restores focus to the Trigger on close.
 *
 * Height animates smoothly when results appear or disappear via ResizeObserver.
 *
 * @example
 * ```tsx
 * <Searchbar.Portal>
 *   <Searchbar.Overlay />
 *   <Searchbar.Content aria-label="Search">
 *     <Searchbar.ModalInput />
 *     <Searchbar.List>…</Searchbar.List>
 *   </Searchbar.Content>
 * </Searchbar.Portal>
 * ```
 */
export const Content = React.forwardRef<HTMLDivElement, SearchbarContentProps>(
  (
    { "aria-label": ariaLabel = "Search", className, asChild = false, children, ...props },
    forwardedRef
  ) => {
    const { store, rootId, rootClassName, handleKeyDown, triggerRef } =
      useSearchbarContext();
    const isOpen = useSearchbarStore(store, (s) => s.open);
    const [present, setPresent] = React.useState(isOpen);
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    const mergedClassName = [rootClassName, className].filter(Boolean).join(" ") || undefined;

    // Focus first focusable on open; restore focus to Trigger on close; trap focus
    React.useEffect(() => {
      if (!isOpen) return;

      const node = contentRef.current;
      const getFocusables = () =>
        Array.from(
          node?.querySelectorAll<HTMLElement>(
            'input, button, [tabindex]:not([tabindex="-1"])'
          ) ?? []
        );

      const focusable = getFocusables()[0];
      focusable?.focus();

      const handleFocusIn = (e: FocusEvent) => {
        if (!node?.contains(e.target as Node)) {
          e.preventDefault();
          getFocusables()[0]?.focus();
        }
      };

      document.addEventListener("focusin", handleFocusIn);

      return () => {
        document.removeEventListener("focusin", handleFocusIn);
        triggerRef?.current?.focus();
      };
    }, [isOpen, triggerRef]);

    React.useEffect(() => {
      if (isOpen) {
        setPresent(true);
        return;
      }
      const timeout = window.setTimeout(() => setPresent(false), PRESENCE_DURATION_MS);
      return () => window.clearTimeout(timeout);
    }, [isOpen]);

    // Animate height via ResizeObserver watching the inner content wrapper.
    // The first measurement is applied instantly (no transition) so the open
    // animation isn't interrupted. Subsequent changes (results appearing /
    // disappearing) are handled by the CSS transition on the outer panel.
    React.useLayoutEffect(() => {
      const inner = innerRef.current;
      const outer = contentRef.current;
      if (!inner || !outer) return;

      const outerStyle = getComputedStyle(outer);
      const paddingY =
        parseFloat(outerStyle.paddingTop) + parseFloat(outerStyle.paddingBottom);

      let initial = true;

      const observer = new ResizeObserver(([entry]) => {
        const targetHeight = entry.contentRect.height + paddingY;

        if (initial) {
          // Set instantly on first render — don't fight the open animation.
          outer.style.transition = "none";
          outer.style.height = `${targetHeight}px`;
          requestAnimationFrame(() => {
            outer.style.transition = "";
            initial = false;
          });
        } else {
          outer.style.height = `${targetHeight}px`;
        }
      });

      observer.observe(inner);

      return () => {
        observer.disconnect();
        outer.style.height = "";
        outer.style.transition = "";
      };
    }, [present]);

    if (!present) return null;

    const Comp = asChild ? Slot : "div";

    return (
      <SearchbarHideListWhenQueryEmptyContext.Provider value={true}>
        <Comp
          {...props}
          ref={(node: HTMLDivElement | null) => {
            (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof forwardedRef === "function") forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className={mergedClassName}
          data-state={isOpen ? "open" : "closed"}
          data-slot="searchbar-content"
          data-searchbar-root={rootId}
          onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
            props.onKeyDown?.(event);
            handleKeyDown(event);
          }}
        >
          <div ref={innerRef} data-slot="searchbar-content-inner">
            {children}
          </div>
        </Comp>
      </SearchbarHideListWhenQueryEmptyContext.Provider>
    );
  }
);

Content.displayName = "Searchbar.Content";
