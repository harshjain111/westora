/**
 * Lead reference format: WG-{YYYY}-{NNNN}, e.g. WG-2026-0417.
 *
 * The number itself is generated inside Postgres (supabase/migrations/
 * 0003_reference_generator.sql), not here — a `before insert` trigger on
 * `leads` calls an atomic per-year sequence function as part of the same
 * insert transaction. Generating it in application code instead would
 * mean reading the current max, then writing a new one, with a race
 * window between the two under concurrent submissions; the DB-side
 * sequence has no such window. This file only validates the shape.
 */
export const REFERENCE_PATTERN = /^WG-\d{4}-\d{4}$/;

export function isValidReference(reference: string): boolean {
  return REFERENCE_PATTERN.test(reference);
}
