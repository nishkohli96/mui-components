import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import {
  pineconeConfig,
  openAIConfig,
  type ChunkMetadata,
  type RetrievedMatch
} from '@nish1896/rag-config';
import { expandComponentMentions } from './componentNames';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_PLATFORM_KEY
});
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

/**
 * Embeds `question` with the same model the corpus was indexed with.
 * Component mentions are expanded to their canonical name first (see
 * `expandComponentMentions`) — the corpus always uses the canonical name,
 * so a query missing the "MUI" prefix or using different
 * casing/separators embeds closer to the right chunk once rewritten.
 */
export async function embedQuestion(question: string): Promise<number[]> {
  const { data } = await openai.embeddings.create({
    model: openAIConfig.embedding.model,
    input: expandComponentMentions(question)
  });
  return data[0]!.embedding;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * A `prop`-type chunk's `sectionHeading` is always `API > propName`
 * — pull propName back out.
 */
export const propNameFromHeading = (heading: string) => heading.replace(/^API > /, '');

/**
 * Queries Pinecone with an already-computed question embedding. Split out
 * from `retrieveChunks` so `/api/answer` can reuse one embedding for both
 * the query-cache lookup and the Pinecone query, instead of embedding the
 * question twice.
 *
 * Combines semantic (embedding) search with two lexical rescues, since pure
 * vector search can't be trusted for exact identifiers:
 *
 * - Short, common prop names ("min", "max") embed weakly against short
 *   queries and can rank below `relevanceThreshold` even when they are the
 *   literal right answer (see `candidatePoolSize`'s doc comment for a
 *   concrete spot-check) — any `prop`-type chunk whose exact prop name
 *   appears as a whole word in `question` is included regardless of score.
 * - Any chunk whose `componentName` is mentioned (after the same
 *   canonicalization `embedQuestion` applies) is included regardless of
 *   score too, as a second line of defense on top of the embedding rewrite.
 */
export async function retrieveChunksForEmbedding(embedding: number[], question: string): Promise<RetrievedMatch[]> {
  const expandedQuestion = expandComponentMentions(question);

  const index = pinecone.index<ChunkMetadata>({ name: pineconeConfig.indexName });
  const { matches } = await index.query({
    vector: embedding,
    topK: pineconeConfig.candidatePoolSize,
    includeMetadata: true
  });

  const candidates = (matches ?? []).filter(match => match.metadata);

  const exactPropMatches = candidates.filter(match => {
    if (match.metadata!.type !== 'prop') {
      return false;
    }
    const propName = propNameFromHeading(match.metadata!.sectionHeading);
    return new RegExp(`\\b${escapeRegExp(propName)}\\b`, 'i').test(question);
  });

  const exactComponentMatches = candidates.filter(match => {
    const componentName = match.metadata!.componentName;
    return !!componentName && new RegExp(`\\b${escapeRegExp(componentName)}\\b`, 'i').test(expandedQuestion);
  });

  const semanticMatches = candidates
    .filter(match => (match.score ?? 0) >= pineconeConfig.relevanceThreshold)
    .slice(0, pineconeConfig.topK);

  const byId = new Map(
    [...exactPropMatches, ...exactComponentMatches, ...semanticMatches].map(match => [
      match.id,
      { id: match.id, score: match.score ?? 0, ...match.metadata! }
    ])
  );

  return [...byId.values()];
}

/**
 * Embeds `question` and returns the docs chunks relevant to it. Used by the
 * raw retrieval route (`/api/ask`, useful on its own for the eval harness)
 * and anywhere that doesn't need the embedding for anything else.
 */
export async function retrieveChunks(question: string): Promise<RetrievedMatch[]> {
  const embedding = await embedQuestion(question);
  return retrieveChunksForEmbedding(embedding, question);
}
