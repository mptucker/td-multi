import Image from "next/image";
import type { Metadata } from "next";
import { loadPage } from "../_shared";
import { HubLink } from "@/components/HubLink";
import { HubHandoff, PageTitle } from "@/components/Sections";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { content } = await loadPage(params, "stay");
  return { title: content.stay!.title, description: content.stay!.subtitle, alternates: { canonical: "/stay" } };
}

const anchor = (t: string) => t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function StayPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand, content, facts } = await loadPage(params, "stay");
  const s = content.stay!;
  return (
    <>
      <PageTitle eyebrow={brand.mostTag} title={s.title} subtitle={s.subtitle} />
      <div className="container space-y-10 py-8">
        {s.sections.map((sec, i) => {
          const f = sec.factKey ? facts[sec.factKey] : undefined;
          return (
            <section key={sec.title} id={anchor(sec.title)} className={`card overflow-hidden grid gap-0 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              {sec.image && (
                <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px]">
                  <Image src={sec.image.src} alt={sec.image.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
                </div>
              )}
              <div className="p-8 md:p-10 flex flex-col">
                <h2 className="text-3xl font-bold">{sec.title}</h2>
                <div className="prose-brand mt-4 text-muted leading-relaxed">{sec.body.map((p, j) => <p key={j}>{p}</p>)}</div>
                {sec.bullets && (
                  <ul className="checklist mt-5 grid gap-2 sm:grid-cols-2 text-sm text-muted">
                    {sec.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                )}
                <div className="mt-auto pt-6 flex flex-wrap items-center gap-4">
                  {sec.cta && <HubLink brand={brand} cta={sec.cta} campaign={`stay-${anchor(sec.title)}`} />}
                  {f?.last_verified && <span className="text-xs text-muted/70">Details verified {f.last_verified}</span>}
                </div>
              </div>
            </section>
          );
        })}
        {s.note && <p className="text-sm text-muted">{s.note}</p>}
      </div>
      <HubHandoff brand={brand} {...content.home.hubHandoff} />
    </>
  );
}
