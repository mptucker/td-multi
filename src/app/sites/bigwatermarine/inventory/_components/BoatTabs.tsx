"use client";

import { useState } from "react";

// Specs and the loan calculator share one panel area. Both stay in the HTML
// (the hidden one uses the `hidden` attribute) so search engines read the specs.
export default function BoatTabs({ specs, calculator }: { specs: React.ReactNode; calculator: React.ReactNode | null }) {
  const [tab, setTab] = useState<"specs" | "loan">("specs");
  if (!calculator) return <div className="bwm-panel">{specs}</div>;
  return (
    <div className="bwm-panel bwm-panel--tabs">
      <div className="bwm-tabs" role="tablist" aria-label="Boat details">
        <button type="button" role="tab" id="tab-specs" aria-controls="panel-specs" aria-selected={tab === "specs"} onClick={() => setTab("specs")}>Specs</button>
        <button type="button" role="tab" id="tab-loan" aria-controls="panel-loan" aria-selected={tab === "loan"} onClick={() => setTab("loan")}>Loan calculator</button>
      </div>
      <div role="tabpanel" id="panel-specs" aria-labelledby="tab-specs" hidden={tab !== "specs"} className="bwm-tabPanel">{specs}</div>
      <div role="tabpanel" id="panel-loan" aria-labelledby="tab-loan" hidden={tab !== "loan"} className="bwm-tabPanel">{calculator}</div>
    </div>
  );
}
