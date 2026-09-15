"use client";

import { useEffect, useState } from "react";
import type { AlertItem } from "@/config/types";

export function SpecialBrandAlert({ alert, brand }: { alert: AlertItem | null; brand: "bigwater" | "towboatus-ntx" }) {
  const storageKey = alert ? `td-alert:${brand}:${alert.id}` : "";
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(!alert || (alert.dismissible !== false && sessionStorage.getItem(storageKey) === "1"));
  }, [alert, storageKey]);

  if (!alert || hidden) return null;

  const dismiss = () => {
    sessionStorage.setItem(storageKey, "1");
    setHidden(true);
  };

  return (
    <>
      {brand === "bigwater" && <style>{`.bwco-nav{top:var(--special-alert-height,44px)!important}`}</style>}
      <aside className={`special-alert special-alert-${brand}`} aria-label="Announcement">
        <div>
          <strong>{alert.text}</strong>
          {alert.promo_code && <code>{alert.promo_code}</code>}
          {alert.cta_url && alert.cta_label && (
            <a href={alert.cta_url} data-intent="announcement" data-entity-id={alert.id}>
              {alert.cta_label} →
            </a>
          )}
          {alert.dismissible !== false && <button type="button" aria-label="Dismiss announcement" onClick={dismiss}>×</button>}
        </div>
      </aside>
    </>
  );
}
