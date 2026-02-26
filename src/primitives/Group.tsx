import * as React from "react";
import { Slot } from "../utils/slot.js";

export type SearchbarGroupProps = {
  /** Accessible label for the group */
  label?: string;
  /** Additional CSS class name */
  className?: string;
  asChild?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Groups related search items under a labelled section.
 *
 * Renders a heading and wraps children in an ARIA group role.
 *
 * @example
 * ```tsx
 * <Searchbar.Group label="Paintings">
 *   <Searchbar.Item value="starry-night">The Starry Night</Searchbar.Item>
 *   <Searchbar.Item value="irises">Irises</Searchbar.Item>
 * </Searchbar.Group>
 * ```
 */
export const Group = React.forwardRef<HTMLDivElement, SearchbarGroupProps>(
  ({ label, className, asChild = false, children, ...props }, forwardedRef) => {
    const labelId = React.useId();
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        {...props}
        ref={forwardedRef as React.Ref<HTMLDivElement>}
        role="group"
        aria-labelledby={label ? labelId : undefined}
        className={className}
        data-slot="searchbar-group"
      >
        {label && (
          <div id={labelId} data-slot="searchbar-group-label">
            {label}
          </div>
        )}
        {children}
      </Comp>
    );
  }
);

Group.displayName = "Searchbar.Group";
