/**
 * RAG ingestion: walks non-v1 doc pages and emits one chunk per MDX prose
 * section (H2/H3) plus one chunk per prop row (from the props-table modules,
 * which hold the real prop name/type/description — MDX only references them
 * via `<PropsTable rows={componentProps.X} />`, so parsing MDX text alone
 * would miss all prop content).
 *
 * v1/** pages are intentionally excluded — same component names, different
 * (older) prop sets, which would make retrieval ambiguous between versions.
 *
 * Output is a pipeline intermediate (consumed by the step-2 embedding
 * script), not source — not committed.
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { glob } from 'node:fs/promises';
import path from 'node:path';
import { componentProps } from '../../docs/src/constants/props-table/index';

const DOCS_APP_DIR = path.resolve(import.meta.dirname, '../../docs/src/app');
const OUT_FILE = path.resolve(import.meta.dirname, '../.output/chunks.json');

type Chunk = {
  id: string;
  type: 'prose' | 'prop';
  componentName: string | null;
  pageUrl: string;
  sectionHeading: string;
  content: string;
  propType?: string;
};

const hashId = (parts: string[]) =>
  createHash('sha256').update(parts.join('::')).digest('hex').slice(0, 16);

const filePathToUrl = (filePath: string) => {
  const rel = path
    .relative(DOCS_APP_DIR, path.dirname(filePath))
    .split(path.sep)
    .join('/');
  return rel === '' ? '/' : `/${rel}`;
};

/** Splits MDX body into H2/H3 sections, each carrying the nearest heading text. */
function splitIntoSections(mdx: string): { heading: string; content: string }[] {
  // strip the leading import/export/frontmatter block — not documentation content
  const bodyStart = mdx.search(/^#\s+/m);
  const body = bodyStart === -1 ? mdx : mdx.slice(bodyStart);

  const lines = body.split('\n');
  const sections: { heading: string; content: string }[] = [];
  let currentHeading = 'Overview';
  let buf: string[] = [];

  const flush = () => {
    const content = buf.join('\n').trim();
    if (content) sections.push({ heading: currentHeading, content });
    buf = [];
  };

  for (const line of lines) {
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      flush();
      currentHeading = h[2].trim();
    } else {
      buf.push(line);
    }
  }
  flush();

  return sections;
}

function extractComponentName(mdx: string): string | null {
  const m = /componentMetadata\.(\w+)/.exec(mdx) ?? /componentProps\.(\w+)/.exec(mdx);
  return m ? m[1] : null;
}

async function main() {
  const chunks: Chunk[] = [];

  const files: string[] = [];
  for await (const f of glob('**/page.mdx', { cwd: DOCS_APP_DIR })) {
    if (!f.startsWith('v1/')) files.push(path.join(DOCS_APP_DIR, f));
  }

  for (const filePath of files) {
    const mdx = await readFile(filePath, 'utf-8');
    const pageUrl = filePathToUrl(filePath);
    const componentName = extractComponentName(mdx);

    for (const { heading, content } of splitIntoSections(mdx)) {
      chunks.push({
        id: hashId([pageUrl, heading]),
        type: 'prose',
        componentName,
        pageUrl,
        sectionHeading: heading,
        content
      });
    }

    // one chunk per prop, resolved from the shared props-table modules
    const propsKeyMatch = /componentProps\.(\w+)/.exec(mdx);
    if (propsKeyMatch) {
      const key = propsKeyMatch[1];
      const rows = componentProps[key];
      if (!rows) {
        console.warn(`No componentProps entry for "${key}" referenced in ${filePath}`);
      } else {
        for (const row of rows) {
          chunks.push({
            id: hashId([pageUrl, 'prop', row.name]),
            type: 'prop',
            componentName: key,
            pageUrl,
            sectionHeading: `API > ${row.name}`,
            content: `Prop \`${row.name}\` (${row.type})${row.required ? ' — required' : ''}: ${row.description}`,
            propType: row.type
          });
        }
      }
    }
  }

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(chunks, null, 2));
  console.log(`Wrote ${chunks.length} chunks (${files.length} pages) to ${OUT_FILE}`);
}

main();
