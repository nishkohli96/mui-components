# @nish1896/mui-components-rag

RAG pipeline for the docs site's "Ask AI" search: ingestion/chunking → embeddings → vector store → retrieval API → LLM synthesis → eval harness.

Internal tooling, not to be published.

## Ingestion

```bash
pnpm run ingest
```

Reads MDX pages and props-table data from `../docs/src` and writes chunks to `.output/chunks.json` (gitignored, pipeline intermediate).

Two chunk sources per doc page:

- **Prose** — MDX split into `H2`/`H3` sections.
- **Props** — one chunk per prop, pulled from `../docs/src/constants/props-table` (the actual prop name/type/description live there as structured data, resolved before `<PropsTable>` renders them — parsing MDX text alone would miss this entirely).

`apps/docs/src/app/v1/**` pages are excluded: same component names as latest, different/older prop sets, which would make retrieval ambiguous between versions.

The script imports `../docs/src/constants/props-table` directly rather than through the docs app's `@/utils` / `@/constants` barrels — those barrels pull in unrelated modules (e.g. `employees.ts`) with a circular-import ordering issue that only breaks under a plain Node/tsx run, not under Next's webpack build. `tsconfig.json` aliases `@/utils` and `@/types` straight to the specific files that are actually needed at runtime instead.

## Embedding

```bash
pnpm run embed
```

Embeds `.output/chunks.json` with OpenAI and upserts into Pinecone. Diffs against `.output/embed-manifest.json` (chunk id → contentHash) so a re-run only re-embeds chunks whose content actually changed, and deletes vectors for chunks no longer in `chunks.json`.

## Eval harness

```bash
pnpm run eval
```

Requires the docs app running (`pnpm doc`, default `http://localhost:3000` — override with `EVAL_BASE_URL`). Runs every question in `src/eval/questions.json` against the live `/api/answer` route and checks:

- **Guardrail** (`expectMatch: false`) — the answer must be exactly the "not covered" fallback, for deliberately out-of-scope questions.
- **Retrieval** (`expectedPageUrl`) — at least one citation must point to the expected page.
- **Answer content** (`expectedKeywords`) — the answer text must contain each keyword (case-insensitive).

Re-run this after any change to chunking, the relevance threshold, or the synthesis prompt in `apps/docs/src/app/api/answer/route.ts` — it's what replaces "looks right to me" with a pass-rate number. Results land in `.output/eval-results.json` (latest run) and `.output/eval-history.json` (every run appended, for tracking pass rate over time as the pipeline changes).

The question set (`src/eval/questions.json`) currently has 2 starter cases — add more (aim for 15-20 covering a spread of components, prop-specific questions, and deliberately out-of-scope questions) to make the pass rate actually meaningful.
