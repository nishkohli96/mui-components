import { codeToHtml, type BundledLanguage } from 'shiki';
import CopyButton from './CopyButton';

type CodeBlockProps = {
  /** Raw source code to highlight. */
  code: string;
  /**
   * Shiki language id.
   * @default 'tsx'
   */
  language?: BundledLanguage;
  /** Optional label shown in the block header, e.g. a filename. */
  title?: string;
};

/**
 * Server component: highlights code with shiki at render/build time so the
 * page ships fully-highlighted static HTML (no client-side highlighter JS).
 * Light/dark palettes are emitted together as CSS variables and switched in
 * `globals.css` via the `data-mui-color-scheme` attribute.
 */
const CodeBlock = async ({ code, language = 'tsx', title }: CodeBlockProps) => {
  const trimmedCode = code.replace(/\n+$/, '');
  const html = await codeToHtml(trimmedCode, {
    lang: language,
    themes: {
      light: 'github-light',
      dark: 'github-dark'
    },
    defaultColor: false
  });

  return (
    <div className="doc-code-block">
      <div className="doc-code-block-header">
        <span className="doc-code-block-title">{title ?? language}</span>
        <CopyButton text={trimmedCode} />
      </div>
      <div
        className="doc-code-block-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default CodeBlock;
