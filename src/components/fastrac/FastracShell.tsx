import type { ReactNode } from "react";
import type { AlertItem, BrandConfig } from "@/config/types";
import { AlertBar, Header } from "@/components/Header";

export function FastracShell({ children, brand, alert }: { children: ReactNode; brand: BrandConfig; alert: AlertItem | null }) {
  return (
    <div className="fastrac-site" data-brand="fastrac">
      <AlertBar alert={alert} brand="fastrac" />
      <Header brand={brand} />
      <main>{children}</main>
      <section className="fc-contact" id="contact">
        <div>
          <p className="fc-eyebrow">Your next good lake story starts here</p>
          <h2>See you<br /><em>at the dock.</em></h2>
          <p>Two tickets or the whole boat? Tell us what you have in mind. We’ll help with the rest.</p>
        </div>
        <div className="fc-contact-actions">
          <a href={`tel:${brand.nap.phoneE164}`} className="fc-phone">{brand.nap.phone}</a>
          <a href="https://texomadestinations.com/things-to-do#/charters-cruises" className="fc-button">Find your next cruise ↗</a>
          <a href={brand.nap.googleMapsUrl} className="fc-text-link">Lighthouse Marina · Pottsboro, Texas →</a>
        </div>
      </section>
    </div>
  );
}
