"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

const chapters = [{ id: "px-arrive", label: "Arrive" }, { id: "px-feel", label: "Exhale" }, { id: "px-yours", label: "Find your pace" }, { id: "px-stay", label: "Stay awhile" }, { id: "px-outside", label: "Wander" }];

export function ParadiseJourney({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState("px-arrive");
  useEffect(() => {
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = element.querySelectorAll<HTMLElement>(".px-reveal");
    const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("px-visible"); reveal.unobserve(entry.target); }
    }), { rootMargin: "0px 0px -35px 0px", threshold: 0.08 });
    if (!reduced.matches) targets.forEach((target) => {
      if (target.getBoundingClientRect().top > window.innerHeight) target.classList.add("px-will-reveal");
      reveal.observe(target);
    });
    const navigation = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setChapter(entry.target.id); });
    }, { rootMargin: "-15% 0px -55% 0px" });
    chapters.forEach(({ id }) => { const target = document.getElementById(id); if (target) navigation.observe(target); });
    const handleMotion = () => { if (reduced.matches) targets.forEach((target) => target.classList.add("px-visible")); };
    reduced.addEventListener("change", handleMotion);
    return () => { reveal.disconnect(); navigation.disconnect(); reduced.removeEventListener("change", handleMotion); };
  }, []);
  return <div ref={root} className="px-home">{children}<nav className={`px-wayfinder ${chapter === "px-arrive" ? "px-wayfinder-arrival" : ""}`} aria-label="Explore Paradise">{chapters.map((item, index) => <a key={item.id} href={`#${item.id}`} aria-current={chapter === item.id ? "location" : undefined}><span className="px-wayfinder-label">{item.label}</span><span className="px-wayfinder-number">0{index + 1}</span></a>)}</nav></div>;
}

const moods = [
  { name: "Relaxing", subtitle: "Nothing on the calendar. Everything you need.", text: "A little shade. A good book. A hammock with your name on it. Some days, the best plan is leaving the afternoon wide open.", image: "/paradise/deer.jpg", alt: "Hammocks beneath a shaded lakeside pavilion at Paradise", note: "Permission to do absolutely nothing.", color: "sage" },
  { name: "Adventure", subtitle: "Take the scenic way through the day.", text: "Get out on the water. Paddle along the shoreline. There’s a whole lake to explore, and a quiet place to come home to when you’re done.", image: "/paradise/aerial-peninsula.jpg", alt: "Aerial view of the wooded Paradise peninsula surrounded by Lake Texoma", note: "Go a little farther. Stay a little longer.", color: "lake" },
  { name: "Refreshing", subtitle: "More lake light. Less screen time.", text: "Follow the shoreline. Find a new view. Let a little fresh air and a whole lot of water change the pace of your day.", image: "/paradise/hammock-pavilion.jpg", alt: "String lights and leafy trees framing an open view of Lake Texoma", note: "The outside is calling.", color: "lake" },
  { name: "Cozy", subtitle: "Stay out until the stars come on.", text: "Dinner on the grill. One more story. Then a quiet good night beneath a sky that feels a little bigger out here.", image: "/paradise/dog-friendly-stay.jpg", alt: "A softly glowing tent beneath the stars", note: "Your kind of night-life.", color: "dusk" },
];

export function ParadiseMood() {
  const [selected, setSelected] = useState(0);
  const mood = moods[selected];
  return <div className={`px-mood px-mood-${mood.color}`}><div className="px-wrap px-mood-controls" role="group" aria-label="Choose how your Paradise feels">{moods.map((item, index) => <button key={item.name} type="button" aria-pressed={selected === index} aria-controls="px-mood-scene" onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.name}<span aria-hidden="true">↗</span></button>)}</div><div id="px-mood-scene" className="px-mood-scene"><div className="px-mood-photo" key={mood.image}><Image src={mood.image} alt={mood.alt} fill sizes="(min-width: 800px) 77vw, 100vw" /></div><div className="px-mood-word" aria-hidden="true">{mood.name}</div><div className="px-mood-caption" aria-live="polite" aria-atomic="true"><span className="px-eyebrow">Find your {mood.name.toLowerCase()} Paradise</span><h3>{mood.subtitle}</h3><p>{mood.text}</p><span className="px-mood-handwritten">{mood.note}</span></div><span className="px-mood-image-note" aria-hidden="true">However you lake.</span></div></div>;
}

type Stay = { name: string; subtitle: string; description: string; image: string; alt: string; detail: string; href: string };

export function ParadiseStays({ stays }: { stays: Stay[] }) {
  const [selected, setSelected] = useState(0);
  const stay = stays[selected];
  return <div className="px-stay-picker"><div className="px-stay-options" role="group" aria-label="Explore ways to stay">{stays.map((item, index) => <button key={item.name} type="button" aria-pressed={selected === index} aria-controls="px-stay-detail" onClick={() => setSelected(index)}><span>0{index + 1}</span><span>{item.name}</span><span aria-hidden="true">{selected === index ? "↗" : "+"}</span></button>)}</div><div className="px-stay-visual"><Image key={stay.image} src={stay.image} alt={stay.alt} fill sizes="(min-width: 800px) 58vw, 100vw" /><span className="px-stay-stamp">Good nights.<br /><em>Great mornings.</em></span></div><div className="px-stay-detail" id="px-stay-detail"><div aria-live="polite" aria-atomic="true"><span className="px-eyebrow">{stay.detail}</span><h3>{stay.subtitle}</h3><p>{stay.description}</p></div><a className="px-pill px-pill-dark" href={stay.href}>Explore {stay.name.toLowerCase()} <span aria-hidden="true">↗</span></a><small>Dates &amp; reservations with Texoma Destinations</small></div></div>;
}
