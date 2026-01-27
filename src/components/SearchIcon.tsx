import * as React from "react";

export type SearchIconProps = {
  /** Width and height in pixels (default: 18) */
  size?: number;
  /** CSS class name for styling */
  className?: string;
};

/**
 * Search magnifying glass icon.
 *
 * A minimal SVG icon that works perfectly with the default theme.
 *
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <div className="etoile-input-wrapper">
 *   <SearchIcon />
 *   <SearchInput placeholder="Search..." />
 * </div>
 * ```
 */
export const SearchIcon = ({ size = 18, className }: SearchIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m21 21-4.34-4.34" />
    <circle cx="11" cy="11" r="8" />
  </svg>
);
