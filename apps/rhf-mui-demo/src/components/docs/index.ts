/**
 * Documentation building blocks.
 *
 * ⚠️ Import this barrel only from server components (pages/layouts).
 * `CodeBlock` pulls in shiki, which must stay out of client bundles —
 * that's also why these are NOT re-exported from `@/components`.
 */
export { default as CodeBlock } from './CodeBlock';
export { default as CopyButton } from './CopyButton';
export { default as DocSection } from './DocSection';
export { default as ExampleBlock } from './ExampleBlock';
export { default as PropsTable } from './PropsTable';
