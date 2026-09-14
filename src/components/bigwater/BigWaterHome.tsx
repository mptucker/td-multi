"use client";

import Image from "next/image";
import { useEffect } from "react";

export function BigWaterHome({ content }: { content: any }) {
  const h = content.home;
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: .12 });
    document.querySelectorAll(".bwco-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <div className="bwco-site">
    <nav className="bwco-nav"><Image src="/bigwater/BWco_Logo.png" width={1000} height={246} alt="BigWater.co" /><a href="#portfolio">Our brands</a></nav>
    <section className="bwco-hero"><div className="bwco-water" /><div className="bwco-hero-copy"><p>{h.eyebrow}</p><Image src="/bigwater/BWco_Logo.png" width={1000} height={246} priority alt="BigWater.co — Go Big" /><i /></div><a href="#portfolio" className="bwco-explore">Explore</a></section>
    <div className="bwco-divider"><i /><b /><i /></div>
    <section className="bwco-portfolio" id="portfolio"><header><p>{h.portfolioEyebrow}</p><h1>{h.portfolioTitle}</h1></header><div>{h.brands.map((item: any, index: number) => { const inner = <><span className="bwco-logo"><Image src={item.logo} width={500} height={300} alt={item.name} /></span><span><h2>{item.name}</h2><p>{item.description}</p></span><em>{item.href ? "Visit →" : "TBA"}</em></>; return item.href ? <a className="bwco-card bwco-reveal" href={item.href} key={item.name} target="_blank" rel="noreferrer" data-intent="portfolio" style={{transitionDelay: `${index * 80}ms`}}>{inner}</a> : <article className="bwco-card bwco-reveal disabled" key={item.name}>{inner}</article>; })}</div></section>
    <section className="bwco-statement"><blockquote>“{h.statement}”</blockquote><p>BigWater.co — Lake Texoma, Texas</p></section>
    <section className="bwco-contact"><p>Get in touch</p><a href={h.phoneHref} data-intent="phone">{h.phone}</a></section>
    <footer className="bwco-footer"><Image src="/bigwater/BWco_Logo.png" width={1000} height={246} alt="BigWater.co" /><p>© {new Date().getFullYear()} BigWater.co — All Rights Reserved</p><em>{content.footerBlurb}</em></footer>
  </div>;
}
