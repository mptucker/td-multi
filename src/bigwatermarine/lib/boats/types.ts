export type BoatStatus = "active" | "on-order" | "sale-pending" | "sold";

export type SpecSection = { title: string; rows: [string, string][] };

export type Boat = {
  /** Boats Group listing ID (the number at the end of every boat URL). */
  id: string;
  /** URL slug: year-make-model-engine. Existing listings keep their WordPress slug. */
  slug: string;
  title: string;
  year: number | null;
  make: string;
  model: string;
  condition: "New" | "Used";
  status: BoatStatus;
  /** Short dealer tag, e.g. "New arrival". */
  badge: string | null;
  /** null = call for pricing */
  price: number | null;
  lengthFt: number | null;
  lengthLabel: string;
  boatClass?: string | null;
  category?: string | null;
  hullMaterial?: string | null;
  hin?: string | null;
  stockNumber?: string | null;
  engineMake?: string | null;
  engineModel?: string | null;
  totalHp?: number | null;
  location: string;
  description: string[];
  images: string[];
  specs: SpecSection[];
  soldDate?: string | null;
  updatedAt?: string | null;
};

export const BUILDERS = ["Scout", "Veranda", "Highfield", "Berkshire"] as const;
export type Builder = (typeof BUILDERS)[number];
