/**
 * A chunk is either a prose section from a docs page (H2/H3-split) or one
 * prop's description from that page's props table.
 */
export type Chunk = {
  id: string;
  /** Hash of `content` — lets the embed step skip chunks whose text hasn't changed. */
  contentHash: string;
  type: 'prose' | 'prop';
  componentName: string | null;
  pageUrl: string;
  sectionHeading: string;
  content: string;
  propType?: string;
};

/**
 * The subset of a Chunk actually written into a Pinecone record's metadata
 * (everything except `id`, which is the record's own id, and `contentHash`,
 * which only the embed pipeline's manifest needs). This is the shape the
 * docs app's retrieval route reads back — kept here so a field added on one
 * side can't silently drift from what the other side expects.
 */
export type ChunkMetadata = {
  type: Chunk['type'];
  componentName: string;
  pageUrl: string;
  sectionHeading: string;
  content: string;
  propType?: string;
};

/** A retrieved chunk plus its similarity score, as the retrieval API returns it. */
export type RetrievedMatch = ChunkMetadata & { id: string; score: number };
