import { notFound } from "next/navigation";
import { FastracListing } from "@/components/fastrac/FastracHome";

export const metadata = {
  title: "Lake Texoma Private Boat Charters",
  description: "Plan a private Lake Texoma charter for 2 to 70 guests aboard the Island Girl, Sight-Sea-Er II and Fastrac fleet.",
  alternates: { canonical: "/private-charters" },
};

export default async function PrivateChartersPage({ params }: { params: Promise<{ brand: string }> }) {
  if ((await params).brand !== "fastrac") notFound();
  return <FastracListing kind="private" />;
}
