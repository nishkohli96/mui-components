import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { NOT_COVERED_ANSWER, type RetrievedMatch } from '@nish1896/rag-config';
import { embedQuestion, retrieveChunksForEmbedding } from '@/lib/rag/retrieve';
import { checkRateLimit, getClientIp } from '@/lib/rag/rateLimit';
import { getCachedAnswer, setCachedAnswer } from '@/lib/rag/answerCache';
import { extractMuiLinks, dedupeLinks, type ExternalLink } from '@/lib/rag/muiLinks';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_PLATFORM_KEY
});

/**
 * Bump this whenever the system prompt below changes meaning — it invalidates
 * every cached answer generated under the old prompt (see answerCache.ts),
 * so a fixed bug (e.g. a false "not covered") can't stay stuck in the cache.
 */
const PROMPT_VERSION = 2;

const answerSchema = z.object({
  answer: z
    .string()
    .describe('The answer to the question, written only from the provided context chunks.'),
  usedChunkNumbers: z
    .array(z.number())
    .describe('The [N] numbers of the context chunks actually used to write the answer — a subset of what was provided, not all of it. Empty if the answer is the "not covered" fallback.')
});

export type Citation = Pick<RetrievedMatch, 'pageUrl' | 'sectionHeading' | 'componentName'>;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return Response.json(
      { error: 'Too many questions — try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
    );
  }

  const { question } = await request.json();

  if (typeof question !== 'string' || !question.trim()) {
    return Response.json({ error: 'question is required' }, { status: 400 });
  }

  const embedding = await embedQuestion(question);

  const cached = getCachedAnswer(embedding, PROMPT_VERSION);
  if (cached) {
    return Response.json({
      answer: cached.answer,
      citations: cached.citations,
      externalLinks: cached.externalLinks
    });
  }

  const chunks = await retrieveChunksForEmbedding(embedding);

  if (chunks.length === 0) {
    setCachedAnswer(embedding, NOT_COVERED_ANSWER, [], [], PROMPT_VERSION);
    return Response.json({
      answer: NOT_COVERED_ANSWER,
      citations: [] as Citation[],
      externalLinks: [] as ExternalLink[]
    });
  }

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: answerSchema,
    system: `You are the "Ask AI" search assistant for the MUI Components docs site.
Answer strictly and only using the provided context chunks — never from general knowledge about MUI or React.

Every component wraps an underlying Material UI component and passes through its remaining
standard MUI props (e.g. "accepts the remaining TextFieldProps", usually with a link to
mui.com) — these passthrough props are almost never named individually in the docs. If the
question asks about a standard MUI prop (e.g. variant, color, fullWidth, size) and a chunk
states the component accepts that underlying MUI component's remaining props, answer that
it's supported via that passthrough and point to the linked MUI docs — do not treat "not
explicitly named" as "not covered" in this case.

Only set "answer" to exactly: "${NOT_COVERED_ANSWER}" (and return an empty usedChunkNumbers
array) when nothing in the context relates to the question at all — not merely because a
specific prop name isn't spelled out.
Only list the [N] numbers of chunks you actually used to write the answer, not every chunk provided.`,
    prompt: `Question: ${question}

Context chunks:
${chunks.map((c, i) => `[${i + 1}] (${c.pageUrl} > ${c.sectionHeading})\n${c.content}`).join('\n\n')}`
  });

  /**
   * Map the model's chunk numbers back to our own exact metadata.
   * The model never generates pageUrl/sectionHeading/componentName
   * itself, so citations can't drift or get hallucinated the way
   * freeform fields did.
   */
  const usedChunks = object.usedChunkNumbers
    .map(n => chunks[n - 1])
    .filter((c): c is RetrievedMatch => c !== undefined);

  const citations: Citation[] = usedChunks.map(
    ({ pageUrl, sectionHeading, componentName }) => ({ pageUrl, sectionHeading, componentName })
  );

  const externalLinks = dedupeLinks(usedChunks.flatMap(c => extractMuiLinks(c.content)));

  setCachedAnswer(embedding, object.answer, citations, externalLinks, PROMPT_VERSION);

  return Response.json({
    answer: object.answer,
    citations,
    externalLinks
  });
}
