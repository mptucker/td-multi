import "server-only";
import type { Boat, BoatStatus, SpecSection } from "./types";
import { slugify } from "./format";

// Boats Group Inventory API (https://api.boats.com/docs).
// The key is read from the BOATS_API_KEY environment variable (set in Vercel,
// marked Sensitive). It is only ever used on the server.

const BASE = "https://api.boats.com/inventory/search";
export const REVALIDATE_SECONDS = 300;

// The API's sales-status values and how the site treats each one.
const STATUSES: { query: string; status: BoatStatus }[] = [
  { query: "active", status: "active" },
  { query: "on-order", status: "on-order" },
  { query: "sale pending", status: "sale-pending" },
  { query: "inactive", status: "sold" },
];

export const hasApiKey = () => Boolean(process.env.BOATS_API_KEY?.trim());

type Raw = Record<string, unknown>;

async function search(salesstatus: string): Promise<Raw[]> {
  const url = new URL(BASE);
  url.searchParams.set("key", process.env.BOATS_API_KEY!.trim());
  url.searchParams.set("salesstatus", salesstatus);
  url.searchParams.set("rows", "500");
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDS, tags: ["inventory"] },
  });
  if (!res.ok) throw new Error(`Boats API ${salesstatus}: HTTP ${res.status}`);
  const data = (await res.json()) as Raw;
  const list = (data.results ?? data.Results ?? data.inventory ?? data.items ?? []) as Raw[];
  return Array.isArray(list) ? list : [];
}

/** Health check: raw counts per status and the shape of one record (no key exposed). */
export async function apiDiagnostics() {
  if (!hasApiKey()) return { keyConfigured: false };
  const out: Record<string, unknown> = { keyConfigured: true, statuses: {} as Record<string, unknown> };
  for (const s of STATUSES) {
    try {
      const rows = await search(s.query);
      (out.statuses as Record<string, unknown>)[s.query] = rows.length;
      if (!out.sampleRaw && rows[0]) {
        const r = rows[0];
        out.rawFieldNames = Object.keys(r).sort();
        out.sampleRaw = Object.fromEntries(
          Object.entries(r).map(([k, v]) => [k, typeof v === "string" && v.length > 160 ? v.slice(0, 160) + "…" : Array.isArray(v) ? v.slice(0, 2) : v]),
        );
        out.sampleNormalized = normalize(r, s.status);
      }
    } catch (e) {
      (out.statuses as Record<string, unknown>)[s.query] = `error: ${(e as Error).message}`;
    }
  }
  return out;
}

/** All listings from the API, normalized. Throws if the API can't be reached. */
export async function fetchAllFromApi(): Promise<Boat[]> {
  const batches = await Promise.all(
    STATUSES.map(async (s) => (await search(s.query)).map((r) => normalize(r, s.status))),
  );
  const seen = new Set<string>();
  return batches.flat().filter((b) => b.id && !seen.has(b.id) && seen.add(b.id));
}

// ── Normalization helpers (tolerant of strings, arrays and objects) ──

function str(v: unknown): string {
  if (v == null) return "";
  if (Array.isArray(v)) return v.map(str).filter(Boolean).join(", ");
  if (typeof v === "object") {
    const o = v as Raw;
    return str(o.value ?? o.Value ?? o.name ?? o.Name ?? "");
  }
  return String(v).trim();
}

function numIn(v: unknown): number | null {
  const m = str(v).replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
}

/** "25 ft" / "7.62 m" / 25 → feet */
function feet(v: unknown): number | null {
  const s = str(v).toLowerCase();
  const n = numIn(s);
  if (n == null) return null;
  return s.includes(" m") && !s.includes("ft") ? +(n * 3.28084).toFixed(1) : n;
}

/** "21.6|gallon" → "21.6 gallons", "8.25 ft" → 8'3", "1,465 lb" stays. */
function measure(v: unknown): string {
  const raw = str(v).replace(/\|/g, " ").replace(/\s+/g, " ").trim();
  if (!raw) return "";
  const ft = raw.match(/^(\d+(?:\.\d+)?)\s*ft$/i);
  if (ft) return feetLabel(Number(ft[1]));
  return raw.replace(/\b(\d+(?:\.\d+)?) gallon\b/i, (_, n) => `${n} ${Number(n) === 1 ? "gallon" : "gallons"}`);
}

/** Letters and digits only, for comparing near-identical strings. */
const loose = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");

function feetLabel(ft: number | null) {
  if (ft == null) return "";
  const whole = Math.floor(ft);
  const inches = Math.round((ft - whole) * 12);
  return inches ? `${whole}'${inches}"` : `${whole}'`;
}

function htmlToParagraphs(v: unknown): string[] {
  const raw = Array.isArray(v) ? v.map(str).join("\n") : str(v);
  return raw
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function row(label: string, v: unknown): [string, string] | null {
  const s = str(v);
  return s ? [label, s] : null;
}

function normalize(r: Raw, status: BoatStatus): Boat {
  const id = str(r.DocumentID ?? r.id);
  const year = numIn(r.ModelYear);
  const make = str(r.MakeString ?? r.MakeStringExact);
  const model = str(r.Model ?? r.ModelExact);
  const engines = (Array.isArray(r.Engines) ? r.Engines : []) as Raw[];
  const e0 = engines[0] ?? {};
  const engineMake = str(e0.Make ?? r.EngineMakeString) || null;
  const totalHp =
    numIn(r.TotalEnginePowerQuantity) ??
    (engines.reduce((sum, e) => sum + (numIn(e.EnginePower) ?? 0), 0) || null);
  const lengthFt = feet(r.LengthOverall ?? r.NominalLength ?? r.NormNominalLength);

  const priceHidden = str(r.PriceHideInd).toLowerCase() === "true";
  const price = priceHidden ? null : numIn(r.NormPrice ?? r.Price);

  const condition = str(r.SaleClassCode).toLowerCase().startsWith("new") ? "New" : "Used";
  const images = ((Array.isArray(r.Images) ? r.Images : []) as Raw[])
    .slice()
    .sort((a, b) => (numIn(a.Priority) ?? 99) - (numIn(b.Priority) ?? 99))
    .map((i) => str(i.Uri ?? i.uri ?? i.Url))
    .filter(Boolean);

  // The dealer's own listing name (e.g. "Highfield Sport 560 - Yamaha SHO 115")
  // is what WordPress used for titles and URL slugs. Fall back to year/make/model.
  const boatName = str(r.BoatName).replace(/\s+-\s+/g, " / ").trim();
  const engineTitle = engineMake && totalHp ? ` / ${engineMake} ${totalHp}` : "";
  const base = boatName || `${make} ${model}${engineTitle}`.trim();
  const title = year && !base.startsWith(String(year)) ? `${year} ${base}` : base;
  const slug = slugify(boatName || title);

  const specs: SpecSection[] = [
    {
      title: "Specifications",
      rows: [
        row("HIN Number", r.BoatHullID), row("Stock Number", str(r.StockNumber) || id), row("Make", make),
        row("Model", model), row("Year", year), row("Condition", condition),
        row("Category", r.BoatCategoryCode), row("Class", r.BoatClassCode),
        row("Hull Material", r.BoatHullMaterialCode), row("Max Passengers", r.MaximumNumberOfPassengersNumeric),
      ].filter(Boolean) as [string, string][],
    },
    {
      title: "Dimensions & Measurements",
      rows: [
        row("Length (Overall)", feetLabel(lengthFt)), row("Beam", measure(r.BeamMeasure)),
        row("Max Draft", measure(r.MaxDraft)), row("Dry Weight", measure(r.DryWeightMeasure)), row("Deadrise", measure(r.DeadriseMeasure).replace(" °", "°")),
      ].filter(Boolean) as [string, string][],
    },
    {
      title: "Tanks",
      rows: [
        row("Fuel Capacity", measure(r.FuelTankCapacityMeasure)), row("Fuel Tanks", r.FuelTankCountNumeric),
        row("Fresh Water", measure(r.WaterTankCapacityMeasure)), row("Holding Tank", measure(r.HoldingTankCapacityMeasure)),
      ].filter(Boolean) as [string, string][],
    },
    {
      title: "Engines & Propulsion",
      rows: engines.flatMap((e, i) => {
        const p = engines.length > 1 ? `Engine ${i + 1} ` : "";
        return [
          row(`${p}Make/Brand`, e.Make), row(`${p}Model`, e.Model), row(`${p}Year Built`, e.Year),
          row(`${p}Power`, numIn(e.EnginePower) ? `${numIn(e.EnginePower)} horsepower` : ""),
          row(`${p}Hours`, e.Hours), row(`${p}Fuel`, str(e.Fuel).replace(/^./, (c) => c.toUpperCase())),
        ].filter(Boolean) as [string, string][];
      }),
    },
  ].filter((s) => s.rows.length);

  return {
    id,
    slug,
    title,
    year,
    make,
    model,
    condition,
    status,
    badge: str(r.ListingTitle) || null,
    price: price && price > 0 ? price : null,
    lengthFt,
    lengthLabel: feetLabel(lengthFt),
    boatClass: str(r.BoatClassCode) || null,
    category: str(r.BoatCategoryCode) || null,
    hullMaterial: str(r.BoatHullMaterialCode) || null,
    hin: str(r.BoatHullID) || null,
    stockNumber: str(r.StockNumber) || id,
    engineMake,
    engineModel: str(e0.Model) || null,
    totalHp,
    location: [str((r.BoatLocation as Raw)?.BoatCityName), str((r.BoatLocation as Raw)?.BoatStateCode)].filter(Boolean).join(", ") || "Pottsboro, TX",
    description: [...htmlToParagraphs(r.GeneralBoatDescription), ...htmlToParagraphs(r.AdditionalDetailDescription)].filter(
      // Drop an opening line that only repeats the listing name (ignoring
      // the year, dashes, slashes and odd spacing from the feed's HTML).
      (p, i) => !(i === 0 && loose(p).replace(String(year ?? ""), "") === loose(base).replace(String(year ?? ""), "")),
    ),
    images,
    specs,
    soldDate: str(r.SoldDate) || (status === "sold" ? str(r.LastModificationDate) || null : null),
    updatedAt: str(r.LastModificationDate ?? r.IMTTimeStamp) || null,
  };
}
