import { Fragment, type ReactNode } from 'react';

/**
 * Matches the inline markdown constructs used across the docs site's own
 * generated text: [label](url), `code`, **bold**, _italic_ — originally
 * written for prop descriptions in `constants/props-table` (see
 * `PropsTable`), reused here since the "Ask AI" synthesis prompt produces
 * the same inline constructs and a chat bubble needs the same rendering.
 */
const inlineMdPattern
  = /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|_[^_]+_)/g;
const linkPattern = /^\[([^\]]+)\]\(([^)]+)\)$/;

/**
 * Renders a description/type/answer string with minimal inline markdown support.
 */
export const renderInlineMd = (text: string): ReactNode => (
  <Fragment>
    {text.split(inlineMdPattern).map((part, index) => {
      const link = part.match(linkPattern);
      if (link) {
        return (
          <a
            key={index}
            href={link[2]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link[1]}
          </a>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index}>
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('_') && part.endsWith('_')) {
        return (
          <em key={index}>
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    })}
  </Fragment>
);
