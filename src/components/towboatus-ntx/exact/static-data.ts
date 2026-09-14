import type { Service, MembershipFeature } from "./types";

/**
 * Static services data - these don't change and don't need DB
 */
export const services: Service[] = [
  {
    id: "towing",
    name: "Towing",
    description:
      "Disabled vessel towed to the nearest marina, ramp, or destination of your choice. Mechanical failure, engine trouble, loss of power — we'll get you there.",
    icon: "towing",
  },
  {
    id: "degrounding",
    name: "Degrounding",
    description:
      "Run aground on a shoal or sandbar? Our captains free your vessel safely using proper technique — no hull damage, no drama, back underway fast.",
    icon: "degrounding",
  },
  {
    id: "fuel",
    name: "Fuel Delivery",
    description:
      "Out of gas in the middle of the lake? We bring fuel to your position so a minor inconvenience doesn't turn into a long tow.",
    icon: "fuel",
  },
  {
    id: "battery",
    name: "Battery Jump Start",
    description:
      "Dead battery before the day ends? We'll send a captain to your position and get your engine started so you can make it back on your own power.",
    icon: "battery",
  },
  {
    id: "salvage",
    name: "Salvage Assistance",
    description:
      "For complex situations — stuck hard, taking on water, or listing — our team is trained in marine salvage and work with most insurance companies directly.",
    icon: "salvage",
  },
  {
    id: "dive",
    name: "Dive Services",
    description:
      "For complex recovery jobs, our certified dive team is capabable. We put trained eyes under your boat when surface-only help isn't enough.",
    icon: "dive",
  },
  {
    id: "regional",
    name: "Regional Support",
    description:
      "We service our area lakes and anywhere nationwide. We specialize in salvage and environmental services and mobilize for cat events anywhere needed.",
    icon: "regional",
  },
  {
    id: "dispatch",
    name: "24/7/365 Live Dispatch",
    description:
      "Emergencies don't follow schedules. Dispatch is live around the clock, every day of the year. When you call, a real person answers and a captain moves.",
    icon: "dispatch",
  },
];

/**
 * Membership plan comparison features
 */
export const membershipFeatures: MembershipFeature[] = [
  { feature: "24/7/365 dispatch assistance", basic: true, freshwater: true, saltwater: true },
  { feature: "Service good on all boats you own, borrow, or rent", basic: true, freshwater: true, saltwater: true },
  { feature: "Serviced by the nation's largest fleet", basic: true, freshwater: true, saltwater: true },
  { feature: "More than 25 benefits & discounts", basic: true, freshwater: true, saltwater: true },
  { feature: "Exclusive rewards at West Marine", basic: true, freshwater: true, saltwater: true },
  { feature: "BoatUS pays 100% for on-the-water towing up to towing limit", basic: false, freshwater: true, saltwater: true },
  { feature: "BoatUS pays 100% for on-the-water jump starts", basic: false, freshwater: true, saltwater: true },
  { feature: "BoatUS pays 100% for on-the-water fuel delivery, you just pay for fuel", basic: false, freshwater: true, saltwater: true },
  { feature: "BoatUS pays 100% for soft ungroundings", basic: false, freshwater: true, saltwater: true },
  { feature: "BoatUS pays 100% for dock-to-dock towing (after 30 days of membership)", basic: false, freshwater: true, saltwater: true },
  { feature: "Covers inland waters of Continental U.S. (excl. Florida)", basic: false, freshwater: true, saltwater: true },
  { feature: "Covers coastal waters including Florida", basic: false, freshwater: false, saltwater: true },
];

/**
 * Why Big Water Cowboys points
 */
export const whyPoints = [
  {
    num: "01",
    title: "Trained, Professional, and Proficent",
    description:
      "Our team is certified and and operate as an authorized BoatUS licensed service provider — part of the largest and most trusted recreational towing network in the U.S.",
  },
  {
    num: "02",
    title: "Local Knowledge, Real Expertise",
    description:
      "We live and work on these lakes. We know every hazard, shoal, weather pattern, and marina better than anyone — because we're here 365 days a year.",
  },
  {
    num: "03",
    title: "National Award-Winning Team",
    description:
      "TowBoatUS Lake Texoma was named BoatUS Tower of the Year 2025 — the most presitigious award in our industry — and has received the BoatUS Meritorious Service Award for lifesaving emergency response.",
  },
  {
    num: "04",
    title: "Multi-Discipline Capability",
    description:
      "Licensed captains, drone operators, and certified divers — capabilities that go beyond any standard tow when your situation demands it.",
  },
];

/**
 * Awards data
 */
export const awards = [
  {
    id: "smooth-sailing",
    title: "BoatUS Smooth Sailing Award — 2024",
    description: "Recognized for exceptional customer service and operational excellence",
    icon: "shield",
  },
  {
    id: "tower-of-year",
    title: "TowBoatUS Tower of the Year — 2025",
    description: "Best towing operator in the nation out of 300+ ports — awarded by BoatUS",
    icon: "star",
  },
  {
    id: "meritorious",
    title: "BoatUS Meritorious Service Award — 2026",
    description: "Recognized for outstanding lifesaving emergency response on Lake Texoma",
    icon: "shield",
  },
];
