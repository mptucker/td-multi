import Image from "next/image";
import Link from "next/link";
import type { BrandConfig } from "@/config/types";
import { BRANDS, PAGE_LABELS, PAGE_LABEL_OVERRIDES, PAGE_PATHS } from "@/config/brands";
import { hubUrl } from "@/config/hub-links";

const FAMILY: { slug: keyof typeof BRANDS; label: string }[] = [
  { slug: "lighthouse", label: "Lighthouse Resort & Marina" },
  { slug: "paradise", label: "Paradise on Lake Texoma" },
  { slug: "sundance", label: "Sundance Camp" },
  { slug: "island-view", label: "Island View Park" },
  { slug: "fastrac", label: "Fastrac Cruises" },
  { slug: "water-taxi", label: "Texoma Water Taxi" },
  { slug: "tackle-box", label: "Tackle Box Outfitters" },
  { slug: "boaterwise", label: "BoaterWise" },
];

export function Footer({ brand, blurb }: { brand: BrandConfig; blurb: string }) {
  const n = brand.nap;
  const labels = { ...PAGE_LABELS, ...(PAGE_LABEL_OVERRIDES[brand.slug] ?? {}) };
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary-dark text-white mt-20">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="inline-flex rounded-md bg-white/95 px-2 py-1">
            <Image src={brand.logo.src} alt={n.displayName} width={brand.logo.width} height={brand.logo.height} className="h-10 w-auto" />
          </span>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">{blurb}</p>
          <address className="mt-5 not-italic text-sm leading-relaxed text-white/90">
            <strong>{n.displayName}</strong>
            <br />
            {n.streetAddress}
            <br />
            {n.city}, {n.region} {n.postalCode}
            <br />
            <a href={`tel:${n.phoneE164}`} className="underline underline-offset-2">{n.phone}</a>
            {n.altPhones?.map((p) => (
              <span key={p.phone}>
                <br />
                {p.label}: <a href={`tel:${p.phoneE164}`} className="underline underline-offset-2">{p.phone}</a>
              </span>
            ))}
            {n.smsLine && (
              <>
                <br />
                {n.smsLine.label}: <a href={`sms:${n.smsLine.phoneE164}`} className="underline underline-offset-2">{n.smsLine.phone}</a>
              </>
            )}
            {n.email && (
              <>
                <br />
                <a href={`mailto:${n.email}`} className="underline underline-offset-2">{n.email}</a>
              </>
            )}
          </address>
          {n.hours && (
            <ul className="mt-4 space-y-1 text-xs text-white/70">
              {n.hours.map((h) => <li key={h}>{h}</li>)}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {brand.pages.map((p) => (
              <li key={p}><Link href={PAGE_PATHS[p]} className="hover:underline">{labels[p]}</Link></li>
            ))}
            <li><a href={hubUrl("my-reservations", brand, { campaign: "footer" })} className="hover:underline">My reservations</a></li>
            <li><a href={hubUrl("tap", brand, { campaign: "footer" })} className="hover:underline">TAP membership</a></li>
            <li><a href={hubUrl("map", brand, { campaign: "footer" })} className="hover:underline">Map of all properties</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">The Texoma Destinations family</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {FAMILY.filter((f) => f.slug !== brand.slug).map((f) => (
              <li key={f.slug}>
                <a href={`https://${BRANDS[f.slug].canonicalDomain}/`} className="hover:underline">{f.label}</a>
              </li>
            ))}
            <li className="pt-2">
              <a href={hubUrl("reserve", brand, { campaign: "footer" })} className="inline-flex items-center gap-2 font-bold hover:underline">
                <Image src="/brands/texoma-destinations.png" alt="" width={400} height={129} className="h-6 w-auto rounded bg-white/95 px-1" />
                Book everything at texomadestinations.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/60">
          <span>© {year} {n.legalName}. All rights reserved.</span>
          <span className="flex gap-4">
            <a href={hubUrl("legal-privacy", brand)} className="hover:underline">Privacy</a>
            <a href={hubUrl("legal-terms", brand)} className="hover:underline">Terms</a>
            {n.facebook && <a href={n.facebook} className="hover:underline">Facebook</a>}
            {n.instagram && <a href={n.instagram} className="hover:underline">Instagram</a>}
          </span>
        </div>
      </div>
    </footer>
  );
}
