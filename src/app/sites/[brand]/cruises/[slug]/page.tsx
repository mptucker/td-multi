import { notFound } from "next/navigation";
import { FastracCruiseDetail, fastracCruises } from "@/components/fastrac/FastracHome";

export async function generateMetadata({ params }: { params: Promise<{ brand: string; slug: string }> }) {
  const { slug } = await params;
  const cruise = fastracCruises.find((item) => item.slug === slug);
  if (!cruise) return {};
  return { title: cruise.title, description: cruise.description, alternates: { canonical: `/cruises/${slug}` } };
}

export function generateStaticParams() {
  return fastracCruises.map((cruise) => ({ brand: "fastrac", slug: cruise.slug }));
}

export default async function CruisePage({ params }: { params: Promise<{ brand: string; slug: string }> }) {
  const { brand, slug } = await params;
  if (brand !== "fastrac" || !fastracCruises.some((cruise) => cruise.slug === slug)) notFound();
  return <FastracCruiseDetail slug={slug} />;
}
