/**
 * Embeds chunks.json with OpenAI and upserts into Pinecone.
 *
 * Diffs against a local manifest (id -> contentHash) so re-running after a
 * docs change only re-embeds chunks whose content actually changed, and
 * deletes vectors for chunks that no longer exist in chunks.json — instead
 * of paying to re-embed all ~785 chunks on every run.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

process.loadEnvFile(path.resolve(import.meta.dirname, '../.env'));

const CHUNKS_FILE = path.resolve(import.meta.dirname, '../.output/chunks.json');
const MANIFEST_FILE = path.resolve(import.meta.dirname, '../.output/embed-manifest.json');
const INDEX_NAME = 'mui-components-docs';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSION = 1536;
const EMBED_BATCH_SIZE = 100;

type Chunk = {
  id: string;
  contentHash: string;
  type: 'prose' | 'prop';
  componentName: string | null;
  pageUrl: string;
  sectionHeading: string;
  content: string;
  propType?: string;
};

type Manifest = Record<string, string>; // chunk id -> contentHash already stored in Pinecone

const openai = new OpenAI({ apiKey: process.env.OPENAI_PLATFORM_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

async function loadManifest(): Promise<Manifest> {
  try {
    return JSON.parse(await readFile(MANIFEST_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

async function ensureIndex() {
  const { indexes } = await pinecone.listIndexes();
  if (indexes?.some(i => i.name === INDEX_NAME)) return;

  console.log(`Creating Pinecone index "${INDEX_NAME}"...`);
  await pinecone.createIndex({
    name: INDEX_NAME,
    dimension: EMBEDDING_DIMENSION,
    metric: 'cosine',
    spec: { serverless: { cloud: 'aws', region: 'us-east-1' } },
    waitUntilReady: true
  });
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  const chunks: Chunk[] = JSON.parse(await readFile(CHUNKS_FILE, 'utf-8'));
  const manifest = await loadManifest();

  const toEmbed = chunks.filter(c => manifest[c.id] !== c.contentHash);
  const currentIds = new Set(chunks.map(c => c.id));
  const toDelete = Object.keys(manifest).filter(id => !currentIds.has(id));

  console.log(
    `${chunks.length} chunks total — ${toEmbed.length} new/changed, ${toDelete.length} removed, ${chunks.length - toEmbed.length} unchanged (skipped)`
  );

  await ensureIndex();
  const index = pinecone.index(INDEX_NAME);

  for (const batch of chunkArray(toEmbed, EMBED_BATCH_SIZE)) {
    const { data } = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch.map(c => c.content)
    });

    await index.upsert(
      batch.map((chunk, i) => ({
        id: chunk.id,
        values: data[i].embedding,
        metadata: {
          type: chunk.type,
          componentName: chunk.componentName ?? '',
          pageUrl: chunk.pageUrl,
          sectionHeading: chunk.sectionHeading,
          content: chunk.content,
          ...(chunk.propType ? { propType: chunk.propType } : {})
        }
      }))
    );

    for (const chunk of batch) manifest[chunk.id] = chunk.contentHash;
    console.log(`Embedded + upserted batch of ${batch.length}`);
  }

  if (toDelete.length) {
    await index.deleteMany(toDelete);
    for (const id of toDelete) delete manifest[id];
    console.log(`Deleted ${toDelete.length} stale vectors`);
  }

  await writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  console.log('Done.');
}

main();
