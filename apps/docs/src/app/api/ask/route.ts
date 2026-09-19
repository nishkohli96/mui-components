import { retrieveChunks } from '@/lib/rag/retrieve';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const question = body?.question;

  if (typeof question !== 'string' || !question.trim()) {
    return Response.json({ error: 'question is required' }, { status: 400 });
  }

  const results = await retrieveChunks(question);
  return Response.json({ results });
}
