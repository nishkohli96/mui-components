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

/**
 * A line is a bullet only if the first non-whitespace character on the
 * *entire line* is "-" followed by whitespace — anchored to line start, so
 * a hyphen anywhere else in the text (a range like "5-10", a word like
 * "non-negative", or something like "as- abc") is never mistaken for a
 * bullet marker. Only a true markdown "- item" line matches.
 */
const bulletLineRe = /^\s*-\s+(.*)$/;

/**
 * Renders a full answer string with the same inline markdown as
 * `renderInlineMd`, plus block-level "- " bullet lists — the "Ask AI"
 * synthesis prompt sometimes returns lists (e.g. "MUIOTPInput works as
 * follows: - Typing a character...") which `renderInlineMd` alone left as
 * literal "- " text instead of an actual list.
 */
export const renderAnswerBlocks = (text: string): ReactNode => {
  const blocks: ReactNode[] = [];
  let currentListItems: string[] = [];

  const flushList = () => {
    if (currentListItems.length === 0) return;
    blocks.push(
      <ul key={blocks.length} style={{ margin: '4px 0', paddingLeft: 20 }}>
        {currentListItems.map((item, i) => (
          <li key={i}>{renderInlineMd(item)}</li>
        ))}
      </ul>
    );
    currentListItems = [];
  };

  for (const line of text.split('\n')) {
    const bulletMatch = bulletLineRe.exec(line);
    if (bulletMatch) {
      currentListItems.push(bulletMatch[1]!);
      continue;
    }
    flushList();
    if (line.trim() === '') continue;
    blocks.push(<div key={blocks.length}>{renderInlineMd(line)}</div>);
  }
  flushList();

  return <Fragment>{blocks}</Fragment>;
};
