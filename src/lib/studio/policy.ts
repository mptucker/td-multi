import type { BrandSlug } from "@/config/types";

const COMPONENT_DIRS: Record<BrandSlug, string[]> = {
  lighthouse: ["src/components/lighthouse/"],
  paradise: ["src/components/paradise/"],
  sundance: ["src/components/sundance/"],
  "island-view": ["src/components/island-view/"],
  fastrac: ["src/components/fastrac/"],
  "water-taxi": ["src/components/water-taxi/"],
  "tackle-box": ["src/components/tackle-box/"],
  boaterwise: ["src/components/boaterwise/"],
  bigwater: ["src/components/bigwater/"],
  "towboatus-ntx": ["src/components/towboatus-ntx/"],
  texomaco: ["src/components/texomaco/"],
};

const ALWAYS_ALLOWED = new Set(["src/app/globals.css", "src/config/brands.ts", "src/config/types.ts"]);
const TEXT_EXTENSIONS = /\.(?:css|json|md|ts|tsx)$/;

export function isStudioPathAllowed(brand: BrandSlug, path: string) {
  if (!path || path.startsWith("/") || path.includes("..") || !TEXT_EXTENSIONS.test(path)) return false;
  if (path === `content/${brand}.json`) return true;
  if (COMPONENT_DIRS[brand].some((prefix) => path.startsWith(prefix))) return true;
  return ALWAYS_ALLOWED.has(path);
}

export function isStudioNewPathAllowed(brand: BrandSlug, path: string) {
  if (!path || path.startsWith("/") || path.includes("..") || !/\.(?:ts|tsx|css|json)$/.test(path)) return false;
  if (COMPONENT_DIRS[brand].some((prefix) => path.startsWith(prefix))) return true;
  return /^src\/app\/sites\/\[brand\]\/[a-z0-9-]+\/page\.tsx$/.test(path);
}

export function visibleStudioFiles(brand: BrandSlug, files: string[]) {
  return files.filter((path) => isStudioPathAllowed(brand, path));
}

export function readableStudioFiles(brand: BrandSlug, files: string[]) {
  const sharedReferences = new Set(["src/components/Header.tsx", "src/components/Footer.tsx", "src/components/Sections.tsx", "src/components/RichText.tsx", "src/app/sites/[brand]/_shared.ts"]);
  return files.filter((path) => isStudioPathAllowed(brand, path) || sharedReferences.has(path) || (path.startsWith("src/app/sites/[brand]/") && path.endsWith("/page.tsx")));
}

export function validateStudioReplacement(path: string, find: string, replace: string) {
  if (!find) throw new Error(`Studio refused an empty search string for ${path}.`);
  if (find === replace) throw new Error(`Studio proposed a no-op change in ${path}.`);
  if (replace.length > 120_000) throw new Error(`Studio proposed an unusually large edit in ${path}.`);
}

export const STUDIO_GUARDRAILS = `
You may edit only the files exposed by the tools. Never request or alter authentication, authorization, API routes,
database code or migrations, environment variables, package manifests, middleware, deployment configuration, analytics,
or secrets. Preserve the site's architecture and existing behavior unless the user explicitly asks to change that behavior.
Do not create or generate images. Reuse only image paths already present in the selected site's source.
CSS added to src/app/globals.css must be scoped to the selected brand so it cannot change another site.
Prefer small exact replacements over rewrites. Keep responsive behavior, accessibility, SEO metadata, and reduced-motion support.
When creating a page under src/app/sites/[brand], it must reject every brand except the selected brand with notFound(),
and it must include appropriate metadata. New files are for genuinely new pages or selected-brand components only.
Do not invent URLs, business facts, prices, phone numbers, or claims. If required information is missing, explain that in the summary
and omit that part of the change. The final submit_changes call must contain only exact replacements that can be applied once.
`;
