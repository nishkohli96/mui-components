/**
 * Color-scheme bootstrap, loaded via next/script `beforeInteractive` from
 * the root layout. Runs before hydration/first paint so there is no theme
 * flash. Equivalent of MUI's <InitColorSchemeScript> with defaultMode="system".
 *
 * ⚠️ Keep the storage key and attribute in sync with src/theme/constants.ts
 * (modeStorageKey / colorSchemeAttribute) — this static file cannot import them.
 */
(function () {
  try {
    var mode = localStorage.getItem('color-scheme') || 'system';
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var scheme = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;
    document.documentElement.setAttribute('data-mui-color-scheme', scheme);
  } catch (e) {
    /* localStorage unavailable — leave the server-rendered default. */
  }
})();
