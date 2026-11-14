"use client";

import { useState } from "react";

export default function ShareTools({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <div className="bwm-share">
      <button type="button" className="bwm-shareBtn" onClick={() => window.print()}>Print spec sheet</button>
      <a className="bwm-shareBtn" href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Take a look at this boat at Big Water Marine: ${url}`)}`}>Email</a>
      <button type="button" className="bwm-shareBtn" onClick={copy}>{copied ? "Link copied" : "Copy link"}</button>
    </div>
  );
}
