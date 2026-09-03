import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "texomadestinations.com" },
      { protocol: "https", hostname: "s3.amazonaws.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  // Legacy-URL redirects are served from /src/config/redirects.ts via middleware so
  // they can be edited per brand without touching this file.
};

export default nextConfig;
