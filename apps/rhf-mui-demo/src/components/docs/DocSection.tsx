import type { ReactNode } from 'react';
import Typography from '@mui/material/Typography';

type DocSectionProps = {
  /** Anchor id for deep links, e.g. `props` → `/textfield#props`. */
  id: string;
  /** Section heading text. */
  title: string;
  children: ReactNode;
};

/**
 * A titled documentation section with a linkable anchor. The heading is a
 * real `<h2>` in server-rendered HTML, so sections are crawlable and can be
 * deep-linked from anywhere.
 */
const DocSection = ({ id, title, children }: DocSectionProps) => {
  return (
    <section className="doc-section">
      <Typography
        id={id}
        variant="h5"
        component="h2"
        className="doc-section-heading"
        sx={{ mt: 5, mb: 2, fontWeight: 600, scrollMarginTop: '80px' }}
      >
        {`${title} `}
        <a
          href={`#${id}`}
          className="doc-section-anchor"
          aria-label={`Link to the "${title}" section`}
        >
          #
        </a>
      </Typography>
      {children}
    </section>
  );
};

export default DocSection;
