"use client";

import { useEffect, useRef } from "react";
import styles from "./TexomaCollective.module.css";

/** Turns on scroll-reveal for [data-reveal] elements. Content stays visible without JS. */
export function RevealObserver() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-tc-site]");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    root.dataset.motion = "on";
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) { (entry.target as HTMLElement).dataset.shown = ""; io.unobserve(entry.target); }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    const watch = () => root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])").forEach((el) => io.observe(el));
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(root, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}

/** Horizontal postcard rail with arrow controls. */
export function Rail({ children, label }: { children: React.ReactNode; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const move = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 20), behavior: "smooth" });
  };
  return (
    <div className={styles.rail}>
      <div className={styles.railControls}>
        <button type="button" onClick={() => move(-1)} aria-label={`Previous ${label}`}>←</button>
        <button type="button" onClick={() => move(1)} aria-label={`Next ${label}`}>→</button>
      </div>
      <div ref={track} className={styles.railTrack} role="list" aria-label={label}>{children}</div>
    </div>
  );
}
