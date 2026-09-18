import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import type { ChunkMetadata, RetrievedMatch } from '@nish1896/rag-types';

const INDEX_NAME = 'mui-components-docs';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const TOP_K = 5;

/**
 * Below this cosine similarity, treat the corpus as not covering the question.
 * `text-embedding-3-small` cosine scores for genuinely relevant short chunks
 * in this corpus land ~0.5-0.66, not near 1.0 — 0.55 is a placeholder based
 * on that spot-check, not a tuned value. Step 6's eval harness replaces this
 * guess with a threshold chosen against labeled questions.
 */
const RELEVANCE_THRESHOLD = 0.55;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_PLATFORM_KEY
});
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

export async function POST(request: Request) {
  const { question } = await request.json();

  if (typeof question !== 'string' || !question.trim()) {
    return Response.json({ error: 'question is required' }, { status: 400 });
  }

  const { data } = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: question
  });

  const index = pinecone.index<ChunkMetadata>({ name: INDEX_NAME });
  const { matches } = await index.query({
    vector: data[0]!.embedding,
    topK: TOP_K,
    includeMetadata: true
  });

  const results: RetrievedMatch[] = (matches ?? [])
    .filter(match => (match.score ?? 0) >= RELEVANCE_THRESHOLD && match.metadata)
    .map(match => ({ id: match.id, score: match.score ?? 0, ...match.metadata! }));

  return Response.json({ results });
}
