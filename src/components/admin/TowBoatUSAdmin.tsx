"use client";

import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ImageRecord } from "@/components/towboatus-ntx/exact/data";
import type { Location, NetworkOperator, SiteConfig } from "@/components/towboatus-ntx/exact/types";

type Section = "locations" | "network" | "config" | "images";

const CATEGORIES = [
  ["hero", "Hero — desktop"],
  ["hero-mobile", "Hero — mobile"],
  ["location", "Location / lake"],
  ["service", "Service"],
  ["team", "Team / fleet"],
  ["coverage-map", "Coverage map"],
  ["gallery", "Gallery"],
] as const;

const CONFIG_LABELS: Record<string, string> = {
  dispatch_url: "Emergency dispatch URL",
  national_dispatch_phone: "National dispatch phone",
  national_vhf: "National VHF channel",
  boatus_join_url: "BoatUS membership URL",
  boatus_towing_url: "BoatUS towing-plan URL",
};

type Props = {
  client: SupabaseClient;
  locations: Location[];
  operators: NetworkOperator[];
  config: SiteConfig[];
  images: ImageRecord[];
  canWrite: boolean;
  onChanged: () => void;
};

export function TowBoatUSAdmin(props: Props) {
  const { client, canWrite, onChanged } = props;
  const [section, setSection] = useState<Section>("locations");
  const [locations, setLocations] = useState(props.locations);
  const [operators, setOperators] = useState(props.operators);
  const [config, setConfig] = useState(props.config);
  const [images, setImages] = useState(props.images);
  const [status, setStatus] = useState("Live database");

  useEffect(() => setLocations(props.locations), [props.locations]);
  useEffect(() => setOperators(props.operators), [props.operators]);
  useEffect(() => setConfig(props.config), [props.config]);
  useEffect(() => setImages(props.images), [props.images]);

  async function afterWrite(action: string, entityType: string, entityId?: string) {
    const user = (await client.auth.getUser()).data.user;
    if (user) await client.from("cms_audit_log").insert({ user_id: user.id, action, entity_type: entityType, entity_id: entityId, brand: "towboatus-ntx" });
    const token = (await client.auth.getSession()).data.session?.access_token;
    if (token) await fetch("/api/admin/revalidate", { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + token }, body: JSON.stringify({ brand: "towboatus-ntx" }) });
    onChanged();
  }

  async function save(table: string, key: string, row: Record<string, unknown>, keyName = "id") {
    if (!canWrite) return;
    setStatus("Saving…");
    const token = (await client.auth.getSession()).data.session?.access_token;
    const response = await fetch("/api/admin/towboatus", { method: "PATCH", headers: { "content-type": "application/json", authorization: "Bearer " + token }, body: JSON.stringify({ table, key, keyName, row }) });
    const result = await response.json();
    if (!response.ok) setStatus(result.error ?? "Unable to save");
    else { setStatus("Saved and published"); await afterWrite("update", table, key); }
  }

  return <div className="cms-stack">
    <section className="cms-panel tbus-cms-intro">
      <div><p className="cms-kicker">TowBoatUS North Texas</p><h2>Operations content</h2><p>These controls update the existing TIDE <code>tbus_*</code> tables used directly by the production site.</p></div>
      <span className="cms-live-dot">{status}</span>
    </section>
    <nav className="tbus-cms-tabs" aria-label="TowBoatUS content sections">
      {(["locations", "network", "config", "images"] as Section[]).map((item) => <button key={item} className={section === item ? "active" : ""} onClick={() => setSection(item)}>{item === "config" ? "Site configuration" : item}</button>)}
    </nav>
    {section === "locations" && <LocationsEditor rows={locations} setRows={setLocations} canWrite={canWrite} save={(row) => save("tbus_locations", row.id, row as unknown as Record<string, unknown>)} />}
    {section === "network" && <NetworkEditor rows={operators} setRows={setOperators} canWrite={canWrite} client={client} save={(row) => save("tbus_network_operators", row.id, row as unknown as Record<string, unknown>)} afterWrite={afterWrite} />}
    {section === "config" && <ConfigEditor rows={config} setRows={setConfig} canWrite={canWrite} save={(row) => save("tbus_site_config", row.key, { value: row.value, updated_at: new Date().toISOString() }, "key")} />}
    {section === "images" && <ImagesEditor rows={images} setRows={setImages} locations={locations} canWrite={canWrite} client={client} save={(row) => save("tbus_images", row.id, row as unknown as Record<string, unknown>)} afterWrite={afterWrite} setStatus={setStatus} />}
  </div>;
}

function LocationsEditor({ rows, setRows, save, canWrite }: { rows: Location[]; setRows: (rows: Location[]) => void; save: (row: Location) => void; canWrite: boolean }) {
  const set = (id: string, field: keyof Location, value: string | number | boolean) => setRows(rows.map((row) => row.id === id ? { ...row, [field]: value } : row));
  return <div className="cms-stack">{rows.map((row) => <section className="cms-panel" key={row.id}><div className="cms-editor-actions"><div><p className="cms-kicker">{row.slug}</p><h2>{row.name}</h2></div><button className="cms-button" disabled={!canWrite} onClick={() => save(row)}>Save location</button></div><div className="cms-form-grid"><Field label="Display name"><input value={row.name} disabled={!canWrite} onChange={(e) => set(row.id,"name",e.target.value)} /></Field><Field label="Short name"><input value={row.short_name ?? ""} disabled={!canWrite} onChange={(e) => set(row.id,"short_name",e.target.value)} /></Field><Field label="Phone"><input value={row.phone} disabled={!canWrite} onChange={(e) => set(row.id,"phone",e.target.value)} /></Field><Field label="Badge"><input value={row.badge_label ?? ""} disabled={!canWrite} onChange={(e) => set(row.id,"badge_label",e.target.value)} /></Field><Field label="State / region"><input value={row.state ?? ""} disabled={!canWrite} onChange={(e) => set(row.id,"state",e.target.value)} /></Field><Field label="County"><input value={row.county ?? ""} disabled={!canWrite} onChange={(e) => set(row.id,"county",e.target.value)} /></Field><Field label="Surface acres"><input value={row.surface_acres ?? ""} disabled={!canWrite} onChange={(e) => set(row.id,"surface_acres",e.target.value)} /></Field><Field label="Shoreline miles"><input value={row.shoreline_miles ?? ""} disabled={!canWrite} onChange={(e) => set(row.id,"shoreline_miles",e.target.value)} /></Field><Field label="Website URL" wide><input value={row.website_url ?? ""} disabled={!canWrite} onChange={(e) => set(row.id,"website_url",e.target.value)} /></Field><Field label="Description" wide><textarea rows={4} value={row.description ?? ""} disabled={!canWrite} onChange={(e) => set(row.id,"description",e.target.value)} /></Field><Field label="Order"><input type="number" value={row.sort_order ?? 0} disabled={!canWrite} onChange={(e) => set(row.id,"sort_order",Number(e.target.value))} /></Field><label className="cms-publish-check"><input type="checkbox" checked={row.active} disabled={!canWrite} onChange={(e) => set(row.id,"active",e.target.checked)} /> Active</label></div></section>)}</div>;
}

function NetworkEditor({ rows, setRows, save, client, canWrite, afterWrite }: { rows: NetworkOperator[]; setRows: (rows: NetworkOperator[]) => void; save: (row: NetworkOperator) => void; client: SupabaseClient; canWrite: boolean; afterWrite: (action:string,type:string,id?:string)=>Promise<void> }) {
  const set = (id: string, field: keyof NetworkOperator, value: string | number | boolean) => setRows(rows.map((row) => row.id === id ? { ...row, [field]: value } : row));
  async function add() {
    const nextOrder = Math.max(0, ...rows.map((row) => row.sort_order ?? 0)) + 1;
    const token = (await client.auth.getSession()).data.session?.access_token;
    const response = await fetch("/api/admin/towboatus", { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + token }, body: JSON.stringify({ entity: "operator", row: { name: "New TowBoatUS operator", region: "north-texas", active: false, is_ours: false, sort_order: nextOrder } }) });
    const result = await response.json();
    if (!response.ok) return alert(result.error ?? "Unable to create operator");
    setRows([...rows, result.data as NetworkOperator]); await afterWrite("create", "tbus_network_operators", result.data.id);
  }
  const labels = { "big-water-cowboys": "Big Water Cowboys", "north-texas": "North Texas / DFW", oklahoma: "Oklahoma" };
  return <div className="cms-stack"><div className="cms-editor-actions"><p>Manage the regional operator directory and the three Big Water Cowboys ports.</p><button className="cms-button" disabled={!canWrite} onClick={add}>Add operator</button></div>{Object.entries(labels).map(([region,label]) => <section className="cms-panel" key={region}><p className="cms-kicker">{label}</p>{rows.filter((row) => row.region === region).map((row) => <div className="tbus-cms-row" key={row.id}><div className="cms-form-grid"><Field label="Name"><input value={row.name} disabled={!canWrite} onChange={(e) => set(row.id,"name",e.target.value)} /></Field><Field label="Phone"><input value={row.phone ?? ""} disabled={!canWrite} onChange={(e) => set(row.id,"phone",e.target.value)} /></Field><Field label="Website"><input value={row.website_url ?? ""} disabled={!canWrite} onChange={(e) => set(row.id,"website_url",e.target.value)} /></Field><Field label="Facebook"><input value={row.facebook_url ?? ""} disabled={!canWrite} onChange={(e) => set(row.id,"facebook_url",e.target.value)} /></Field><Field label="Order"><input type="number" value={row.sort_order ?? 0} disabled={!canWrite} onChange={(e) => set(row.id,"sort_order",Number(e.target.value))} /></Field><Field label="Region"><select value={row.region} disabled={!canWrite} onChange={(e) => set(row.id,"region",e.target.value)}>{Object.entries(labels).map(([value,text]) => <option key={value} value={value}>{text}</option>)}</select></Field><label className="cms-publish-check"><input type="checkbox" checked={row.is_ours} disabled={!canWrite} onChange={(e) => set(row.id,"is_ours",e.target.checked)} /> Our operation</label><label className="cms-publish-check"><input type="checkbox" checked={row.active} disabled={!canWrite} onChange={(e) => set(row.id,"active",e.target.checked)} /> Active</label></div><button className="cms-button cms-button-muted" disabled={!canWrite} onClick={() => save(row)}>Save</button></div>)}</section>)}</div>;
}

function ConfigEditor({ rows, setRows, save, canWrite }: { rows: SiteConfig[]; setRows: (rows: SiteConfig[]) => void; save: (row: SiteConfig) => void; canWrite: boolean }) {
  return <section className="cms-panel"><p className="cms-kicker">Emergency and BoatUS links</p><h2>Site configuration</h2><div className="cms-field-list">{rows.map((row) => <label key={row.key}><span>{CONFIG_LABELS[row.key] ?? row.key}</span><div className="tbus-cms-inline"><input value={row.value} disabled={!canWrite} onChange={(e) => setRows(rows.map((item) => item.key === row.key ? { ...item, value: e.target.value } : item))} /><button className="cms-button cms-button-muted" disabled={!canWrite} onClick={() => save(row)}>Save</button></div></label>)}</div></section>;
}

function ImagesEditor({ rows, setRows, locations, save, client, canWrite, afterWrite, setStatus }: { rows: ImageRecord[]; setRows: (rows: ImageRecord[])=>void; locations: Location[]; save:(row:ImageRecord)=>void; client:SupabaseClient; canWrite:boolean; afterWrite:(action:string,type:string,id?:string)=>Promise<void>; setStatus:(value:string)=>void }) {
  const [category, setCategory] = useState("hero");
  const [file, setFile] = useState<File|null>(null);
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [locationId, setLocationId] = useState("");
  const [featured, setFeatured] = useState(true);
  const shown = useMemo(() => rows.filter((row) => row.category === category), [rows,category]);
  const set = (id:string, field:keyof ImageRecord, value:string|number|boolean|null) => setRows(rows.map((row) => row.id === id ? { ...row, [field]: value } : row));
  async function upload() {
    if (!file || !title.trim() || !alt.trim()) return alert("Choose an image and add a title and useful alt text.");
    setStatus("Uploading image…");
    const token = (await client.auth.getSession()).data.session?.access_token;
    const form = new FormData();
    form.set("file", file); form.set("category", category); form.set("title", title.trim()); form.set("alt", alt.trim()); form.set("locationId", locationId); form.set("featured", String(featured));
    const response = await fetch("/api/admin/towboatus", { method: "POST", headers: { authorization: "Bearer " + token }, body: form });
    const result = await response.json();
    if (!response.ok) { setStatus(result.error ?? "Unable to upload image"); return; }
    setRows([result.data as ImageRecord,...rows]); setFile(null); setTitle(""); setAlt(""); setLocationId(""); setStatus("Image uploaded and published"); await afterWrite("create","tbus_images",result.data.id);
  }
  return <div className="cms-stack"><section className="cms-panel"><p className="cms-kicker">Supabase storage · tbus-assets</p><h2>Upload TowBoatUS photography</h2><div className="cms-form-grid"><Field label="Image"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={!canWrite} onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></Field><Field label="Category"><select value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></Field><Field label="Title"><input value={title} disabled={!canWrite} onChange={(e) => setTitle(e.target.value)} /></Field><Field label="Alt text"><input value={alt} disabled={!canWrite} onChange={(e) => setAlt(e.target.value)} /></Field><Field label="Location"><select value={locationId} disabled={!canWrite} onChange={(e) => setLocationId(e.target.value)}><option value="">Site-wide image</option>{locations.map((row) => <option value={row.id} key={row.id}>{row.name}</option>)}</select></Field><label className="cms-publish-check"><input type="checkbox" checked={featured} disabled={!canWrite} onChange={(e) => setFeatured(e.target.checked)} /> Featured in slideshow</label></div><button className="cms-button" disabled={!canWrite || !file} onClick={upload}>Upload and publish</button></section><div className="tbus-image-grid">{shown.map((row) => <article className="cms-panel" key={row.id}><img src={row.public_url} alt={row.alt_text ?? ""} /><div className="cms-field-list"><label><span>Title</span><input value={row.title} disabled={!canWrite} onChange={(e) => set(row.id,"title",e.target.value)} /></label><label><span>Alt text</span><input value={row.alt_text ?? ""} disabled={!canWrite} onChange={(e) => set(row.id,"alt_text",e.target.value)} /></label><label><span>Order</span><input type="number" value={row.sort_order ?? 0} disabled={!canWrite} onChange={(e) => set(row.id,"sort_order",Number(e.target.value))} /></label></div><div className="tbus-cms-inline"><label className="cms-publish-check"><input type="checkbox" checked={row.is_featured} disabled={!canWrite} onChange={(e) => set(row.id,"is_featured",e.target.checked)} /> Featured</label><label className="cms-publish-check"><input type="checkbox" checked={row.active} disabled={!canWrite} onChange={(e) => set(row.id,"active",e.target.checked)} /> Active</label><button className="cms-button cms-button-muted" disabled={!canWrite} onClick={() => save(row)}>Save</button></div></article>)}</div></div>;
}

function Field({ label, wide, children }: { label:string; wide?:boolean; children:React.ReactNode }) { return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>; }
