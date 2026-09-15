/**
 * Zod schema for the RHF unit-input demo. Only the numeric **value** side of
 * each field is validated (`z.custom<number | null>`, matching the
 * `age`/`rating` convention in `complete-forms/react-hook-form/validation.ts`)
 * — the **unit** side always carries a default selection.
 */

import * as z from 'zod';

const requiredAmount = (label: string) => z.custom<number | null>(
  val => typeof val === 'number',
  { message: `${label} is required` }
);

export const unitInputFormSchema = z.object({
  distanceUnit: z.enum(['km', 'mi', 'nmi']),
  distanceAmount: requiredAmount('Distance'),
  storage: z.object({
    unit: z.enum(['KB', 'MB', 'GB', 'TB']),
    amount: requiredAmount('File size')
  })
});
