"use client";

import { useEffect, useMemo, useState } from "react";

type Metric = { activeUsers: number; sessions: number; views: number; engagedSessions: number; keyEvents: number };
type Report = {
  brand: string;
  propertyId: string;
  days: number;
  through: string;
  generatedAt: string;
  totals: Metric & { engagementRate: number };
  trend: Array<{ date: string } & Metric>;
  pages: Array<{ path: string; title: string; views: number; users: number; engagementRate: number }>;
  channels: Array<{ channel: string; sessions: number; users: number; keyEvents: number }>;
  devices: Array<{ device: string; sessions: number; users: number }>;
  actions: Array<{ event: string; count: number; users: number }>;
};

const RANGES = [7, 30, 90] as const;
const number = new Intl.NumberFormat("en-US");

function compactDate(value: string) {
  if (!/^\d{8}$/.test(value)) return value;
  const date = new Date(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6)}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function friendlyEvent(value: string) {
  return ({ brand_conversion_click: "Website CTA clicks", generate_lead: "Lead events", purchase: "Purchases" } as Record<string, string>)[value] || value.replaceAll("_", " ");
}

function Loading() {
  return <div className="cms-analytics-loading" aria-live="polite"><span /><strong>Reading Google Analytics…</strong><p>This normally takes a few seconds.</p></div>;
}

export function AnalyticsDashboard({ assignments, brandNames, accessToken }: { assignments: string[]; brandNames: Record<string, string>; accessToken: string }) {
  const [brand, setBrand] = useState(assignments[0] ?? "");
  const [days, setDays] = useState<(typeof RANGES)[number]>(30);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    if (!assignments.includes(brand)) setBrand(assignments[0] ?? "");
  }, [assignments, brand]);

  useEffect(() => {
    if (!brand || !accessToken) return;
    const controller = new AbortController();
    setLoading(true); setError(""); setMissing([]);
    fetch(`/api/admin/analytics?brand=${encodeURIComponent(brand)}&days=${days}`, {
      headers: { authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
    }).then(async (response) => {
      const body = await response.json();
      if (!response.ok) {
        setMissing(Array.isArray(body.missing) ? body.missing : []);
        throw new Error(body.error || "Analytics could not be loaded");
      }
      setReport(body as Report);
    }).catch((reason) => {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setReport(null); setError(reason instanceof Error ? reason.message : "Analytics could not be loaded");
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [brand, days, accessToken]);

  const maxViews = useMemo(() => Math.max(1, ...(report?.trend.map((point) => point.views) ?? [1])), [report]);
  if (!assignments.length) return <div className="cms-empty"><strong>No site analytics available</strong><p>Assign at least one brand to this account.</p></div>;

  return <div className="cms-analytics">
    <section className="cms-panel cms-analytics-controls">
      <label><span>Brand</span><select value={brand} onChange={(event) => setBrand(event.target.value)}>{assignments.map((item) => <option value={item} key={item}>{brandNames[item] ?? item}</option>)}</select></label>
      <fieldset><legend>Date range</legend>{RANGES.map((range) => <button type="button" key={range} className={days === range ? "active" : ""} onClick={() => setDays(range)}>{range} days</button>)}</fieldset>
      <div><span>Reporting window</span><strong>{report ? `Through ${new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "America/Chicago" }).format(new Date(`${report.through}T12:00:00`))}` : "GA4 finalized data"}</strong></div>
    </section>

    {loading ? <Loading /> : error ? <section className="cms-panel cms-analytics-setup"><span className="cms-analytics-icon">GA</span><div><p className="cms-kicker">Google Analytics connection</p><h2>{missing.length ? "One-time setup needed" : "Analytics is temporarily unavailable"}</h2><p>{error}</p>{missing.length > 0 && <ul>{missing.map((item) => <li key={item}>{item}</li>)}</ul>}<small>The dashboard stays hidden from public visitors, and Google credentials remain server-only.</small></div></section> : report && <>
      <div className="cms-metrics cms-analytics-metrics">
        <AnalyticsMetric value={report.totals.activeUsers} label="Active users" />
        <AnalyticsMetric value={report.totals.sessions} label="Sessions" />
        <AnalyticsMetric value={report.totals.views} label="Page views" />
        <AnalyticsMetric value={report.totals.engagementRate} label="Engagement rate" suffix="%" />
        <AnalyticsMetric value={report.totals.keyEvents} label="Key events" />
      </div>

      <section className="cms-panel cms-analytics-trend">
        <div className="cms-analytics-heading"><div><p className="cms-kicker">Traffic</p><h2>Daily page views</h2></div><span>Updated about every 15 minutes</span></div>
        {report.trend.length ? <div className="cms-analytics-chart" role="img" aria-label={`Daily page views for ${brandNames[brand] ?? brand}`}>
          {report.trend.map((point, index) => <div className="cms-analytics-bar" key={point.date} title={`${compactDate(point.date)}: ${number.format(point.views)} views`}><i style={{ height: `${Math.max(3, (point.views / maxViews) * 100)}%` }} /><span>{(report.trend.length <= 14 || index % Math.ceil(report.trend.length / 8) === 0) ? compactDate(point.date) : ""}</span></div>)}
        </div> : <p className="cms-analytics-empty">No page-view data was returned for this period.</p>}
      </section>

      <div className="cms-analytics-grid">
        <AnalyticsTable title="Top pages" kicker="What people viewed" columns={["Page", "Views", "Users"]} rows={report.pages.map((row) => [<span key={row.path}><strong>{row.title || row.path}</strong><small>{row.path}</small></span>, number.format(row.views), number.format(row.users)])} empty="No page data yet." />
        <AnalyticsTable title="Traffic sources" kicker="How people arrived" columns={["Channel", "Sessions", "Key events"]} rows={report.channels.map((row) => [row.channel, number.format(row.sessions), number.format(row.keyEvents)])} empty="No acquisition data yet." />
      </div>

      <div className="cms-analytics-grid cms-analytics-grid-small">
        <AnalyticsTable title="Devices" kicker="How people browsed" columns={["Device", "Sessions", "Users"]} rows={report.devices.map((row) => [<span className="cms-capitalize" key={row.device}>{row.device}</span>, number.format(row.sessions), number.format(row.users)])} empty="No device data yet." />
        <AnalyticsTable title="Tracked site actions" kicker="Conversion activity" columns={["Action", "Count", "Users"]} rows={report.actions.map((row) => [friendlyEvent(row.event), number.format(row.count), number.format(row.users)])} empty="No tracked CTA or lead events in this period." />
      </div>

      <section className="cms-panel cms-analytics-footnote"><div><strong>Reading property {report.propertyId}</strong><span>Google Analytics Data API · {brandNames[brand] ?? brand}</span></div><p>“Key events” are the events marked as important in GA4. Website CTA clicks include booking, phone, directions, and outbound actions recorded by the brand sites.</p></section>
    </>}
  </div>;
}

function AnalyticsMetric({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  return <div className="cms-metric"><strong>{number.format(value)}{suffix}</strong><span>{label}</span></div>;
}

function AnalyticsTable({ title, kicker, columns, rows, empty }: { title: string; kicker: string; columns: string[]; rows: React.ReactNode[][]; empty: string }) {
  return <section className="cms-panel cms-analytics-table"><p className="cms-kicker">{kicker}</p><h2>{title}</h2>{rows.length ? <div className="cms-analytics-table-scroll"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div> : <p className="cms-analytics-empty">{empty}</p>}</section>;
}
