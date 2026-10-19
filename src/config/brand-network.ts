import type { BrandNetworkSettings } from "./types";

export const BRAND_NETWORK_CATEGORY_LABELS = {
  "stay-play": "Stay & Play",
  "on-water": "On the Water",
  "shop-explore": "Shop & Explore",
} as const;

const allSites = ["lighthouse", "paradise", "sundance", "island-view", "fastrac", "water-taxi", "tackle-box", "boaterwise", "bigwater", "towboatus-ntx"] as const;

export const DEFAULT_BRAND_NETWORK: BrandNetworkSettings = {
  enabled: true,
  heading: "The Most Texoma.",
  strapline: "One lake. Every way to enjoy it.",
  hub_label: "Explore Texoma Destinations",
  hub_url: "https://texomadestinations.com/",
  items: [
    { id: "lighthouse", display_name: "Lighthouse Resort & Marina", url: "https://lighthouseresort.com/", category: "stay-play", description: "Cabins, marina slips and lake days from one home base.", sort_order: 10, visible: true, show_on_sites: [...allSites] },
    { id: "paradise", display_name: "Paradise on Lake Texoma", url: "https://paradisetexoma.com/", category: "stay-play", description: "Glamping, RV sites and unhurried shoreline escapes.", sort_order: 20, visible: true, show_on_sites: [...allSites] },
    { id: "sundance", display_name: "Sundance Camp", url: "https://sundancetexoma.com/", category: "stay-play", description: "Tiny cabins, group stays and a private-feeling cove.", sort_order: 30, visible: true, show_on_sites: [...allSites] },
    { id: "island-view", display_name: "Island View Park", url: "https://islandviewtexoma.com/", category: "stay-play", description: "The beach day that is closer than you think.", sort_order: 40, visible: true, show_on_sites: [...allSites] },
    { id: "fastrac", display_name: "Fastrac Cruises", url: "https://fastrac.com/", category: "on-water", description: "Public cruises, private charters and unforgettable lake stories.", sort_order: 10, visible: true, show_on_sites: [...allSites] },
    { id: "water-taxi", display_name: "Texoma Water Taxi", url: "https://texomawatertaxi.com/", category: "on-water", description: "Point-to-point rides and private trips across Lake Texoma.", sort_order: 20, visible: true, show_on_sites: [...allSites] },
    { id: "towboatus", display_name: "TowBoatUS North Texas", url: "https://towboatusntx.com/", category: "on-water", description: "Professional on-water assistance, 24/7/365.", sort_order: 30, visible: true, show_on_sites: [...allSites] },
    { id: "tackle-box", display_name: "Tackle Box Outfitters", url: "https://tackleboxtexoma.com/", category: "shop-explore", description: "Bait, tackle, provisions and local fishing know-how.", sort_order: 10, visible: true, show_on_sites: [...allSites] },
    { id: "big-water-marine", display_name: "Big Water Marine", url: "https://bigwatermarine.com/", category: "shop-explore", description: "Premium boats, service and the Big Water Boat Club.", sort_order: 20, visible: true, show_on_sites: [...allSites] },
    { id: "boaterwise", display_name: "BoaterWise", url: "https://boaterwise.com/", category: "shop-explore", description: "Hands-on instruction for safer, more confident boating.", sort_order: 30, visible: true, show_on_sites: [...allSites] },
  ],
};
