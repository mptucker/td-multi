import type { ReactNode } from "react";

/** Small, safe formatting language for CMS copy: links, bold, italic and underline. */
export function RichText({ children }: { children: string }) {
  return <>{parse(children)}</>;
}

function parse(value: string): ReactNode[] {
  const pattern = /(\[[^\]]+\]\(https?:\/\/[^)]+\)|\*\*[^*]+\*\*|_[^_]+_|\+\+[^+]+\+\+)/g;
  return value.split(pattern).filter(Boolean).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return <a key={index} href={link[2]} rel="noopener noreferrer">{link[1]}</a>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2,-2)}</strong>;
    if (part.startsWith("_") && part.endsWith("_")) return <em key={index}>{part.slice(1,-1)}</em>;
    if (part.startsWith("++") && part.endsWith("++")) return <u key={index}>{part.slice(2,-2)}</u>;
    return part;
  });
}
