import type { BrandConfig, CTA } from "@/config/types";
import { hubUrl } from "@/config/hub-links";
import { PAGE_PATHS } from "@/config/brands";

interface Props {
  brand: BrandConfig;
  cta: CTA;
  campaign?: string;
  className?: string;
  onDark?: boolean;
}

/**
 * Renders any CTA. Intents resolve to hub deep links (external, UTM-stamped, new tab off —
 * we want the customer to feel it's one journey, so same tab). Internal hrefs stay relative.
 */
export function HubLink({ brand, cta, campaign, className, onDark }: Props) {
  const href = cta.intent ? hubUrl(cta.intent, brand, { campaign }) : cta.href ?? "#";
  const external = href.startsWith("http");
  const variant = cta.variant ?? "primary";
  const cls = `btn btn-${variant}${onDark && variant === "ghost" ? " on-dark" : ""} ${className ?? ""}`;
  return (
    <a
      href={href}
      className={cls}
      data-intent={cta.intent}
      data-brand={brand.slug}
      rel={external ? "noopener" : undefined}
    >
      {cta.label}
      {external && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </a>
  );
}

export function pagePath(brand: BrandConfig, key: string) {
  void brand;
  return PAGE_PATHS[key] ?? "/";
}
