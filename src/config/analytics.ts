import type { BrandSlug } from "./types";

/** Existing GA4 streams are retained so every brand keeps its historical reporting. */
export const GA4_MEASUREMENT_IDS: Record<BrandSlug, string> = {
  boaterwise: "G-R80L5GXLFR",
  fastrac: "G-H5YSB812RP",
  "island-view": "G-RD3J8HD3JT",
  lighthouse: "G-R44CY1CBQP",
  paradise: "G-4HHE75P6C0",
  sundance: "G-58NHSD0MEH",
  "tackle-box": "G-MW3EGLZLL2",
  "water-taxi": "G-C34MP392N2",
};
