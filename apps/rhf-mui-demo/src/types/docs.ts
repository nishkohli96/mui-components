/**
 * Shape of a single row in a component props table.
 * Mirrors `PropsInfo` from the legacy rhf-mui-docs app so prop descriptions
 * can be maintained centrally and reused across doc pages and versions.
 *
 * `description` and `type` support inline markdown: `` `code` `` spans and
 * `[label](url)` links — rendered by the docs `PropsTable` component.
 */
export type PropsInfo = {
  name: string;
  description: string;
  type: string;
  required?: boolean;
  /** Set when `type` contains a markdown link instead of a plain code span. */
  hasLinkInType?: boolean;
  /** Rendered in the "Default" column; omit to show "-". */
  defaultValue?: string;
};
