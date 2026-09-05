import Image from "next/image";
import type { BrandConfig, BrandContent, FactItem } from "@/config/types";
import { HubLink } from "@/components/HubLink";

const trustMarks = [
  { src: "/boaterwise/nsbc.png", alt: "National Safe Boating Council", note: "NSBC-certified instructors and curriculum" },
  { src: "/boaterwise/uscg-captain.png", alt: "U.S. Coast Guard Licensed Captain", note: "Taught by USCG-licensed captains" },
  { src: "/boaterwise/boatus-on-water.png", alt: "BoatUS On-Water Training", note: "BoatUS Foundation on-water training provider" },
];

export function BoaterWiseHome({ brand, content }: { brand: BrandConfig; content: BrandContent; facts: Record<string, FactItem> }) {
  const h = content.home;
  const plan = content.plan!;
  const modules = h.features.slice(0, 4);

  return (
    <>
      <section className="bw-hero">
        <Image src="/boaterwise/training-hero.webp" alt="A BoaterWise captain coaching students aboard a pontoon on Lake Texoma" fill priority sizes="100vw" className="object-cover" />
        <div className="bw-hero-wash" />
        <div className="bw-hero-grid container">
          <div className="bw-hero-copy">
            <p className="bw-kicker"><span>Lake Texoma</span> On-water boat training</p>
            <h1>Learn it.<br /><em>Drive it.</em><br />Own the water.</h1>
            <p className="bw-lede">Your course to on-water safety—with patient captains, real helm time, and the kind of practice that turns nerves into confidence.</p>
            <div className="flex flex-wrap gap-3">
              <HubLink brand={brand} cta={{ label: "Book classes", intent: "boaterwise-book", variant: "primary" }} campaign="bw-hero" />
              <HubLink brand={brand} cta={{ label: "Private instruction", intent: "boaterwise-private", variant: "ghost" }} campaign="bw-hero-private" />
            </div>
          </div>
          <div className="bw-hero-badges" aria-label="Course format"><span>Small groups</span><span>Real boats</span><span>All helm time</span></div>
          <div className="bw-image-callout"><strong>100%</strong><span>outside and<br />on the water</span></div>
        </div>
        <nav className="bw-jump-nav" aria-label="On this page"><div className="container"><a href="#courses">Courses</a><a href="#private">Private instruction</a><a href="#credentials">Credentials</a><a href="#questions">Questions</a></div></nav>
      </section>

      <section id="credentials" className="bw-trust container">
        <div className="bw-trust-intro"><p className="eyebrow">Training you can trust</p><h2>Qualified where it counts.</h2></div>
        {trustMarks.map((mark) => <div className="bw-trust-mark" key={mark.alt}><div><Image src={mark.src} alt={mark.alt} width={360} height={180} className="object-contain" /></div><p>{mark.note}</p></div>)}
      </section>

      <section className="bw-intro"><div className="container grid items-center gap-10 py-14 md:grid-cols-2 md:py-18">
        <div className="bw-intro-image"><Image src="/boaterwise/helm-instruction.webp" alt="A BoaterWise instructor pointing out a maneuver to a student at the helm" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" /></div>
        <div><p className="eyebrow">Professional. Relaxed. Practical.</p><h2>{h.intro.title}</h2>{h.intro.body.map((p, i) => <p key={i}>{p}</p>)}</div>
      </div></section>

      <section id="courses" className="bw-courses container py-14 md:py-18">
        <div className="bw-section-heading"><div><p className="eyebrow">Pick your next skill</p><h2>This is learning<br />with the throttle on.</h2></div><div><p>Take the full NSBC pathway or jump straight to the skill that would make your next boat day better. Every three-hour session is built around doing—not watching.</p><HubLink brand={brand} cta={{ label: "See the class schedule", intent: "boaterwise-book", variant: "primary" }} campaign="bw-courses" /></div></div>
        <ol className="bw-course-route">{modules.map((module, index) => <li key={module.title}><div className="bw-route-number"><span>Module</span>{index + 1}</div><div className="bw-route-copy"><p className="bw-route-skill">{["Start & control", "Dock with confidence", "Handle open water", "Master the unexpected"][index]}</p><h3>{module.title.replace(/^Module \d — /, "")}</h3><p>{module.body}</p><HubLink brand={brand} cta={{ label: `Book module ${index + 1}`, intent: "boaterwise-book", variant: "ghost" }} campaign={`bw-module-${index + 1}`} /></div></li>)}</ol>
      </section>

      <section className="bw-photo-story" aria-label="BoaterWise training in action">
        <div className="bw-photo-tall"><Image src="/boaterwise/coaching-detail.webp" alt="A student receiving hands-on instruction at the helm" fill sizes="30vw" className="object-cover" /></div>
        <div className="bw-photo-wide"><Image src="/boaterwise/coaching-wide.webp" alt="A captain teaching students aboard a boat on Lake Texoma" fill sizes="45vw" className="object-cover" /></div>
        <div className="bw-photo-quote"><p>“Questions encouraged.<br />Nerves expected.<br /><strong>Confidence earned.</strong>”</p></div>
      </section>

      <section id="private" className="bw-private"><div className="container grid md:grid-cols-2">
        <div className="bw-private-copy"><p className="eyebrow">Focused on your needs</p><h2>Your boat or ours.</h2><p>Private instruction puts the captain’s attention on you, your co-captain, and the situations that cause the most stress. Train aboard our 24-foot pontoon or bring your own boat up to 32 feet.</p><ul><li>Docking at your slip</li><li>Launching at your ramp</li><li>Boat-specific controls and handling</li><li>A customized session for one person or a couple</li></ul><HubLink brand={brand} cta={{ label: "Book private instruction", intent: "boaterwise-private", variant: "primary" }} campaign="bw-private" /></div>
        <div className="bw-private-image"><Image src="/boaterwise/training-conversation.webp" alt="A captain and students discussing boat handling during a private lesson" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" /></div>
      </div></section>

      <section className="bw-next-boat">
        <div className="container">
          <p className="bw-next-label">From first lesson to first boat</p>
          <div className="bw-next-copy"><p className="eyebrow">The Texoma boating flywheel</p><h2>Love the boat you trained on?</h2><p>BoaterWise instructors stay focused on training—not sales. But when you’re ready to explore ownership, we can make a warm handoff to Big Water Marine. They sell Berkshire pontoons like the boats used in our classes, along with other premium brands, from their Pottsboro and Kingston locations.</p></div>
          <div className="bw-next-actions"><a href="https://bigwatermarine.com/inventory/?utm_source=boaterwise.com&utm_medium=brand-site&utm_campaign=after-training" className="btn btn-primary">Shop boats at Big Water Marine <span aria-hidden>→</span></a><a href="https://bigwatermarine.com/boatclub/?utm_source=boaterwise.com&utm_medium=brand-site&utm_campaign=after-training" className="bw-text-link">Not ready to own? Explore Boat Club →</a></div>
        </div>
      </section>

      <section className="bw-support container py-14 md:py-18"><div className="bw-support-card">
        <div><Image src="/boaterwise/boatus-on-water.png" alt="BoatUS Foundation On-Water Training" width={516} height={145} /></div>
        <div><p className="eyebrow">Start with the rules. Then learn the boat.</p><h2>Need your Texas boater education card?</h2><p>Texas requires boater education for certain operators born on or after September 1, 1993. BoatUS Foundation offers a free state-approved online safety course; BoaterWise adds the hands-on experience that a screen cannot.</p><a href="https://www.boatus.org/free/" className="btn btn-secondary">Take the free online course <span aria-hidden>→</span></a></div>
      </div></section>

      <section id="questions" className="bw-faq"><div className="container grid gap-10 py-14 md:grid-cols-[.65fr_1.35fr] md:py-18">
        <div><p className="eyebrow">Before you board</p><h2>Good questions make better boaters.</h2><p>Still unsure which class fits? Call us at <a href={`tel:${brand.nap.phoneE164}`}>{brand.nap.phone}</a> and we’ll help you choose.</p></div>
        <div className="bw-faq-list">{plan.faqs.map((faq) => <details key={faq.q}><summary>{faq.q}<span aria-hidden>+</span></summary><p>{faq.a}</p>{faq.q.includes("prepare") && <a className="bw-faq-resource" href="https://www.safeboatingcouncil.org/training/on-water-courses/boat-control-on-water-training-course/">Review the NSBC course modules →</a>}{faq.q.includes("private") && <a className="bw-faq-resource" href="https://jobemarine.com">Visit Jobe Marine →</a>}{faq.q.includes("purchase") && <a className="bw-faq-resource" href="https://bigwatermarine.com/inventory/?utm_source=boaterwise.com&utm_medium=brand-site&utm_campaign=faq">Browse Big Water Marine inventory →</a>}</details>)}</div>
      </div></section>

      <section className="bw-final container">
        <div className="bw-final-photo"><Image src="/boaterwise/student-group.webp" alt="BoaterWise students completing an on-water class at Lighthouse Marina" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" /></div>
        <div className="bw-final-copy"><p className="eyebrow">Training at Lighthouse Marina</p><h2>Ready to take the helm?</h2><p>Choose a small-group course or schedule private instruction on our boat or yours.</p><div className="flex flex-wrap gap-3"><HubLink brand={brand} cta={{ label: "Book classes", intent: "boaterwise-book", variant: "primary" }} campaign="bw-final" /><HubLink brand={brand} cta={{ label: "Book private", intent: "boaterwise-private", variant: "ghost" }} campaign="bw-final-private" /></div></div>
      </section>
    </>
  );
}
