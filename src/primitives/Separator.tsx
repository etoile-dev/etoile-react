import * as React from "react";
import { Slot } from "../utils/slot.js";

export type SearchbarSeparatorProps = {
  className?: string;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Visual separator between groups or sections.
 *
 * @example
 * ```tsx
 * <Searchbar.Group label="Paintings">…</Searchbar.Group>
 * <Searchbar.Separator />
 * <Searchbar.Group label="Artists">…</Searchbar.Group>
 * ```
 */
export const Separator = React.forwardRef<HTMLDivElement, SearchbarSeparatorProps>(
  ({ className, asChild = false, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        {...props}
        ref={forwardedRef as React.Ref<HTMLDivElement>}
        role="separator"
        aria-orientation="horizontal"
        className={className}
        data-slot="searchbar-separator"
      />
    );
  }
);

Separator.displayName = "Searchbar.Separator";
