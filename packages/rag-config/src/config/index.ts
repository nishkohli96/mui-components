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
  relevanceThreshold: 0.5,
  /**
   * How many raw matches to pull from Pinecone before filtering, wider than
   * `topK` — needed so the exact-prop-name rescue (see retrieve.ts) has a
   * pool to search. Short, common prop names ("min", "max") embed weakly
   * against short queries and can rank outside the top `topK` on pure
   * cosine similarity even when they're the literal right answer — spot
   * check: "numberinput min prop" scored the actual `min` chunk 0.4517,
   * ranked 15th, while unrelated prose chunks scored higher (0.53) purely
   * from sharing more surface vocabulary with the query.
   */
  candidatePoolSize: 20
};

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
