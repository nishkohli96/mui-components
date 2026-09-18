export const pineconeConfig = {
  /**
   * Name of the Pinecone serverless index all chunks are
   * upserted into and queried from.
   */
  indexName: 'mui-components-docs',
  /**
   * Number of nearest-neighbor matches to fetch per query,
   * before the relevance filter below.
   */
  topK: 5,
  /**
   * Below this cosine similarity, a match is dropped instead of being treated
   * as relevant — lets the retrieval route say "not covered in the docs"
   * instead of forcing a weak match into the LLM prompt.
   */
  relevanceThreshold: 0.5
};

/**
 * The exact fallback string `/api/answer` returns when no retrieved chunk
 * clears the relevance threshold. Shared with the eval harness (apps/rag),
 * which checks answers against this exact string to verify the "not
 * covered" guardrail actually fires — kept here so the two can't drift.
 */
export const NOT_COVERED_ANSWER = "🔍 This isn't covered in the MUI Components docs.";

export const openAIConfig = {
  embedding: {
    /**
     * OpenAI embedding model used for both indexing chunks and embedding user
     * queries — must match on both sides, or similarity scores are meaningless.
     */
    model: 'text-embedding-3-small',
    /**
     * Vector size text-embedding-3-small outputs; must match the
     * Pinecone index's configured dimension exactly.
     */
    dimension: 1536,
    /**
     * Max chunks sent per OpenAI embeddings.create call during the embed pipeline,
     * to stay under request-size limits.
     */
    batchSize: 100
  }
};
