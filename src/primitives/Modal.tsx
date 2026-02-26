import * as React from "react";
import { Root } from "./Root.js";
import { Portal } from "./Portal.js";
import { Overlay } from "./Overlay.js";
import { Content } from "./Content.js";
import type { SearchbarRootProps } from "./Root.js";

export type SearchbarModalProps = {
  /** Accessible label for the dialog (default: "Search") */
  "aria-label"?: string;
} & Omit<SearchbarRootProps, "asChild">;

/**
 * Command palette primitive. Combines Root + Portal + Overlay + Content
 * into a single component — analogous to `Command.Dialog` in cmdk.
 *
 * Handles portal rendering, backdrop overlay, focus trapping, and
 * Escape/outside-click close. Children go directly into the Content panel.
 * This primitive is unstyled; add `className="etoile-search"` on Modal/Root
 * and import `@etoile-dev/react/styles.css` to use the default theme.
 *
 * @example Basic usage
 * ```tsx
 * <Searchbar.Modal hotkey="mod+k">
 *   <Searchbar.ModalInput />
 *   <Searchbar.List>…</Searchbar.List>
 * </Searchbar.Modal>
 * ```
 *
 * @example Controlled open state
 * ```tsx
 * <Searchbar.Modal open={open} onOpenChange={setOpen}>
 *   <Searchbar.ModalInput placeholder="Search paintings…" />
 *   <Searchbar.List>
 *     {items.map((item) => (
 *       <Searchbar.Item key={item.id} value={item.id}>{item.title}</Searchbar.Item>
 *     ))}
 *   </Searchbar.List>
 * </Searchbar.Modal>
 * ```
 */
export const Modal = React.forwardRef<HTMLDivElement, SearchbarModalProps>(
  (
    { "aria-label": ariaLabel = "Search", children, className, ...rootProps },
    ref
  ) => (
    <Root {...rootProps} ref={ref} className={className}>
      <Portal>
        <Overlay />
        <Content aria-label={ariaLabel}>{children}</Content>
      </Portal>
    </Root>
  )
);

Modal.displayName = "Searchbar.Modal";
