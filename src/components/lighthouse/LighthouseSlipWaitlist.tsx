import type { BrandConfig } from "@/config/types";

const BOLLARD_WAITLIST = "https://bollard.texomadestinations.com/slip-waitlist?embed=1";

export function LighthouseSlipWaitlist({ brand }: { brand: BrandConfig }) {
  return (
    <section id="slip-waitlist" className="lh-slip-waitlist" aria-labelledby="lh-slip-waitlist-title">
      <div className="lh-container lh-slip-waitlist-layout">
        <div className="lh-slip-waitlist-copy">
          <p className="lh-eyebrow">Boat slip waiting list</p>
          <h2 id="lh-slip-waitlist-title">Tell us what<br /><em>fits your boat.</em></h2>
          <p>
            Share your boat details and the kind of space you need. Your request goes directly to
            Bollard, our marina team&apos;s slip-management system.
          </p>
          <p className="lh-small">
            Already joined? Submit the form again to update your details without losing your place.
          </p>
          <a className="lh-text-link" href={`tel:${brand.nap.phoneE164}`}>
            Questions? Call {brand.nap.phone}
          </a>
        </div>
        <div className="lh-slip-waitlist-frame">
          <iframe
            src={BOLLARD_WAITLIST}
            title="Lighthouse Resort & Marina boat slip waiting list"
            loading="lazy"
          />
          <a href="https://bollard.texomadestinations.com/slip-waitlist" target="_blank" rel="noreferrer">
            Open the waiting list form in a new window
          </a>
        </div>
      </div>
    </section>
  );
}
