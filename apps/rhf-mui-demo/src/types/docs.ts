import type { ReactNode } from 'react';

/**
 * A single row of a component props table.
 */
export type PropDoc = {
  /** Prop name, e.g. `fieldName`. */
  name: string;
  /** Type signature shown in code style, e.g. `string | null`. */
  type: string;
  /** Whether the prop must be supplied. */
  required?: boolean;
  /** Default value shown in code style, e.g. `','`. */
  defaultValue?: string;
  /** Prop description; supports inline elements like `<code>`. */
  description: ReactNode;
};
