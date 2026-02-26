import * as React from "react";

export type SearchbarKbdProps = {
  /** Shortcut text (default: "⌘K") */
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

/**
 * Keyboard shortcut badge.
 *
 * @example
 * ```tsx
 * <Searchbar.Kbd />           // renders "⌘K"
 * <Searchbar.Kbd>/</Searchbar.Kbd>
 * <Searchbar.Kbd>Ctrl K</Searchbar.Kbd>
 * ```
 */
export const Kbd = ({ children = "⌘K", className, ...props }: SearchbarKbdProps) => (
  <kbd {...props} data-slot="searchbar-kbd" className={className}>
    {children}
  </kbd>
);

Kbd.displayName = "Searchbar.Kbd";
