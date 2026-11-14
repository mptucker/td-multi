import { getInventory, boatPath, money } from "@/bigwatermarine/lib/boats";
import { abs } from "@/bigwatermarine/lib/seo";
import { config } from "@/bigwatermarine/lib/config";
import { WINTER_PACKAGES, LABOR } from "@/bigwatermarine/lib/service";


// llms.txt: a plain-text briefing for AI assistants (https://llmstxt.org).
export async function bigWaterMarineLlms(): Promise<Response> {
  const boats = await getInventory();
  const lines = [
    "# Big Water Marine",
    "",
    "> Boat dealer and factory-authorized marine service center on Lake Texoma in Pottsboro, Texas. Sells new and pre-owned Scout, Veranda, Highfield and Berkshire boats; services Suzuki, Yamaha, Mercury and BRP engines; runs Big Water Boat Club.",
    "",
    `- Phone (call or text): ${config.phone}`,
    "- Sales: 50055 N State Hwy 289, Pottsboro, TX 75076. Tuesday–Saturday 9am–5pm.",
    "- Service: 33 Tackle Box Dr, Pottsboro, TX 75076. Tuesday–Friday 8am–5pm, Saturday 8am–3pm.",
    "- Serves Lake Texoma, Pottsboro, Sherman, Denison, North Texas and Southern Oklahoma.",
    "",
    "## Key pages",
    `- [Boats for sale](${abs("/inventory/")}): live inventory with prices, photos and specs.`,
    `- [Marine service](${abs("/service/")}): factory-authorized service, repowers, electronics, mobile service. Labor $${LABOR.onsite}/hr at the shop, $${LABOR.mobile}/hr mobile. Book: ${config.windlassIntakeUrl}`,
    `- [Winterization](${abs("/winterize/")}): guaranteed packages ${WINTER_PACKAGES.map((p) => `${p.name} $${p.onsite}`).join(", ")}.`,
    `- Builder pages: [Scout](${abs("/scout/")}) center and dual consoles, [Veranda](${abs("/veranda/")}) luxury pontoons, [Highfield](${abs("/highfield/")}) aluminum-hull RIBs, [Berkshire](${abs("/berkshire/")}) pontoons.`,
    `- [Big Water Boat Club](${abs("/boatclub/")}): $1,000 initiation discounted to $500 for a first membership ($1,000 to rejoin after cancelling), $50/month billed quarterly, 50% off boat rentals at Lighthouse Resort & Marina, no blackout dates.`,
    `- [Financing](${abs("/financing/")}): new, used and repower financing through marine lenders; rates as low as 5.99% APR, terms up to 20 years.`,
    `- [Rent, join or own](${abs("/keepboating/")}): compare rentals, Boat Club and buying, with a calculator.`,
    `- [Storage](${abs("/storage/")}): secure outdoor storage in Pottsboro; 6 months included in SecurePro ($1,750).`,
    `- [About](${abs("/about/")}): who we are, both locations, and related businesses.`,
    `- [Fleet sales](${abs("/fleet-sales/")}): new and used fleet boats for marinas, resorts, rental operators, clubs and camps; fleet pricing from 2 boats, deeper at 4, wholesale at 8; used rental boats anyone can buy.`,
    `- [Contact](${abs("/contact/")}): call or text, both locations, hours and directions.`,
    `- [Brands](${abs("/brands/")}): compare Berkshire, Veranda, Scout and Highfield.`,
    `- [Lake Texoma boat buying guide](${abs("/lake-texoma-boat-buying-guide/")}): how wind, use and size should shape a Texoma boat purchase; most families fit 22–25 ft, tritoon over two-tube.`,
    `- [New vs used boat cost](${abs("/new-vs-used-boat-cost/")}): season costs by length (wrap $25/ft, storage $2/ft per month, FreezeGuard $335) and where new and used differ.`,
    `- [Big Water Boat Club vs Freedom Boat Club](${abs("/big-water-boat-club-vs-freedom-boat-club/")}): side-by-side fees, reservation limits, blackout dates and commitment.`,
    `- [FAQ](${abs("/faq/")}): the questions we are asked most about buying, service, winterization, storage, Boat Club and fees.`,
    "",
    `## Boats in stock (${boats.length})`,
    ...boats.map(
      (b) =>
        `- [${b.title}](${abs(boatPath(b))}): ${b.condition === "New" ? "New" : "Pre-owned"}, ${b.price ? money(b.price) : "call for pricing"}${b.status !== "active" ? ` (${b.status.replace("-", " ")})` : ""}`,
    ),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
