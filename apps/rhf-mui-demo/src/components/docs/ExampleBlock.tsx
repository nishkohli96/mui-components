import type { ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import CodeBlock from './CodeBlock';

type ExampleBlockProps = {
  /** Live, interactive demo (usually a small client component). */
  children: ReactNode;
  /** Optional caption rendered above the demo. */
  title?: string;
  /** Optional prose rendered between the caption and the demo. */
  description?: ReactNode;
  /** Source code shown in the collapsible "Show code" section. */
  source?: string;
  /** Label for the source block, e.g. a filename. */
  sourceTitle?: string;
};

/**
 * Wraps a live demo with an optional collapsible source view.
 * Uses a native `<details>` element so the code is part of the
 * server-rendered HTML (indexable, works without JavaScript).
 */
const ExampleBlock = ({
  children,
  title,
  description,
  source,
  sourceTitle
}: ExampleBlockProps) => {
  return (
    <div className="doc-example">
      {title && (
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {description}
        </Typography>
      )}
      <div className="doc-example-demo">{children}</div>
      {source && (
        <details className="doc-example-source">
          <summary>Show code</summary>
          <CodeBlock code={source} title={sourceTitle} />
        </details>
      )}
    </div>
  );
};

export default ExampleBlock;
