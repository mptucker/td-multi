import type { BrandConfig } from "@/config/types";

const RADIUS = { sharp: "0.25rem", soft: "0.75rem", round: "1.5rem" } as const;

/** Emits the per-brand CSS variables and font <link>. Server component. */
export function BrandStyle({ brand }: { brand: BrandConfig }) {
  const t = brand.theme;
  const css = `:root{--c-primary:${t.primary};--c-primary-dark:${t.primaryDark};--c-accent:${t.accent};--c-accent2:${t.accent2 ?? t.accent};--c-bg:${t.bg};--c-surface:${t.surface};--c-ink:${t.ink};--c-muted:${t.muted};--font-display:"${t.fontDisplay}",Georgia,serif;--font-body:"${t.fontBody}",system-ui,sans-serif;--radius:${RADIUS[t.radius]};}`;
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={t.fontHref} />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}
