import Image from "next/image";
import type { Metadata } from "next";
import { loadPage } from "../_shared";
import { HubLink } from "@/components/HubLink";
import { HubHandoff, PageTitle } from "@/components/Sections";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { content } = await loadPage(params, "groups");
  return { title: content.groups!.title, description: content.groups!.subtitle, alternates: { canonical: "/groups-and-events" } };
}

const anchor = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function GroupsPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand, content } = await loadPage(params, "groups");
  const g = content.groups!;
  return (
    <>
      <PageTitle eyebrow="Groups & events" title={g.title} subtitle={g.subtitle} />
      <section className="container grid gap-8 py-8 md:grid-cols-12">
        <div className="prose-brand text-lg text-muted leading-relaxed md:col-span-7">{g.intro.map((p, i) => <p key={i}>{p}</p>)}</div>
        <aside className="card p-6 md:col-span-5 self-start">
          <p className="eyebrow">Perfect for</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {g.eventTypes.map((t) => <li key={t} className="rounded-full bg-bg px-3 py-1 text-sm font-semibold">{t}</li>)}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <HubLink brand={brand} cta={g.cta} campaign="groups-aside" />
            {g.contactPhone && (
              <a href={`tel:${g.contactPhone.replace(/\D/g, "").replace(/^/, "+1")}`} className="text-center text-sm font-bold underline underline-offset-4">
                Or call our events team: {g.contactPhone}
              </a>
            )}
          </div>
        </aside>
      </section>
      <section className="container py-8">
        <h2 className="mb-6 text-3xl font-bold">Spaces & vessels</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {g.venues.map((v) => (
            <article key={v.name} id={anchor(v.name)} className="card overflow-hidden flex flex-col">
              {v.image && (
                <div className="relative aspect-[4/3]">
                  <Image src={v.image.src} alt={v.image.alt} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
                </div>
              )}
              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold">{v.name}</h3>
                <p className="mt-1 font-bold text-accent">{v.capacity}</p>
                <ul className="checklist mt-3 space-y-1 text-sm text-muted">{v.details.map((d) => <li key={d}>{d}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <HubHandoff brand={brand} {...content.home.hubHandoff} />
    </>
  );
}
