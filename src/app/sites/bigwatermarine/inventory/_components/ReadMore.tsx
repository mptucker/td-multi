"use client";

import { useState } from "react";

// The full description is always in the HTML; it's just visually clipped.
export default function ReadMore({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bwm-readMore" data-open={open}>
      <div className="bwm-readMoreBody">{children}</div>
      <button type="button" className="bwm-btnOutlineDark bwm-btnSm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
