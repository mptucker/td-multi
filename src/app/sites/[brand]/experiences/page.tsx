import { notFound } from "next/navigation";
import { FastracListing } from "@/components/fastrac/FastracHome";

export const metadata = {
  title: "Lake Texoma Boat Tours & Experiences",
  description: "Find romantic cruises, family outings, Lake Texoma tours, beach days and group boat experiences with Fastrac Cruises.",
  alternates: { canonical: "/experiences" },
};

export default async function ExperiencesPage({ params }: { params: Promise<{ brand: string }> }) {
  if ((await params).brand !== "fastrac") notFound();
  return <FastracListing kind="experiences" />;
}
