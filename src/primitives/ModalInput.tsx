import * as React from "react";
import { Input } from "./Input.js";
import { Icon } from "./Icon.js";
import { Kbd } from "./Kbd.js";

export type SearchbarModalInputProps = {
  /** Placeholder for the search input (default: "Search…") */
  placeholder?: string;
  /**
   * Leading icon content.
   * Pass `null` to hide it.
   * Default: built-in Searchbar.Icon
   */
  icon?: React.ReactNode | null;
  /**
   * Content for the keyboard shortcut badge.
   * Pass `null` to hide the badge entirely.
   * Default: "Esc"
   */
  kbd?: React.ReactNode | null;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Pre-composed input row for command palette mode.
 *
 * Renders a search icon, combobox input, and optional keyboard badge in a
 * flex row. A separator border appears automatically when results are
 * visible below (via `:has(+ [role="listbox"])`).
 *
 * Styled via `data-slot="searchbar-modal-input"` — fully independent from
 * the inline `Searchbar` input wrapper.
 *
 * @example Basic usage
 * ```tsx
 * <Searchbar.Modal hotkey="mod+k">
 *   <Searchbar.ModalInput />
 *   <Searchbar.List>…</Searchbar.List>
 * </Searchbar.Modal>
 * ```
 *
 * @example Custom placeholder, no kbd badge
 * ```tsx
 * <Searchbar.Modal>
 *   <Searchbar.ModalInput placeholder="Search paintings…" icon={null} kbd={null} />
 *   <Searchbar.List>…</Searchbar.List>
 * </Searchbar.Modal>
 * ```
 */
export const ModalInput = React.forwardRef<HTMLDivElement, SearchbarModalInputProps>(
  (
    {
      placeholder = "Search…",
      icon = <Icon />,
      kbd = "Esc",
      className,
      ...props
    },
    ref
  ) => (
    <div
      {...props}
      ref={ref}
      data-slot="searchbar-modal-input"
      className={className}
    >
      {icon}
      <Input autoFocus={true} placeholder={placeholder} />
      {kbd !== null && <Kbd>{kbd}</Kbd>}
    </div>
  )
);

ModalInput.displayName = "Searchbar.ModalInput";
