import * as React from "react";

export type SearchbarIconProps = {
  /** Width and height in pixels (default: 18) */
  size?: number;
  className?: string;
} & React.SVGAttributes<SVGElement>;

/**
 * Search magnifying glass icon.
 *
 * @example
 * ```tsx
 * <div data-slot="searchbar-input-row">
 *   <Searchbar.Icon />
 *   <Searchbar.Input />
 * </div>
 * ```
 */
export const Icon = ({ size = 18, className, ...props }: SearchbarIconProps) => (
  <svg
    {...props}
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

Icon.displayName = "Searchbar.Icon";
