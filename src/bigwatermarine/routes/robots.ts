import type { MetadataRoute } from "next";
import { SITE } from "@/bigwatermarine/lib/seo";

// Search engines and AI answer engines are all welcome: being found in
// ChatGPT, Perplexity, Claude, Gemini and Google AI answers is a goal.
const AI_AND_SOCIAL = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot", "Applebot-Extended", "Bingbot",
  "Amazonbot", "facebookexternalhit", "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...AI_AND_SOCIAL.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/api/"] })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
