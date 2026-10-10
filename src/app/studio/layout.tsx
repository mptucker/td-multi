import type { Metadata } from "next";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Site Studio · Texoma Destinations", robots: { index: false, follow: false, noarchive: true } };

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <div className="cms-shell">{children}</div>;
}
