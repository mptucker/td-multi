// ─────────────────────────────────────────────────────────────────────────
// Site settings. Values come from content/bigwatermarine.json (site.*), which
// is edited in /admin → Site content. A few can also be overridden with an
// environment variable in Vercel, which wins when set.
// ─────────────────────────────────────────────────────────────────────────

import { cms, n } from "./cms";

const env = (name: string, fallback: string) => process.env[name]?.trim() || fallback;
const num = (name: string, fallback: number) => {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && process.env[name] ? v : fallback;
};

const site = cms.site;

export const config = {
  siteUrl: env("NEXT_PUBLIC_BWM_SITE_URL", "https://bigwatermarine.com"),

  phone: site.phone,
  phoneE164: site.phoneE164,
  /** Texts go to the same number (Dockline handles the conversation). */
  textE164: env("NEXT_PUBLIC_BWM_TEXT_NUMBER", site.phoneE164),
  email: site.email,
  salesEmail: site.salesEmail,
  promo: site.promo,
  hours: site.hours,

  /** Windlass customer work-order intake. Regenerate in Windlass, then paste here or set NEXT_PUBLIC_BWM_WINDLASS_INTAKE_URL. */
  windlassIntakeUrl: env(
    "NEXT_PUBLIC_BWM_WINDLASS_INTAKE_URL",
    site.windlassIntakeUrl,
  ),

  /** Where "Join Big Water Boat Club" goes. */
  boatClubJoinUrl: env("NEXT_PUBLIC_BWM_BOAT_CLUB_JOIN_URL", site.boatClubJoinUrl),

  /** Dockline chat/text widget (site id "bwm"). */
  docklineSrc: env("NEXT_PUBLIC_BWM_DOCKLINE_SRC", "https://dockline.texomadestinations.com/widget.js"),
  docklineSite: env("NEXT_PUBLIC_BWM_DOCKLINE_SITE", "bwm"),

  /** Payment calculator defaults (customers can change them on each boat page). */
  loan: {
    downPercent: num("NEXT_PUBLIC_LOAN_DOWN_PERCENT", n(site.loan.downPercent, 10)),
    apr: num("NEXT_PUBLIC_LOAN_APR", n(site.loan.apr, 7.69)),
    termYears: num("NEXT_PUBLIC_LOAN_TERM_YEARS", n(site.loan.termYears, 20)),
  },

  /** Third-party links used on boat pages. */
  financingUrl: site.financingUrl,
  tradeValueUrl: site.tradeValueUrl,
  insuranceUrl: site.insuranceUrl,

  /** Pages not built yet are served from WordPress at this origin (see next.config.ts). */
  legacyOrigin: env("BWM_LEGACY_WP_ORIGIN", "https://bigwatermarine.com"),

  /** How long (days) a sold boat's page stays up before redirecting to its brand. */
  soldPageDays: n(site.soldPageDays, 90),
};

/** Tap-to-text link with a pre-written message. */
export function smsHref(body?: string) {
  const b = body ? `?&body=${encodeURIComponent(body)}` : "";
  return `sms:${config.textE164}${b}`;
}
export const telHref = `tel:${config.phoneE164}`;
