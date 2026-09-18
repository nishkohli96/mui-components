/**
 * A chunk would be an object containing either a paragraph from the component
 * docs, or the prop description from the PropsDescription table on the docs
 * page.
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

/** chunk id -> contentHash already embedded and stored in Pinecone */
export type EmbedManifest = Record<string, string>;
