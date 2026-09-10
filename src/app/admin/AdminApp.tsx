"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import lighthouse from "@content/lighthouse.json";
import paradise from "@content/paradise.json";
import sundance from "@content/sundance.json";
import islandView from "@content/island-view.json";
import fastrac from "@content/fastrac.json";
import waterTaxi from "@content/water-taxi.json";
import tackleBox from "@content/tackle-box.json";
import boaterwise from "@content/boaterwise.json";

type Role = "admin" | "director" | "site_manager" | "editor" | "viewer";
type Profile = { user_id: string; display_name: string; phone?: string; role: Role; active: boolean };
type BrandRow = { brand: string; content: Record<string, any>; draft_content?: Record<string, any>; published_at?: string; updated_at?: string };
type Tab = "overview" | "sites" | "media" | "alerts" | "faqs" | "packages" | "events" | "global" | "staff" | "activity";
const BRAND_NAMES: Record<string, string> = { lighthouse: "Lighthouse Resort & Marina", paradise: "Paradise on Lake Texoma", sundance: "Sundance Camp", "island-view": "Island View Park", fastrac: "Fastrac Cruises", "water-taxi": "Texoma Water Taxi", "tackle-box": "Tackle Box Outfitters", boaterwise: "BoaterWise" };
const ALL_BRANDS = Object.keys(BRAND_NAMES);
const LOCAL_CONTENT: Record<string, Record<string, any>> = { lighthouse, paradise, sundance, "island-view": islandView, fastrac, "water-taxi": waterTaxi, "tackle-box": tackleBox, boaterwise } as any;
const NAV: [Tab, string][] = [["overview","Overview"],["sites","Site content"],["media","Media"],["alerts","Announcement bars"],["faqs","FAQs"],["packages","Packages"],["events","Events"],["global","Global footer & TAP"],["staff","Staff"],["activity","Activity"]];
let sb = supabaseBrowser();

function toE164US(value?: string | null) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  return null;
}

function setAtPath(source: Record<string, any>, path: string, value: string) {
  const next = structuredClone(source);
  const keys = path.split(".");
  let node: any = next;
  keys.forEach((key, i) => {
    const k: string | number = /^\d+$/.test(key) ? Number(key) : key;
    if (i === keys.length - 1) node[k] = value;
    else node = node[k];
  });
  return next;
}
function editableFields(value: any, prefix = ""): { path: string; label: string; value: string; kind: "text" | "image" | "url" }[] {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? prefix + "." + key : key;
    if (typeof child === "string") {
      if (["slug"].includes(key)) return [];
      const kind = /image|src|ogImage/i.test(key) ? "image" : /href|url/i.test(key) ? "url" : "text";
      return [{ path, label: path.replace(/\.\d+\./g, " › ").replace(/\./g, " › ").replace(/([A-Z])/g, " $1"), value: child, kind }];
    }
    return editableFields(child, path);
  });
}
function contentWarnings(content: Record<string, any>) {
  const fields = editableFields(content);
  const warnings: string[] = [];
  for (const field of fields) {
    if ((field.kind === "url" || field.kind === "image") && field.value && !/^(https?:\/\/|\/)/.test(field.value)) warnings.push(field.label + " needs a valid URL.");
    if (/seo › title/i.test(field.label) && field.value.length > 65) warnings.push("SEO title is longer than 65 characters.");
    if (/seo › description/i.test(field.label) && field.value.length > 165) warnings.push("SEO description is longer than 165 characters.");
  }
  const gallery = content.home?.gallery ?? [];
  gallery.forEach((image: any, index: number) => { if (image?.src && !image?.alt) warnings.push("Gallery image " + (index + 1) + " needs alt text."); });
  if (content.home?.heroImage?.src && !content.home?.heroImage?.alt) warnings.push("Hero image needs alt text.");
  return [...new Set(warnings)];
}
function formatDate(value?: string) { return value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: value.includes("T") ? "short" : undefined }).format(new Date(value)) : "—"; }

export function AdminApp({ supabaseUrl, supabaseKey }: { supabaseUrl: string; supabaseKey: string }) {
  sb ??= supabaseBrowser(supabaseUrl, supabaseKey);
  const [session, setSession] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [assignments, setAssignments] = useState<string[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [status, setStatus] = useState("Loading…");
  const [data, setData] = useState<Record<string, any[]>>({});
  const sessionRef = useRef<any>(null);

  const load = useCallback(async (activeSession?: any) => {
    activeSession ??= sessionRef.current;
    if (!sb || !activeSession) return;
    setStatus("Loading workspace…");
    const { data: p, error: profileError } = await sb.from("cms_users").select("*").eq("user_id", activeSession.user.id).maybeSingle();
    if (profileError) { setProfile(null); setStatus("Access check failed: " + profileError.message); return; }
    if (!p?.active) {
      const { data: claimed } = await sb.rpc("cms_claim_invite");
      if (claimed) { location.reload(); return; }
      const { error: requestError } = await sb.from("cms_access_requests").upsert({ user_id: activeSession.user.id, phone: toE164US(activeSession.user.phone) });
      if (requestError) { setStatus("Access request failed: " + requestError.message); return; }
      setProfile(null); setStatus("Access requested"); return;
    }
    await sb.from("cms_access_requests").delete().eq("user_id", activeSession.user.id);
    await sb.rpc("cms_touch_login");
    const { data: siteRows } = await sb.from("cms_user_sites").select("brand").eq("user_id", activeSession.user.id);
    const allowed = p.role === "admin" || p.role === "director" ? ALL_BRANDS : (siteRows ?? []).map((r) => r.brand);
    const queries = await Promise.all([
      sb.from("brand_content").select("*").in("brand", allowed),
      sb.from("media_assets").select("*").eq("archived", false).order("created_at", { ascending: false }),
      sb.from("alerts").select("*").order("created_at", { ascending: false }),
      sb.from("faqs").select("*").order("sort_order"),
      sb.from("packages").select("*").order("sort_order"),
      sb.from("events").select("*").order("starts_at"),
      sb.from("global_settings").select("*"),
      sb.from("brand_settings").select("*").in("brand", allowed),
      sb.from("content_revisions").select("*").order("created_at", { ascending: false }).limit(30),
      sb.from("cms_audit_log").select("*").order("created_at", { ascending: false }).limit(75),
      p.role === "admin" ? sb.from("cms_users").select("*,cms_user_sites(brand)").order("display_name") : Promise.resolve({ data: [] }),
      p.role === "admin" ? sb.from("cms_access_requests").select("*").order("requested_at") : Promise.resolve({ data: [] }),
      p.role === "admin" ? sb.from("cms_invites").select("*").order("created_at") : Promise.resolve({ data: [] }),
    ]);
    setProfile(p); setAssignments(allowed);
    const userIds = new Set((queries[10].data ?? []).map((u: any) => u.user_id));
    const storedBrands = queries[0].data ?? [];
    const brands = allowed.map((brand) => storedBrands.find((row: any) => row.brand === brand) ?? { brand, content: LOCAL_CONTENT[brand], draft_content: LOCAL_CONTENT[brand] });
    setData({ brands, media: queries[1].data ?? [], alerts: queries[2].data ?? [], faqs: queries[3].data ?? [], packages: queries[4].data ?? [], events: queries[5].data ?? [], global: queries[6].data ?? [], settings: queries[7].data ?? [], revisions: queries[8].data ?? [], audit: queries[9].data ?? [], users: queries[10].data ?? [], requests: (queries[11].data ?? []).filter((r: any) => !userIds.has(r.user_id)), invites: queries[12].data ?? [] });
    setStatus("Live");
  }, []);

  useEffect(() => {
    if (!sb) { setStatus("Supabase is not configured"); return; }
    let active = true;
    sb.auth.getSession().then(({ data }) => {
      if (!active) return;
      sessionRef.current = data.session;
      setSession(data.session);
      setAuthReady(true);
      if (data.session) load(data.session); else setStatus("Signed out");
    });
    const { data: listener } = sb.auth.onAuthStateChange((event, next) => {
      sessionRef.current = next;
      setSession(next);
      setAuthReady(true);
      if (!next) { setProfile(null); setStatus("Signed out"); return; }
      if (event === "SIGNED_IN" || event === "USER_UPDATED") setTimeout(() => load(next), 0);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [load]);

  if (!sb) return <CmsMessage title="CMS setup needed">Add the public Supabase URL and anonymous key to this deployment.</CmsMessage>;
  if (!authReady) return <CmsMessage title="Opening CMS">Checking your secure session…</CmsMessage>;
  if (!session) return <PhoneLogin />;
  if (!profile && status.startsWith("Access check failed")) return <CmsMessage title="Unable to verify access"><p>{status}</p><button className="cms-button cms-button-muted" onClick={() => location.reload()}>Try again</button></CmsMessage>;
  if (!profile) return <CmsMessage title="Access requested">Your phone number is verified. An administrator needs to approve CMS access before you can continue.<button className="cms-button cms-button-muted" onClick={() => sb!.auth.signOut()}>Use another number</button></CmsMessage>;

  return (
    <div className="cms-app">
      <aside className="cms-sidebar">
        <div><strong>Texoma Destinations</strong><span>Brand publishing</span></div>
        <nav>{NAV.filter(([key]) => key !== "staff" || profile.role === "admin").map(([key, label]) => <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{label}</button>)}</nav>
        <div className="cms-user"><strong>{profile.display_name || profile.phone}</strong><span>{profile.role.replace("_", " ")}</span><button onClick={() => sb!.auth.signOut()}>Sign out</button></div>
      </aside>
      <main className="cms-main">
        <header className="cms-topbar"><div><h1>{NAV.find(([key]) => key === tab)?.[1]}</h1><p>{tabDescription(tab)}</p></div><span className="cms-live-dot">{status}</span></header>
        {tab === "overview" && <Overview data={data} assignments={assignments} />}
        {tab === "sites" && <SiteEditor rows={(data.brands ?? []) as BrandRow[]} canWrite={profile.role !== "viewer"} onChanged={() => load()} />}
        {tab === "media" && <MediaLibrary rows={data.media ?? []} assignments={assignments} canWrite={profile.role !== "viewer"} onChanged={() => load()} />}
        {tab === "alerts" && <CollectionEditor type="alerts" rows={data.alerts ?? []} assignments={assignments} canWrite={profile.role !== "viewer"} onChanged={() => load()} />}
        {tab === "faqs" && <CollectionEditor type="faqs" rows={data.faqs ?? []} assignments={assignments} canWrite={profile.role !== "viewer"} onChanged={() => load()} />}
        {tab === "packages" && <CollectionEditor type="packages" rows={data.packages ?? []} assignments={assignments} canWrite={profile.role !== "viewer"} onChanged={() => load()} />}
        {tab === "events" && <CollectionEditor type="events" rows={data.events ?? []} assignments={assignments} canWrite={profile.role !== "viewer"} onChanged={() => load()} />}
        {tab === "global" && <GlobalEditor rows={data.global ?? []} settings={data.settings ?? []} assignments={assignments} leader={profile.role === "admin" || profile.role === "director"} onChanged={() => load()} />}
        {tab === "staff" && <StaffEditor users={data.users ?? []} requests={data.requests ?? []} invites={data.invites ?? []} onChanged={() => load()} />}
        {tab === "activity" && <Activity rows={data.audit ?? []} revisions={data.revisions ?? []} onChanged={() => load()} />}
      </main>
    </div>
  );
}

function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  async function send() {
    setMessage("Sending code…");
    const value = toE164US(phone);
    if (!value) { setMessage("Enter a valid 10-digit U.S. mobile number."); return; }
    const { error } = await sb!.auth.signInWithOtp({ phone: value });
    if (error) setMessage(error.message); else { setPhone(value); setSent(true); setMessage("Code sent"); }
  }
  async function verify() {
    setMessage("Checking code…");
    const { error } = await sb!.auth.verifyOtp({ phone, token: code, type: "sms" });
    if (error) setMessage(error.message);
  }
  return <div className="cms-login"><div className="cms-login-card"><div className="cms-mark">TD</div><p className="cms-kicker">Texoma Destinations</p><h1>Brand publishing</h1><p>Use the mobile number connected to your staff account.</p>{!sent ? <><label>Mobile number<input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="903 555 0123" /></label><button className="cms-button" onClick={send}>Text me a code</button></> : <><label>Six-digit code<input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" className="cms-otp" /></label><button className="cms-button" onClick={verify}>Verify and continue</button><button className="cms-link" onClick={() => setSent(false)}>Use another number</button></>}<span className="cms-form-note">{message}</span></div></div>;
}

function CmsMessage({ title, children }: { title: string; children: React.ReactNode }) { return <div className="cms-login"><div className="cms-login-card"><div className="cms-mark">TD</div><h1>{title}</h1><div className="cms-message-body">{children}</div></div></div>; }
function tabDescription(tab: Tab) {
  return ({ overview: "What is live, scheduled, and waiting for attention.", sites: "Edit approved copy and images without changing page design.", media: "Upload, reuse, and archive brand photography.", alerts: "Schedule one dismissible message across one or more sites.", faqs: "Maintain site-specific answers and search-friendly FAQ data.", packages: "Publish the same offer consistently across selected brands.", events: "Schedule event information and tracked registration links.", global: "Manage shared TAP content and each brand’s contact details.", staff: "Approve access, assign roles, and limit site access.", activity: "A record of publishing and content changes." } as Record<Tab,string>)[tab];
}

function Overview({ data, assignments }: { data: Record<string, any[]>; assignments: string[] }) {
  const now = Date.now();
  const scheduled = [...(data.alerts ?? []), ...(data.events ?? [])].filter((r) => r.published && r.starts_at && new Date(r.starts_at).getTime() > now).length;
  const drafts = (data.brands ?? []).filter((r) => JSON.stringify(r.draft_content) !== JSON.stringify(r.content)).length;
  return <div className="cms-dashboard"><div className="cms-metrics"><Metric value={assignments.length} label="Sites available" /><Metric value={drafts} label="Unpublished drafts" /><Metric value={scheduled} label="Scheduled items" /><Metric value={(data.media ?? []).length} label="Media assets" /></div><section className="cms-panel"><h2>Your sites</h2><div className="cms-site-grid">{assignments.map((brand) => { const row = data.brands?.find((r) => r.brand === brand); return <article key={brand}><span className="cms-site-initial">{BRAND_NAMES[brand]?.slice(0,2)}</span><div><strong>{BRAND_NAMES[brand]}</strong><small>Last published {formatDate(row?.published_at ?? row?.updated_at)}</small></div><a href={"/sites/" + brand} target="_blank">View site ↗</a></article>; })}</div></section></div>;
}
function Metric({ value, label }: { value: number; label: string }) { return <div className="cms-metric"><strong>{value}</strong><span>{label}</span></div>; }

function SiteEditor({ rows, canWrite, onChanged }: { rows: BrandRow[]; canWrite: boolean; onChanged: () => void }) {
  const [brand, setBrand] = useState(rows[0]?.brand ?? "");
  const row = rows.find((r) => r.brand === brand) ?? rows[0];
  const [draft, setDraft] = useState<Record<string, any>>(row?.draft_content ?? row?.content ?? {});
  const [view, setView] = useState<"desktop"|"mobile">("desktop");
  const [saved, setSaved] = useState("All changes saved");
  const draftRef = useRef(draft); draftRef.current = draft;
  useEffect(() => { if (row) { setBrand(row.brand); setDraft(row.draft_content ?? row.content); } }, [row?.brand]);
  useEffect(() => { if (!canWrite || !brand) return; const timer = setInterval(() => save(false), 300000); return () => clearInterval(timer); }, [brand, canWrite]);
  async function save(publish: boolean) {
    setSaved(publish ? "Publishing…" : "Saving…");
    if (publish) await sb!.from("content_revisions").insert({ entity_type: "brand_content", entity_id: brand, brand, snapshot: row.content, action: "publish", created_by: (await sb!.auth.getUser()).data.user?.id });
    const update = publish ? { content: draftRef.current, draft_content: draftRef.current, published_at: new Date().toISOString() } : { draft_content: draftRef.current };
    const { error } = await sb!.from("brand_content").upsert({ brand, ...update });
    if (!error) await log(publish ? "publish" : "save_draft", "brand_content", brand, brand);
    if (!error && publish) await refreshPublicSite(brand);
    setSaved(error ? error.message : publish ? "Live" : "Draft saved"); if (!error) onChanged();
  }
  if (!row) return <Empty title="No site content is available">Ask an administrator to assign a site to your account.</Empty>;
  const fields = editableFields(draft);
  const warnings = contentWarnings(draft);
  return <div className="cms-editor-grid"><section className="cms-panel cms-fields"><div className="cms-editor-actions"><select value={brand} onChange={(e) => { const next = rows.find((r) => r.brand === e.target.value)!; setBrand(next.brand); setDraft(next.draft_content ?? next.content); }}><option value="" disabled>Choose a site</option>{rows.map((r) => <option key={r.brand} value={r.brand}>{BRAND_NAMES[r.brand]}</option>)}</select><span>{saved}</span></div>{warnings.length > 0 && <div className="cms-warnings"><strong>Check before publishing</strong>{warnings.map((warning) => <span key={warning}>{warning}</span>)}</div>}<div className="cms-field-list">{fields.map((field) => <label key={field.path}><span>{field.label}</span>{field.kind === "image" && field.value && <img src={field.value} alt="" />}{field.value.length > 90 && field.kind === "text" ? <textarea rows={4} value={field.value} disabled={!canWrite} onChange={(e) => { setDraft(setAtPath(draft, field.path, e.target.value)); setSaved("Unsaved changes"); }} /> : <input type={field.kind === "url" || field.kind === "image" ? "url" : "text"} value={field.value} disabled={!canWrite} onChange={(e) => { setDraft(setAtPath(draft, field.path, e.target.value)); setSaved("Unsaved changes"); }} />}</label>)}</div><footer className="cms-sticky-actions"><button className="cms-button cms-button-muted" disabled={!canWrite} onClick={() => save(false)}>Save draft</button><button className="cms-button" disabled={!canWrite || warnings.length > 0} title={warnings.length ? "Resolve content warnings before publishing" : ""} onClick={() => save(true)}>Publish now</button></footer></section><section className="cms-preview-panel"><div><strong>Live preview</strong><span><button className={view === "desktop" ? "active" : ""} onClick={() => setView("desktop")}>Desktop</button><button className={view === "mobile" ? "active" : ""} onClick={() => setView("mobile")}>Mobile</button></span></div><iframe title={BRAND_NAMES[brand] + " preview"} className={view} src={"/sites/" + brand + "?cms_preview=1"} /></section></div>;
}

function MediaLibrary({ rows, assignments, canWrite, onChanged }: { rows: any[]; assignments: string[]; canWrite: boolean; onChanged: () => void }) {
  const [brand, setBrand] = useState(assignments[0] ?? ""); const [alt, setAlt] = useState(""); const [busy, setBusy] = useState(false);
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file || !alt.trim()) return;
    if (file.size > 15 * 1024 * 1024) return alert("Choose an image under 15 MB.");
    const dimensions = await new Promise<{width:number;height:number}>((resolve, reject) => { const image = new Image(); const url = URL.createObjectURL(file); image.onload = () => { resolve({width:image.naturalWidth,height:image.naturalHeight}); URL.revokeObjectURL(url); }; image.onerror = reject; image.src = url; });
    if (dimensions.width < 800 || dimensions.height < 500) return alert("This image is too small. Choose one at least 800 × 500 pixels.");
    setBusy(true); const path = (brand || "shared") + "/" + Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const { error: uploadError } = await sb!.storage.from("brand-media").upload(path, file, { contentType: file.type });
    if (!uploadError) { const publicUrl = sb!.storage.from("brand-media").getPublicUrl(path).data.publicUrl; const user = (await sb!.auth.getUser()).data.user; const { error } = await sb!.from("media_assets").insert({ brand: brand || null, storage_path: path, public_url: publicUrl, filename: file.name, mime_type: file.type, width: dimensions.width, height: dimensions.height, alt_text: alt.trim(), created_by: user?.id }); if (!error) { await log("upload", "media_assets", path, brand); setAlt(""); onChanged(); } else alert(error.message); } else alert(uploadError.message); setBusy(false);
  }
  return <><section className="cms-panel cms-upload"><div><h2>Upload an image</h2><p>Images are shared in the library but remain assigned to a brand. Alt text is required.</p></div><select value={brand} onChange={(e) => setBrand(e.target.value)}>{assignments.map((b) => <option key={b} value={b}>{BRAND_NAMES[b]}</option>)}</select><input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image for accessibility" /><label className={"cms-button " + (!alt || !canWrite ? "disabled" : "")}>{busy ? "Uploading…" : "Choose image"}<input hidden type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={!alt || !canWrite || busy} onChange={upload} /></label></section><div className="cms-media-grid">{rows.map((item) => <article key={item.id}><img src={item.public_url} alt={item.alt_text} /><div><strong>{item.alt_text}</strong><span>{BRAND_NAMES[item.brand] ?? "Shared"} · {item.filename}</span><button onClick={() => navigator.clipboard.writeText(item.public_url)}>Copy URL</button></div></article>)}</div></>;
}

function CollectionEditor({ type, rows, assignments, canWrite, onChanged }: { type: "alerts"|"faqs"|"packages"|"events"; rows: any[]; assignments: string[]; canWrite: boolean; onChanged: () => void }) {
  const [editing, setEditing] = useState<any>(null);
  const visibleRows = rows.filter((row) => type === "faqs" ? assignments.includes(row.brand) : row.show_on_sites?.some((b: string) => assignments.includes(b)));
  return <><div className="cms-collection-head"><div><strong>{visibleRows.length} {type}</strong><span>Expired and unpublished items remain here for reuse.</span></div>{canWrite && <button className="cms-button" onClick={() => setEditing(emptyItem(type, assignments[0]))}>New {type === "faqs" ? "FAQ" : type.slice(0,-1)}</button>}</div>{editing && <RecordForm type={type} value={editing} assignments={assignments} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); onChanged(); }} />}<div className="cms-table">{visibleRows.map((row) => <button key={row.id} onClick={() => setEditing(row)}><span><strong>{row.title ?? row.question ?? row.text}</strong><small>{type === "faqs" ? BRAND_NAMES[row.brand] : row.show_on_sites?.map((b:string) => BRAND_NAMES[b]).join(" · ")}</small></span><span className={row.published ? "cms-status-live" : "cms-status-draft"}>{row.published ? isExpired(row) ? "Expired" : "Published" : "Draft"}</span><span>Review →</span></button>)}</div></>;
}

function RecordForm({ type, value, assignments, onCancel, onSaved }: { type: "alerts"|"faqs"|"packages"|"events"; value: any; assignments: string[]; onCancel: () => void; onSaved: () => void }) {
  const [row, setRow] = useState<any>({ ...value }); const [saving, setSaving] = useState(false);
  const set = (key: string, val: any) => setRow((r:any) => ({ ...r, [key]: val }));
  async function save() {
    setSaving(true); const table = type; const cleaned = { ...row };
    if (type === "packages" && typeof cleaned.details === "string") cleaned.details = cleaned.details.split("\n").filter(Boolean);
    if (type === "alerts" && cleaned.published && cleaned.show_on_sites?.length) {
      const { data: existing } = await sb!.from("alerts").select("id,show_on_sites").eq("published", true).overlaps("show_on_sites", cleaned.show_on_sites);
      const oldIds = (existing ?? []).filter((item) => item.id !== cleaned.id).map((item) => item.id);
      if (oldIds.length) await sb!.from("alerts").update({ published: false }).in("id", oldIds);
    }
    const { error } = await sb!.from(table).upsert(cleaned).select().single();
    if (error) alert(error.message); else { await log(row.id ? "update" : "create", table, row.id, row.brand ?? row.show_on_sites?.[0], { sites: row.show_on_sites }); await refreshPublicSite(type === "faqs" ? row.brand : undefined); onSaved(); } setSaving(false);
  }
  const multi = type !== "faqs";
  return <section className="cms-panel cms-record-form"><div className="cms-form-grid">{type === "faqs" ? <><Field label="Question"><input value={row.question ?? ""} onChange={(e) => set("question", e.target.value)} /></Field><Field label="Answer" wide><textarea rows={5} value={row.answer ?? ""} onChange={(e) => set("answer", e.target.value)} /></Field><Field label="Site"><select value={row.brand} onChange={(e) => set("brand", e.target.value)}>{assignments.map((b) => <option key={b} value={b}>{BRAND_NAMES[b]}</option>)}</select></Field><Field label="Order"><input type="number" value={row.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value))} /></Field></> : type === "alerts" ? <><Field label="Message" wide><textarea rows={3} value={row.text ?? ""} onChange={(e) => set("text", e.target.value)} /></Field><Field label="Promo code"><input value={row.promo_code ?? ""} onChange={(e) => set("promo_code", e.target.value)} /></Field><Field label="Priority"><input type="number" value={row.priority ?? 0} onChange={(e) => set("priority", Number(e.target.value))} /></Field><Field label="Button label"><input value={row.cta_label ?? ""} onChange={(e) => set("cta_label", e.target.value)} /></Field><Field label="Button URL"><input type="url" value={row.cta_url ?? ""} onChange={(e) => set("cta_url", e.target.value)} /></Field><Field label="Starts"><input type="datetime-local" value={(row.starts_at ?? "").slice(0,16)} onChange={(e) => set("starts_at", e.target.value)} /></Field><Field label="Ends"><input type="datetime-local" value={(row.ends_at ?? "").slice(0,16)} onChange={(e) => set("ends_at", e.target.value)} /></Field></> : <><Field label="Title"><input value={row.title ?? ""} onChange={(e) => set("title", e.target.value)} /></Field><Field label="Slug"><input value={row.slug ?? ""} onChange={(e) => set("slug", e.target.value)} /></Field><Field label="Summary" wide><textarea rows={4} value={row.summary ?? ""} onChange={(e) => set("summary", e.target.value)} /></Field><Field label="Image URL" wide><input type="url" value={row.image ?? ""} onChange={(e) => set("image", e.target.value)} /></Field><Field label="Price"><input value={row.price_text ?? ""} onChange={(e) => set("price_text", e.target.value)} /></Field>{type === "events" ? <><Field label="Starts"><input type="datetime-local" value={(row.starts_at ?? "").slice(0,16)} onChange={(e) => set("starts_at", e.target.value)} /></Field><Field label="Ends"><input type="datetime-local" value={(row.ends_at ?? "").slice(0,16)} onChange={(e) => set("ends_at", e.target.value)} /></Field><Field label="Location"><input value={row.location ?? ""} onChange={(e) => set("location", e.target.value)} /></Field><Field label="Capacity"><input value={row.capacity ?? ""} onChange={(e) => set("capacity", e.target.value)} /></Field></> : <><Field label="Details, one per line" wide><textarea rows={4} value={Array.isArray(row.details) ? row.details.join("\n") : row.details ?? ""} onChange={(e) => set("details", e.target.value)} /></Field><Field label="Promo code"><input value={row.promo_code ?? ""} onChange={(e) => set("promo_code", e.target.value)} /></Field><Field label="Terms"><input value={row.terms ?? ""} onChange={(e) => set("terms", e.target.value)} /></Field><Field label="Valid from"><input type="date" value={row.valid_from ?? ""} onChange={(e) => set("valid_from", e.target.value)} /></Field><Field label="Valid through"><input type="date" value={row.valid_to ?? ""} onChange={(e) => set("valid_to", e.target.value)} /></Field></>}<Field label="Button label"><input value={row.cta_label ?? ""} onChange={(e) => set("cta_label", e.target.value)} /></Field><Field label="Button URL"><input type="url" value={row.cta_url ?? ""} onChange={(e) => set("cta_url", e.target.value)} /></Field></>}{multi && <fieldset className="cms-sites-field"><legend>Show on sites</legend>{assignments.map((b) => <label key={b}><input type="checkbox" checked={(row.show_on_sites ?? []).includes(b)} onChange={(e) => set("show_on_sites", e.target.checked ? [...(row.show_on_sites ?? []), b] : (row.show_on_sites ?? []).filter((x:string) => x !== b))} />{BRAND_NAMES[b]}</label>)}</fieldset>}<label className="cms-publish-check"><input type="checkbox" checked={Boolean(row.published)} onChange={(e) => set("published", e.target.checked)} /> Publish this item</label></div><footer><button className="cms-button cms-button-muted" onClick={onCancel}>Cancel</button><button className="cms-button" onClick={save} disabled={saving}>{saving ? "Saving…" : multi && row.show_on_sites?.length > 1 ? "Save to " + row.show_on_sites.length + " sites" : "Save"}</button></footer></section>;
}

function GlobalEditor({ rows, settings, assignments, leader, onChanged }: { rows: any[]; settings: any[]; assignments: string[]; leader: boolean; onChanged: () => void }) {
  const existingTap = rows.find((r) => r.key === "tap")?.value ?? { enabled: true, image: "/brands/tap-pass.png", heading: "More lake. More savings.", body: "TAP into benefits across the Texoma Destinations family.", button_label: "Explore TAP", button_url: "https://texomadestinations.com/tap" };
  const existingFooter = rows.find((r) => r.key === "footer")?.value ?? { family_heading: "The Texoma Destinations family", hub_label: "Book everything at texomadestinations.com", hub_url: "https://texomadestinations.com/", bigwater_heading: "BigWater.co — Premium Marine Lifestyle", bigwater_url: "https://bigwater.co/", marine_label: "Big Water Marine", marine_url: "https://bigwatermarine.com/", tow_label: "TowBoatUS North Texas", tow_url: "https://towboatusntx.com/" };
  const [tap, setTap] = useState(existingTap); const [footer, setFooter] = useState(existingFooter); const [brand, setBrand] = useState(assignments[0] ?? ""); const current = settings.find((r) => r.brand === brand) ?? { brand };
  const [contact, setContact] = useState(current);
  useEffect(() => setContact(settings.find((r) => r.brand === brand) ?? { brand }), [brand]);
  async function saveTap() { const { error } = await sb!.from("global_settings").upsert({ key: "tap", value: tap }); if (error) alert(error.message); else { await log("update","global_settings","tap"); onChanged(); } }
  async function saveFooter() { const { error } = await sb!.from("global_settings").upsert({ key: "footer", value: footer }); if (error) alert(error.message); else { await log("update","global_settings","footer"); onChanged(); } }
  async function saveContact() { const { error } = await sb!.from("brand_settings").upsert(contact); if (error) alert(error.message); else { await log("update","brand_settings",brand,brand); onChanged(); } }
  return <div className="cms-stack"><section className="cms-panel"><p className="cms-kicker">Shared across the family</p><h2>TAP promotion</h2><div className="cms-form-grid"><Field label="Image URL" wide><input value={tap.image ?? ""} onChange={(e) => setTap({...tap,image:e.target.value})} /></Field><Field label="Heading"><input value={tap.heading ?? ""} onChange={(e) => setTap({...tap,heading:e.target.value})} /></Field><Field label="Button label"><input value={tap.button_label ?? ""} onChange={(e) => setTap({...tap,button_label:e.target.value})} /></Field><Field label="Description" wide><textarea rows={3} value={tap.body ?? ""} onChange={(e) => setTap({...tap,body:e.target.value})} /></Field><Field label="Destination URL" wide><input value={tap.button_url ?? ""} onChange={(e) => setTap({...tap,button_url:e.target.value})} /></Field></div>{leader && <button className="cms-button" onClick={saveTap}>Publish to all sites</button>}</section><section className="cms-panel"><p className="cms-kicker">Shared footer links</p><h2>Brand family footer</h2><div className="cms-form-grid">{Object.keys(existingFooter).map((key) => <Field key={key} label={key.replaceAll("_"," ")}><input value={footer[key] ?? ""} onChange={(e) => setFooter({...footer,[key]:e.target.value})} /></Field>)}</div>{leader && <button className="cms-button" onClick={saveFooter}>Publish footer to all sites</button>}</section><section className="cms-panel"><p className="cms-kicker">Site information</p><h2>Contact and social details</h2><select value={brand} onChange={(e) => setBrand(e.target.value)}>{assignments.map((b) => <option key={b} value={b}>{BRAND_NAMES[b]}</option>)}</select><div className="cms-form-grid">{["street_address","city","region","postal_code","phone","phone_e164","email","facebook","instagram","tiktok"].map((key) => <Field key={key} label={key.replaceAll("_"," ")}><input value={contact[key] ?? ""} onChange={(e) => setContact({...contact,[key]:e.target.value})} /></Field>)}</div><p className="cms-form-note">Blank social fields automatically fall back to Texoma Destinations.</p><button className="cms-button" onClick={saveContact}>Save site details</button></section></div>;
}

function StaffEditor({ users, requests, invites, onChanged }: { users: any[]; requests: any[]; invites: any[]; onChanged: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("site_manager");
  const [sites, setSites] = useState<string[]>([]);
  async function invite() {
    const normalized = toE164US(phone);
    if (!normalized || !name.trim()) return alert("Enter a name and valid 10-digit U.S. mobile number.");
    if (role === "site_manager" && sites.length === 0) return alert("Choose at least one site for a site manager.");
    const { data: auth } = await sb!.auth.getUser();
    const { error } = await sb!.from("cms_invites").upsert({ phone: normalized, display_name: name.trim(), role, sites: role === "site_manager" ? sites : [], invited_by: auth.user?.id });
    if (error) return alert(error.message);
    await log("invite", "cms_users", normalized, undefined, { role, sites });
    setName(""); setPhone(""); setRole("site_manager"); setSites([]); onChanged();
  }
  async function approve(req: any) { const { error } = await sb!.from("cms_users").insert({ user_id: req.user_id, phone: req.phone, display_name: req.phone, role: "site_manager", active: true }); if (!error) { await sb!.from("cms_access_requests").delete().eq("user_id", req.user_id); await log("approve","cms_users",req.user_id); onChanged(); } else alert(error.message); }
  async function update(user: any, patch: any) { const { error } = await sb!.from("cms_users").update(patch).eq("user_id", user.user_id); if (error) alert(error.message); else { await log("update","cms_users",user.user_id); onChanged(); } }
  async function updateSites(user: any, brand: string, checked: boolean) {
    if (checked) {
      const { error } = await sb!.from("cms_user_sites").insert({ user_id: user.user_id, brand });
      if (error) return alert(error.message);
    } else {
      const { error } = await sb!.from("cms_user_sites").delete().eq("user_id", user.user_id).eq("brand", brand);
      if (error) return alert(error.message);
    }
    await log("assign_sites","cms_users",user.user_id,brand); onChanged();
  }
  return <div className="cms-stack"><section className="cms-panel"><p className="cms-kicker">Invite staff</p><h2>Add a CMS user</h2><div className="cms-form-grid"><Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} /></Field><Field label="Mobile number"><input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="903 555 0123" /></Field><Field label="Role"><select value={role} onChange={(e) => setRole(e.target.value as Role)}>{["admin","director","site_manager"].map((r) => <option key={r} value={r}>{r.replace("_"," ")}</option>)}</select></Field></div>{role === "site_manager" && <div className="cms-staff-sites">{ALL_BRANDS.map((brand) => <label key={brand}><input type="checkbox" checked={sites.includes(brand)} onChange={(e) => setSites(e.target.checked ? [...sites, brand] : sites.filter((s) => s !== brand))} />{BRAND_NAMES[brand]}</label>)}</div>}<button className="cms-button" onClick={invite}>Add staff member</button>{invites.length > 0 && <p className="cms-form-note">Pending invitations: {invites.map((i) => `${i.display_name} (${i.phone})`).join(", ")}</p>}</section>{requests.length > 0 && <section className="cms-panel"><h2>Uninvited access requests</h2>{requests.map((r) => <div className="cms-staff-row" key={r.user_id}><span><strong>{r.phone}</strong><small>Requested {formatDate(r.requested_at)}</small></span><button className="cms-button" onClick={() => approve(r)}>Approve as site manager</button></div>)}</section>}<section className="cms-panel"><h2>Staff accounts</h2>{users.map((u) => <div className="cms-staff-card" key={u.user_id}><div className="cms-staff-row"><span><strong>{u.display_name || u.phone}</strong><small>Last login {formatDate(u.last_login_at)}</small></span><select value={u.role} onChange={(e) => update(u,{role:e.target.value})}>{["admin","director","site_manager"].map((r) => <option key={r} value={r}>{r.replace("_"," ")}</option>)}</select><label><input type="checkbox" checked={u.active} onChange={(e) => update(u,{active:e.target.checked})} /> Active</label></div>{u.role === "site_manager" && <div className="cms-staff-sites">{ALL_BRANDS.map((brand) => <label key={brand}><input type="checkbox" checked={(u.cms_user_sites ?? []).some((s:any) => s.brand === brand)} onChange={(e) => updateSites(u,brand,e.target.checked)} />{BRAND_NAMES[brand]}</label>)}</div>}</div>)}</section></div>;
}
function Activity({ rows, revisions, onChanged }: { rows: any[]; revisions: any[]; onChanged: () => void }) {
  async function restore(revision: any) { const { error } = await sb!.from("brand_content").update({ draft_content: revision.snapshot }).eq("brand", revision.brand); if (error) alert(error.message); else { await log("restore_draft","brand_content",revision.brand,revision.brand,{revision:revision.id}); onChanged(); } }
  return <div className="cms-stack">{revisions.length > 0 && <section className="cms-panel"><h2>Restorable site versions</h2>{revisions.filter((r) => r.entity_type === "brand_content").map((r) => <div className="cms-staff-row" key={r.id}><span><strong>{BRAND_NAMES[r.brand]}</strong><small>Published {formatDate(r.created_at)}</small></span><button className="cms-button cms-button-muted" onClick={() => restore(r)}>Restore as draft</button></div>)}</section>}<div className="cms-table">{rows.map((row) => <div key={row.id}><span><strong>{row.action.replaceAll("_"," ")}</strong><small>{row.entity_type} · {row.brand ? BRAND_NAMES[row.brand] : "Global"}</small></span><span>{formatDate(row.created_at)}</span></div>)}</div></div>;
}
function Empty({ title, children }: { title: string; children: React.ReactNode }) { return <div className="cms-empty"><strong>{title}</strong><p>{children}</p></div>; }
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>; }
function emptyItem(type: string, brand: string) { const id = crypto.randomUUID(); if (type === "faqs") return { id, brand, question: "", answer: "", sort_order: 0, published: false }; if (type === "alerts") return { id, text: "", show_on_sites: [brand], priority: 0, published: false, dismissible: true }; return { id, slug: "", title: "", summary: "", show_on_sites: [brand], published: false, sort_order: 0, starts_at: type === "events" ? new Date().toISOString().slice(0,16) : undefined }; }
function isExpired(row: any) { const end = row.ends_at ?? row.valid_to; return end && new Date(end).getTime() < Date.now(); }
async function log(action: string, entityType: string, entityId?: string, brand?: string, details: Record<string,unknown> = {}) { const user = (await sb!.auth.getUser()).data.user; if (user) await sb!.from("cms_audit_log").insert({ user_id: user.id, action, entity_type: entityType, entity_id: entityId, brand: brand || null, details }); }
async function refreshPublicSite(brand?: string) { const token = (await sb!.auth.getSession()).data.session?.access_token; if (token) await fetch("/api/admin/revalidate", { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + token }, body: JSON.stringify({ brand }) }); }
