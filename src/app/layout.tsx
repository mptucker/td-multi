import type { ReactNode } from "react";
import "./globals.css";

/**
 * Root layout is intentionally thin: the brand layout at /sites/[brand]/layout.tsx owns
 * <html> attributes, fonts and tokens. Next requires <html>/<body> here.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
