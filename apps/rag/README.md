# @nish1896/mui-components-rag

RAG pipeline for the docs site's "Ask AI" search: ingestion/chunking → embeddings → vector store → retrieval API → LLM synthesis → eval harness. Internal tooling, not published — versioned independently of `packages/mui-components` and `apps/docs` (excluded from `scripts/bump-version.sh`).

## Ingestion

```bash
pnpm run ingest
```

Reads MDX pages and props-table data from `../docs/src` and writes chunks to `.output/chunks.json` (gitignored, pipeline intermediate).

Two chunk sources per doc page:

- **Prose** — MDX split into H2/H3 sections.
- **Props** — one chunk per prop, pulled from `../docs/src/constants/props-table` (the actual prop name/type/description live there as structured data, resolved before `<PropsTable>` renders them — parsing MDX text alone would miss this entirely).

`apps/docs/src/app/v1/**` pages are excluded: same component names as latest, different/older prop sets, which would make retrieval ambiguous between versions.

The script imports `../docs/src/constants/props-table` directly rather than through the docs app's `@/utils` / `@/constants` barrels — those barrels pull in unrelated modules (e.g. `employees.ts`) with a circular-import ordering issue that only breaks under a plain Node/tsx run, not under Next's webpack build. `tsconfig.json` aliases `@/utils` and `@/types` straight to the specific files that are actually needed at runtime instead.
