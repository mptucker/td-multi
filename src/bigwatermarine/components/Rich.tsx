import Link from "next/link";
import type { ReactNode } from "react";
import { fill } from "@/bigwatermarine/lib/cms";

/**
 * Formatting for Big Water Marine copy edited in /admin:
 *   **bold**   _italic_   [link text](/page/)   [call](tel:+19034191019)
 * Links may be site paths (/…), https://…, tel: or mailto:. {placeholders}
 * such as {club.initiation} are filled first; pass `values` for page-specific
 * numbers like {boats.count}.
 */
export default function Rich({ text, values, linkClass = "bwm-inlineLink" }: { text: string; values?: Record<string, string | number>; linkClass?: string }) {
  return <>{parse(fill(text, values), linkClass)}</>;
}

const PATTERN = /(\[[^\]]+\]\((?:\/|https?:\/\/|tel:|mailto:)[^)\s]*\)|\*\*[^*]+\*\*|(?<![\w/])_[^_]+_(?![\w]))/g;

function parse(value: string, linkClass: string): ReactNode[] {
  return value.split(PATTERN).filter(Boolean).map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      return href.startsWith("/") ? (
        <Link key={i} href={href} className={linkClass || undefined}>{parse(label, linkClass)}</Link>
      ) : (
        <a key={i} href={href} className={linkClass || undefined}>{parse(label, linkClass)}</a>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={i}>{parse(part.slice(2, -2), linkClass)}</strong>;
    if (part.startsWith("_") && part.endsWith("_") && part.length > 2) return <em key={i}>{parse(part.slice(1, -1), linkClass)}</em>;
    return part;
  });
}
