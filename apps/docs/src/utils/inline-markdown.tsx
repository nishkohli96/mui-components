import { Fragment, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';

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
/** Same external-link test `mdx-components.tsx` uses for its own `a` mapping — keep the two in sync. */
const isExternalUrl = (url: string) => /^https?:\/\//.test(url);

/**
 * Renders a description/type/answer string with minimal inline markdown support.
 */
export const renderInlineMd = (text: string): ReactNode => (
  <Fragment>
    {text.split(inlineMdPattern).map((part, index) => {
      const link = part.match(linkPattern);
      if (link) {
        const isExternal = isExternalUrl(link[2]!);
        return (
          <MuiLink
            key={index}
            href={link[2]}
            underline="hover"
            {...(isExternal && {
              target: '_blank',
              rel: 'noopener noreferrer'
            })}
          >
            {link[1]}
          </MuiLink>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="inline-code">
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
/** Opening or closing fence of a code block: ``` optionally followed by a language tag. */
const fenceLineRe = /^```(\w*)\s*$/;

/**
 * Renders a full answer string with the same inline markdown as
 * `renderInlineMd`, plus two block-level constructs `renderInlineMd` alone
 * can't express:
 *
 * - "- " bullet lists — the synthesis prompt sometimes returns lists (e.g.
 *   "MUIOTPInput works as follows: - Typing a character...").
 * - ``` fenced code blocks — the prompt often echoes a real usage snippet
 *   verbatim. These are rendered as raw preformatted text (no per-line
 *   bullet/inline-markdown parsing inside the fence — a code line like
 *   `**foo**: number` or a backtick-containing string must render literally,
 *   not get parsed as bold/inline-code).
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

  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    const fenceMatch = fenceLineRe.exec(line);
    if (fenceMatch) {
      flushList();
      const language = fenceMatch[1];
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !fenceLineRe.test(lines[i]!)) {
        codeLines.push(lines[i]!);
        i++;
      }
      // i now sits on the closing fence (or ran off the end of an unterminated block) — the outer loop's i++ moves past it.
      blocks.push(
        <Box
          key={blocks.length}
          component="pre"
          sx={{
            m: '4px 0',
            p: 1.25,
            borderRadius: 1,
            overflowX: 'auto',
            fontSize: '0.8125rem',
            bgcolor: 'action.selected'
          }}
        >
          {language && (
            <Box component="span" sx={{ display: 'block', mb: 0.5, fontSize: '0.7rem', color: 'text.secondary' }}>
              {language}
            </Box>
          )}
          <code>{codeLines.join('\n')}</code>
        </Box>
      );
      continue;
    }

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
