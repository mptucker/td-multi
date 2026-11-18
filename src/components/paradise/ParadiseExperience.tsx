"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export function ParadiseJourney({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 900px) and (pointer: fine)");
    const reveals = element.querySelectorAll<HTMLElement>(".px-reveal");
    const activePhotos = new Set<HTMLElement>();
    let frame = 0;
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("px-visible"); revealObserver.unobserve(entry.target); }
    }), { rootMargin: "0px 0px -20px 0px", threshold: 0.06 });
    reveals.forEach((target) => {
      if (!motion.matches && target.getBoundingClientRect().top > window.innerHeight) target.classList.add("px-will-reveal");
      revealObserver.observe(target);
    });
    const updatePhotos = () => {
      frame = 0;
      if (motion.matches || !desktop.matches) return;
      activePhotos.forEach((photo) => {
        const bounds = photo.getBoundingClientRect();
        const position = (window.innerHeight / 2 - bounds.top - bounds.height / 2) / window.innerHeight;
        photo.style.setProperty("--px-shift", `${Math.max(-22, Math.min(22, position * 26))}px`);
      });
    };
    const onScroll = () => { if (!frame && !motion.matches && desktop.matches) frame = requestAnimationFrame(updatePhotos); };
    const photoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) activePhotos.add(entry.target as HTMLElement); else activePhotos.delete(entry.target as HTMLElement); });
      onScroll();
    });
    element.querySelectorAll<HTMLElement>("[data-parallax]").forEach((photo) => photoObserver.observe(photo));
    const onPreference = () => {
      if (motion.matches) reveals.forEach((target) => target.classList.add("px-visible"));
      element.querySelectorAll<HTMLElement>("[data-parallax]").forEach((photo) => photo.style.removeProperty("--px-shift"));
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    motion.addEventListener("change", onPreference);
    desktop.addEventListener("change", onPreference);
    return () => {
      revealObserver.disconnect(); photoObserver.disconnect();
      window.removeEventListener("scroll", onScroll); motion.removeEventListener("change", onPreference); desktop.removeEventListener("change", onPreference);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={root} className="px-home">{children}</div>;
}

function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number, count: number, select: (index: number) => void) {
  let next = index;
  if (event.key === "ArrowRight") next = (index + 1) % count;
  else if (event.key === "ArrowLeft") next = (index + count - 1) % count;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = count - 1;
  else return;
  event.preventDefault();
  select(next);
  const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=tab]");
  tabs?.[next]?.focus();
}

const moods = [
  { name: "Relaxing", title: "Nothing planned. Nothing missing.", body: "A little shade. A good book. A hammock with your name on it. The afternoon is yours to do absolutely nothing with.", image: "/paradise/deer.jpg", alt: "Hammocks under the shaded pavilion at Paradise", note: "Permission to put your feet up.", position: "center 55%" },
  { name: "Adventure", title: "See where the shoreline takes you.", body: "Get out on the water. Paddle a little farther. Find a new favorite view, then come back to your quiet corner of the lake.", image: "/paradise/aerial-peninsula.jpg", alt: "Paradise’s wooded peninsula and Lake Texoma shoreline from above", note: "A whole lake of possibilities.", position: "center 55%" },
  { name: "Refreshing", title: "A little less screen. A lot more sky.", body: "Follow the trees to the water. Breathe in the lake air. It’s surprising what a few days outside can do.", image: "/paradise/hammock-pavilion.jpg", alt: "Leafy trees and string lights overlooking the lake", note: "Let the outside in.", position: "center 50%" },
  { name: "Cozy", title: "Your kind of night-life.", body: "Dinner on the grill. One more story. Then a quiet good night beneath a sky that feels a little bigger out here.", image: "/paradise/dog-friendly-stay.jpg", alt: "A glowing tent beneath a sky full of stars", note: "Stay until the stars come out.", position: "center 60%" },
];

export function ParadiseMood() {
  const [selected, setSelected] = useState(0);
  const mood = moods[selected];
  return <div className="px-moods">
    <div className={`px-mood-stage px-mood-${mood.name.toLowerCase()}`}>
      <div key={mood.image} className="px-mood-image is-active"><Image src={mood.image} alt={mood.alt} fill sizes="100vw" priority={selected === 0} style={{ objectPosition: mood.position }} /></div>
      <div className="px-mood-shade" />
      <div className="px-wrap px-mood-lead px-reveal"><p className="px-eyebrow">Follow your feeling</p><h2 id="px-discover-title">Your kind of <em>Paradise.</em></h2><p>Some days you wander. Some days you don&apos;t. There&apos;s room for both.</p></div>
      <div key={mood.name} id={`px-mood-panel-${selected}`} role="tabpanel" aria-labelledby={`px-mood-tab-${selected}`} tabIndex={0} className="px-wrap px-mood-panel"><div className="px-mood-story"><span className="px-mood-number" aria-hidden="true">0{selected + 1} / 04</span><h3>{mood.title}</h3><p>{mood.body}</p><span>{mood.note}</span></div></div>
      <div className="px-wrap px-mood-tabs" role="tablist" aria-label="Find your Paradise mood">{moods.map((item, index) => <button key={item.name} id={`px-mood-tab-${index}`} type="button" role="tab" aria-selected={selected === index} aria-controls={`px-mood-panel-${index}`} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => moveTab(event, index, moods.length, setSelected)}><span aria-hidden="true">0{index + 1}</span>{item.name}</button>)}</div>
    </div>
  </div>;
}

export type ParadiseStay = { name: string; invitation: string; description: string; image: string; alt: string; detail: string; note: string; href: string };

export function ParadiseStays({ stays }: { stays: ParadiseStay[] }) {
  const [selected, setSelected] = useState(0);
  const stay = stays[selected];
  return <div className="px-stay-explorer">
    <div className="px-stay-tabs" role="tablist" aria-label="Find your way to stay">{stays.map((stay, index) => <button key={stay.name} id={`px-stay-tab-${index}`} type="button" role="tab" aria-selected={selected === index} aria-controls={`px-stay-panel-${index}`} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => moveTab(event, index, stays.length, setSelected)}><span>0{index + 1}</span>{stay.name}<i aria-hidden="true">↗</i></button>)}</div>
    <div key={stay.name} role="tabpanel" id={`px-stay-panel-${selected}`} aria-labelledby={`px-stay-tab-${selected}`} tabIndex={0} className="px-stay-scene">
      <figure className="px-stay-image"><Image src={stay.image} alt={stay.alt} fill sizes="(min-width: 900px) 64vw, 100vw" /><figcaption>{stay.note}</figcaption></figure>
      <div className="px-stay-story"><span className="px-stay-handle" aria-hidden="true" /><span className="px-eyebrow">{stay.detail}</span><h3>{stay.invitation}</h3><p>{stay.description}</p><a href={stay.href} className="px-book-link">{stay.name === "Camping" ? "Find a tent site" : `Explore ${stay.name.toLowerCase()}`} <span aria-hidden="true">↗</span></a><small>Choose your dates with Texoma Destinations</small></div>
    </div>
  </div>;
}
