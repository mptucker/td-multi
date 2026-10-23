import "server-only";
import { createSign } from "node:crypto";
import type { BrandSlug } from "@/config/types";

const ANALYTICS_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DATA_API = "https://analyticsdata.googleapis.com/v1beta";
const CACHE_TTL = 15 * 60 * 1000;

type ServiceAccount = { clientEmail: string; privateKey: string };
type TokenCache = { token: string; expiresAt: number };
type CachedReport = { expiresAt: number; data: AnalyticsReport };

export type AnalyticsMetric = {
  activeUsers: number;
  sessions: number;
  views: number;
  engagedSessions: number;
  keyEvents: number;
};

export type AnalyticsReport = {
  brand: BrandSlug;
  propertyId: string;
  days: number;
  through: string;
  generatedAt: string;
  totals: AnalyticsMetric & { engagementRate: number };
  trend: Array<{ date: string } & AnalyticsMetric>;
  pages: Array<{ path: string; title: string; views: number; users: number; engagementRate: number }>;
  channels: Array<{ channel: string; sessions: number; users: number; keyEvents: number }>;
  devices: Array<{ device: string; sessions: number; users: number }>;
  actions: Array<{ event: string; count: number; users: number }>;
};

let tokenCache: TokenCache | null = null;
const reportCache = new Map<string, CachedReport>();

const PROPERTY_ENV_KEYS: Record<BrandSlug, string> = {
  lighthouse: "GA4_PROPERTY_ID_LIGHTHOUSE",
  paradise: "GA4_PROPERTY_ID_PARADISE",
  sundance: "GA4_PROPERTY_ID_SUNDANCE",
  "island-view": "GA4_PROPERTY_ID_ISLAND_VIEW",
  fastrac: "GA4_PROPERTY_ID_FASTRAC",
  "water-taxi": "GA4_PROPERTY_ID_WATER_TAXI",
  "tackle-box": "GA4_PROPERTY_ID_TACKLE_BOX",
  boaterwise: "GA4_PROPERTY_ID_BOATERWISE",
  bigwater: "GA4_PROPERTY_ID_BIGWATER",
  "towboatus-ntx": "GA4_PROPERTY_ID_TOWBOATUS_NTX",
};

function parseJson<T>(value?: string): T | null {
  if (!value) return null;
  try { return JSON.parse(value) as T; } catch { return null; }
}

function serviceAccount(): ServiceAccount | null {
  const json = parseJson<Record<string, string>>(process.env.GA4_SERVICE_ACCOUNT_JSON);
  const clientEmail = json?.client_email || process.env.GA4_CLIENT_EMAIL;
  const privateKey = json?.private_key || process.env.GA4_PRIVATE_KEY;
  if (!clientEmail || !privateKey) return null;
  return { clientEmail, privateKey: privateKey.replace(/\\n/g, "\n") };
}

export function ga4PropertyId(brand: BrandSlug): string | null {
  const map = parseJson<Partial<Record<BrandSlug, string>>>(process.env.GA4_PROPERTY_IDS);
  const value = map?.[brand] || process.env[PROPERTY_ENV_KEYS[brand]];
  const normalized = value?.replace(/^properties\//, "").trim();
  return normalized && /^\d+$/.test(normalized) ? normalized : null;
}

export function ga4SetupStatus(brand: BrandSlug) {
  const missing: string[] = [];
  if (!serviceAccount()) missing.push("GA4 service account credentials");
  if (!ga4PropertyId(brand)) missing.push(`GA4 property ID for ${brand}`);
  return { configured: missing.length === 0, missing };
}

function base64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

async function accessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.token;
  const account = serviceAccount();
  if (!account) throw new Error("GA4 service account credentials are not configured");
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({
    iss: account.clientEmail,
    scope: ANALYTICS_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${payload}`;
  const signature = createSign("RSA-SHA256").update(unsigned).end().sign(account.privateKey, "base64url");
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
    cache: "no-store",
  });
  const body = await response.json() as { access_token?: string; expires_in?: number; error_description?: string };
  if (!response.ok || !body.access_token) throw new Error(body.error_description || "Google authentication failed");
  tokenCache = { token: body.access_token, expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000 };
  return tokenCache.token;
}

type GaValue = { value?: string };
type GaRow = { dimensionValues?: GaValue[]; metricValues?: GaValue[] };
type GaReport = { rows?: GaRow[]; totals?: GaRow[] };
type GaBatch = { reports?: GaReport[]; error?: { message?: string } };

const numberAt = (row: GaRow | undefined, index: number) => Number(row?.metricValues?.[index]?.value ?? 0);
const stringAt = (row: GaRow | undefined, index: number) => row?.dimensionValues?.[index]?.value ?? "";
const ratioAt = (row: GaRow | undefined, index: number) => Math.round(numberAt(row, index) * 1000) / 10;
function reportingDate(daysAgo: number) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(Date.now() - daysAgo * 86_400_000));
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function requestBody(days: number) {
  const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "yesterday" }];
  return {
    requests: [
      {
        dateRanges,
        dimensions: [{ name: "date" }],
        metrics: ["activeUsers", "sessions", "screenPageViews", "engagedSessions", "keyEvents"].map((name) => ({ name })),
        metricAggregations: ["TOTAL"],
        returnPropertyQuota: true,
        orderBys: [{ dimension: { dimensionName: "date" } }],
        limit: "400",
      },
      {
        dateRanges,
        dimensions: [{ name: "pagePathPlusQueryString" }, { name: "pageTitle" }],
        metrics: ["screenPageViews", "activeUsers", "engagementRate"].map((name) => ({ name })),
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: "10",
      },
      {
        dateRanges,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: ["sessions", "activeUsers", "keyEvents"].map((name) => ({ name })),
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: "10",
      },
      {
        dateRanges,
        dimensions: [{ name: "deviceCategory" }],
        metrics: ["sessions", "activeUsers"].map((name) => ({ name })),
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      },
      {
        dateRanges,
        dimensions: [{ name: "eventName" }],
        metrics: ["eventCount", "activeUsers"].map((name) => ({ name })),
        dimensionFilter: { filter: { fieldName: "eventName", inListFilter: { values: ["brand_conversion_click", "generate_lead", "purchase"] } } },
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      },
    ],
  };
}

export async function getAnalyticsReport(brand: BrandSlug, days: number): Promise<AnalyticsReport> {
  const propertyId = ga4PropertyId(brand);
  if (!propertyId) throw new Error(`GA4 property ID is not configured for ${brand}`);
  const cacheKey = `${brand}:${propertyId}:${days}`;
  const cached = reportCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const token = await accessToken();
  const response = await fetch(`${DATA_API}/properties/${propertyId}:batchRunReports`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(requestBody(days)),
    cache: "no-store",
  });
  const body = await response.json() as GaBatch;
  if (!response.ok || !body.reports) throw new Error(body.error?.message || `Google Analytics returned ${response.status}`);

  const [trendReport, pagesReport, channelsReport, devicesReport, actionsReport] = body.reports;
  const total = trendReport?.totals?.[0];
  const sessions = numberAt(total, 1);
  const engagedSessions = numberAt(total, 3);
  const report: AnalyticsReport = {
    brand,
    propertyId,
    days,
    through: reportingDate(1),
    generatedAt: new Date().toISOString(),
    totals: {
      activeUsers: numberAt(total, 0),
      sessions,
      views: numberAt(total, 2),
      engagedSessions,
      keyEvents: numberAt(total, 4),
      engagementRate: sessions ? Math.round((engagedSessions / sessions) * 1000) / 10 : 0,
    },
    trend: (trendReport?.rows ?? []).map((row) => ({ date: stringAt(row, 0), activeUsers: numberAt(row, 0), sessions: numberAt(row, 1), views: numberAt(row, 2), engagedSessions: numberAt(row, 3), keyEvents: numberAt(row, 4) })),
    pages: (pagesReport?.rows ?? []).map((row) => ({ path: stringAt(row, 0), title: stringAt(row, 1), views: numberAt(row, 0), users: numberAt(row, 1), engagementRate: ratioAt(row, 2) })),
    channels: (channelsReport?.rows ?? []).map((row) => ({ channel: stringAt(row, 0) || "Unassigned", sessions: numberAt(row, 0), users: numberAt(row, 1), keyEvents: numberAt(row, 2) })),
    devices: (devicesReport?.rows ?? []).map((row) => ({ device: stringAt(row, 0) || "Unknown", sessions: numberAt(row, 0), users: numberAt(row, 1) })),
    actions: (actionsReport?.rows ?? []).map((row) => ({ event: stringAt(row, 0), count: numberAt(row, 0), users: numberAt(row, 1) })),
  };
  reportCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL, data: report });
  return report;
}
