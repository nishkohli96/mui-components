'use client';

import { useEffect, useState } from 'react';

type TocItem = {
  id: string;
  text: string;
  level: number;
};

/**
 * MUI-docs-style "Contents" rail. Scans the rendered article for h2/h3
 * headings after mount (works for any page — MDX or TSX) and highlights
 * the section currently in view. Pure navigation aid: page content itself
 * is server-rendered, so SEO does not depend on this component.
 */
const PageToc = () => {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.doc-article h2[id], .doc-article h3[id]'
      )
    );
    setItems(
      headings.map(heading => ({
        id: heading.id,
        /* Strip the trailing "#" of the hover anchor from the label. */
        text: (heading.textContent ?? '').replace(/#\s*$/, '').trim(),
        level: heading.tagName === 'H2' ? 2 : 3
      }))
    );

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.find(entry => entry.isIntersecting);
        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      /* Treat a heading as active while it sits in the upper viewport. */
      { rootMargin: '-90px 0px -70% 0px' }
    );
    headings.forEach(heading => observer.observe(heading));
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="doc-toc" aria-label="Page contents">
      <p className="doc-toc-title">Contents</p>
      <ul>
        {items.map(item => (
          <li
            key={item.id}
            className={[
              item.level === 3 ? 'doc-toc-sub' : '',
              item.id === activeId ? 'doc-toc-active' : ''
            ].join(' ').trim()}
          >
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default PageToc;
