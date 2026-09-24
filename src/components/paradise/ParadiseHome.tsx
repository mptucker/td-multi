import Image from "next/image";
import Link from "next/link";
import type { BrandConfig } from "@/config/types";
import { hubUrl } from "@/config/hub-links";
import { ParadiseJourney, ParadiseMood, ParadiseStays } from "./ParadiseExperience";

function Sun({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true"><circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1.5" /><path d="M50 4v15m0 62v15M4 50h15m62 0h15M17 17l11 11m44 44 11 11M17 83l11-11m44-44 11-11M32 7l6 14m24 58 6 14M7 68l14-6m58-24 14-6M7 32l14 6m58 24 14 6M32 93l6-14m24-58 6-14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

export function ParadiseHome({ brand }: { brand: BrandConfig }) {
  const stays = [
    { name: "Glamping", subtitle: "A little closer to the lake.", description: "Kabanas, Kasitas and Kimas. Settle into a simple lakeside hideaway, step onto your porch and let the view do the rest. Shared bathhouses keep the essentials close.", image: "/paradise/glamping-guest-lake.jpg", alt: "An A-frame glamping cabin overlooking Lake Texoma", detail: "Kabanas · Kasitas · Kimas", href: hubUrl("cabins", brand, { campaign: "paradise-stays", content: "glamping" }) },
    { name: "Cabins", subtitle: "Make yourself right at home.", description: "A cozy place to come back to after a day outside. Find your favorite cabin, or make a memory in the Paradise Express, our real 1920s train car.", image: "/paradise/lake-evening-with-dog.jpg", alt: "A small wood cabin tucked beneath the trees at Paradise", detail: "Cozy cabins · Paradise Express", href: hubUrl("cabins", brand, { campaign: "paradise-stays", content: "cabins" }) },
    { name: "RV sites", subtitle: "Your home. A whole new view.", description: "Bring the rig and settle into a shaded loop or a waterfront site. Unfold the chairs, put something on the grill and stay a little longer.", image: "/paradise/aerial-rv-loop.jpg", alt: "Aerial view of RV sites beside the wooded Lake Texoma shoreline", detail: "Shaded loops · Waterfront sites", href: hubUrl("rv", brand, { campaign: "paradise-stays", content: "rv" }) },
    { name: "Tent camping", subtitle: "A million little night-lights.", description: "Pack the tent and claim your piece of the shoreline. Simple nights, fresh air and a sky that makes you glad you stayed outside.", image: "/paradise/dog-friendly-stay.jpg", alt: "A glowing tent under a star-filled night sky", detail: "Primitive camping · Shoreline views", href: hubUrl("tents", brand, { campaign: "paradise-stays", content: "tents" }) },
  ];

  return (
    <ParadiseJourney>
      <section className="px-arrival" id="px-arrive" aria-labelledby="px-title">
        <div className="px-arrival-photo"><Image src="/paradise/glamping-porch-lake.jpg" alt="Sunlight and lake views from a waterfront porch at Paradise on Lake Texoma" fill priority sizes="100vw" /></div>
        <div className="px-arrival-shade" />
        <div className="px-arrival-top"><span>Pottsboro, Texas</span><span>200 wooded acres. One beautiful escape.</span><span>On Lake Texoma</span></div>
        <div className="px-arrival-title"><p>However you lake.</p><h1 id="px-title"><span>Find your</span>Paradise<span className="px-title-dot">.</span></h1></div>
        <div className="px-arrival-bottom"><p>A little less rush.<br />A little more <em>right here.</em></p><a className="px-round-link" href="#px-feel"><span>Take a<br />look around</span><span aria-hidden="true">↓</span></a><a className="px-pill px-pill-light" href="#px-stay">Find your kind of stay <span aria-hidden="true">↗</span></a></div>
        <svg className="px-shoreline-edge" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0 66C200 90 310 15 560 40S1000 105 1440 28V90H0Z" /></svg>
      </section>

      <section className="px-breathe px-wrap" id="px-feel" aria-labelledby="px-breathe-title">
        <div className="px-chapter px-reveal"><span>01</span><p>Leave a little behind</p><i aria-hidden="true" /></div>
        <div className="px-breathe-heading px-reveal"><h2 id="px-breathe-title">First,<br /><em>exhale.</em></h2><div><Sun /><p>Getting away should feel like<br /><strong>actually getting away.</strong></p></div></div>
        <div className="px-morning-story">
          <figure className="px-morning-portrait px-reveal"><Image src="/paradise/birthday-cabin.jpg" alt="A guest enjoying a drink in the doorway of a lakeside cabin" fill sizes="(min-width: 800px) 39vw, 83vw" /><figcaption>Stay here a minute.</figcaption></figure>
          <div className="px-morning-copy px-reveal"><p className="px-eyebrow">You made it.</p><h3>The coffee&apos;s warm.<br />The lake&apos;s right there.<br /><em>The day can wait.</em></h3><p>Follow the trees down to the water. Put your phone away for a while. This quiet corner of Lake Texoma has a way of making a weekend feel a little longer.</p><Link className="px-underlink" href="/plan-your-visit">Get to know the place <span aria-hidden="true">↗</span></Link></div>
          <figure className="px-morning-inset px-reveal"><Image src="/paradise/morning-coffee.jpg" alt="A pair of deck chairs facing a golden Lake Texoma sunset" fill sizes="(min-width: 800px) 37vw, 73vw" /><figcaption>Save a seat for sunset.</figcaption></figure>
          <svg className="px-meander" viewBox="0 0 600 800" fill="none" aria-hidden="true"><path d="M60 10C-80 210 520 95 425 260S40 290 90 455s525 160 385 335" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 8" /><path d="m458 777 17 13 22-8" stroke="currentColor" strokeWidth="1.5" /></svg>
        </div>
      </section>

      <section className="px-feeling" id="px-yours" aria-labelledby="px-feeling-title">
        <div className="px-wrap px-feeling-heading px-reveal"><div className="px-chapter"><span>02</span><p>Find your own pace</p><i aria-hidden="true" /></div><h2 id="px-feeling-title">What does your<br /><em>Paradise feel like?</em></h2><p>There&apos;s no right way to spend a lake day.<br />Just the way that feels like you.</p></div>
        <ParadiseMood />
      </section>

      <section className="px-sleep px-wrap" id="px-stay" aria-labelledby="px-sleep-title">
        <div className="px-sleep-heading px-reveal"><div><div className="px-chapter"><span>03</span><p>Make yourself at home</p><i aria-hidden="true" /></div><h2 id="px-sleep-title">Stay a<br /><em>little longer.</em></h2></div><p>A porch by the water.<br />Your favorite camper.<br />A tent beneath the stars.<br /><strong>Pick your kind of good night.</strong></p></div>
        <ParadiseStays stays={stays} />
        <div className="px-stay-footnote"><Link href="/stay">The details on every stay <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="px-wander" id="px-outside" aria-labelledby="px-wander-title">
        <div className="px-wrap px-wander-grid">
          <div className="px-wander-copy px-reveal"><div className="px-chapter"><span>04</span><p>Let the day unfold</p><i aria-hidden="true" /></div><h2 id="px-wander-title">A whole lot<br />of<em>nothing</em>to do.</h2><p>And somehow, the best kind of day. A paddle along the shoreline. An afternoon in a hammock. A deer wandering past. One more story around the fire.</p><Link className="px-underlink" href="/plan-your-visit">Follow your curiosity <span aria-hidden="true">↗</span></Link></div>
          <div className="px-wander-collage"><figure className="px-wander-main px-reveal"><Image src="/paradise/pavilion-detail.jpg" alt="A guest relaxing in a hammock in the shaded hammock garden" fill sizes="(min-width: 800px) 37vw, 77vw" /><figcaption>Doing nothing. Doing it well.</figcaption></figure><figure className="px-wander-small px-reveal"><Image src="/paradise/tent-under-stars.jpg" alt="A deer resting in the grass at Paradise on Lake Texoma" fill sizes="(min-width: 800px) 23vw, 48vw" /><figcaption>The neighbors are pretty quiet.</figcaption></figure><Sun className="px-wander-sun" /></div>
        </div>
        <div className="px-wander-notes px-wrap"><span>Kayaks &amp; paddleboards</span><i aria-hidden="true">✳</i><span>Hammock garden</span><i aria-hidden="true">✳</i><span>Community firepit</span><i aria-hidden="true">✳</i><span>Private boat ramp</span></div>
      </section>

      <section className="px-company px-wrap" aria-labelledby="px-company-title"><figure className="px-company-photo px-reveal"><Image src="/paradise/camp-grill.jpg" alt="A guest and her dog spending time outside a Paradise cabin" fill sizes="(min-width: 800px) 30vw, 72vw" /></figure><div className="px-company-copy px-reveal"><p className="px-eyebrow">Good days. Better company.</p><h2 id="px-company-title">Bring your people.<br /><em>And your best friend.</em></h2><p>Room to reconnect, run around, or simply be together. Dog-friendly stays mean the whole crew can find their Paradise.</p><Link className="px-underlink" href="/plan-your-visit">A few things to know before you go <span aria-hidden="true">↗</span></Link></div><span className="px-company-note" aria-hidden="true">paws welcome ♡</span></section>

      <section className="px-dusk" id="px-return" aria-labelledby="px-dusk-title"><Image src="/paradise/morning-coffee.jpg" alt="The sun setting over Lake Texoma beyond an empty pair of deck chairs" fill sizes="100vw" /><div className="px-dusk-shade" /><div className="px-dusk-copy px-reveal"><span className="px-eyebrow">Close enough for a weekend. Far enough to feel it.</span><h2 id="px-dusk-title">You&apos;ll know<br />when you&apos;ve<br /><em>found it.</em></h2><p>However you lake, you&apos;ll find your Paradise here.</p><a className="px-pill px-pill-light" href="#px-stay">Let&apos;s find your stay <span aria-hidden="true">↗</span></a></div><div className="px-dusk-bottom"><span>Paradise on Lake Texoma</span><span>Pottsboro, Texas</span><span>This is your sign to get away.</span></div></section>
    </ParadiseJourney>
  );
}
