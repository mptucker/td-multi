"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { BRAND_NETWORK_CATEGORY_LABELS } from "@/config/brand-network";
import type { BrandNetworkCategory, BrandNetworkSettings, BrandSlug } from "@/config/types";

const CATEGORIES = Object.keys(BRAND_NETWORK_CATEGORY_LABELS) as BrandNetworkCategory[];

export function TexomaNetwork({ settings, currentBrand }: { settings: BrandNetworkSettings; currentBrand: BrandSlug }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const items = useMemo(() => settings.items
    .filter((item) => item.visible && (!item.show_on_sites?.length || item.show_on_sites.includes(currentBrand)))
    .sort((a, b) => a.sort_order - b.sort_order || a.display_name.localeCompare(b.display_name)), [settings.items, currentBrand]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const onPointerDown = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => { document.removeEventListener("keydown", onKeyDown); document.removeEventListener("pointerdown", onPointerDown); };
  }, [open]);

  if (!settings.enabled || !items.length) return null;
  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const delayedClose = () => { cancelClose(); closeTimer.current = setTimeout(() => setOpen(false), 180); };

  return (
    <div className={`td-network ${open ? "is-open" : ""}`} ref={rootRef} onMouseEnter={() => { cancelClose(); setOpen(true); }} onMouseLeave={delayedClose} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) delayedClose(); }}>
      <button className="brand-endorsement td-network-trigger" type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(true)}>
        <span>A Texoma<br />Destinations property</span><i aria-hidden>↗</i>
      </button>
      <section className="td-network-panel" id={panelId} aria-label="The Texoma Destinations family" hidden={!open}>
        <div className="td-network-inner">
          <header>
            <a href={settings.hub_url}>{settings.heading}</a>
            <p>{settings.strapline}</p>
          </header>
          <div className="td-network-groups">
            {CATEGORIES.map((category) => {
              const categoryItems = items.filter((item) => item.category === category);
              if (!categoryItems.length) return null;
              return <div className="td-network-group" key={category}><h2>{BRAND_NETWORK_CATEGORY_LABELS[category]}</h2>{categoryItems.map((item) => <a href={item.url} key={item.id}><span>{item.display_name}</span>{item.description && <small>{item.description}</small>}</a>)}</div>;
            })}
          </div>
          <footer><a href={settings.hub_url}>{settings.hub_label} <span aria-hidden>↗</span></a><b>The Most Texoma</b></footer>
        </div>
      </section>
    </div>
  );
}
