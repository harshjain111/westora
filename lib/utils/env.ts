/**
 * Throws with a clear message instead of silently continuing with
 * `undefined` — used in place of a bare `!` non-null assertion on env vars
 * (CLAUDE.md §9: no `!` without a comment explaining the invariant; this
 * makes the invariant an actual runtime check instead of an assertion).
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
