import Image from "next/image";
import Link from "next/link";
import type { BrandConfig } from "@/config/types";
import { hubUrl } from "@/config/hub-links";
import { ParadiseJourney, ParadiseMood, ParadiseStays, type ParadiseStay } from "./ParadiseExperience";

function Shoreline({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 110" fill="none" aria-hidden="true">
      <path d="M1 58c70-85 130 85 205 0s130 85 205 0 120 65 188 0M1 76c70-85 130 85 205 0s130 85 205 0 120 65 188 0" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ParadiseHome({ brand }: { brand: BrandConfig }) {
  const stays: ParadiseStay[] = [
    {
      name: "Glamping", invitation: "Your porch. Your pace.",
      description: "Wake up close to the water in a Kabana, Kasita or Kima. A real bed, a little outdoor space and a view worth lingering over. Bathrooms and showers are in the shared bathhouse.",
      image: "/paradise/glamping-guest-lake.jpg", alt: "An A-frame glamping cabin overlooking Lake Texoma",
      detail: "Kabanas · Kasitas · Kimas", note: "Pack light. Settle in.",
      href: hubUrl("cabins", brand, { campaign: "paradise-stays", content: "glamping" }),
    },
    {
      name: "Cabins", invitation: "A place to come back to.",
      description: "Come in from the lake and make yourself at home. Choose a cozy cabin, or settle into the Paradise Express: a real 1920s train car with its own story to tell.",
      image: "/paradise/lake-evening-with-dog.jpg", alt: "A small wood cabin beneath the trees at Paradise",
      detail: "Cabins · The Paradise Express", note: "A good night, your way.",
      href: hubUrl("cabins", brand, { campaign: "paradise-stays", content: "cabins" }),
    },
    {
      name: "RV sites", invitation: "Bring your favorite little home.",
      description: "A shaded loop or a spot near the water. Park the camper, unfold the chairs and make yourself comfortable. Vintage campers fit right in here.",
      image: "/paradise/aerial-rv-loop.jpg", alt: "RV sites along the wooded shoreline at Paradise on Lake Texoma",
      detail: "Shaded loops · Waterfront sites", note: "Same home. A better view.",
      href: hubUrl("rv", brand, { campaign: "paradise-stays", content: "rv" }),
    },
    {
      name: "Camping", invitation: "Leave room for the stars.",
      description: "Carry the tent down to our primitive shoreline sites. No hookups, just a quieter corner of Paradise. Pack in your water; restrooms and showers are back at the main camp.",
      image: "/paradise/dog-friendly-stay.jpg", alt: "A softly lit tent beneath a star-filled sky",
      detail: "Primitive tent sites · Shoreline", note: "The simplest kind of getaway.",
      href: hubUrl("tents", brand, { campaign: "paradise-stays", content: "tents" }),
    },
  ];

  return (
    <ParadiseJourney>
      <section className="px-arrival" id="px-arrive" aria-labelledby="px-title">
        <div className="px-arrival-photo px-parallax" data-parallax>
          <Image src="/paradise/glamping-porch-lake.jpg" alt="A quiet porch, shade trees and Lake Texoma just beyond at Paradise" fill priority sizes="100vw" />
        </div>
        <div className="px-arrival-wash" />
        <div className="px-arrival-location"><span>Paradise on Lake Texoma</span><span>Pottsboro, Texas</span></div>
        <div className="px-arrival-intro"><p>Leave a little<br />behind.</p><a href="#px-exhale" aria-label="Follow the story to the lake">Follow the lake <span aria-hidden="true">↓</span></a></div>
        <div className="px-arrival-title">
          <p className="px-arrival-script">However you lake.</p>
          <h1 id="px-title"><span>Find your</span>Paradise<span className="px-title-dot">.</span></h1>
        </div>
        <div className="px-arrival-bottom"><span>A secluded escape. A very warm welcome.</span><a href={hubUrl("cabins", brand, { campaign: "paradise-hero" })}>Find a place to stay <span aria-hidden="true">↗</span></a></div>
      </section>

      <section className="px-exhale" id="px-exhale" aria-labelledby="px-exhale-title">
        <div className="px-wrap px-exhale-story">
          <figure className="px-exhale-portrait px-reveal">
            <Image src="/paradise/birthday-cabin.jpg" alt="A guest taking a quiet moment with a drink in her cabin doorway" fill sizes="(min-width: 900px) 36vw, 75vw" />
          </figure>
          <div className="px-exhale-copy px-reveal"><p className="px-eyebrow">You made it</p><h2 id="px-exhale-title">Nothing on the clock.<br /><em>Everything to feel.</em></h2><Shoreline /><p className="px-exhale-phrase">The coffee&apos;s warm. The lake&apos;s right there. <strong>The day can wait.</strong></p><div>Getting away should feel like actually getting away. Two hundred wooded acres, a quiet shoreline and room to settle into your own rhythm.</div><Link className="px-link" href="/plan-your-visit">Get to know Paradise <span aria-hidden="true">↗</span></Link></div>
          <figure className="px-exhale-landscape px-parallax px-reveal" data-parallax><Image src="/paradise/hammock-pavilion.jpg" alt="String lights and trees framing Lake Texoma" fill sizes="(min-width: 900px) 58vw, 100vw" /><figcaption>Nowhere else you need to be.</figcaption></figure>
        </div>
      </section>

      <section className="px-discover" id="px-discover" aria-labelledby="px-discover-title">
        <ParadiseMood />
      </section>

      <section className="px-stays" id="px-stay" aria-labelledby="px-stay-title">
        <div className="px-wrap px-stays-heading px-reveal"><p className="px-eyebrow">Put your bags down</p><h2 id="px-stay-title">Make yourself <em>right at home.</em></h2><p>A little porch. Your favorite camper. A tent under the stars. How you stay is up to you.</p></div>
        <ParadiseStays stays={stays} />
        <div className="px-wrap px-stays-fineprint"><span>Reservations are completed with Texoma Destinations.</span><Link className="px-link" href="/stay">All the details on staying here <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="px-outside" id="px-outside" aria-labelledby="px-outside-title">
        <div className="px-wrap px-outside-layout">
          <figure className="px-outside-photo px-parallax px-reveal" data-parallax><Image src="/paradise/pavilion-detail.jpg" alt="A guest relaxing in a hammock at Paradise" fill sizes="(min-width: 900px) 58vw, 100vw" /></figure>
          <div className="px-outside-heading px-reveal"><p className="px-eyebrow">No itinerary required</p><h2 id="px-outside-title">A whole lot of <em>nothing</em> to do.</h2></div>
          <div className="px-outside-copy px-reveal"><p>Paddle the shoreline. Find your hammock. Watch a deer wander past. Meet your people at the community bar, then stay for one more story around the fire.</p><div className="px-outside-list"><span>Kayak &amp; paddleboard rentals</span><span>Hammock garden</span><span>Community bar &amp; firepit</span><span>Private boat ramp</span></div><Link className="px-link" href="/plan-your-visit">A little help planning your getaway <span aria-hidden="true">↗</span></Link></div>
        </div>
        <div className="px-outside-line" aria-hidden="true">A little less rush. <em>A little more lake.</em></div>
      </section>

      <div className="px-finale">
        <section className="px-together" aria-labelledby="px-together-title"><div className="px-together-photo px-parallax" data-parallax><Image src="/paradise/string-lights-lake.jpg" alt="A guest and her dog enjoying an evening beside Lake Texoma" fill sizes="100vw" /></div><div className="px-together-wash" /><div className="px-wrap px-together-copy px-reveal"><p className="px-eyebrow">The best part is who you bring</p><h2 id="px-together-title">Your people.<br /><em>Your Paradise.</em></h2><p>A weekend to reconnect. A birthday by the water. Or just a few days with your favorite company. Dog-friendly stays mean your best friend can come, too.</p><Link className="px-link" href="/groups-and-events">Bring everyone together <span aria-hidden="true">↗</span></Link><span className="px-evening-cue">And when the light starts to go&hellip; <i aria-hidden="true">↓</i></span></div></section>

        <section className="px-homeward" id="px-last-light" aria-labelledby="px-homeward-title">
          <div className="px-homeward-aerial px-parallax" data-parallax><Image src="/paradise/aerial-peninsula.jpg" alt="The wooded Paradise peninsula surrounded by Lake Texoma" fill sizes="100vw" /></div>
          <div className="px-homeward-sunset px-parallax" data-parallax><Image src="/paradise/morning-coffee.jpg" alt="Two empty chairs facing the sunset over Lake Texoma" fill sizes="100vw" /></div>
          <div className="px-homeward-wash" />
          <div className="px-homeward-thread" aria-hidden="true"><span>Late afternoon</span><i /><span>Last light</span></div>
          <div className="px-wrap px-homeward-arrive px-reveal"><p className="px-eyebrow">On the quiet side of Lake Texoma</p><h2 id="px-homeward-title">Secluded.<br /><em>Not isolated.</em></h2><p>Close enough for the weekend.<br />Far enough to feel it.</p><a className="px-link" href={brand.nap.googleMapsUrl} data-intent="directions">Find us in {brand.nap.city}, {brand.nap.region} <span aria-hidden="true">↗</span></a><address>{brand.nap.streetAddress}<br />{brand.nap.city}, {brand.nap.region} {brand.nap.postalCode}</address></div>
          <div className="px-homeward-pause px-reveal"><span>The lake gets quiet.</span><strong>You stay.</strong></div>
          <div className="px-wrap px-homeward-last px-reveal"><p className="px-eyebrow">There&apos;s always one more sunset</p><h2>You&apos;ll know<br />when you&apos;ve<br /><em>found it.</em></h2><p>However you lake,<br />you&apos;ll find your Paradise here.</p><div className="px-booking-links"><a href={hubUrl("cabins", brand, { campaign: "paradise-finale", content: "cabins" })} data-intent="cabins">Find glamping &amp; cabins <span aria-hidden="true">↗</span></a><a href={hubUrl("rv", brand, { campaign: "paradise-finale", content: "rv" })} data-intent="rv">Bring your RV <span aria-hidden="true">↗</span></a><a href={hubUrl("tents", brand, { campaign: "paradise-finale", content: "tents" })} data-intent="tents">Pitch your tent <span aria-hidden="true">↗</span></a></div></div>
          <div className="px-last-light-signature"><Shoreline /><span>this is Paradise</span></div>
        </section>
      </div>
    </ParadiseJourney>
  );
}
