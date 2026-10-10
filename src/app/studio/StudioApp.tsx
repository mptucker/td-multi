"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

type Role = "admin" | "director" | "site_manager" | "editor" | "viewer";
type Profile = { user_id: string; display_name: string; phone?: string; role: Role; active: boolean };
type StudioResult = {
  summary: string;
  verification: string[];
  files: string[];
  branch: string;
  sha: string;
  pullRequestNumber: number;
  pullRequestUrl: string;
  previewUrl?: string | null;
  previewState?: string;
  status: string;
};

const BRAND_NAMES: Record<string, string> = {
  lighthouse: "Lighthouse Resort & Marina",
  paradise: "Paradise on Lake Texoma",
  sundance: "Sundance Camp",
  "island-view": "Island View Park",
  fastrac: "Fastrac Cruises",
  "water-taxi": "Texoma Water Taxi",
  "tackle-box": "Tackle Box Outfitters",
  boaterwise: "BoaterWise",
  bigwater: "BigWater.co",
  "towboatus-ntx": "TowBoatUS North Texas",
};
const ALL_BRANDS = Object.keys(BRAND_NAMES);
let sb = supabaseBrowser();

function toE164US(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  return null;
}

export function StudioApp({ supabaseUrl, supabaseKey }: { supabaseUrl: string; supabaseKey: string }) {
  sb ??= supabaseBrowser(supabaseUrl, supabaseKey);
  const [session, setSession] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [authMessage, setAuthMessage] = useState("Opening Studio…");

  const loadProfile = useCallback(async (activeSession: any) => {
    if (!sb || !activeSession) return;
    const { data: user, error } = await sb.from("cms_users").select("*").eq("user_id", activeSession.user.id).maybeSingle();
    if (error || !user?.active) { setProfile(null); setAuthMessage(error?.message || "Your CMS access is not active."); return; }
    const { data: assignments } = await sb.from("cms_user_sites").select("brand").eq("user_id", activeSession.user.id);
    setProfile(user);
    setBrands(user.role === "admin" || user.role === "director" ? ALL_BRANDS : (assignments || []).map((row) => row.brand));
  }, []);

  useEffect(() => {
    if (!sb) { setReady(true); setAuthMessage("Supabase is not configured."); return; }
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session); setReady(true);
      if (data.session) loadProfile(data.session);
    });
    const { data } = sb.auth.onAuthStateChange((_event, next) => {
      setSession(next); setReady(true);
      if (next) setTimeout(() => loadProfile(next), 0); else setProfile(null);
    });
    return () => data.subscription.unsubscribe();
  }, [loadProfile]);

  if (!sb) return <StudioMessage title="Studio setup needed">Add the public Supabase configuration to this deployment.</StudioMessage>;
  if (!ready) return <StudioMessage title="Opening Studio">Checking your secure session…</StudioMessage>;
  if (!session) return <StudioLogin />;
  if (!profile) return <StudioMessage title="Studio access unavailable"><p>{authMessage}</p><a href="/admin">Return to the CMS</a></StudioMessage>;

  return <StudioWorkspace profile={profile} brands={brands} accessToken={session.access_token} onSignOut={() => sb!.auth.signOut()} />;
}

function StudioWorkspace({ profile, brands, accessToken, onSignOut }: { profile: Profile; brands: string[]; accessToken: string; onSignOut: () => void }) {
  const [brand, setBrand] = useState(brands[0] || "");
  const [route, setRoute] = useState("");
  const [prompt, setPrompt] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<StudioResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canApprove = profile.role === "admin" || profile.role === "director";
  const canRequest = profile.role !== "viewer";
  const suggestions = useMemo(() => [
    "The font spacing in this section feels off. Use the screenshot to tighten the hierarchy and spacing.",
    "Rework this page so the sections flow as one cohesive story while preserving the existing content.",
    "Change the primary button in this section to link to the page I described.",
    "Add a focused landing page that explains why these offerings are a better choice, using only verified site content.",
  ], []);

  useEffect(() => {
    if (!brand && brands[0]) setBrand(brands[0]);
  }, [brand, brands]);

  useEffect(() => () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }, [imagePreview]);

  function chooseScreenshot(file: File | null) {
    setScreenshot(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  async function submit() {
    if (!brand || prompt.trim().length < 8) return;
    setBusy(true); setMessage("Studio is inspecting the selected site and preparing a safe preview…"); setResult(null);
    const body = new FormData();
    body.set("brand", brand); body.set("route", route); body.set("prompt", prompt);
    if (screenshot) body.set("screenshot", screenshot);
    try {
      const response = await fetch("/api/studio/change", { method: "POST", headers: { authorization: `Bearer ${accessToken}` }, body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Studio could not prepare the preview.");
      setResult(data); setMessage("Change prepared. Vercel is building an isolated preview.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Studio could not prepare the preview."); }
    finally { setBusy(false); }
  }

  async function refreshPreview() {
    if (!result) return;
    setMessage("Checking the preview deployment…");
    const response = await fetch(`/api/studio/status?pr=${result.pullRequestNumber}`, { headers: { authorization: `Bearer ${accessToken}` } });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || "Could not check the preview."); return; }
    setResult({ ...result, ...data });
    setMessage(data.previewState === "success" ? "Preview is ready to review." : data.previewState === "failure" || data.previewState === "error" ? "The preview build failed. Open the source review for details." : "The preview is still building. Check again in a moment.");
  }

  async function approve() {
    if (!result || !confirm("Publish this exact preview to production?")) return;
    setBusy(true); setMessage("Sending the approved change to production…");
    try {
      const response = await fetch("/api/studio/approve", { method: "POST", headers: { authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ pullRequestNumber: result.pullRequestNumber, confirmation: "PUBLISH" }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not publish this change.");
      setResult({ ...result, status: "published" }); setMessage("Approved. The production deployment is now underway.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not publish this change."); }
    finally { setBusy(false); }
  }

  return <div className="studio-shell">
    <header className="studio-header">
      <a className="studio-brand" href="/admin"><span>TD</span><div><strong>Site Studio</strong><small>Texoma Destinations</small></div></a>
      <div className="studio-user"><div><strong>{profile.display_name || profile.phone}</strong><small>{profile.role.replace("_", " ")}</small></div><a href="/admin">CMS</a><button onClick={onSignOut}>Sign out</button></div>
    </header>
    <main className="studio-main">
      <section className="studio-intro"><p className="studio-kicker">Prompt-driven site changes</p><h1>Describe what feels wrong.<br/><em>See the fix before it goes live.</em></h1><p>Choose the site, point Studio toward a page or section, and explain the outcome you want. A screenshot is often the fastest way to show what you mean.</p></section>
      <div className="studio-grid">
        <section className="studio-composer">
          <div className="studio-step"><span>01</span><div><label htmlFor="studio-site">Choose the site</label><select id="studio-site" value={brand} onChange={(event) => setBrand(event.target.value)} disabled={busy}>{brands.map((item) => <option key={item} value={item}>{BRAND_NAMES[item]}</option>)}</select></div></div>
          <div className="studio-step"><span>02</span><div><label htmlFor="studio-route">Page or section <small>optional</small></label><input id="studio-route" value={route} onChange={(event) => setRoute(event.target.value)} placeholder="Home page, hero, /stay, membership section…" disabled={busy}/></div></div>
          <div className="studio-step studio-step-prompt"><span>03</span><div><label htmlFor="studio-prompt">What should change?</label><textarea id="studio-prompt" rows={8} value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Talk to Studio like you would talk to a designer…" disabled={busy}/><div className="studio-suggestions">{suggestions.slice(0,3).map((item) => <button type="button" key={item} onClick={() => setPrompt(item)}>{item}</button>)}</div></div></div>
          <div className="studio-step"><span>04</span><div><label>Show us what you mean <small>optional</small></label><button type="button" className="studio-upload" onClick={() => inputRef.current?.click()} disabled={busy}>{imagePreview ? <img src={imagePreview} alt="Screenshot selected for this request"/> : <><b>＋</b><strong>Add a screenshot</strong><small>PNG, JPEG or WebP · up to 8 MB</small></>}</button><input ref={inputRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => chooseScreenshot(event.target.files?.[0] || null)}/>{imagePreview && <button type="button" className="studio-remove" onClick={() => chooseScreenshot(null)}>Remove screenshot</button>}</div></div>
          <footer className="studio-submit"><p><strong>Nothing changes live yet.</strong> Studio creates a separate preview for review.</p><button onClick={submit} disabled={!canRequest || busy || !brand || prompt.trim().length < 8}>{busy ? "Building preview…" : "Prepare preview →"}</button></footer>
        </section>
        <aside className="studio-review">
          {!result ? <div className="studio-empty"><span>PREVIEW</span><div className="studio-window"><i/><i/><i/><p>Your proposed change will appear here with a private review link.</p></div><ul><li>Works only within the selected site</li><li>Never changes CMS data or architecture</li><li>Requires human approval to publish</li></ul></div> : <div className="studio-result"><span className={`studio-state ${result.status === "published" ? "published" : ""}`}>{result.status === "published" ? "Published" : result.previewState === "success" ? "Preview ready" : result.previewState === "failure" || result.previewState === "error" ? "Build failed" : "Preview building"}</span><h2>{result.summary}</h2><div className="studio-file-list"><strong>Files changed</strong>{result.files.map((file) => <code key={file}>{file}</code>)}</div>{result.verification.length > 0 && <div className="studio-checks"><strong>Review these details</strong><ul>{result.verification.map((item) => <li key={item}>{item}</li>)}</ul></div>}<div className="studio-review-actions">{result.previewUrl ? <a href={result.previewUrl} target="_blank">Open visual preview ↗</a> : <button onClick={refreshPreview}>Check preview status</button>}<a className="secondary" href={result.pullRequestUrl} target="_blank">Review source ↗</a></div>{result.status !== "published" && canApprove && <button className="studio-approve" onClick={approve} disabled={busy || result.previewState !== "success"}>Approve this preview for production</button>}{result.status !== "published" && !canApprove && <p className="studio-approval-note">A director or administrator can publish after the preview has been reviewed.</p>}<button className="studio-start-over" onClick={() => { setResult(null); setMessage(""); }}>Start another request</button></div>}
          {message && <p className="studio-message" role="status">{message}</p>}
        </aside>
      </div>
    </main>
  </div>;
}

function StudioLogin() {
  const [phone, setPhone] = useState(""); const [code, setCode] = useState(""); const [sent, setSent] = useState(false); const [message, setMessage] = useState("");
  async function send() { const value = toE164US(phone); if (!value) { setMessage("Enter a valid 10-digit U.S. mobile number."); return; } setMessage("Sending code…"); const { error } = await sb!.auth.signInWithOtp({ phone: value }); if (error) setMessage(error.message); else { setPhone(value); setSent(true); setMessage("Code sent"); } }
  async function verify() { setMessage("Checking code…"); const { error } = await sb!.auth.verifyOtp({ phone, token: code, type: "sms" }); if (error) setMessage(error.message); }
  return <div className="cms-login"><div className="cms-login-card"><div className="cms-mark">TD</div><p className="cms-kicker">Texoma Destinations</p><h1>Site Studio</h1><p>Use the same verified mobile number as the CMS.</p>{!sent ? <><label>Mobile number<input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" placeholder="903 555 0123"/></label><button className="cms-button" onClick={send}>Text me a code</button></> : <><label>Six-digit code<input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0,6))} inputMode="numeric" autoComplete="one-time-code" className="cms-otp"/></label><button className="cms-button" onClick={verify}>Open Studio</button></>}<span className="cms-form-note">{message}</span></div></div>;
}

function StudioMessage({ title, children }: { title: string; children: React.ReactNode }) { return <div className="cms-login"><div className="cms-login-card"><div className="cms-mark">TD</div><h1>{title}</h1><div className="cms-message-body">{children}</div></div></div>; }
