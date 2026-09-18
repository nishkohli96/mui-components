import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import type { RetrievedMatch } from '@nish1896/rag-config';
import { retrieveChunks } from '@/lib/rag/retrieve';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_PLATFORM_KEY
});

const NOT_COVERED_ANSWER = 'This isn\'t covered in the MUI Components docs.';

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
  const { question } = await request.json();

  if (typeof question !== 'string' || !question.trim()) {
    return Response.json({ error: 'question is required' }, { status: 400 });
  }

  const chunks = await retrieveChunks(question);

  if (chunks.length === 0) {
    return Response.json({
      answer: NOT_COVERED_ANSWER,
      citations: [] as Citation[]
    });
  }

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: answerSchema,
    system: `You are the "Ask AI" search assistant for the MUI Components docs site.
Answer strictly and only using the provided context chunks — never from general knowledge about MUI or React.
If the context doesn't actually answer the question, set "answer" to exactly: "${NOT_COVERED_ANSWER}" and return an empty usedChunkNumbers array.
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
  const citations: Citation[] = object.usedChunkNumbers
    .map(n => chunks[n - 1])
    .filter((c): c is RetrievedMatch => c !== undefined)
    .map(({ pageUrl, sectionHeading, componentName }) => ({ pageUrl, sectionHeading, componentName }));

  return Response.json({ answer: object.answer, citations });
}
