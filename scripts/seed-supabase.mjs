#!/usr/bin/env node
/**
 * Seed Supabase from /content/*.json.
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed
 * Idempotent: upserts on slug/key. Brand page copy is seeded into brand_content so the
 * admin (or a future rich editor) can override the JSON without a deploy.
 */
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });
const load = async (f) => JSON.parse(await readFile(new URL(`../content/${f}`, import.meta.url), "utf8"));

const brands = ["lighthouse", "paradise", "sundance", "island-view", "fastrac", "tackle-box", "boaterwise", "water-taxi"];
for (const b of brands) {
  const content = await load(`${b}.json`);
  const { error } = await sb.from("brand_content").upsert({ brand: b, content });
  console.log(error ? `✗ brand_content ${b}: ${error.message}` : `✓ brand_content ${b}`);
}

const strip = (rows) => rows.map(({ id, ...r }) => (id && !/^[0-9a-f-]{36}$/i.test(id) ? r : { id, ...r }));

for (const [table, file, conflict] of [
  ["events", "events.json", "slug"],
  ["packages", "packages.json", "slug"],
  ["alerts", "alerts.json", "text"],
  ["facts", "facts.json", "key"],
]) {
  const rows = strip(await load(file));
  const { error } = await sb.from(table).upsert(rows, { onConflict: conflict });
  console.log(error ? `✗ ${table}: ${error.message}` : `✓ ${table} (${rows.length})`);
}
