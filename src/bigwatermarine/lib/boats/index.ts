import "server-only";
import { cache } from "react";
import type { Boat } from "./types";
import snapshot from "./snapshot.json";
import { fetchAllFromApi, hasApiKey } from "./api";
import { brandOf } from "./format";
import { config } from "@/bigwatermarine/lib/config";

export * from "./types";
export * from "./format";

const SNAPSHOT = snapshot as Boat[];

// Slugs the current WordPress site already uses. Keeping them means every
// existing boat URL (and its search ranking) carries over unchanged.
const LEGACY_SLUGS = new Map(SNAPSHOT.map((b) => [b.id, b.slug]));

/**
 * Everything the site knows about, including sold boats. Live from the
 * Boats Group API when BOATS_API_KEY is set; otherwise the bundled snapshot.
 * If the API is down, the site keeps working from the snapshot.
 */
const allBoats = cache(async (): Promise<{ boats: Boat[]; source: "live" | "snapshot" }> => {
  if (hasApiKey()) {
    try {
      const live = await fetchAllFromApi();
      if (live.length) {
        return {
          source: "live",
          boats: live.map((b) => ({ ...b, slug: LEGACY_SLUGS.get(b.id) ?? b.slug })),
        };
      }
    } catch (err) {
      console.error("[inventory] falling back to snapshot:", err);
    }
  }
  return { source: "snapshot", boats: SNAPSHOT };
});

/** Boats shown for sale: active, on order, and sale pending. */
export async function getInventory(): Promise<Boat[]> {
  const { boats } = await allBoats();
  return boats.filter((b) => b.status !== "sold");
}

export async function getInventorySource() {
  return (await allBoats()).source;
}

/** Any boat by listing ID, sold ones included. */
export async function getBoat(id: string): Promise<Boat | null> {
  const { boats } = await allBoats();
  return boats.find((b) => b.id === id) ?? null;
}

/** Sold boats keep their page (with a Sold banner) for a while, then redirect. */
export function soldPageExpired(b: Boat) {
  if (b.status !== "sold") return false;
  if (!b.soldDate) return false;
  const sold = Date.parse(b.soldDate);
  if (Number.isNaN(sold)) return false;
  return Date.now() - sold > config.soldPageDays * 86_400_000;
}

/** Up to `n` boats like this one: same builder or class first, nearest price. */
export function similarBoats(boat: Boat, all: Boat[], n = 4): Boat[] {
  const brand = brandOf(boat.make);
  const score = (b: Boat) =>
    (brandOf(b.make) === brand && brand !== "Other" ? 0 : 2) +
    (b.boatClass && b.boatClass === boat.boatClass ? 0 : 1) +
    (b.condition === boat.condition ? 0 : 0.5) +
    Math.min(Math.abs((b.price ?? 0) - (boat.price ?? 0)) / 100_000, 1);
  return all
    .filter((b) => b.id !== boat.id && b.status !== "sold")
    .sort((a, b) => score(a) - score(b))
    .slice(0, n);
}
