"use client";
import { useEffect, useState } from "react";
import type { AlertItem } from "@/config/types";

export function DismissibleAlert({ alert, brand }: { alert: AlertItem; brand: string }) {
  const key = "td-alert:" + brand + ":" + alert.id;
  const [hidden, setHidden] = useState(true);
  useEffect(() => setHidden(sessionStorage.getItem(key) === "1"), [key]);
  if (hidden) return null;
  return <div className="bg-accent text-white text-sm"><div className="container flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center">
    <span className="font-semibold">{alert.text}</span>
    {alert.promo_code && <code className="rounded bg-black/15 px-2 py-1 font-bold">{alert.promo_code}</code>}
    {alert.cta_url && alert.cta_label && <a href={alert.cta_url} data-intent="announcement" data-entity-id={alert.id} className="underline underline-offset-2 font-bold">{alert.cta_label} →</a>}
    <button type="button" aria-label="Dismiss announcement" className="ml-2 border-0 bg-transparent text-white text-lg cursor-pointer" onClick={() => { sessionStorage.setItem(key, "1"); setHidden(true); }}>×</button>
  </div></div>;
}
