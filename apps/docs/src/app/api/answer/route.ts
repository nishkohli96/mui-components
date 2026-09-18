import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { NOT_COVERED_ANSWER, type RetrievedMatch } from '@nish1896/rag-config';
import { embedQuestion, retrieveChunksForEmbedding } from '@/lib/rag/retrieve';
import { checkRateLimit, getClientIp } from '@/lib/rag/rateLimit';
import { getCachedAnswer, setCachedAnswer } from '@/lib/rag/answerCache';
import { extractMuiLinks, dedupeLinks, type ExternalLink } from '@/lib/rag/muiLinks';
import { computeCitationAnchor } from '@/lib/rag/citationAnchor';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_PLATFORM_KEY
});

/**
 * Bump this whenever the system prompt below changes meaning — it invalidates
 * every cached answer generated under the old prompt (see answerCache.ts),
 * so a fixed bug (e.g. a false "not covered") can't stay stuck in the cache.
 */
const PROMPT_VERSION = 6;

const answerSchema = z.object({
  answer: z
    .string()
    .describe('The answer to the question, written only from the provided context chunks.'),
  usedChunkNumbers: z
    .array(z.number())
    .describe('The [N] numbers of the context chunks actually used to write the answer — a subset of what was provided, not all of it. Empty if the answer is the "not covered" fallback.')
});

export type Citation = Pick<RetrievedMatch, 'pageUrl' | 'sectionHeading' | 'componentName'> & { anchor: string };

const PASSTHROUGH_STATEMENT_RE = /accepts\s+(?:most|all|the remaining)\s+\[?\w*Props/i;

/**
 * Even with an explicit instruction and temperature 0, gpt-4o-mini still
 * sometimes answers "not covered" for a standard MUI prop when the
 * retrieved passthrough statement names an exclusion list (e.g. "accepts
 * most TextFieldProps, with some excluded, including type, multiline and
 * rows") — a prompt-following gap that more prompt text didn't reliably
 * close. This is a deterministic safety net underneath the LLM's judgment:
 * if the model declined but a passthrough statement with a linked MUI doc
 * was actually retrieved, don't trust the model's "not covered" — verify
 * it in code instead.
 */
function findPassthroughChunk(chunks: RetrievedMatch[]): RetrievedMatch | undefined {
  return chunks.find(c => PASSTHROUGH_STATEMENT_RE.test(c.content) && extractMuiLinks(c.content).length > 0);
}

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

  const chunks = await retrieveChunksForEmbedding(embedding, question);

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
    temperature: 0,
    schema: answerSchema,
    system: `You are the "Ask AI" search assistant for the MUI Components docs site.
Answer strictly and only using the provided context chunks — never from general knowledge
about MUI or React.

Each chunk is labeled with its TYPE and COMPONENT. A "prop" chunk is the library's own
authoritative, structured documentation for exactly one named prop — if the question asks
about a specific prop and a "prop" chunk for that exact prop is present, that chunk is
always the answer: use its content directly and never describe that prop as merely
inherited/passthrough, even if a "prose" chunk elsewhere makes a generic passthrough
statement. Only fall back to the passthrough explanation below when no "prop" chunk
documents the specific prop being asked about.

If the question names a specific component (with or without the "MUI" prefix, any casing or
separators — "numberinput", "number-input", and "MUINumberInput" all mean the same
component), and multiple chunks answer the same prop for different components, always prefer
the chunk whose COMPONENT matches the one named in the question over a chunk for a different
component, even if that other chunk scores as more relevant.

Every component wraps an underlying Material UI component and passes through its remaining
standard MUI props (e.g. "accepts the remaining TextFieldProps", usually with a link to
mui.com) — these passthrough props are almost never named individually in the docs. If the
question asks about a standard MUI prop (e.g. variant, color, fullWidth, size) with no
matching "prop" chunk, and a "prose" chunk states the component accepts that underlying MUI
component's remaining props, answer that it's supported via that passthrough and point to
the linked MUI docs — do not treat "not explicitly named" as "not covered" in this case. This
applies even when the passthrough statement is the only relevant chunk provided.

Some components' passthrough statement names a short exclusion list (e.g. "accepts most
TextFieldProps, with some excluded, including type, multiline and rows") — this means every
OTHER standard prop of the underlying MUI component is supported; do not read the exclusion
list as a reason to be uncertain about a prop that isn't on it.

Only set "answer" to exactly: "${NOT_COVERED_ANSWER}" (and return an empty usedChunkNumbers
array) when nothing in the context relates to the question at all — not merely because a
specific prop name isn't spelled out.
Only list the [N] numbers of chunks you actually used to write the answer, not every chunk provided.`,
    prompt: `Question: ${question}

Context chunks:
${chunks.map((c, i) => `[${i + 1}] TYPE: ${c.type} | COMPONENT: ${c.componentName || 'n/a'} (${c.pageUrl} > ${c.sectionHeading})\n${c.content}`).join('\n\n')}`
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

  let answer = object.answer;
  let citations: Citation[] = usedChunks.map(c => ({
    pageUrl: c.pageUrl,
    sectionHeading: c.sectionHeading,
    componentName: c.componentName,
    anchor: computeCitationAnchor(c)
  }));
  let externalLinks = dedupeLinks(usedChunks.flatMap(c => extractMuiLinks(c.content)));

  if (answer === NOT_COVERED_ANSWER) {
    const passthroughChunk = findPassthroughChunk(chunks);
    if (passthroughChunk) {
      const links = extractMuiLinks(passthroughChunk.content);
      const component = passthroughChunk.componentName || 'This component';
      answer = `${component} passes through most of the underlying Material UI component's standard props, so this is very likely supported — see the linked MUI docs for exact behavior.`;
      citations = [{
        pageUrl: passthroughChunk.pageUrl,
        sectionHeading: passthroughChunk.sectionHeading,
        componentName: passthroughChunk.componentName,
        anchor: computeCitationAnchor(passthroughChunk)
      }];
      externalLinks = dedupeLinks(links);
    }
  }

  setCachedAnswer(embedding, answer, citations, externalLinks, PROMPT_VERSION);

  return Response.json({ answer, citations, externalLinks });
}
