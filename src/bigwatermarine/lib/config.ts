// ─────────────────────────────────────────────────────────────────────────
// Site settings: the one place to change links and numbers that move.
// Each value can also be overridden with an environment variable in Vercel
// (Settings → Environment Variables), so it can change without a code edit.
// When the brand-sites CMS is ready, these will be read from it instead.
// ─────────────────────────────────────────────────────────────────────────

const env = (name: string, fallback: string) => process.env[name]?.trim() || fallback;
const num = (name: string, fallback: number) => {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && process.env[name] ? v : fallback;
};

export const config = {
  siteUrl: env("NEXT_PUBLIC_BWM_SITE_URL", "https://bigwatermarine.com"),

  phone: "903-419-1019",
  phoneE164: "+19034191019",
  /** Texts go to the same number (Dockline handles the conversation). */
  textE164: env("NEXT_PUBLIC_BWM_TEXT_NUMBER", "+19034191019"),
  email: "service@bigwatermarine.com",

  /** Windlass customer work-order intake. Regenerate in Windlass, then paste here or set NEXT_PUBLIC_BWM_WINDLASS_INTAKE_URL. */
  windlassIntakeUrl: env(
    "NEXT_PUBLIC_BWM_WINDLASS_INTAKE_URL",
    "https://windlass.bigwatermarine.com/service-intake/1ec8eb50353ca3d3a8ab9b2f901831b88c08",
  ),

  /** Where "Join Big Water Boat Club" goes. */
  boatClubJoinUrl: env("NEXT_PUBLIC_BWM_BOAT_CLUB_JOIN_URL", "https://texomadestinations.com/tap"),

  /** Dockline chat/text widget (site id "bwm"). */
  docklineSrc: env("NEXT_PUBLIC_BWM_DOCKLINE_SRC", "https://dockline.texomadestinations.com/widget.js"),
  docklineSite: env("NEXT_PUBLIC_BWM_DOCKLINE_SITE", "bwm"),

  /** Payment calculator defaults (customers can change them on each boat page). */
  loan: {
    downPercent: num("NEXT_PUBLIC_LOAN_DOWN_PERCENT", 10),
    apr: num("NEXT_PUBLIC_LOAN_APR", 7.69),
    termYears: num("NEXT_PUBLIC_LOAN_TERM_YEARS", 20),
  },

  /** Third-party links used on boat pages. */
  financingUrl:
    "https://di0000000hq8reaw.my.site.com/creditApplication/s/creditapplication?varDealerNameAndId=BigWaterMarineTX-001Qp00000SMfkL&varIndirectOrCl=Indirect&varBoatOrRv=boat",
  tradeValueUrl: "https://services.bigwatermarine.com/price-checker",
  insuranceUrl: "https://services.bigwatermarine.com/insurance",

  /** Pages not built yet are served from WordPress at this origin (see next.config.ts). */
  legacyOrigin: env("BWM_LEGACY_WP_ORIGIN", "https://bigwatermarine.com"),

  /** How long (days) a sold boat's page stays up before redirecting to its brand. */
  soldPageDays: 90,
};

/** Tap-to-text link with a pre-written message. */
export function smsHref(body?: string) {
  const b = body ? `?&body=${encodeURIComponent(body)}` : "";
  return `sms:${config.textE164}${b}`;
}
export const telHref = `tel:${config.phoneE164}`;
