"use client";

import { useEffect, useRef, useState } from "react";
import type { BrandConfig, GalleryImage, HubIntent } from "@/config/types";
import { hubUrl } from "@/config/hub-links";

const OPTIONS: { intent: HubIntent; label: string; detail: string; action: string }[] = [
  { intent: "cabins", label: "A cabin stay", detail: "Find the right cabin for your crew and see live availability.", action: "Find a cabin" },
  { intent: "rv", label: "An RV stay", detail: "Bring your home on wheels and choose your spot by the lake.", action: "Find an RV site" },
  { intent: "boats", label: "A boat day", detail: "Choose your boat, rental time, and date on Texoma Destinations.", action: "Find a boat" },
];

export function LighthouseTripPicker({ brand }: { brand: BrandConfig }) {
  const [selected, setSelected] = useState(0);
  const item = OPTIONS[selected];
  return <section className="lh-trip-picker" aria-label="Start planning your trip">
    <div className="lh-trip-label"><span className="lh-eyebrow">Your lake plans start here</span><strong>What brings you out?</strong></div>
    <fieldset><legend className="sr-only">Choose your lake experience</legend>{OPTIONS.map((option, index) => <label key={option.intent} className={selected === index ? "is-selected" : ""}><input type="radio" name="lake-plan" checked={selected === index} onChange={() => setSelected(index)} /><span>{option.label}</span></label>)}</fieldset>
    <div className="lh-trip-result"><p aria-live="polite">{item.detail}</p><a href={hubUrl(item.intent, brand, { campaign: "trip-picker" })} className="lh-button lh-button-navy" data-intent={item.intent}>{item.action}<span aria-hidden>↗</span></a></div>
  </section>;
}

export function LighthouseMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("lh-in-view"); observer.unobserve(entry.target); } }), { threshold: .12 });
    document.querySelectorAll(".lh-reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return null;
}

export function LighthouseMapViewer({ image }: { image: GalleryImage }) {
  const [zoom, setZoom] = useState(1);
  const viewport = useRef<HTMLDivElement>(null);
  return <div className="lh-map-viewer">
    <div className="lh-map-toolbar"><span>Official property map</span><div><button type="button" disabled={zoom === 1} onClick={() => setZoom(Math.max(1, zoom - .5))} aria-label="Zoom out">−</button><output aria-live="polite">{Math.round(zoom * 100)}%</output><button type="button" disabled={zoom === 3} onClick={() => setZoom(Math.min(3, zoom + .5))} aria-label="Zoom in">+</button><button type="button" onClick={() => { setZoom(1); viewport.current?.scrollTo(0, 0); }}>Reset</button></div></div>
    <div className="lh-map-viewport" ref={viewport} tabIndex={0} role="region" aria-label="Scrollable property map. Use zoom controls to enlarge, then scroll to explore.">
      {/* Preserve the full map and its printed labels; the original is also available below. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} style={{ width: `${zoom * 100}%`, maxWidth: "none" }} />
    </div>
    <div className="lh-map-caption"><p>Zoom in to read site numbers. Scroll to explore the enlarged map.</p><a href={image.src} target="_blank" rel="noopener noreferrer">Open full-size map <span aria-hidden>↗</span></a></div>
  </div>;
}
