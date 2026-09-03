import type { ReactNode } from "react";
import Link from "next/link";
import { isAdmin } from "./_auth";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

const NAV = [
  ["events", "Events"],
  ["packages", "Packages"],
  ["alerts", "Alert bars"],
  ["facts", "Facts registry"],
  ["links", "Hub deep links"],
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authed = await isAdmin();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: "system-ui, sans-serif" }}>
      <header className="border-b bg-white">
        <div className="container flex items-center justify-between py-3">
          <Link href="/admin" className="font-bold">TD Brand Sites — Admin</Link>
          {authed && (
            <nav className="flex items-center gap-5 text-sm">
              {NAV.map(([k, l]) => <Link key={k} href={`/admin/${k}`} className="hover:underline">{l}</Link>)}
              <form action={logoutAction}><button className="rounded bg-slate-200 px-3 py-1">Log out</button></form>
            </nav>
          )}
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
