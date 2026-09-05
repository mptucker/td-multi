import Image from "next/image";
import type { BrandConfig } from "@/config/types";
import { hubUrl } from "@/config/hub-links";

export function MembershipBand({ brand }: { brand: BrandConfig }) {
  const islandView = brand.slug === "island-view";
  return (
    <section className={`tap-band ${islandView ? "tap-band-island" : ""}`} aria-labelledby="tap-heading">
      <div className="container grid items-center gap-6 py-9 md:grid-cols-[auto_1fr_auto] md:py-11">
        <Image
          src="/brands/tap-pass.png"
          alt="Texoma Access Pass"
          width={600}
          height={300}
          className="h-16 w-auto md:h-20"
        />
        <div>
          <p className="eyebrow !text-current">One pass. More Lake Texoma.</p>
          <h2 id="tap-heading" className="mt-1 text-2xl font-bold md:text-3xl">
            {islandView ? "Come back all year with TAP." : "Get more from every Texoma trip."}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-80 md:text-base">
            {islandView
              ? "TAP memberships include free day use at Island View and Paradise, plus savings on stays, rentals, cruises and more across the Texoma Destinations family."
              : "TAP members unlock day-use access and savings on stays, rentals, cruises and experiences across the Texoma Destinations family."}
          </p>
        </div>
        <a href={hubUrl("tap", brand, { campaign: "sitewide-tap" })} className="btn tap-band-button whitespace-nowrap">
          Explore TAP membership <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
