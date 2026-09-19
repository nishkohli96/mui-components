'use client';

import { DocSearch } from '@docsearch/react';
import { ENV_VARS, appName } from '@/constants';
import '@docsearch/css/dist/style.css';

/**
 * The Algolia crawler indexes each page's real `<title>` (e.g.
 * "MUITextField | MUI Components") as `hierarchy.lvl0` — correct for SEO,
 * but redundant in the search dropdown where every single result and every
 * "Recently viewed" entry repeats the same site name. This strips just the
 * display suffix client-side; the indexed record and the page's actual
 * `<title>` are untouched.
 *
 * Only trims already-fetched search results — a "Recently viewed" entry
 * saved to localStorage *before* this shipped keeps its old, un-stripped
 * title until the user searches again and re-selects it.
 */
const titleSuffix = ` | ${appName}`;
const stripTitleSuffix = (value?: string) => value?.endsWith(titleSuffix)
  ? value.slice(0, -titleSuffix.length)
  : value;

type DocSearchHit = Parameters<NonNullable<Parameters<typeof DocSearch>[0]['transformItems']>>[0][number];

/**
 * The dropdown's top ("best match") row renders from `_highlightResult`
 * (highlighted HTML, e.g. `<mark>TextField</mark> | MUI Components`), while
 * every other row renders from the plain `hierarchy` field — both need the
 * suffix stripped, or only some rows lose it.
 */
const transformItems = (items: DocSearchHit[]) => items.map(item => ({
  ...item,
  hierarchy: {
    ...item.hierarchy,
    lvl0: stripTitleSuffix(item.hierarchy?.lvl0) ?? item.hierarchy?.lvl0
  },
  _highlightResult: item._highlightResult && {
    ...item._highlightResult,
    hierarchy: item._highlightResult.hierarchy && {
      ...item._highlightResult.hierarchy,
      lvl0: item._highlightResult.hierarchy.lvl0 && {
        ...item._highlightResult.hierarchy.lvl0,
        value: stripTitleSuffix(item._highlightResult.hierarchy.lvl0.value)
          ?? item._highlightResult.hierarchy.lvl0.value
      }
    }
  }
}));

/**
 * Algolia DocSearch trigger + modal. Renders nothing when the env vars
 * aren't configured (e.g. a local checkout without `.env` filled in) instead
 * of throwing — DocSearch requires all three to be non-empty strings.
 */
const SearchBar = () => {
  const { appId, apiKey, indexName } = ENV_VARS.algoliaConfig;
  if (!appId || !apiKey || !indexName) {
    return null;
  }

  return (
    <DocSearch
      appId={appId}
      apiKey={apiKey}
      indices={[indexName]}
      transformItems={transformItems}
    />
  );
};

export default SearchBar;
