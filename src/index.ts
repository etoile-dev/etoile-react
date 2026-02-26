// ─── Primary export ───────────────────────────────────────────────────────────
//
// `Searchbar` is both a ready-to-use Etoile search component AND
// the namespace for all headless primitives:
//
//   <Searchbar apiKey="…" collections={["paintings"]} />
//
//   <Searchbar.Root onSelect={…}>
//     <Searchbar.Input />
//     <Searchbar.List>
//       <Searchbar.Item value="…">…</Searchbar.Item>
//       <Searchbar.Empty>No results</Searchbar.Empty>
//     </Searchbar.List>
//   </Searchbar.Root>

export { Searchbar, SearchModal } from "./Searchbar.js";

// ─── Individual primitive exports (tree-shakeable) ────────────────────────────
export { Root as SearchbarRoot } from "./primitives/Root.js";
export { Input as SearchbarInput } from "./primitives/Input.js";
export { List as SearchbarList } from "./primitives/List.js";
export { Item as SearchbarItem } from "./primitives/Item.js";
export { Results as SearchbarResults } from "./primitives/Results.js";
export { Group as SearchbarGroup } from "./primitives/Group.js";
export { Separator as SearchbarSeparator } from "./primitives/Separator.js";
export { Empty as SearchbarEmpty } from "./primitives/Empty.js";
export { Loading as SearchbarLoading } from "./primitives/Loading.js";
export { Error as SearchbarError } from "./primitives/Error.js";
export { Portal as SearchbarPortal } from "./primitives/Portal.js";
export { Overlay as SearchbarOverlay } from "./primitives/Overlay.js";
export { Content as SearchbarContent } from "./primitives/Content.js";
export { Modal as SearchbarModal } from "./primitives/Modal.js";
export { ModalInput as SearchbarModalInput } from "./primitives/ModalInput.js";
export { Trigger as SearchbarTrigger } from "./primitives/Trigger.js";
export { Icon as SearchbarIcon } from "./primitives/Icon.js";
export { Kbd as SearchbarKbd } from "./primitives/Kbd.js";
export { Thumbnail as SearchbarThumbnail } from "./primitives/Thumbnail.js";

// ─── Context hook (advanced usage) ───────────────────────────────────────────
export { useSearchbarContext, useSearchbarStore, useSearchbarState } from "./context.js";
export { useEtoileSearch, useSearch } from "./hooks/useEtoileSearch.js";

// ─── Types ────────────────────────────────────────────────────────────────────
export type { SearchResult, SearchFilter, FilterOperator } from "@etoile-dev/client";
/** @deprecated Use `SearchResult` from `@etoile-dev/client` instead. */
export type { SearchResultData } from "./types.js";
export type { SearchbarProps, SearchModalProps } from "./Searchbar.js";
export type { SearchbarRootProps } from "./primitives/Root.js";
export type { SearchbarInputProps } from "./primitives/Input.js";
export type { SearchbarListProps } from "./primitives/List.js";
export type { SearchbarItemProps } from "./primitives/Item.js";
export type { SearchbarResultsProps } from "./primitives/Results.js";
export type { SearchbarGroupProps } from "./primitives/Group.js";
export type { SearchbarSeparatorProps } from "./primitives/Separator.js";
export type { SearchbarEmptyProps } from "./primitives/Empty.js";
export type { SearchbarLoadingProps } from "./primitives/Loading.js";
export type { SearchbarErrorProps } from "./primitives/Error.js";
export type { SearchbarPortalProps } from "./primitives/Portal.js";
export type { SearchbarOverlayProps } from "./primitives/Overlay.js";
export type { SearchbarContentProps } from "./primitives/Content.js";
export type { SearchbarModalProps } from "./primitives/Modal.js";
export type { SearchbarModalInputProps } from "./primitives/ModalInput.js";
export type { SearchbarTriggerProps } from "./primitives/Trigger.js";
export type { SearchbarIconProps } from "./primitives/Icon.js";
export type { SearchbarKbdProps } from "./primitives/Kbd.js";
export type { SearchbarThumbnailProps } from "./primitives/Thumbnail.js";
export type { SearchbarState, SearchbarStore } from "./store.js";
export type { UseEtoileSearchOptions, UseEtoileSearchReturn } from "./hooks/useEtoileSearch.js";
