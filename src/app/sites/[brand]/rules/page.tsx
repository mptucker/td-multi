import type { Metadata } from "next";
import { loadPage } from "../_shared";
import { hubUrl } from "@/config/hub-links";
import { HubHandoff, PageTitle, RuleGroups } from "@/components/Sections";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { content } = await loadPage(params, "rules");
  return { title: content.rules!.title, description: content.rules!.subtitle, alternates: { canonical: "/rules" } };
}

export default async function RulesPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand, content, facts } = await loadPage(params, "rules");
  const r = content.rules!;
  return (
    <>
      <PageTitle eyebrow="Rules & policies" title={r.title} subtitle={r.subtitle} />
      <section className="container py-8">
        <RuleGroups groups={r.groups} facts={facts} />
        <div className="card mt-8 p-6 text-sm text-muted leading-relaxed">
          <p>{r.policyNote}</p>
          <p className="mt-3">
            The complete, current cancellation and payment policy is maintained by Texoma Destinations and shown at checkout.{" "}
            <a href={hubUrl("property", brand, { campaign: "rules-policy" })} className="font-bold underline underline-offset-4">Read the full policy</a>
            {" · "}
            <a href={hubUrl("legal-terms", brand, { campaign: "rules-terms" })} className="font-bold underline underline-offset-4">Terms of service</a>
          </p>
        </div>
      </section>
      <HubHandoff brand={brand} {...content.home.hubHandoff} />
    </>
  );
}
