import * as React from "react";
import { SearchbarItemDataContext } from "../context.js";

export type SearchbarThumbnailProps = {
  /** Explicit image source. Defaults to `metadata.thumbnailUrl` from item context. */
  src?: string;
  /** Alt text. Defaults to item title from context. */
  alt?: string;
  /** Width and height in pixels (default: 40) */
  size?: number;
  className?: string;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height">;

/**
 * Thumbnail image for a search result item.
 *
 * When used inside the Etoile `<Searchbar />` wrapper, automatically reads
 * `metadata.thumbnailUrl` and the item title from context. Pass `src` and
 * `alt` explicitly when using headless primitives.
 *
 * Returns null if no source is found.
 *
 * @example
 * ```tsx
 * <Searchbar.Item value={result.id}>
 *   <Searchbar.Thumbnail src={result.thumbnailUrl} alt={result.title} />
 *   {result.title}
 * </Searchbar.Item>
 * ```
 */
export const Thumbnail = ({
  src,
  alt,
  size = 40,
  className,
  ...props
}: SearchbarThumbnailProps) => {
  const itemData = React.useContext(SearchbarItemDataContext);
  const metadata = itemData?.metadata as Record<string, unknown> | undefined;
  const imageSrc =
    src ??
    readImageSource(metadata, [
      "thumbnailUrl",
      "thumbnail_url",
      "thumbnail",
      "image",
      "imageUrl",
      "image_url",
      "cover",
      "coverUrl",
      "cover_url",
      "artwork",
      "artworkUrl",
      "artwork_url",
    ]);
  const imageAlt = alt ?? (itemData?.title as string | undefined) ?? "";

  if (!imageSrc) return null;

  return (
    <img
      {...props}
      src={imageSrc}
      alt={imageAlt}
      width={size}
      height={size}
      className={className}
      draggable={false}
    />
  );
};

Thumbnail.displayName = "Searchbar.Thumbnail";

const readImageSource = (metadata: Record<string, unknown> | undefined, keys: string[]) => {
  if (!metadata) return undefined;

  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === "string" && value.trim() !== "") return value;
    if (value && typeof value === "object") {
      const nestedUrl = (value as Record<string, unknown>).url;
      if (typeof nestedUrl === "string" && nestedUrl.trim() !== "") return nestedUrl;
    }
  }

  return undefined;
};
