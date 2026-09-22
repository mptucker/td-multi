import { notFound } from "next/navigation";
import { FastracListing } from "@/components/fastrac/FastracHome";

export const metadata = {
  title: "Lake Texoma Public Cruises",
  description: "Browse Fastrac sunset, dinner, sightseeing and seasonal themed cruises departing Lighthouse Marina on Lake Texoma.",
  alternates: { canonical: "/public-cruises" },
};

export default async function PublicCruisesPage({ params }: { params: Promise<{ brand: string }> }) {
  if ((await params).brand !== "fastrac") notFound();
  return <FastracListing kind="public" />;
}
