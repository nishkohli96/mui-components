import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Reads a source file (relative to the app root) so doc pages can display
 * the exact code of the example component they render — the snippet can
 * never drift from the live demo.
 *
 * Server-only (uses `node:fs`): call it from server components/pages,
 * never from anything under a `'use client'` boundary. Kept out of the
 * `@/utils` barrel for that reason.
 *
 * @param relativePath - Path from the app root, e.g. `src/forms/textfield/examples/BasicTextField.tsx`.
 */
export function readSourceFile(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), 'utf-8');
}
