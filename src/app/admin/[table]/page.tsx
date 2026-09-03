import { notFound, redirect } from "next/navigation";
import { isAdmin } from "../_auth";
import { deleteRow, saveRow, type Table } from "../actions";
import { supabaseService } from "@/lib/supabase";
import { BRAND_SLUGS, BRANDS } from "@/config/brands";
import eventsJson from "@content/events.json";
import packagesJson from "@content/packages.json";
import alertsJson from "@content/alerts.json";
import factsJson from "@content/facts.json";

const TABLES: Table[] = ["events", "packages", "alerts", "facts"];
const FALLBACK: Record<Table, unknown[]> = { events: eventsJson, packages: packagesJson, alerts: alertsJson, facts: factsJson };

type Row = Record<string, unknown>;

const FIELDS: Record<Table, { name: string; label: string; type?: string; wide?: boolean }[]> = {
  events: [
    { name: "title", label: "Title" }, { name: "slug", label: "Slug" }, { name: "starts_at", label: "Starts (ISO)", type: "datetime-local" }, { name: "ends_at", label: "Ends (ISO)", type: "datetime-local" },
    { name: "location", label: "Location" }, { name: "price_text", label: "Price text" }, { name: "summary", label: "Summary", wide: true }, { name: "image", label: "Image URL", wide: true },
    { name: "cta_label", label: "CTA label" }, { name: "cta_url", label: "CTA URL (exact hub/fastrac link)", wide: true },
  ],
  packages: [
    { name: "title", label: "Title" }, { name: "slug", label: "Slug" }, { name: "price_text", label: "Price text" }, { name: "sort_order", label: "Sort order", type: "number" },
    { name: "summary", label: "Summary", wide: true }, { name: "details", label: "Details (one per line)", wide: true }, { name: "image", label: "Image URL", wide: true },
    { name: "cta_label", label: "CTA label" }, { name: "cta_intent", label: "CTA intent (e.g. tap, picnics, cabins)" }, { name: "cta_url", label: "CTA URL override", wide: true },
    { name: "valid_from", label: "Valid from", type: "date" }, { name: "valid_to", label: "Valid to", type: "date" },
  ],
  alerts: [
    { name: "text", label: "Text", wide: true }, { name: "cta_label", label: "CTA label" }, { name: "cta_url", label: "CTA URL", wide: true },
    { name: "starts_at", label: "Starts", type: "datetime-local" }, { name: "ends_at", label: "Ends", type: "datetime-local" },
  ],
  facts: [
    { name: "key", label: "Key (brand.thing)" }, { name: "brand", label: "Brand slug or hub" }, { name: "label", label: "Label" }, { name: "value", label: "Value" },
    { name: "owner", label: "Owner" }, { name: "last_verified", label: "Last verified", type: "date" }, { name: "source_url", label: "Source URL", wide: true }, { name: "notes", label: "Notes", wide: true },
  ],
};

export default async function TablePage({ params, searchParams }: { params: Promise<{ table: string }>; searchParams: Promise<{ edit?: string; new?: string }> }) {
  if (!(await isAdmin())) redirect("/admin");
  const { table } = await params;
  if (!TABLES.includes(table as Table)) notFound();
  const t = table as Table;
  const { edit, new: isNew } = await searchParams;

  const sb = supabaseService();
  let rows: Row[] = FALLBACK[t] as Row[];
  let live = false;
  if (sb) {
    const { data } = await sb.from(t).select("*").order(t === "facts" ? "key" : t === "packages" ? "sort_order" : "created_at", { ascending: t !== "events" });
    if (data) { rows = data as Row[]; live = true; }
  }
  const idKey = t === "facts" ? "key" : "id";
  const editing = isNew ? {} : edit ? rows.find((r) => String(r[idKey]) === edit) : undefined;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">{t}</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className={`rounded px-2 py-1 ${live ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{live ? "Supabase (live)" : "Read-only — content/*.json"}</span>
          {live && <a href={`/admin/${t}?new=1`} className="rounded bg-slate-900 px-3 py-1 font-semibold text-white">+ New</a>}
        </div>
      </div>

      {editing !== undefined && live && (
        <form action={saveRow.bind(null, t)} className="mt-6 grid gap-4 rounded-lg border bg-white p-6 md:grid-cols-2">
          {t !== "facts" && <input type="hidden" name="id" defaultValue={String(editing.id ?? "")} />}
          {FIELDS[t].map((f) => (
            <label key={f.name} className={`text-sm ${f.wide ? "md:col-span-2" : ""}`}>
              <span className="block font-semibold">{f.label}</span>
              {f.wide && (f.name === "summary" || f.name === "details" || f.name === "notes" || f.name === "text") ? (
                <textarea name={f.name} rows={3} className="mt-1 w-full rounded border px-3 py-2" defaultValue={Array.isArray(editing[f.name]) ? (editing[f.name] as string[]).join("\n") : String(editing[f.name] ?? "")} />
              ) : (
                <input name={f.name} type={f.type ?? "text"} className="mt-1 w-full rounded border px-3 py-2" defaultValue={fmt(editing[f.name], f.type)} />
              )}
            </label>
          ))}
          {t !== "facts" && (
            <fieldset className="md:col-span-2">
              <legend className="text-sm font-semibold">Show on sites</legend>
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                {BRAND_SLUGS.map((s) => (
                  <label key={s} className="flex items-center gap-1 rounded border px-2 py-1">
                    <input type="checkbox" name={`site_${s}`} defaultChecked={((editing.show_on_sites as string[]) ?? []).includes(s)} /> {BRANDS[s].nap.shortName}
                  </label>
                ))}
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={Boolean(editing.published)} /> Published</label>
            </fieldset>
          )}
          <div className="md:col-span-2 flex gap-3">
            <button className="rounded bg-slate-900 px-4 py-2 font-semibold text-white">Save</button>
            <a href={`/admin/${t}`} className="rounded border px-4 py-2">Cancel</a>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">{t === "facts" ? "Key" : "Title"}</th>
              <th className="p-3">{t === "facts" ? "Value" : t === "alerts" ? "Window" : "When / price"}</th>
              <th className="p-3">{t === "facts" ? "Verified" : "Sites"}</th>
              <th className="p-3">{t === "facts" ? "Owner" : "Published"}</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r[idKey])} className="border-t">
                <td className="p-3 font-semibold">{String(r.title ?? r.text ?? r.key ?? "")}</td>
                <td className="p-3">{t === "facts" ? String(r.value ?? "") : t === "alerts" ? `${r.starts_at ?? "—"} → ${r.ends_at ?? "—"}` : `${r.starts_at ?? ""} ${r.price_text ?? ""}`}</td>
                <td className="p-3">{t === "facts" ? String(r.last_verified ?? "—") : ((r.show_on_sites as string[]) ?? []).join(", ")}</td>
                <td className="p-3">{t === "facts" ? String(r.owner ?? "—") : r.published ? "✓" : "—"}</td>
                <td className="p-3 whitespace-nowrap">
                  {live && (
                    <>
                      <a href={`/admin/${t}?edit=${encodeURIComponent(String(r[idKey]))}`} className="underline">Edit</a>
                      <form action={deleteRow.bind(null, t, String(r[idKey]))} className="inline ml-3"><button className="text-red-700 underline">Delete</button></form>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function fmt(v: unknown, type?: string): string {
  if (v === null || v === undefined) return "";
  if (type === "datetime-local" && typeof v === "string") return v.slice(0, 16);
  if (type === "date" && typeof v === "string") return v.slice(0, 10);
  return String(v);
}
