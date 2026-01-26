export type SearchResultData = {
  external_id: string;
  title: string;
  collection: string;
  score: number;
  metadata: Record<string, unknown>;
};
