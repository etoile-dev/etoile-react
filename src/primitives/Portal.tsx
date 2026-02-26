import * as React from "react";
import { createPortal } from "react-dom";

export type SearchbarPortalProps = {
  /** DOM node to portal into (default: document.body) */
  container?: Element | null;
  children: React.ReactNode;
};

/**
 * Renders children into a portal — useful for command palette / modal mode
 * to escape stacking contexts.
 *
 * @example
 * ```tsx
 * <Searchbar.Root>
 *   <Searchbar.Trigger />
 *   <Searchbar.Portal>
 *     <Searchbar.Overlay />
 *     <Searchbar.Content>
 *       <Searchbar.Input />
 *       <Searchbar.List>…</Searchbar.List>
 *     </Searchbar.Content>
 *   </Searchbar.Portal>
 * </Searchbar.Root>
 * ```
 */
export const Portal = ({ container, children }: SearchbarPortalProps) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, container ?? document.body);
};

Portal.displayName = "Searchbar.Portal";
