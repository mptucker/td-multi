import Image from "next/image";
import { BRANDS } from "@/config/brands";

/** Shown when the host isn't a known brand domain (e.g. the bare Vercel preview URL). */
export default function Directory() {
  return (
    <main className="container py-16">
      <h1 className="text-3xl font-bold">Texoma Destinations — brand gateway sites</h1>
      <p className="mt-2 text-muted">Pick a brand to preview. On production each brand is served from its own domain.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.values(BRANDS).map((b) => (
          <li key={b.slug} className="card p-5">
            <a href={`/?brand=${b.slug}`} className="block">
              <span className="inline-flex rounded bg-white px-2 py-1"><Image src={b.logo.src} alt={b.nap.displayName} width={b.logo.width} height={b.logo.height} className="h-10 w-auto" /></span>
              <p className="mt-3 font-bold">{b.nap.displayName}</p>
              <p className="text-sm text-muted">{b.canonicalDomain} · {b.pages.length} pages</p>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm text-muted">Admin: <a className="underline" href="/admin">/admin</a></p>
    </main>
  );
}
