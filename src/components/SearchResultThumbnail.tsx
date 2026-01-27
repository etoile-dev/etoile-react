import * as React from "react";
import { SearchResultDataContext } from "./SearchResults.js";

export type SearchResultThumbnailProps = {
  /** Image source URL (defaults to result.metadata.thumbnailUrl) */
  src?: string;
  /** Alt text for the image (defaults to result.title) */
  alt?: string;
  /** Width and height in pixels (default: 40) */
  size?: number;
  /** CSS class name for styling */
  className?: string;
};

/**
 * Thumbnail image for search results with automatic source detection.
 *
 * Automatically uses `metadata.thumbnailUrl` if available. Returns null
 * if no image source is found. Must be used inside SearchResults.
 *
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <SearchResults>
 *   {(result) => (
 *     <SearchResult>
 *       <SearchResultThumbnail />
 *       <span>{result.title}</span>
 *     </SearchResult>
 *   )}
 * </SearchResults>
 * ```
 *
 * @example With custom size and styling
 * ```tsx
 * <SearchResultThumbnail size={48} className="rounded-full" />
 * ```
 */
export const SearchResultThumbnail = ({
  src,
  alt,
  size = 40,
  className,
}: SearchResultThumbnailProps) => {
  const result = React.useContext(SearchResultDataContext);

  const imageSrc = src ?? (result?.metadata?.thumbnailUrl as string | undefined);
  const imageAlt = alt ?? result?.title ?? "";

  if (!imageSrc) {
    return null;
  }

  return (
    <img
      src={imageSrc}
      alt={imageAlt}
      width={size}
      height={size}
      className={className}
      draggable={false}
    />
  );
};
