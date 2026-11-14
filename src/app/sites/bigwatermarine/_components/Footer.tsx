import Image from "next/image";
import Link from "next/link";
import Motif from "@/bigwatermarine/components/Motif";
import logo from "@public/brand/logo-white-teal.png";
import { config, smsHref } from "@/bigwatermarine/lib/config";

const columns = [
  {
    title: "Boats",
    links: [
      ["All inventory", "/inventory/"],
      ["Scout", "/scout/"],
      ["Veranda", "/veranda/"],
      ["Highfield", "/highfield/"],
      ["Berkshire", "/berkshire/"],
      ["Financing", "/financing/"],
      ["Fleet sales", "/fleet-sales/"],
      ["All brands", "/brands/"],
      ["Boat buying guide", "/lake-texoma-boat-buying-guide/"],
      ["New vs used cost", "/new-vs-used-boat-cost/"],
    ],
  },
  {
    title: "Service",
    links: [
      ["Marine service", "/service/"],
      ["Winterization", "/winterize/"],
      ["Storage", "/storage/"],
      ["Book service", config.windlassIntakeUrl],
    ],
  },
  {
    title: "Big Water",
    links: [
      ["Boat Club", "/boatclub/"],
      ["Rentals", "/keepboating/"],
      ["vs Freedom Boat Club", "/big-water-boat-club-vs-freedom-boat-club/"],
      ["Who we are", "/about/"],
      ["FAQ", "/faq/"],
      ["Contact", "/contact/"],
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="bwm-footer">
      <div className="bwm-wrap bwm-footerInner">
        <div className="bwm-footerBrand">
          <Image src={logo} alt="Big Water Marine" sizes="200px" className="bwm-footerLogo" />
          <p>
            Boat sales, factory-authorized service and Big Water Boat Club on Lake Texoma.
          </p>
          <p className="bwm-footerContact">
            <a href={`tel:${config.phoneE164}`}>Call {config.phone}</a>
            <a href={smsHref()}>Text {config.phone}</a>
          </p>
          <p className="bwm-footerAddr">
            Sales: 50055 N State Hwy 289, Pottsboro, TX 75076<br />
            Service: 33 Tackle Box Dr, Pottsboro, TX 75076
          </p>
        </div>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title} className="bwm-footerCol">
            <h2>{c.title}</h2>
            {c.links.map(([label, href]) =>
              href.startsWith("http") ? <a key={label} href={href}>{label}</a> : <Link key={label} href={href}>{label}</Link>,
            )}
          </nav>
        ))}
        <div className="bwm-footerBase">
          <Motif className="bwm-footerMotif" lineColor="var(--bwm-teal)" barColor="rgba(255,255,255,.2)" />
          <p>© {new Date().getFullYear()} Big Water Marine · Pottsboro, Texas</p>
        </div>
      </div>
    </footer>
  );
}
