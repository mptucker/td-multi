import Link from "next/link";
import type { BrandConfig, BrandContent } from "@/config/types";
import { BreadcrumbJsonLd } from "@/components/Sections";
import { LighthouseMotion } from "./LighthouseInteractions";
import { LighthouseNext, LighthousePhoto } from "./LighthouseShared";
import { lighthouseImage } from "./data";
import { LighthouseInquiryForm } from "./LighthouseInquiryForm";

type Props = { brand: BrandConfig; content: BrandContent };

export function LighthouseGroupsPage({ brand, content }: Props) {
  const eventsPhone = content.groups?.contactPhone || brand.nap.phone;
  const eventsPhoneHref = `+1${eventsPhone.replace(/\D/g, "")}`;
  const hero = lighthouseImage(content, "groupsHero", { src: "/lighthouse/events/groups-hero-cruise.webp", alt: "A group enjoying an evening cruise on Lake Texoma" });
  const fishing = lighthouseImage(content, "groupsFishing", { src: "/lighthouse/events/groups-fishing.webp", alt: "A company fishing group gathered around the day's catch" });
  const family = lighthouseImage(content, "groupsFamily", { src: "/lighthouse/events/groups-family.webp", alt: "A family relaxing by a fire outside a Lighthouse cabin" });
  const cruise = lighthouseImage(content, "groupsCruise", { src: "/lighthouse/events/groups-cruise.webp", alt: "Guests sharing a meal aboard a Lake Texoma cruise" });
  const lodging = lighthouseImage(content, "groupsLodging", { src: "/lighthouse/events/groups-lodging.webp", alt: "The shared porch outside Lighthouse cabins" });
  const lodge = lighthouseImage(content, "lodgeExterior", { src: "/lighthouse/events/lodge-exterior.webp", alt: "The Lighthouse Lodge among oak trees" });
  const moment = lighthouseImage(content, "lodgeHero", { src: "/lighthouse/events/lodge-hero.webp", alt: "A group enjoying time together on the Lighthouse Lodge deck" });

  return <div className="lh-site lh-groups-page">
    <LighthouseMotion />
    <BreadcrumbJsonLd brand={brand} page="groups" path="/groups-and-events" />
    <section className="lh-groups-hero">
      <LighthousePhoto src={hero.src} alt={hero.alt} priority />
      <div className="lh-groups-hero-shade" />
      <div className="lh-groups-hero-copy"><Link className="lh-breadcrumb" href="/">Lighthouse <span aria-hidden>/</span> Groups & getaways</Link><p className="lh-eyebrow">Groups & getaways at Lighthouse</p><h1>Bring your people.<br /><em>Make a weekend of it.</em></h1><p>Company fishing weekends, family reunions, and celebrations that deserve a little more time together. Bring your group to Lake Texoma—we’ll help you explore the possibilities.</p><div className="lh-actions"><a className="lh-button lh-button-red" href="#group-inquiry">Plan your group getaway <span aria-hidden>↗</span></a><a className="lh-button lh-button-white" href="#possibilities">Explore the possibilities <span aria-hidden>↓</span></a></div></div>
    </section>

    <section className="lh-groups-story lh-container lh-reveal"><div><p className="lh-eyebrow">The whole trip, in one place</p><h2>Arrive. Settle in.<br /><em>Stay a little longer.</em></h2></div><ol><li><span>01</span><strong>Settle in</strong><p>Cabins and RV sites keep the group near the lake and close to one another.</p></li><li><span>02</span><strong>Get on the water</strong><p>Explore fishing and cruise possibilities that turn a gathering into a Lake Texoma story.</p></li><li><span>03</span><strong>Gather again</strong><p>Share a meal, a deck, a celebration, and the time between scheduled activities.</p></li></ol></section>

    <section id="possibilities" className="lh-groups-chapters">
      <article className="lh-groups-chapter"><LighthousePhoto src={fishing.src} alt={fishing.alt} /><div><span>01 · Company fishing weekends</span><h2>Trade the meeting room<br /><em>for the water.</em></h2><p>Spend the day fishing, then come back to somewhere the group can eat, talk, and compare the one that got away. Lodging nearby makes it easier to keep the weekend together.</p></div></article>
      <article className="lh-groups-chapter"><LighthousePhoto src={family.src} alt={family.alt} /><div><span>02 · Family reunions</span><h2>Room to reconnect.<br /><em>Nothing to rush.</em></h2><p>Give every generation time to settle in, wander toward the lake, share an activity, and find their way back to the fire. Cabins and RV sites offer different ways to stay close.</p></div></article>
      <article className="lh-groups-chapter"><LighthousePhoto src={cruise.src} alt={cruise.alt} /><div><span>03 · Group cruises</span><h2>Put everyone<br /><em>in the same boat.</em></h2><p>A cruise can bring the group together on the water for conversation, scenery, and a shared Lake Texoma experience. Ask the team to help you explore the current options.</p></div></article>
      <article className="lh-groups-chapter"><LighthousePhoto src={lodging.src} alt={lodging.alt} /><div><span>04 · Lodging</span><h2>Your own space.<br /><em>One home base.</em></h2><p>Mix cabins and RV sites around the way your group travels. Individual amenities and availability vary, so choose the stay that fits each part of the crew.</p><div className="lh-actions"><Link className="lh-text-link" href="/cabins">Explore cabins <span aria-hidden>↗</span></Link><Link className="lh-text-link" href="/rv-sites">Explore RV sites <span aria-hidden>↗</span></Link></div></div></article>
    </section>

    <section className="lh-groups-lodge lh-container lh-reveal"><Link href="/lodge" className="lh-groups-lodge-photo"><LighthousePhoto src={lodge.src} alt={lodge.alt} /><span>Explore the Lodge <i aria-hidden>↗</i></span></Link><div><p className="lh-eyebrow">A gathering place at the heart of the trip</p><h2>The Lodge<br /><em>at Lighthouse.</em></h2><p>Bring everyone together for group meals, meetings, celebrations, and weddings—with an indoor venue, a covered deck, and the lake right outside.</p><p>See capacity, amenities, kitchen details, photography, and the optional Cove Point ceremony setting on the dedicated Lodge page.</p><Link className="lh-button lh-button-red" href="/lodge">Explore the Lodge <span aria-hidden>↗</span></Link></div></section>

    <section className="lh-groups-moment"><LighthousePhoto src={moment.src} alt={moment.alt} /><div><p className="lh-eyebrow">Celebrations & shared moments</p><h2>Leave a little room<br /><em>for nothing at all.</em></h2><p>Meals, games, conversations on the deck, and time between the things you planned—that is often where the trip becomes the memory.</p></div></section>

    <section id="group-inquiry" className="lh-lodge-inquiry lh-groups-inquiry"><div className="lh-lodge-inquiry-intro"><p className="lh-eyebrow">Start with the people</p><h2>Let’s plan something worth getting everyone together for.</h2><p>Tell us the shape of the trip. We’ll help you explore lodging, fishing, cruises, gathering space, and the right next conversation—without assuming a fixed package or guaranteed availability.</p><a className="lh-text-link" href={`tel:${eventsPhoneHref}`}>Prefer to call? {eventsPhone} <span aria-hidden>↗</span></a></div><LighthouseInquiryForm variant="group" /></section>
    <div className="lh-container lh-next-pair"><LighthouseNext href="/lodge" label="Need a gathering space?" title="Tour the Lighthouse Lodge" /><LighthouseNext href="/property-map" label="Picture the whole trip" title="Explore the property map" /></div>
  </div>;
}
