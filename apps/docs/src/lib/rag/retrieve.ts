import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import {
  pineconeConfig,
  openAIConfig,
  type ChunkMetadata,
  type RetrievedMatch
} from '@nish1896/rag-config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_PLATFORM_KEY
});
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

/** Embeds `question` with the same model the corpus was indexed with. */
export async function embedQuestion(question: string): Promise<number[]> {
  const { data } = await openai.embeddings.create({
    model: openAIConfig.embedding.model,
    input: question
  });
  return data[0]!.embedding;
}

/**
 * Queries Pinecone with an already-computed question embedding, filtered by
 * `pineconeConfig.relevanceThreshold`. Split out from `retrieveChunks` so
 * `/api/answer` can reuse one embedding for both the query-cache lookup and
 * the Pinecone query, instead of embedding the question twice.
 */
export async function retrieveChunksForEmbedding(embedding: number[]): Promise<RetrievedMatch[]> {
  const index = pinecone.index<ChunkMetadata>({ name: pineconeConfig.indexName });
  const { matches } = await index.query({
    vector: embedding,
    topK: pineconeConfig.topK,
    includeMetadata: true
  });

  return (matches ?? [])
    .filter(match => (match.score ?? 0) >= pineconeConfig.relevanceThreshold && match.metadata)
    .map(match => ({ id: match.id, score: match.score ?? 0, ...match.metadata! }));
}

/**
 * Embeds `question` and returns the docs chunks relevant to it. Used by the
 * raw retrieval route (`/api/ask`, useful on its own for the eval harness)
 * and anywhere that doesn't need the embedding for anything else.
 */
export async function retrieveChunks(question: string): Promise<RetrievedMatch[]> {
  const embedding = await embedQuestion(question);
  return retrieveChunksForEmbedding(embedding);
}
