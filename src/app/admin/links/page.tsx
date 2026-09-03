import { redirect } from "next/navigation";
import { isAdmin } from "../_auth";
import { BRANDS } from "@/config/brands";
import { describeHubLinks } from "@/config/hub-links";

/** Every CTA destination for every brand — handy for QA with the hub developer. */
export default async function LinksPage() {
  if (!(await isAdmin())) redirect("/admin");
  return (
    <div>
      <h1 className="text-2xl font-bold">Hub deep links</h1>
      <p className="mt-2 text-sm text-slate-600">Generated from <code>src/config/hub-links.ts</code>. Click any link to verify it lands on the right property page.</p>
      {Object.values(BRANDS).map((b) => (
        <section key={b.slug} className="mt-8">
          <h2 className="text-lg font-bold">{b.nap.displayName} <span className="text-sm font-normal text-slate-500">({b.canonicalDomain})</span></h2>
          <table className="mt-2 w-full text-sm rounded-lg border bg-white">
            <tbody>
              {describeHubLinks(b).map((l) => (
                <tr key={l.intent} className="border-t">
                  <td className="p-2 font-mono text-xs w-44">{l.intent}</td>
                  <td className="p-2 break-all"><a href={l.url} className="underline" target="_blank" rel="noopener">{l.url}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
