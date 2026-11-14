// Tiny event bus so other parts of the page (like the builders list) can
// drive the inventory finder without wrapping the page in a client component.
export type FinderFilter = { brand?: string; condition?: string };
export const FILTER_EVENT = "bwm:filter";
export function applyFinderFilter(f: FinderFilter) {
  window.dispatchEvent(new CustomEvent<FinderFilter>(FILTER_EVENT, { detail: f }));
  document.getElementById("boats")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
