/**
 * Documentation building blocks for .mdx pages.
 *
 * - DocsPage: article + sticky right-rail table of contents.
 * - MdxPre: code-block frame with a copy button (mapped in mdx-components).
 * - PageToc: standalone TOC, already included by DocsPage.
 * - PropsTable: props reference table fed by `constants/component-props.ts`.
 */
export { default as DocsPage } from './DocsPage';
export { default as MdxPre } from './MdxPre';
export { default as PageToc } from './PageToc';
export { default as PropsTable } from './PropsTable';
