import type { Location } from "@/components/towboatus-ntx/exact/types";
import { ShieldIcon } from "@/components/towboatus-ntx/exact/icons";
import Image from "next/image";

interface FooterProps {
  locations: Location[];
  nationalDispatchPhone: string;
}

export default function Footer({ locations, nationalDispatchPhone }: FooterProps) {
  return (
    <footer
      id="contact"
      className="bg-navy-deep border-t-[3px] border-red pt-12 pb-8 px-5"
      aria-label="Site footer"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Brand block */}
        <div className="mb-10">
          <Image
            src="/towboatus-ntx/logo-white.png"
            alt="TowBoatUS Big Water Cowboys"
            width={160}
            height={40}
            className="h-10 w-auto mb-4"
          />
          <p className="text-sm text-white/70 leading-relaxed mb-4 max-w-[420px]">
            Authorized TowBoatUS licensed service provider on Lake Texoma, Bois d&apos;Arc Lake, and
            Cedar Creek Reservoir. USCG licensed. BoatUS network member. Serving North Texas
            boaters 24/7/365.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/20 rounded px-3 py-2 text-xs font-bold tracking-wide uppercase text-white/60">
            <ShieldIcon className="w-4 h-4 text-red" aria-hidden="true" />
            USCG Licensed Operator
          </div>
        </div>

        {/* Footer columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-t border-b border-white/10 mb-8">
          {/* Emergency Lines */}
          <div>
            <h4 className="font-display text-sm font-bold tracking-wide uppercase text-white mb-4">
              Emergency Lines
            </h4>
            {locations.map((location) => (
              <div key={location.id} className="mb-4">
                <div className="text-xs font-bold tracking-wide uppercase text-white/50 mb-1">
                  {location.short_name || location.name.replace("TowBoatUS ", "")}
                </div>
                <a
                  href={`tel:+1${location.phone.replace(/[^0-9]/g, "")}`}
                  className="font-display text-lg font-bold text-white hover:text-red transition-colors"
                >
                  {location.phone}
                </a>
              </div>
            ))}
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="text-xs font-bold tracking-wide uppercase text-white/50 mb-1">
                National Dispatch
              </div>
              <a
                href={`tel:+1${nationalDispatchPhone.replace(/[^0-9]/g, "")}`}
                className="font-display text-base font-bold text-white hover:text-red transition-colors"
              >
                {nationalDispatchPhone} · VHF 16
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm font-bold tracking-wide uppercase text-white mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              {[
                "Vessel Towing",
                "Degrounding",
                "Fuel Delivery",
                "Battery Jump Start",
                "Salvage Assistance",
                "Dive Services",
                "24/7 Dispatch",
              ].map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Membership */}
          <div>
            <h4 className="font-display text-sm font-bold tracking-wide uppercase text-white mb-4">
              Membership
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.boatus.com/towing/membership?sourcecode=WT13014A"
                  target="_blank"
                  rel="noopener"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Join BoatUS
                </a>
              </li>
              <li>
                <a
                  href="https://www.boatus.com/towing/membership?sourcecode=WT13014A"
                  target="_blank"
                  rel="noopener"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Freshwater Towing Plan
                </a>
              </li>
              <li>
                <a
                  href="https://www.boatus.com/towing/membership?sourcecode=WT13014A"
                  target="_blank"
                  rel="noopener"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Saltwater Towing Plan
                </a>
              </li>
              <li>
                <a
                  href="https://www.boatus.com/insurance/"
                  target="_blank"
                  rel="noopener"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Boat Insurance
                </a>
              </li>
              <li>
                <a
                  href="#membership"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Plan Comparison
                </a>
              </li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="font-display text-sm font-bold tracking-wide uppercase text-white mb-4">
              More
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  About Big Water Cowboys
                </a>
              </li>
              <li>
                <a
                  href="#locations"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Our Lakes
                </a>
              </li>
              <li>
                <a
                  href="#network"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  TX/OK Network
                </a>
              </li>
              <li>
                <a
                  href="https://towboatuslaketexoma.com"
                  target="_blank"
                  rel="noopener"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  towboatuslaketexoma.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.boatus.com"
                  target="_blank"
                  rel="noopener"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  BoatUS.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="text-xs text-white/50 leading-relaxed">
            © {new Date().getFullYear()} Big Water Cowboys, LLC · dba TowBoatUS
            Lake Texoma, TowBoatUS Bois d&apos;Arc Lake, TowBoatUS Cedar Creek Reservoir
            <br />
            Authorized BoatUS Towing Licensed Service Provider · Lake Texoma, Texas / Oklahoma
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
