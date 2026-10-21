import Image from "next/image";
import Link from "next/link";
import type { BrandConfig, HubIntent } from "@/config/types";
import { hubUrl } from "@/config/hub-links";

export function LighthousePhoto({ src, alt, className = "", priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return <div className={`lh-photo ${className}`}><Image src={src} alt={alt} fill sizes="(max-width: 760px) 100vw, 65vw" priority={priority} className="object-cover" /></div>;
}

export function LighthouseBookingLink({ brand, intent, children, campaign = "lighthouse", className = "lh-button lh-button-red" }: { brand: BrandConfig; intent: HubIntent; children: React.ReactNode; campaign?: string; className?: string }) {
  return <a href={hubUrl(intent, brand, { campaign })} className={className} data-intent={intent}>{children}<span aria-hidden>↗</span></a>;
}

export function LighthouseClosing({ brand }: { brand: BrandConfig }) {
  return <section className="lh-closing lh-reveal"><div><p className="lh-eyebrow">See you at Lighthouse</p><h2>Less planning.<br /><em>More lake.</em></h2></div><div><p>Choose your cabin, claim your RV spot, or get a boat on the calendar. Your next lake story starts here.</p><div className="lh-actions"><LighthouseBookingLink brand={brand} intent="cabins" campaign="closing">Book your stay</LighthouseBookingLink><LighthouseBookingLink brand={brand} intent="boats" campaign="closing" className="lh-button lh-button-outline">Rent a boat</LighthouseBookingLink></div><small>Live availability & reservations through Texoma Destinations.</small></div></section>;
}

export function LighthouseNext({ href, label, title }: { href: string; label: string; title: string }) {
  return <Link className="lh-next" href={href}><span><small>{label}</small><strong>{title}</strong></span><span aria-hidden>↗</span></Link>;
}
