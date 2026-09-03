import Image from "next/image";
import Link from "next/link";
import type { AlertItem, BrandConfig } from "@/config/types";
import { PAGE_LABELS, PAGE_LABEL_OVERRIDES, PAGE_PATHS } from "@/config/brands";
import { hubUrl } from "@/config/hub-links";

export function AlertBar({ alert }: { alert: AlertItem | null }) {
  if (!alert) return null;
  return (
    <div className="bg-accent text-white text-sm">
      <div className="container flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center">
        <span className="font-semibold">{alert.text}</span>
        {alert.cta_url && alert.cta_label && (
          <a href={alert.cta_url} className="underline underline-offset-2 font-bold">
            {alert.cta_label} →
          </a>
        )}
      </div>
    </div>
  );
}

export function Header({ brand }: { brand: BrandConfig }) {
  const dark = brand.theme.header === "dark";
  const nav = brand.pages.filter((p) => p !== "home");
  const labels = { ...PAGE_LABELS, ...(PAGE_LABEL_OVERRIDES[brand.slug] ?? {}) };
  return (
    <header className={`${dark ? "bg-primary text-white" : "bg-surface text-ink"} sticky top-0 z-40 shadow-sm`}>
      <div className="container flex items-center justify-between gap-6 py-3">
        <Link href="/" className="flex items-center shrink-0" aria-label={`${brand.nap.displayName} home`}>
          <span className={`inline-flex rounded-md px-2 py-1 ${dark ? "bg-white/95" : ""}`}>
            <Image
              src={brand.logo.src}
              alt={brand.nap.displayName}
              width={brand.logo.width}
              height={brand.logo.height}
              priority
              className="h-10 md:h-12 w-auto"
            />
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
          {nav.map((p) => (
            <Link key={p} href={PAGE_PATHS[p]} className="opacity-90 hover:opacity-100 hover:underline underline-offset-4">
              {labels[p]}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={`tel:${brand.nap.phoneE164}`} className="hidden md:inline text-sm font-semibold opacity-90">
            {brand.nap.phone}
          </a>
          <a href={hubUrl(brand.primaryIntent, brand, { campaign: "header" })} className="btn btn-primary !py-2 !px-4 text-sm">
            {brand.primaryLabel}
          </a>
        </div>
      </div>
      {/* mobile nav */}
      <nav className={`lg:hidden ${dark ? "bg-primary-dark" : "bg-bg"} border-t border-black/5`}>
        <div className="container flex gap-4 overflow-x-auto py-2 text-xs font-bold uppercase tracking-wide">
          {nav.map((p) => (
            <Link key={p} href={PAGE_PATHS[p]} className="whitespace-nowrap opacity-90">
              {labels[p]}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
