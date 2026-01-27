import * as React from "react";

export type SearchKbdProps = {
  /** Keyboard shortcut text (default: "⌘K") */
  children?: React.ReactNode;
  /** CSS class name for styling */
  className?: string;
};

/**
 * Keyboard shortcut badge for search.
 *
 * Displays a styled keyboard shortcut indicator. Works with the default theme.
 *
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <div className="etoile-input-wrapper">
 *   <SearchIcon />
 *   <SearchInput placeholder="Search..." />
 *   <SearchKbd />
 * </div>
 * ```
 *
 * @example Custom shortcut
 * ```tsx
 * <SearchKbd>/</SearchKbd>
 * <SearchKbd>Ctrl K</SearchKbd>
 * ```
 */
export const SearchKbd = ({
  children = "⌘K",
  className,
}: SearchKbdProps) => (
  <kbd className={className ? `etoile-kbd ${className}` : "etoile-kbd"}>
    {children}
  </kbd>
);
