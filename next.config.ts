import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Trailing slashes are handled per brand in middleware: bigwatermarine.com
  // keeps its WordPress-style /page/ URLs, every other brand drops them.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "texomadestinations.com" },
      { protocol: "https", hostname: "s3.amazonaws.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  // bigwatermarine.com: old WordPress photo URLs keep working while WordPress
  // runs on another host. Set BWM_LEGACY_WP_ORIGIN (e.g. https://wp.bigwatermarine.com).
  async rewrites() {
    const wp = (process.env.BWM_LEGACY_WP_ORIGIN || "").replace(/\/$/, "");
    if (!wp || /\/\/(www\.)?bigwatermarine\.com$/.test(wp)) return [];
    return [{ source: "/wp-content/:path*", has: [{ type: "host", value: "(www\\.)?bigwatermarine\\.com" }], destination: `${wp}/wp-content/:path*` }];
  },
  // Legacy-URL redirects are served from /src/config/redirects.ts via middleware so
  // they can be edited per brand without touching this file.
};

export default nextConfig;
