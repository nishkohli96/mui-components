export const pineconeConfig = {
  indexName: 'mui-components-docs',
  topK: 5
}

export const openAIConfig = {
  embedding: {
		model: 'text-embedding-3-small',
		dimension: 1536,
		batchSize: 100,
	},
/**
 * Below this cosine similarity, treat the corpus as not covering the question.
 * `text-embedding-3-small` cosine scores for genuinely relevant short chunks
 * in this corpus land ~0.5-0.66, not near 1.0 — 0.55 is a placeholder based
 * on that spot-check, not a tuned value. Step 6's eval harness replaces this
 * guess with a threshold chosen against labeled questions.
 */
 relevanceThreshold: 0.50
}
