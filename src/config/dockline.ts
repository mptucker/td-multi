import type { BrandSlug } from "./types";

/**
 * Dockline "Text us" widget. Stored in global_settings under "dockline_widget"
 * and edited in /admin → Shared settings. Each brand with a site key loads
 * <dockline>/widget.js; the widget's look, questions and approved domains are
 * managed in Dockline (Settings → Website widgets).
 */
export interface DocklineWidgetSettings {
  enabled: boolean;
  base_url: string;
  /** brand → Dockline site key; blank = no widget on that site. */
  sites: Partial<Record<BrandSlug, string>>;
}

export const DEFAULT_DOCKLINE_WIDGET: DocklineWidgetSettings = {
  enabled: false,
  base_url: "https://dockline.texomadestinations.com",
  sites: { lighthouse: "lighthouse", paradise: "paradise", sundance: "sundance", "island-view": "islandview", fastrac: "fastrac" },
};

/** The widget script for a brand, or null when it shouldn't load. */
export function docklineWidgetScript(settings: Partial<DocklineWidgetSettings> | null | undefined, brand: BrandSlug): { src: string; site: string } | null {
  const s = { ...DEFAULT_DOCKLINE_WIDGET, ...settings, sites: { ...DEFAULT_DOCKLINE_WIDGET.sites, ...settings?.sites } };
  if (!s.enabled) return null;
  const site = (s.sites[brand] ?? "").trim().toLowerCase();
  if (!/^[a-z0-9-]{1,40}$/.test(site)) return null;
  let base: URL;
  try {
    base = new URL(s.base_url);
  } catch {
    return null;
  }
  if (base.protocol !== "https:") return null;
  return { src: `${base.origin}/widget.js`, site };
}
