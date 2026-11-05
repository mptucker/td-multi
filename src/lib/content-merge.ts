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

/** Build the smallest JSON document that reproduces `value` when merged over
 * `base`. CMS rows store this patch instead of a second full copy of the site,
 * so new copy and fields shipped in Git remain authoritative unless a person
 * has intentionally changed that exact field in the CMS. Arrays are treated as
 * a single editable value because ordering is meaningful. */
export function diffContent(base: unknown, value: unknown): Record<string, unknown> {
  if (!isPlainObject(base) || !isPlainObject(value)) return {};
  const patch: Record<string, unknown> = {};
  for (const [key, nextValue] of Object.entries(value)) {
    const baseValue = base[key];
    if (isPlainObject(baseValue) && isPlainObject(nextValue)) {
      const nested = diffContent(baseValue, nextValue);
      if (Object.keys(nested).length) patch[key] = nested;
    } else if (!sameValue(baseValue, nextValue)) {
      patch[key] = nextValue;
    }
  }
  return patch;
}

export const CMS_PATCH_VERSION = 1;

export function versionContentPatch(patch: Record<string, unknown>): Record<string, unknown> {
  return { __cmsPatch: CMS_PATCH_VERSION, ...patch };
}

export function isVersionedContentPatch(value: unknown): value is Record<string, unknown> {
  return isPlainObject(value) && value.__cmsPatch === CMS_PATCH_VERSION;
}

export function stripContentPatchVersion(value: Record<string, unknown>): Record<string, unknown> {
  const { __cmsPatch: _version, ...patch } = value;
  return patch;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(canonicalValue(left)) === JSON.stringify(canonicalValue(right));
}

function canonicalValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (isPlainObject(value)) return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalValue(value[key])]));
  return value;
}
