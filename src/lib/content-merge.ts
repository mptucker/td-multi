/** Merge a stored CMS document over the versioned site model without losing
 * fields added by a newer release. Arrays replace as a complete value. */
export function mergeContent<T>(base: T, stored: unknown): T {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return base;
  if (!base || typeof base !== "object" || Array.isArray(base)) return stored as T;
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(stored as Record<string, unknown>)) {
    const fallback = result[key];
    result[key] = value && typeof value === "object" && !Array.isArray(value) && fallback && typeof fallback === "object" && !Array.isArray(fallback)
      ? mergeContent(fallback, value)
      : value;
  }
  return result as T;
}
