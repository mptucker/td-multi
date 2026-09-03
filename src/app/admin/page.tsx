import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "./_auth";
import { loginAction } from "./actions";
import { hasSupabase } from "@/lib/supabase";

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect("/admin/events");
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-sm rounded-lg border bg-white p-6">
      <h1 className="text-xl font-bold">Sign in</h1>
      {!adminConfigured() && <p className="mt-3 rounded bg-amber-50 p-3 text-sm text-amber-900">Set <code>ADMIN_PASSWORD</code> in the environment to enable the admin.</p>}
      {!hasSupabase() && <p className="mt-3 rounded bg-slate-100 p-3 text-sm">Supabase isn't configured — the sites are running from <code>/content/*.json</code>. Set the Supabase env vars to edit content here.</p>}
      {error && <p className="mt-3 text-sm text-red-700">Wrong password.</p>}
      <form action={loginAction} className="mt-4 space-y-3">
        <input name="password" type="password" placeholder="Admin password" className="w-full rounded border px-3 py-2" required />
        <button className="w-full rounded bg-slate-900 px-3 py-2 font-semibold text-white">Continue</button>
      </form>
    </div>
  );
}
