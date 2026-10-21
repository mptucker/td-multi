"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { BrandConfig, BrandNetworkSettings } from "@/config/types";
import { hubUrl } from "@/config/hub-links";
import { TexomaNetwork } from "@/components/TexomaNetwork";
import { LIGHTHOUSE_JOURNEYS } from "./data";

export function LighthouseHeader({ brand, network }: { brand: BrandConfig; network: BrandNetworkSettings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname().replace(/^\/sites\/lighthouse/, "") || "/";
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape" && open) { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return <header className="lh-header">
    <a className="lh-skip" href="#main-content">Skip to content</a>
    <div className="lh-header-top">
      <div className="lh-lockup"><Link href="/" aria-label="Lighthouse Resort & Marina home"><Image src={brand.logo.src} alt={brand.nap.displayName} width={702} height={194} priority /></Link><TexomaNetwork settings={network} currentBrand="lighthouse" /></div>
      <div className="lh-header-contact"><span>Lake Texoma · Pottsboro, Texas</span><a href={`tel:${brand.nap.phoneE164}`}>{brand.nap.phone}</a></div>
      <a className="lh-button lh-button-red lh-header-book" href={hubUrl("cabins", brand, { campaign: "header" })} data-intent="cabins">Book your stay <span aria-hidden>↗</span></a>
      <button ref={toggle} type="button" className="lh-menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="lighthouse-navigation" onClick={() => setOpen(!open)}><span>{open ? "Close" : "Menu"}</span><span aria-hidden>{open ? "×" : "☰"}</span></button>
    </div>
    <nav id="lighthouse-navigation" className={`lh-nav ${open ? "is-open" : ""}`} aria-label="Main navigation">
      {LIGHTHOUSE_JOURNEYS.map((item) => <Link key={item.key} href={item.path} onClick={() => setOpen(false)} aria-current={pathname === item.path ? "page" : undefined} className={item.key === "boats" ? "lh-nav-boats" : undefined}>{item.label}{item.key === "boats" && <span aria-hidden>↗</span>}</Link>)}
    </nav>
  </header>;
}
