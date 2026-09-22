import Image from "next/image";
import Link from "next/link";

export const fastracCruises = [
  { slug: "texie-cruise", title: "Discovering Texie Cruise", category: "Family experience", image: "/fastrac/texie.png", description: "A family-friendly cruise with Lake Texoma's legendary dragon, stories, activities and fun on the water." },
  { slug: "eagle-watching-breakfast-cruise", title: "Eagle Watching Breakfast Cruise", category: "Seasonal cruise", image: "/fastrac/eagle.png", description: "Search for wintering bald eagles while enjoying breakfast aboard the Island Girl." },
  { slug: "lake-tour-experience", title: "Lake Tour Experience", category: "Public cruise", image: "/fastrac/island-girl-aerial-current.jpg", description: "A narrated 90-minute tour of the lake, marinas, islands, homes and Denison Dam." },
  { slug: "murder-mystery-cruise", title: "Murder Mystery Cruise", category: "Themed dinner cruise", image: "/fastrac/murder-mystery.jpg", description: "A classic whodunit unfolds around you while dinner is served on Lake Texoma." },
  { slug: "cupids-arrow-dinner-cruise", title: "Cupid's Arrow Dinner Cruise", category: "Seasonal dinner cruise", image: "/fastrac/cupids-arrow.jpg", description: "An intimate Valentine's cruise with dinner, live music and the lake after dark." },
  { slug: "lake-day-experience", title: "Lake Day Experience", category: "Private experience", image: "/fastrac/guests-sunset-current.jpg", description: "A captain, a boat and a secluded beach—your own four-hour Lake Texoma day." },
];

const scheduleUrl = "https://texomadestinations.com/things-to-do#/charters-cruises";

export function FastracHome() {
  return (
    <>
      <section className="fc-opening">
        <Image src="/fastrac/guests-sunset-current.jpg" alt="Island Girl cruising Lake Texoma in the evening light" fill priority sizes="100vw" />
        <div className="fc-opening-shade" />
        <div className="fc-wide fc-opening-copy">
          <p className="fc-eyebrow">Fastrac Charters &amp; Cruises · Lake Texoma</p>
          <h1>The best part<br />is <em>out there.</em></h1>
          <p>A little farther from shore.<br />A little closer to your people.</p>
          <a href={scheduleUrl} className="fc-button">Find your cruise <span aria-hidden>↗</span></a>
        </div>
        <div className="fc-opening-bottom fc-wide">
          <span>Sunset cruises · Private charters · Lake days</span>
          <a href="#aboard">Leave the shore behind <span aria-hidden>↓</span></a>
        </div>
      </section>

      <section className="fc-away" id="aboard">
        <svg className="fc-wake" viewBox="0 0 1200 500" fill="none" aria-hidden="true"><path d="M-80 360C240 520 570-90 885 155S1140 610 1290 230" /><path d="M-80 390C240 550 570-60 885 185S1140 640 1290 260" /><path d="M-80 420C240 580 570-30 885 215S1140 670 1290 290" /></svg>
        <div className="fc-wide fc-away-grid">
          <div className="fc-away-copy">
            <p className="fc-eyebrow">You bring the people. We bring the lake.</p>
            <h2>Some days deserve<br />a different<br /><em>point of view.</em></h2>
            <p>The dock slips away. Someone opens the cooler. The conversation gets a little easier. And suddenly, an ordinary evening is the one you’ll talk about all week.</p>
            <p>That’s what we do. Public cruises, private celebrations and unhurried days on Lake Texoma—with a captain who knows the way.</p>
            <a href="#your-day" className="fc-story-link">Find your kind of lake day <span aria-hidden>↓</span></a>
          </div>
          <figure className="fc-memory fc-memory-main">
            <div><Image src="/fastrac/island-girl-guest-2-current.jpg" alt="A couple taking in the Lake Texoma view from Island Girl" fill sizes="(min-width: 800px) 40vw, 85vw" /></div>
            <figcaption>Now this is our kind of evening.</figcaption>
          </figure>
          <figure className="fc-memory fc-memory-small">
            <div><Image src="/fastrac/guests-family-current.jpg" alt="A young guest visiting the Island Girl wheelhouse" fill sizes="(min-width: 800px) 22vw, 50vw" /></div>
            <figcaption>Little moments. Big memories.</figcaption>
          </figure>
        </div>
        <p className="fc-away-word" aria-hidden="true">ALL ABOARD.</p>
      </section>

      <section className="fc-choose" id="your-day">
        <div className="fc-wide">
          <div className="fc-choose-heading">
            <div><p className="fc-eyebrow">A seat with a better view</p><h2>Make a little<br /><em>room for the lake.</em></h2></div>
            <div><p>Just the two of you? The kids, too? Come aboard a scheduled cruise and let us take it from here.</p><a href={scheduleUrl} className="fc-story-link">See what’s sailing next <span aria-hidden>↗</span></a></div>
          </div>
          <div className="fc-cruise-scenes">
            <Link href="/public-cruises" className="fc-scene fc-scene-evening">
              <Image src="/fastrac/guests-sunset-current.jpg" alt="Island Girl on the open water beneath a sunset sky" fill sizes="(min-width: 760px) 58vw, 100vw" />
              <div><span>For the golden hours</span><h3>Stay for<br />the sunset.</h3><p>Dinner, a lake breeze and nowhere else to be.</p><strong>Explore public cruises ↗</strong></div>
            </Link>
            <Link href="/cruises/texie-cruise" className="fc-scene fc-scene-family">
              <Image src="/fastrac/guests-family-current.jpg" alt="A child at the wheel on an Island Girl family outing" fill sizes="(min-width: 760px) 32vw, 100vw" />
              <div><span>For the little adventurers</span><h3>Big lake.<br />Bigger stories.</h3><p>Meet Texie, the friendly legend of Lake Texoma.</p><strong>Discover the Texie cruise ↗</strong></div>
            </Link>
          </div>
          <div className="fc-sailing-list">
            <p>A few more reasons<br /><strong>to come aboard.</strong><span>Seasonal experiences vary. Check the live schedule for dates.</span></p>
            <div>{fastracCruises.filter((cruise) => cruise.slug !== "texie-cruise").map((cruise, index) => <Link key={cruise.slug} href={`/cruises/${cruise.slug}`}><span>0{index + 1}</span><h3>{cruise.title}</h3><small>{cruise.category}</small><b aria-hidden>↗</b></Link>)}</div>
          </div>
        </div>
      </section>

      <section className="fc-celebrate">
        <div className="fc-celebrate-photo"><Image src="/fastrac/island-girl-aerial-current.jpg" alt="Guests gathered on the upper deck of Island Girl at Lighthouse Marina" fill sizes="100vw" /><div /><p>YOUR PEOPLE.<br /><em>Your whole boat.</em></p></div>
        <div className="fc-charter-story fc-wide">
          <div className="fc-charter-stamp"><span>Made for</span><strong>your<br />occasion.</strong><span>Lake Texoma · Fastrac</span></div>
          <div><p className="fc-eyebrow">Private charters · Two to seventy guests</p><h2>Bring everyone<br /><em>worth celebrating.</em></h2><p>The birthday that deserves more than a table. The team that needs an afternoon together. The wedding guests who traveled all this way.</p><p>Make the boat yours. We’ll help match your group with the right boat, food and time on the water—and bring the captain and crew.</p><Link href="/private-charters" className="fc-button">Plan your private charter <span aria-hidden>↗</span></Link></div>
        </div>
        <div className="fc-fleet-line fc-wide"><div><strong>70</strong><span>guests on Island Girl</span></div><div><strong>36</strong><span>guests on Sight-Sea-Er II</span></div><div><strong>2–18</strong><span>small-group options</span></div><Link href="/experiences">Find your fit <span aria-hidden>↗</span></Link></div>
      </section>

      <section className="fc-detour">
        <div className="fc-detour-photo"><Image src="/water-taxi/jolt.webp" alt="The Jolt Texoma Water Taxi ready at the dock" fill sizes="(min-width: 800px) 52vw, 100vw" /></div>
        <div className="fc-detour-copy"><p className="fc-eyebrow">A little detour? We know a boat.</p><h2>Dock to dinner.<br />Shore to island.<br /><em>You to anywhere.</em></h2><p>Our Texoma Water Taxi is the easy way around the lake. Catch a ride, find your beach, or make a whole day of it.</p><a href="https://texomawatertaxi.com/" className="fc-story-link">Meet Texoma Water Taxi <span aria-hidden>↗</span></a></div>
      </section>

      <section className="fc-before fc-wide">
        <div><p className="fc-eyebrow">Before we cast off</p><h2>A few good<br />things to know.</h2></div>
        <div>
          <details><summary>Where do we meet?<span aria-hidden>+</span></summary><p>Public cruises depart from the Fastrac charter dock at Lighthouse Marina, 300 Lighthouse Drive in Pottsboro, Texas. Arrive at least 15 minutes before departure.</p></details>
          <details><summary>Can we bring our own drinks?<span aria-hidden>+</span></summary><p>Adult beverages are BYOB unless your event listing says otherwise. Check the details for your cruise before you pack the cooler.</p></details>
          <details><summary>What if we want the whole boat?<span aria-hidden>+</span></summary><p>We have private charter options for small groups through celebrations of up to 70 guests. <Link href="/private-charters">Explore the fleet</Link> or call 903.361.0775 to plan your trip.</p></details>
          <details><summary>What’s on the calendar?<span aria-hidden>+</span></summary><p>Public cruises and seasonal experiences are released throughout the year. <a href={scheduleUrl}>Check the live schedule</a> for current dates, details and ticket availability.</p></details>
        </div>
      </section>
    </>
  );
}

export function FastracListing({ kind }: { kind: "public" | "private" | "experiences" }) {
  const copy = kind === "public"
    ? ["Public Cruises", "A better way to see Lake Texoma", "Sunset, dinner, sightseeing and seasonal themed cruises depart from Lighthouse Marina. The live schedule is released throughout the year."]
    : kind === "private"
      ? ["Private Charters", "Your people. Your boat. Your Lake Texoma.", "From an intimate yacht cruise to a seventy-person celebration, every charter includes a licensed captain and crew."]
      : ["Fastrac Experiences", "Choose the day you want to have", "Romantic evenings, family outings, lake tours, beach days and group celebrations—find the boat and experience that fits."];
  const cards = kind === "private"
    ? [
      { title: "Island Girl", category: "Up to 70 guests", image: "/fastrac/island-girl-dock-current.jpg", description: "Two decks, climate-controlled cabin, restrooms and room for dinner, dancing and a full celebration." },
      { title: "Sight-Sea-Er II", category: "Up to 36 guests", image: "/fastrac/sight-sea-er.jpg", description: "A 55-foot tritoon with a galley, restroom and flexible indoor-outdoor space for mid-size groups." },
      { title: "Lake Day Experience", category: "Private beach day", image: "/fastrac/guests-sunset-current.jpg", description: "Four hours with a captain and crew, a secluded island beach, and optional catering and kayaks." },
    ]
    : fastracCruises;
  return <>
    <section className="fc-page-hero"><Image src={kind === "private" ? "/fastrac/island-girl-dock-current.jpg" : "/fastrac/island-girl-aerial-current.jpg"} alt="" fill priority sizes="100vw" /><div className="fc-hero-shade"/><div className="fc-wide"><p className="fc-eyebrow">{copy[0]}</p><h1>{copy[1]}</h1><p>{copy[2]}</p></div></section>
    <section className="fc-catalog fc-wide"><div className="fc-card-grid">{cards.map((item) => <article className="fc-card" key={item.title}><div className="fc-card-image"><Image src={item.image} alt="" fill sizes="33vw" /></div><div><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p>{kind === "private" ? <a href="#contact"><strong>Ask about this boat →</strong></a> : <Link href={`/cruises/${"slug" in item ? item.slug : "lake-day-experience"}`}><strong>Learn more →</strong></Link>}</div></article>)}</div></section>
  </>;
}

export function FastracCruiseDetail({ slug }: { slug: string }) {
  const cruise = fastracCruises.find((item) => item.slug === slug);
  if (!cruise) return null;
  return <>
    <section className="fc-page-hero"><Image src={cruise.image} alt={cruise.title} fill priority sizes="100vw" /><div className="fc-hero-shade"/><div className="fc-wide"><p className="fc-eyebrow">{cruise.category}</p><h1>{cruise.title}</h1><p>{cruise.description}</p><a href="https://texomadestinations.com/things-to-do#/charters-cruises" className="fc-button">See dates &amp; reserve</a></div></section>
    <section className="fc-detail fc-wide"><div><p className="fc-eyebrow">The experience</p><h2>Come aboard Lake Texoma’s cruise company.</h2></div><div><p>{cruise.description} Cruises depart from the Fastrac charter dock at Lighthouse Marina in Pottsboro, Texas.</p><p>Arrive at least 15 minutes before departure. Public cruises are captained by a licensed USCG captain, and adult beverages are BYOB unless the event listing says otherwise.</p><a href="https://texomadestinations.com/things-to-do#/charters-cruises" className="fc-text-link">View the live schedule and ticket availability →</a></div></section>
  </>;
}
