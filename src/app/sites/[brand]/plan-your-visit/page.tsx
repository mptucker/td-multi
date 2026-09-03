import type { Metadata } from "next";
import { loadPage } from "../_shared";
import { ContactMap, FAQList, HubHandoff, PageTitle, RuleGroups } from "@/components/Sections";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { content } = await loadPage(params, "plan");
  return { title: content.plan!.title, description: content.plan!.subtitle, alternates: { canonical: "/plan-your-visit" } };
}

export default async function PlanPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand, content, facts } = await loadPage(params, "plan");
  const p = content.plan!;
  return (
    <>
      <PageTitle eyebrow="Plan your visit" title={p.title} subtitle={p.subtitle} />
      <ContactMap brand={brand} directions={p.directions} />
      <section className="container py-8">
        <h2 className="text-3xl font-bold">{p.arrival.title}</h2>
        <div className="prose-brand mt-4 max-w-3xl text-lg text-muted leading-relaxed">{p.arrival.body.map((b, i) => <p key={i}>{b}</p>)}</div>
      </section>
      <section className="container py-8">
        <h2 className="mb-6 text-3xl font-bold">The essentials</h2>
        <RuleGroups groups={p.essentials} facts={facts} />
      </section>
      {p.nearby && p.nearby.length > 0 && (
        <section className="container py-8">
          <h2 className="text-3xl font-bold">While you're here</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {p.nearby.map((n) => (
              <li key={n.name} className="card p-5">
                <p className="font-bold">{n.name}</p>
                <p className="mt-1 text-sm text-muted">{n.note}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      <FAQList faqs={p.faqs} />
      <HubHandoff brand={brand} {...content.home.hubHandoff} />
    </>
  );
}
