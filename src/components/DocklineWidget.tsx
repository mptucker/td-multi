import { docklineWidgetScript, type DocklineWidgetSettings } from "@/config/dockline";
import type { BrandSlug } from "@/config/types";

/** Loads the Dockline "Text us" button for this brand, if one is set in /admin. */
export function DocklineWidget({ brand, settings }: { brand: BrandSlug; settings: Partial<DocklineWidgetSettings> | null }) {
  const widget = docklineWidgetScript(settings, brand);
  if (!widget) return null;
  return <script src={widget.src} data-site={widget.site} async />;
}
