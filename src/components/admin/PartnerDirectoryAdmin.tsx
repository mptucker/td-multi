"use client";

import { useEffect, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

type Organization = { id: string; slug: string; name: string; description: string; logo_url?: string | null; website_url?: string | null; partnership_tier: string; approved: boolean; active: boolean; public: boolean; sort_order: number };
type Location = { id: string; organization_id: string; slug: string; name: string; description: string; address: string; area: string; latitude: number; longitude: number; categories: string[]; image_url?: string | null; booking_url?: string | null; contact_url?: string | null; map_x?: number | null; map_y?: number | null; is_featured: boolean; active: boolean; public: boolean; sort_order: number };
type MapSettings = { id: string; map_url: string; show_roads: boolean; show_geographic_labels: boolean; theme: "coastal" | "chart" | "natural" };

const TIERS = ["launch_partner", "discover", "grow", "elevate", "strategic"];
const CATEGORIES = ["stay", "play", "water", "shop"];
const DEFAULT_SETTINGS: MapSettings = { id: "texomaco", map_url: "/texomaco/texoma-map.svg", show_roads: true, show_geographic_labels: false, theme: "coastal" };

export function PartnerDirectoryAdmin({ client, organizations, locations, settings, media, canWrite, onChanged }: { client: SupabaseClient; organizations: Organization[]; locations: Location[]; settings: MapSettings | null; media: any[]; canWrite: boolean; onChanged: () => void }) {
  const [orgDrafts, setOrgDrafts] = useState(organizations);
  const [locationDrafts, setLocationDrafts] = useState(locations);
  const [mapDraft, setMapDraft] = useState<MapSettings>(settings ?? DEFAULT_SETTINGS);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState("");
  const mapInput = useRef<HTMLInputElement>(null);
  const photoInputs = useRef<Record<string, HTMLInputElement | null>>({});
  useEffect(() => setOrgDrafts(organizations), [organizations]);
  useEffect(() => setLocationDrafts(locations), [locations]);
  useEffect(() => setMapDraft(settings ?? DEFAULT_SETTINGS), [settings]);

  const updateOrg = (id: string, patch: Partial<Organization>) => setOrgDrafts((rows) => rows.map((row) => row.id === id ? { ...row, ...patch } : row));
  const updateLocation = (id: string, patch: Partial<Location>) => setLocationDrafts((rows) => rows.map((row) => row.id === id ? { ...row, ...patch } : row));

  async function save(table: string, id: string, value: Record<string, unknown>) {
    setMessage("Saving…");
    const { id: _id, created_at: _created, updated_at: _updated, ...record } = value as any;
    const { error } = await client.from(table).update(record).eq("id", id);
    if (error) setMessage(error.message); else { setMessage("Saved. Public map data will refresh shortly."); onChanged(); }
  }

  async function saveMapSettings() {
    setMessage("Saving map settings…");
    const { error } = await client.from("partner_map_settings").upsert(mapDraft, { onConflict: "id" });
    if (error) setMessage(error.message); else { setMessage("Map settings saved."); onChanged(); }
  }

  async function uploadAsset(file: File, alt: string, kind: "maps" | "locations") {
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `texomaco/${kind}/${Date.now()}-${safe}`;
    const { error: uploadError } = await client.storage.from("brand-media").upload(path, file, { contentType: file.type });
    if (uploadError) throw uploadError;
    const publicUrl = client.storage.from("brand-media").getPublicUrl(path).data.publicUrl;
    const user = (await client.auth.getUser()).data.user;
    await client.from("media_assets").insert({ brand: "texomaco", storage_path: path, public_url: publicUrl, filename: file.name, mime_type: file.type, alt_text: alt, created_by: user?.id });
    return publicUrl;
  }

  async function uploadMap(file?: File) {
    if (!file) return;
    if (file.type !== "image/svg+xml" && !file.name.toLowerCase().endsWith(".svg")) { setMessage("Use an SVG exported from the layered Illustrator map."); return; }
    setUploading("map"); setMessage("Uploading map…");
    try {
      const url = await uploadAsset(file, "Lake Texoma partner map", "maps");
      const next = { ...mapDraft, map_url: url };
      setMapDraft(next);
      const { error } = await client.from("partner_map_settings").upsert(next, { onConflict: "id" });
      if (error) throw error;
      setMessage("Map uploaded and published."); onChanged();
    } catch (error: any) { setMessage(error?.message || "The map could not be uploaded."); }
    finally { setUploading(""); if (mapInput.current) mapInput.current.value = ""; }
  }

  async function uploadPhoto(location: Location, file?: File) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) { setMessage("Use a JPEG, PNG, WebP, or AVIF photo."); return; }
    setUploading(location.id); setMessage(`Uploading photo for ${location.name}…`);
    try {
      const url = await uploadAsset(file, location.name, "locations");
      updateLocation(location.id, { image_url: url });
      const { error } = await client.from("partner_locations").update({ image_url: url }).eq("id", location.id);
      if (error) throw error;
      setMessage("Photo uploaded and attached to the location."); onChanged();
    } catch (error: any) { setMessage(error?.message || "The photo could not be uploaded."); }
    finally { setUploading(""); const input = photoInputs.current[location.id]; if (input) input.value = ""; }
  }

  async function addOrganization() {
    const slug = `partner-${Date.now()}`;
    const { error } = await client.from("partner_organizations").insert({ slug, name: "New partner", partnership_tier: "discover", active: true, approved: false, public: false, sort_order: organizations.length * 10 + 10 });
    if (error) setMessage(error.message); else onChanged();
  }
  async function addLocation(organizationId: string) {
    const { error } = await client.from("partner_locations").insert({ organization_id: organizationId, slug: `location-${Date.now()}`, name: "New location", description: "", address: "", area: "Lake Texoma", latitude: 33.86, longitude: -96.66, map_x: 50, map_y: 50, categories: ["play"], is_featured: false, active: true, public: false, sort_order: locations.length * 10 + 10 });
    if (error) setMessage(error.message); else onChanged();
  }

  return <div className="cms-stack">
    <section className="cms-panel tco-map-settings">
      <div className="tco-partner-intro"><div><p className="cms-kicker">Map presentation</p><h2>Collective map settings</h2><p>Upload the layered SVG exported from Illustrator. The public map can independently show or hide Illustrator groups named Roads, Labels – Street, Geographic Labels, Towns, and Marinas.</p></div><button className="cms-button" disabled={!canWrite || uploading === "map"} onClick={() => mapInput.current?.click()}>{uploading === "map" ? "Uploading…" : "Upload map SVG"}</button></div>
      <input ref={mapInput} hidden type="file" accept="image/svg+xml,.svg" onChange={(event) => uploadMap(event.target.files?.[0])} />
      <div className="tco-map-preview" data-theme={mapDraft.theme}><img src={mapDraft.map_url} alt="Current Texoma Collective map" /></div>
      <div className="cms-form-grid">
        <label className="wide"><span>Current map file</span><input value={mapDraft.map_url} disabled={!canWrite} onChange={(e) => setMapDraft({ ...mapDraft, map_url: e.target.value })} /></label>
        <label><span>Color theme</span><select value={mapDraft.theme} disabled={!canWrite} onChange={(e) => setMapDraft({ ...mapDraft, theme: e.target.value as MapSettings["theme"] })}><option value="coastal">Coastal aqua + cream</option><option value="chart">Nautical chart</option><option value="natural">Natural lake + sage</option></select></label>
        <div className="tco-switches"><label><input type="checkbox" checked={mapDraft.show_roads} disabled={!canWrite} onChange={(e) => setMapDraft({ ...mapDraft, show_roads: e.target.checked })}/> Show roads and road names</label><label><input type="checkbox" checked={mapDraft.show_geographic_labels} disabled={!canWrite} onChange={(e) => setMapDraft({ ...mapDraft, show_geographic_labels: e.target.checked })}/> Show geographic locations</label></div>
      </div>
      {canWrite && <button className="cms-button cms-button-muted" onClick={saveMapSettings}>Save map settings</button>}
    </section>

    <section className="cms-panel tco-partner-intro">
      <div><h2>Partner locations</h2><p>Add the title, description, photo, latitude/longitude, and exact map position for every pin. Featured locations rise to the front of the directory.</p></div>
      {canWrite && <button className="cms-button" onClick={addOrganization}>Add partner</button>}
    </section>
    {orgDrafts.map((organization) => {
      const orgLocations = locationDrafts.filter((location) => location.organization_id === organization.id);
      const live = organization.approved && organization.active && organization.public;
      return <details className="cms-panel tco-partner" key={organization.id} open={!organization.approved}>
        <summary><span><strong>{organization.name}</strong><small>{organization.partnership_tier.replaceAll("_", " ")} · {orgLocations.length} {orgLocations.length === 1 ? "location" : "locations"}</small></span><span className={live ? "cms-status-live" : "cms-status-draft"}>{live ? "Public" : "Hidden"}</span></summary>
        <div className="cms-form-grid tco-partner-fields">
          <label><span>Name</span><input value={organization.name} disabled={!canWrite} onChange={(e) => updateOrg(organization.id, { name: e.target.value })}/></label>
          <label><span>Slug</span><input value={organization.slug} disabled={!canWrite} onChange={(e) => updateOrg(organization.id, { slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}/></label>
          <label className="wide"><span>Description</span><textarea rows={3} value={organization.description || ""} disabled={!canWrite} onChange={(e) => updateOrg(organization.id, { description: e.target.value })}/></label>
          <label><span>Website</span><input type="url" value={organization.website_url || ""} disabled={!canWrite} onChange={(e) => updateOrg(organization.id, { website_url: e.target.value })}/></label>
          <label><span>Logo URL</span><input value={organization.logo_url || ""} disabled={!canWrite} onChange={(e) => updateOrg(organization.id, { logo_url: e.target.value })}/></label>
          <label><span>Partnership tier</span><select value={organization.partnership_tier} disabled={!canWrite} onChange={(e) => updateOrg(organization.id, { partnership_tier: e.target.value })}>{TIERS.map((tier) => <option key={tier} value={tier}>{tier.replaceAll("_", " ")}</option>)}</select></label>
          <label><span>Sort order</span><input type="number" value={organization.sort_order} disabled={!canWrite} onChange={(e) => updateOrg(organization.id, { sort_order: Number(e.target.value) })}/></label>
          <div className="wide tco-switches"><label><input type="checkbox" checked={organization.approved} disabled={!canWrite} onChange={(e) => updateOrg(organization.id, { approved: e.target.checked })}/> Approved</label><label><input type="checkbox" checked={organization.active} disabled={!canWrite} onChange={(e) => updateOrg(organization.id, { active: e.target.checked })}/> Active</label><label><input type="checkbox" checked={organization.public} disabled={!canWrite} onChange={(e) => updateOrg(organization.id, { public: e.target.checked })}/> Public</label></div>
        </div>
        {canWrite && <div className="cms-review-actions"><button className="cms-button" onClick={() => save("partner_organizations", organization.id, organization)}>Save partner</button><button className="cms-button cms-button-muted" onClick={() => addLocation(organization.id)}>Add location</button></div>}
        <div className="tco-locations">{orgLocations.map((location, index) => <LocationEditor key={location.id} location={location} defaultOpen={index === 0} media={media} canWrite={canWrite} uploading={uploading} update={(patch) => updateLocation(location.id, patch)} upload={(file) => uploadPhoto(location, file)} inputRef={(node) => { photoInputs.current[location.id] = node; }} save={() => save("partner_locations", location.id, location)} />)}</div>
      </details>;
    })}
    {message && <p className="cms-save-toast" role="status" aria-live="polite">{message}</p>}
  </div>;
}

function LocationEditor({ location, defaultOpen, media, canWrite, uploading, update, upload, inputRef, save }: { location: Location; defaultOpen: boolean; media: any[]; canWrite: boolean; uploading: string; update: (patch: Partial<Location>) => void; upload: (file?: File) => void; inputRef: (node: HTMLInputElement | null) => void; save: () => void }) {
  const localInput = useRef<HTMLInputElement | null>(null);
  const setRef = (node: HTMLInputElement | null) => { localInput.current = node; inputRef(node); };
  return <details className="tco-location" open={defaultOpen}>
    <summary><span><strong>{location.name}</strong><small>{location.area} · {location.categories.join(", ")}{location.is_featured ? " · Featured" : ""}</small></span><span className="tco-location-summary-actions"><span className={location.active && location.public ? "cms-status-live" : "cms-status-draft"}>{location.active && location.public ? "On map" : "Hidden"}</span><span className="tco-edit-hint">Edit location <b aria-hidden="true">↓</b></span></span></summary>
    <div className="tco-location-toolbar"><p>Update this pin and save it independently from the partner above.</p>{canWrite && <button type="button" className="cms-button" onClick={save}>Save location</button>}</div>
    <div className="tco-location-editor">
      <div className="cms-form-grid">
        <label><span>Location title</span><input value={location.name} disabled={!canWrite} onChange={(e) => update({ name: e.target.value })}/></label>
        <label><span>Location slug</span><input value={location.slug} disabled={!canWrite} onChange={(e) => update({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}/></label>
        <label className="wide"><span>Description</span><textarea rows={3} value={location.description || ""} disabled={!canWrite} onChange={(e) => update({ description: e.target.value })}/></label>
        <label className="wide"><span>Address</span><input value={location.address || ""} disabled={!canWrite} onChange={(e) => update({ address: e.target.value })}/></label>
        <label><span>Area label</span><input value={location.area || ""} disabled={!canWrite} onChange={(e) => update({ area: e.target.value })}/></label>
        <label><span>Categories</span><select multiple value={location.categories || []} disabled={!canWrite} onChange={(e) => update({ categories: [...e.target.selectedOptions].map((option) => option.value) })}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label><span>Latitude</span><input type="number" step="any" value={location.latitude} disabled={!canWrite} onChange={(e) => update({ latitude: Number(e.target.value) })}/></label>
        <label><span>Longitude</span><input type="number" step="any" value={location.longitude} disabled={!canWrite} onChange={(e) => update({ longitude: Number(e.target.value) })}/></label>
        <label><span>Map X position (%)</span><input type="number" min="0" max="100" step="0.1" value={location.map_x ?? 50} disabled={!canWrite} onChange={(e) => update({ map_x: Number(e.target.value) })}/></label>
        <label><span>Map Y position (%)</span><input type="number" min="0" max="100" step="0.1" value={location.map_y ?? 50} disabled={!canWrite} onChange={(e) => update({ map_y: Number(e.target.value) })}/></label>
        <label><span>Booking or primary link</span><input type="url" value={location.booking_url || ""} disabled={!canWrite} onChange={(e) => update({ booking_url: e.target.value })}/></label>
        <label><span>Contact link</span><input type="url" value={location.contact_url || ""} disabled={!canWrite} onChange={(e) => update({ contact_url: e.target.value })}/></label>
        <label><span>Photo library</span><select value={location.image_url || ""} disabled={!canWrite} onChange={(e) => update({ image_url: e.target.value })}><option value="">Use existing listing photo</option>{media.filter((asset) => asset.mime_type !== "image/svg+xml").map((asset) => <option key={asset.id} value={asset.public_url}>{asset.alt_text || asset.filename}</option>)}</select></label>
        <label><span>Sort order</span><input type="number" value={location.sort_order} disabled={!canWrite} onChange={(e) => update({ sort_order: Number(e.target.value) })}/></label>
        <div className="wide tco-switches"><label><input type="checkbox" checked={Boolean(location.is_featured)} disabled={!canWrite} onChange={(e) => update({ is_featured: e.target.checked })}/> Featured</label><label><input type="checkbox" checked={location.active} disabled={!canWrite} onChange={(e) => update({ active: e.target.checked })}/> Active</label><label><input type="checkbox" checked={location.public} disabled={!canWrite} onChange={(e) => update({ public: e.target.checked })}/> Public</label></div>
      </div>
      <aside className="tco-photo-editor">{location.image_url ? <img src={location.image_url} alt="" /> : <span>No location photo selected</span>}<button type="button" className="cms-button cms-button-muted" disabled={!canWrite || uploading === location.id} onClick={() => localInput.current?.click()}>{uploading === location.id ? "Uploading…" : "Upload new photo"}</button><input ref={setRef} hidden type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => upload(event.target.files?.[0])}/></aside>
    </div>
    {canWrite && <button type="button" className="cms-button" onClick={save}>Save location</button>}
  </details>;
}
