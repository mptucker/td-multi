import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = path.resolve(import.meta.dirname, "..");
const envPath = process.argv[2];
const includeValues = process.argv.includes("--values");
const includeFullValues = process.argv.includes("--full-values");
const onlyBrand = process.argv.find((argument) => argument.startsWith("--brand="))?.slice("--brand=".length);
const auditCollections = process.argv.includes("--collections");

if (envPath && fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator);
    let value = line.slice(separator + 1);
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!value.includes("[SENSITIVE]")) process.env[key] ??= value;
  }
}

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("A readable Supabase URL and anon/publishable key are required.");

const slugs = [
  "lighthouse",
  "paradise",
  "sundance",
  "island-view",
  "fastrac",
  "tackle-box",
  "boaterwise",
  "water-taxi",
  "bigwater",
  "towboatus-ntx",
  "texomaco",
];

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (isObject(value)) return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  return value;
}
const same = (left, right) => JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));

function compare(gitValue, cmsValue, prefix = "") {
  if (same(gitValue, cmsValue)) return [];
  if (!isObject(gitValue) || !isObject(cmsValue)) {
    return [{ path: prefix || "(root)", kind: gitValue === undefined ? "cms-only" : cmsValue === undefined ? "git-only" : "changed" }];
  }
  const keys = new Set([...Object.keys(gitValue), ...Object.keys(cmsValue)]);
  return [...keys].sort().flatMap((key) => compare(gitValue[key], cmsValue[key], prefix ? `${prefix}.${key}` : key));
}

function merge(base, patch) {
  if (!isObject(base) || !isObject(patch)) return patch;
  const result = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (key === "__cmsPatch") continue;
    result[key] = isObject(result[key]) && isObject(value) ? merge(result[key], value) : value;
  }
  return result;
}

function valueAt(source, dottedPath) {
  if (dottedPath === "(root)") return source;
  return dottedPath.split(".").reduce((value, key) => value?.[key], source);
}

function summarize(value) {
  if (includeFullValues) return value;
  if (value === undefined) return "<missing>";
  if (Array.isArray(value)) return `[array: ${value.length} item${value.length === 1 ? "" : "s"}] ${JSON.stringify(value).slice(0, 240)}`;
  if (isObject(value)) return `{object: ${Object.keys(value).length} key${Object.keys(value).length === 1 ? "" : "s"}} ${JSON.stringify(value).slice(0, 240)}`;
  return JSON.stringify(value).slice(0, 240);
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

if (auditCollections) {
  const definitions = [
    ["events", "slug"],
    ["packages", "slug"],
    ["alerts", "text"],
    ["facts", "key"],
  ];
  const collectionReport = [];
  for (const [table, identity] of definitions) {
    const gitRows = JSON.parse(fs.readFileSync(path.join(root, "content", `${table}.json`), "utf8"));
    const { data: cmsRows, error: collectionError } = await supabase.from(table).select("*");
    if (collectionError) throw collectionError;
    const gitById = new Map(gitRows.map((row) => [row[identity], row]));
    const cmsById = new Map((cmsRows || []).map((row) => [row[identity], row]));
    const changed = [];
    for (const [id, gitRow] of gitById) {
      const cmsRow = cmsById.get(id);
      if (!cmsRow) continue;
      const comparableKeys = Object.keys(gitRow).filter((key) => key !== "id");
      const comparableGit = Object.fromEntries(comparableKeys.map((key) => [key, gitRow[key]]));
      const comparableCms = Object.fromEntries(comparableKeys.map((key) => [key, cmsRow[key]]));
      if (!same(comparableGit, comparableCms)) {
        const rowDifferences = compare(comparableGit, comparableCms);
        changed.push(includeValues ? {
          id,
          differences: rowDifferences.map((difference) => ({
            ...difference,
            git: summarize(valueAt(comparableGit, difference.path)),
            cms: summarize(valueAt(comparableCms, difference.path)),
          })),
        } : id);
      }
    }
    collectionReport.push({
      table,
      gitRows: gitRows.length,
      cmsRows: (cmsRows || []).length,
      gitOnly: [...gitById.keys()].filter((id) => !cmsById.has(id)),
      cmsOnly: [...cmsById.keys()].filter((id) => !gitById.has(id)),
      changed,
    });
  }
  const { data: faqRows, error: faqError } = await supabase.from("faqs").select("brand,question,answer,published");
  if (faqError) throw faqError;
  const gitFaqs = slugs.flatMap((slug) => {
    const content = JSON.parse(fs.readFileSync(path.join(root, "content", `${slug}.json`), "utf8"));
    return (content.plan?.faqs || []).map((faq) => ({ brand: slug, question: faq.q, answer: faq.a }));
  });
  const cmsFaqs = (faqRows || []).filter((row) => row.published).map(({ brand, question, answer }) => ({ brand, question, answer }));
  const faqKey = (row) => `${row.brand}::${row.question}`;
  const gitFaqMap = new Map(gitFaqs.map((row) => [faqKey(row), row]));
  const cmsFaqMap = new Map(cmsFaqs.map((row) => [faqKey(row), row]));
  collectionReport.push({
    table: "faqs",
    gitRows: gitFaqs.length,
    cmsRows: cmsFaqs.length,
    gitOnly: [...gitFaqMap.keys()].filter((id) => !cmsFaqMap.has(id)),
    cmsOnly: [...cmsFaqMap.keys()].filter((id) => !gitFaqMap.has(id)),
    changed: [...gitFaqMap.keys()].filter((id) => cmsFaqMap.has(id) && !same(gitFaqMap.get(id), cmsFaqMap.get(id))),
  });
  const { data: globalRows, error: globalError } = await supabase.from("global_settings").select("key");
  if (globalError) throw globalError;
  console.log(JSON.stringify({ collections: collectionReport, globalSettingKeys: (globalRows || []).map((row) => row.key).sort() }, null, 2));
  process.exit(0);
}

let { data: rows, error } = await supabase
  .from("brand_content")
  .select("brand,content,draft_content,published_at,updated_at")
  .in("brand", slugs)
  .order("brand");
let draftAuditAvailable = true;
if (error && /draft_content|permission/i.test(error.message)) {
  draftAuditAvailable = false;
  ({ data: rows, error } = await supabase
    .from("brand_content")
    .select("brand,content,published_at,updated_at")
    .in("brand", slugs)
    .order("brand"));
}
if (error) throw error;

const byBrand = new Map((rows || []).map((row) => [row.brand, row]));
const report = [];
for (const slug of slugs.filter((slug) => !onlyBrand || slug === onlyBrand)) {
  const gitPath = path.join(root, "content", `${slug}.json`);
  const gitContent = JSON.parse(fs.readFileSync(gitPath, "utf8"));
  const row = byBrand.get(slug);
  const patchFormat = row?.content?.__cmsPatch === 1;
  const effectiveContent = patchFormat ? merge(gitContent, row.content) : row?.content;
  const effectiveDraft = row?.draft_content
    ? (row.draft_content.__cmsPatch === 1 ? merge(gitContent, row.draft_content) : row.draft_content)
    : effectiveContent;
  const differences = row ? compare(gitContent, effectiveContent) : [];
  const draftDifferences = row?.draft_content ? compare(gitContent, effectiveDraft) : [];
  const unpublishedDifferences = row?.draft_content ? compare(effectiveContent, effectiveDraft) : [];
  report.push({
    brand: slug,
    cmsRecord: Boolean(row),
    draftAuditAvailable,
    storageFormat: row ? (patchFormat ? "versioned-patch" : "legacy-full-document") : "none",
    publishedAt: row?.published_at || null,
    updatedAt: row?.updated_at || null,
    counts: {
      changed: differences.filter((item) => item.kind === "changed").length,
      cmsOnly: differences.filter((item) => item.kind === "cms-only").length,
      gitOnly: differences.filter((item) => item.kind === "git-only").length,
    },
    draftCounts: {
      changed: draftDifferences.filter((item) => item.kind === "changed").length,
      cmsOnly: draftDifferences.filter((item) => item.kind === "cms-only").length,
      gitOnly: draftDifferences.filter((item) => item.kind === "git-only").length,
    },
    unpublishedCounts: {
      changed: unpublishedDifferences.filter((item) => item.kind === "changed").length,
      cmsOnly: unpublishedDifferences.filter((item) => item.kind === "cms-only").length,
      gitOnly: unpublishedDifferences.filter((item) => item.kind === "git-only").length,
    },
    differences: includeValues ? differences.map((difference) => ({
      ...difference,
      git: summarize(valueAt(gitContent, difference.path)),
      cms: summarize(valueAt(effectiveContent, difference.path)),
    })) : differences,
    draftDifferences: includeValues ? draftDifferences.map((difference) => ({
      ...difference,
      git: summarize(valueAt(gitContent, difference.path)),
      cms: summarize(valueAt(effectiveDraft, difference.path)),
    })) : draftDifferences,
    unpublishedDifferences: includeValues ? unpublishedDifferences.map((difference) => ({
      ...difference,
      published: summarize(valueAt(effectiveContent, difference.path)),
      draft: summarize(valueAt(effectiveDraft, difference.path)),
    })) : unpublishedDifferences,
  });
}

console.log(JSON.stringify(report, null, 2));
