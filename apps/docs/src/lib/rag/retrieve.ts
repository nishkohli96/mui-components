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

/**
 * Embeds `question` and returns the docs chunks relevant to it, filtered by
 * `pineconeConfig.relevanceThreshold`. Shared by the raw retrieval route
 * (`/api/ask`, useful on its own for the eval harness) and the synthesis
 * route (`/api/answer`) — one retrieval implementation for both.
 */
export async function retrieveChunks(question: string): Promise<RetrievedMatch[]> {
  const { data } = await openai.embeddings.create({
    model: openAIConfig.embedding.model,
    input: question
  });

  const index = pinecone.index<ChunkMetadata>({ name: pineconeConfig.indexName });
  const { matches } = await index.query({
    vector: data[0]!.embedding,
    topK: pineconeConfig.topK,
    includeMetadata: true
  });

  return (matches ?? [])
    .filter(match => (match.score ?? 0) >= pineconeConfig.relevanceThreshold && match.metadata)
    .map(match => ({ id: match.id, score: match.score ?? 0, ...match.metadata! }));
}
