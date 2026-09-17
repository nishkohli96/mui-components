'use client';

import dynamic from 'next/dynamic';

/**
 * DocSearch's button renders a platform-specific shortcut label
 * ("Ctrl+K" vs "⌘K", from `navigator.platform`) and reads `localStorage`
 * for recent searches — both client-only, so its server-rendered markup
 * would never match the client and break hydration for the whole page.
 *
 * (`@docsearch/react/style` is imported in the root layout, not here —
 * Turbopack doesn't extract CSS reached only through this `ssr: false`
 * dynamic import, so the modal renders unstyled — `position: static`
 * instead of `fixed` — if the import lives inside this lazy boundary.)
 */
export default dynamic(() => import('.'), {
  ssr: false,
});
