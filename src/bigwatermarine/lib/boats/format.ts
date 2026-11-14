import type { Boat } from "./types";
import { BUILDERS } from "./types";
import { config } from "@/bigwatermarine/lib/config";

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const boatPath = (b: Pick<Boat, "slug" | "id">) => `/inventory/boat/${b.slug}/${b.id}/`;

/** One of our four builders, or "Other". */
export function brandOf(make: string): string {
  const m = BUILDERS.find((x) => x.toLowerCase() === make.trim().toLowerCase());
  return m ?? "Other";
}

/** Brand landing page path (these exist on the current site). */
export function brandPath(make: string) {
  const b = brandOf(make);
  return b === "Other" ? "/inventory/" : `/${b.toLowerCase()}/`;
}

/** Standard amortized monthly payment. */
export function monthlyPayment(price: number, downPercent = config.loan.downPercent, apr = config.loan.apr, years = config.loan.termYears) {
  const principal = price * (1 - downPercent / 100);
  const n = years * 12;
  const r = apr / 100 / 12;
  if (principal <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

export const conditionLabel = (b: Boat) => (b.condition === "New" ? "New" : "Pre-owned");

export function statusLabel(b: Boat): string | null {
  switch (b.status) {
    case "on-order": return "On order";
    case "sale-pending": return "Sale pending";
    case "sold": return "Sold";
    default: return null;
  }
}

/** Plain-language one-liner used for meta descriptions and AI answers. */
export function boatSummary(b: Boat) {
  const parts = [
    `${conditionLabel(b)}${b.lengthLabel ? ` ${b.lengthLabel.replace(/'$/, "-foot")}` : ""} ${b.year ?? ""} ${b.make} ${b.model}`.replace(/\s+/g, " ").trim(),
    b.engineMake && b.totalHp ? `with a ${b.engineMake} ${b.totalHp} HP` : "",
    `for sale in ${b.location} on Lake Texoma`,
  ].filter(Boolean);
  const price = b.price ? `${money(b.price)}.` : "Call for pricing.";
  return `${parts.join(" ")}. ${price}`;
}
