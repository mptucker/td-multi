import Image from "next/image";
import { BRANDS } from "@/config/brands";
import type { BrandSlug } from "@/config/types";

const LAST_UPDATED: Record<BrandSlug, { iso: string; label: string }> = {
  sundance: { iso: "2026-09-06", label: "Sep 6, 2026" },
  "tackle-box": { iso: "2026-09-05", label: "Sep 5, 2026" },
  boaterwise: { iso: "2026-09-05", label: "Sep 5, 2026" },
  "island-view": { iso: "2026-09-04", label: "Sep 4, 2026" },
  lighthouse: { iso: "2026-09-03", label: "Sep 3, 2026" },
  paradise: { iso: "2026-09-03", label: "Sep 3, 2026" },
  fastrac: { iso: "2026-09-03", label: "Sep 3, 2026" },
  "water-taxi": { iso: "2026-09-07", label: "Sep 7, 2026" },
};

/** Shown when the host isn't a known brand domain (e.g. the bare Vercel preview URL). */
export default function Directory() {
  return (
    <main className="container py-16">
      <h1 className="text-3xl font-bold">Texoma Destinations — brand gateway sites</h1>
      <p className="mt-2 text-muted">Pick a brand to preview. On production each brand is served from its own domain.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.values(BRANDS).toSorted((a, b) => LAST_UPDATED[b.slug].iso.localeCompare(LAST_UPDATED[a.slug].iso)).map((b) => (
          <li key={b.slug} className="card p-5">
            <a href={`/?brand=${b.slug}`} className="flex h-full flex-col">
              <span className="inline-flex rounded bg-white px-2 py-1"><Image src={b.logo.src} alt={b.nap.displayName} width={b.logo.width} height={b.logo.height} className="h-10 w-auto" /></span>
              <p className="mt-3 font-bold">{b.nap.displayName}</p>
              <p className="text-sm text-muted">{b.canonicalDomain} · {b.pages.length} pages</p>
              <p className="mt-4 border-t border-black/10 pt-3 text-xs font-semibold uppercase tracking-wide text-muted">
                Updated <time dateTime={LAST_UPDATED[b.slug].iso}>{LAST_UPDATED[b.slug].label}</time>
              </p>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm text-muted">Admin: <a className="underline" href="/admin">/admin</a></p>
    </main>
  );
}
