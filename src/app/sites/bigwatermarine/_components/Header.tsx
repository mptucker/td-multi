"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import logoWhite from "@public/brand/logo-white-teal.png";

// Plain labels, in the order a first-time buyer scans them.
const nav = [
  { label: "Boats", href: "/inventory/" },
  { label: "Service", href: "/service/" },
  { label: "Boat Club", href: "/boatclub/" },
  { label: "Who We Are", href: "/about/" },
  { label: "Visit", href: "/#visit" },
];

type Props = {
  phone: string;
  phoneHref: string;
  windlassUrl: string;
  promo: { text: string; href: string };
  hours: { salesShort: string; serviceShort: string; summary: string };
};

export default function Header({ phone, phoneHref, windlassUrl, promo, hours }: Props) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  const current = (href: string) => (href !== "/#visit" && pathname?.startsWith(href) ? "page" : undefined);

  return (
    <header className="bwm-header" data-solid={solid || open}>
      <a href="#main" className="bwm-skip">Skip to content</a>

      {/* Utility bar: phone and hours where people look first */}
      <div className="bwm-utility">
        <div className="bwm-utilityInner">
          <a href={phoneHref} className="bwm-utilityPhone">Call or text {phone}</a>
          <span className="bwm-utilityHours">
            <span>{hours.salesShort}</span>
            <span>{hours.serviceShort}</span>
          </span>
          <span className="bwm-utilityPlace">Pottsboro · Lake Texoma</span>
          {promo.text && <Link href={promo.href || "/inventory/"} className="bwm-utilityPromo">{promo.text}</Link>}
        </div>
      </div>

      <div className="bwm-bar">
        <div className="bwm-headerInner">
          <Link href="/" className="bwm-logo" aria-label="Big Water Marine, home">
            <Image src={logoWhite} alt="" fill sizes="190px" className="bwm-logoImg"  priority />
          </Link>
          <nav aria-label="Main" className="bwm-nav">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={current(n.href)}>{n.label}</Link>
            ))}
          </nav>
          <div className="bwm-headerActions">
            <a href={phoneHref} className="bwm-headerCall" aria-label={`Call ${phone}`}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
              Call
            </a>
            <a href={windlassUrl} className="bwm-headerService">Book service</a>
            <Link href="/inventory/" className="bwm-headerShop">Shop boats</Link>
            <button type="button" className="bwm-menuBtn" aria-expanded={open} aria-controls="bwm-menu" onClick={() => setOpen((o) => !o)}>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="bwm-menu" className="bwm-mobileMenu">
          <nav aria-label="Mobile">
            {nav.map((n) => <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</Link>)}
          </nav>
          <div className="bwm-mobileMenuActions">
            <Link href="/inventory/" className="bwm-btnTeal" onClick={() => setOpen(false)}>Shop boats</Link>
            <a href={windlassUrl} className="bwm-btnOutlineDark">Book service</a>
            <a href={phoneHref} className="bwm-btnOutlineDark">Call or text {phone}</a>
          </div>
          <p className="bwm-mobileMenuHours">{hours.summary}</p>
        </div>
      )}
    </header>
  );
}
