/**
 * Search result data returned from Étoile API.
 *
 * @example
 * ```ts
 * const result: SearchResultData = {
 *   external_id: "starry-night",
 *   title: "The Starry Night",
 *   collection: "paintings",
 *   score: 0.95,
 *   content: "A swirling night sky over a village...",
 *   metadata: {
 *     artist: "Vincent van Gogh",
 *     year: 1889,
 *     url: "https://example.com/starry-night"
 *   }
 * };
 * ```
 */
export type SearchResultData = {
  /** Unique identifier for the result */
  external_id: string;
  /** Title of the result */
  title: string;
  /** Collection this result belongs to */
  collection: string;
  /** Relevance score (0-1, higher is more relevant) */
  score: number;
  /** Text content of the result */
  content?: string;
  /** Custom metadata attached to the result */
  metadata: Record<string, unknown>;
};
