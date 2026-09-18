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

export async function POST(request: Request) {
  const { question } = await request.json();

  if (typeof question !== 'string' || !question.trim()) {
    return Response.json({ error: 'question is required' }, { status: 400 });
  }

  const { data } = await openai.embeddings.create({
    model: openAIConfig.embedding.model,
    input: question
  });

  const index = pinecone.index<ChunkMetadata>({
    name: pineconeConfig.indexName
  });
  const { matches } = await index.query({
    vector: data[0]!.embedding,
    topK: pineconeConfig.topK,
    includeMetadata: true
  });

  const results: RetrievedMatch[] = (matches ?? [])
    .filter(match => (match.score ?? 0) >= openAIConfig.relevanceThreshold && match.metadata)
    .map(match => ({ id: match.id, score: match.score ?? 0, ...match.metadata! }));

  return Response.json({ results });
}
