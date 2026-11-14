// Big Water Marine's editable content. content/bigwatermarine.json is edited in
// /admin → Site content and published as a Git commit, which redeploys the site.
//
// The CMS edits strings only, so prices are stored as plain numbers in text
// ("165", not "$165"). FAQ answers and notes can include {placeholders} such as
// {club.initiation} or {labor.onsite}; fill() swaps in the current value, so a
// price changed in one place updates every answer that quotes it.

import raw from "@content/bigwatermarine.json";

export type Faq = { q: string; a: string };

type Cms = typeof raw;
export const cms: Cms = raw;

/** Text → number, for prices and rates stored as strings. */
export const n = (value: string | undefined, fallback = 0) => {
  const v = Number(String(value ?? "").replace(/[$,\s]/g, ""));
  return Number.isFinite(v) && String(value ?? "").trim() !== "" ? v : fallback;
};

function placeholderValues(): Record<string, string> {
  const club = cms.club;
  const values: Record<string, string> = {
    "labor.onsite": cms.service.labor.onsite,
    "labor.mobile": cms.service.labor.mobile,
    "mobileTravel.minimum": cms.service.mobileTravel.minimum,
    "mobileTravel.perMile": cms.service.mobileTravel.perMile,
    inspectionPoints: cms.service.inspectionPoints.join("; "),
    "club.holidayHalfDay": String(n(club.holidayFullDay) / 2),
    "club.winterHalfDayHalf": String(n(club.winterHalfDay) / 2),
  };
  for (const [k, v] of Object.entries(club)) values[`club.${k}`] = v;
  return values;
}

/** Replace {placeholders} with current values. Unknown placeholders are left as written. */
export function fill(text: string, extra?: Record<string, string | number>): string {
  const values: Record<string, string | number> = { ...placeholderValues(), ...extra };
  return text.replace(/\{([\w.]+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** FAQs for a page, with placeholders filled. */
export function faqs(page: keyof Cms["faqs"]): Faq[] {
  const list = cms.faqs[page] as unknown as Faq[];
  return list.map((f) => ({ q: fill(f.q), a: fill(f.a) }));
}
