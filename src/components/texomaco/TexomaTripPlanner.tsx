"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./TexomaTripPlanner.module.css";

type Partner = {
  id: string;
  name: string;
  organization: string;
  description: string;
  address: string;
  area: string;
  categories: string[];
  latitude: number;
  longitude: number;
  mapX?: number;
  mapY?: number;
  featured?: boolean;
  image: string;
  website?: string;
  booking?: string;
};

const FALLBACK: Partner[] = [
  { id: "lighthouse-resort", name: "Lighthouse Resort & Marina", organization: "Lighthouse Resort & Marina", description: "Cabins, RV sites, a full-service marina and boat rentals in one lakefront place.", address: "300 Lighthouse Drive, Pottsboro, TX 75076", area: "Little Mineral", categories: ["stay", "water"], latitude: 33.860666, longitude: -96.662635, mapX: 52, mapY: 64.6, featured: true, image: "/lighthouse/hero.jpg", website: "https://lighthouseresort.com", booking: "https://texomadestinations.com/where-to-stay/cabins#/lighthouse" },
  { id: "fastrac-charters", name: "Fastrac Cruises", organization: "Fastrac Cruises", description: "Public cruises and private charters departing Lighthouse Marina.", address: "Lighthouse Marina, Pottsboro, TX 75076", area: "Little Mineral", categories: ["play", "water"], latitude: 33.858662, longitude: -96.661691, mapX: 52.4, mapY: 65.8, featured: true, image: "/fastrac/island-girl-aerial-current.jpg", website: "https://fastrac.com", booking: "https://texomadestinations.com/things-to-do#/charters-cruises" },
  { id: "island-view", name: "Island View Park", organization: "Island View Park", description: "Sandy beach, covered shelters, paddle rentals and easy family fun.", address: "87426 Preston Bend Rd, Pottsboro, TX 75076", area: "Preston Peninsula", categories: ["play", "water"], latitude: 33.85945, longitude: -96.67116, mapX: 50.1, mapY: 63.8, featured: true, image: "/explorer/assets/photo/island-view.jpg", website: "https://islandviewtexoma.com", booking: "https://texomadestinations.com/things-to-do#/beach-access" },
  { id: "sundance", name: "Sundance Camp", organization: "Sundance Camp", description: "A tiny-cabin village, RV sites and a gathering place at Preston Point.", address: "295 Glen Eden Drive, Pottsboro, TX 75076", area: "Preston Point", categories: ["stay"], latitude: 33.87845, longitude: -96.63636, mapX: 61, mapY: 52.8, featured: true, image: "/sundance/hero.webp", website: "https://sundancetexoma.com", booking: "https://texomadestinations.com/where-to-stay/cabins#/sundance" },
  { id: "tackle-box", name: "Tackle Box Outfitters", organization: "Tackle Box Outfitters", description: "Fishing, outdoor gear, fuel and local knowledge on Highway 289.", address: "83924 N State Hwy 289, Pottsboro, TX 75076", area: "Highway 289", categories: ["shop"], latitude: 33.834293, longitude: -96.678798, mapX: 52.6, mapY: 69.1, image: "/tackle-box/hero.webp", website: "https://tackleboxtexoma.com" },
  { id: "big-water-marine", name: "Big Water Marine", organization: "Big Water Marine", description: "Premium new and pre-owned boats, marine service and support in Pottsboro.", address: "50055 N State Hwy 289, Pottsboro, TX 75076", area: "Pottsboro", categories: ["shop", "water"], latitude: 33.796532, longitude: -96.677637, mapX: 55, mapY: 82, image: "/lighthouse/boat-current.jpg", website: "https://bigwatermarine.com" },
  { id: "paradise", name: "Paradise on Lake Texoma", organization: "Paradise on Lake Texoma", description: "Cabins, glamping, RV and tent sites on Big Mineral.", address: "503 Paradise Park Rd, Pottsboro, TX 75076", area: "Big Mineral", categories: ["stay", "play"], latitude: 33.794878, longitude: -96.787151, mapX: 26.5, mapY: 85.4, featured: true, image: "/paradise/aerial-peninsula.jpg", website: "https://paradisetexoma.com", booking: "https://texomadestinations.com/where-to-stay/cabins#/paradise" },
];

const FILTERS = [
  { id: "all", label: "All partners" },
  { id: "stay", label: "Stay" },
  { id: "play", label: "Play" },
  { id: "water", label: "On the water" },
  { id: "shop", label: "Shop & service" },
];

const STORAGE_KEY = "texomaco-my-trip";

function mapPosition(partner: Partner) {
  if (Number.isFinite(partner.mapX) && Number.isFinite(partner.mapY)) return { left: `${partner.mapX}%`, top: `${partner.mapY}%` };
  const minLng = -96.82, maxLng = -96.61, minLat = 33.77, maxLat = 33.90;
  return {
    left: `${14 + ((partner.longitude - minLng) / (maxLng - minLng)) * 72}%`,
    top: `${10 + (1 - (partner.latitude - minLat) / (maxLat - minLat)) * 75}%`,
  };
}

type MapSettings = { map_url: string; show_roads: boolean; show_geographic_labels: boolean; theme: "coastal" | "chart" | "natural" };
const DEFAULT_MAP: MapSettings = { map_url: "/texomaco/texoma-map.svg", show_roads: true, show_geographic_labels: false, theme: "coastal" };

function LayeredMap({ url, roads, labels }: { url: string; roads: boolean; labels: boolean }) {
  const [markup, setMarkup] = useState("");
  useEffect(() => {
    let active = true;
    fetch(url).then((response) => response.ok ? response.text() : "").then((text) => {
      if (!active || !text.includes("<svg")) return;
      const document = new DOMParser().parseFromString(text, "image/svg+xml");
      document.querySelectorAll("script,foreignObject,iframe,object,embed").forEach((node) => node.remove());
      document.querySelectorAll("*").forEach((node) => [...node.attributes].forEach((attribute) => {
        if (/^on/i.test(attribute.name) || ((attribute.name === "href" || attribute.name.endsWith(":href")) && !attribute.value.startsWith("#"))) node.removeAttribute(attribute.name);
      }));
      const svg = document.documentElement;
      svg.removeAttribute("width"); svg.removeAttribute("height");
      if (active) setMarkup(svg.outerHTML);
    }).catch(() => undefined);
    return () => { active = false; };
  }, [url]);
  if (!markup) return <img className={styles.mapArt} src={url} alt="Map of Lake Texoma and surrounding roads" />;
  return <div className={`${styles.mapArt} ${roads ? "" : styles.hideRoads} ${labels ? styles.showLabels : styles.hideLabels}`} role="img" aria-label="Map of Lake Texoma and surrounding roads" dangerouslySetInnerHTML={{ __html: markup }} />;
}

export function TexomaTripPlanner() {
  const [partners, setPartners] = useState<Partner[]>(FALLBACK);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [trip, setTrip] = useState<string[]>([]);
  const [tripOpen, setTripOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [mapSettings, setMapSettings] = useState<MapSettings>(DEFAULT_MAP);
  const [showRoads, setShowRoads] = useState(DEFAULT_MAP.show_roads);
  const [showLabels, setShowLabels] = useState(DEFAULT_MAP.show_geographic_labels);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  useEffect(() => {
    const queryTrip = new URLSearchParams(window.location.search).get("trip");
    const saved = queryTrip?.split(",").filter(Boolean) ?? JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved)) setTrip(saved);
    fetch("/api/partners")
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (!payload?.authoritative || !payload.locations?.length) return;
        const organizations = new Map(payload.organizations.map((org: any) => [org.id, org]));
        const next: Partner[] = payload.locations.map((location: any) => {
          const org: any = organizations.get(location.organization_id) || {};
          return {
            id: location.slug ? `${org.slug || "partner"}-${location.slug}` : location.id,
            name: location.name,
            organization: org.name || location.name,
            description: location.description || org.description || "A Texoma Collective partner.",
            address: location.address || "Lake Texoma",
            area: location.area || "Lake Texoma",
            categories: location.categories || [],
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
            mapX: location.map_x == null ? undefined : Number(location.map_x),
            mapY: location.map_y == null ? undefined : Number(location.map_y),
            featured: Boolean(location.is_featured),
            image: location.image_url || "/lighthouse/hero.jpg",
            website: org.website_url || undefined,
            booking: location.booking_url || location.contact_url || undefined,
          };
        });
        next.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
        if (payload.settings) {
          const nextSettings = { ...DEFAULT_MAP, ...payload.settings };
          setMapSettings(nextSettings);
          setShowRoads(nextSettings.show_roads);
          setShowLabels(nextSettings.show_geographic_labels);
        }
        setPartners(next);
        setSelected((current) => current && next.some((item) => item.id === current) ? current : null);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(trip)); }, [trip]);

  const visible = useMemo(() => filter === "all" ? partners : partners.filter((partner) => partner.categories.includes(filter)), [filter, partners]);
  const featured = useMemo(() => {
    const featuredPartners = visible.filter((partner) => partner.featured);
    return featuredPartners.length ? featuredPartners : visible;
  }, [visible]);
  const carouselPartner = featured[carouselIndex % Math.max(featured.length, 1)] ?? visible[0] ?? partners[0];
  const active = (selected ? partners.find((partner) => partner.id === selected) : undefined) ?? carouselPartner;
  const tripPartners = trip.map((id) => partners.find((partner) => partner.id === id)).filter((partner): partner is Partner => Boolean(partner));

  useEffect(() => {
    setCarouselIndex(0);
    setSelected(null);
  }, [filter]);

  useEffect(() => {
    if (selected || featured.length < 2) return;
    const timer = window.setInterval(() => setCarouselIndex((current) => (current + 1) % featured.length), 5000);
    return () => window.clearInterval(timer);
  }, [featured.length, selected]);

  function selectPartner(id: string) {
    setSelected(id);
  }

  function changeZoom(next: number) {
    const value = Math.min(3, Math.max(1, next));
    setZoom(value);
    if (value === 1) setPan({ x: 0, y: 0 });
  }

  function clampPan(value: number, scale = zoom) {
    const limit = 310 * Math.max(0, scale - 1);
    return Math.min(limit, Math.max(-limit, value));
  }

  function toggleTrip(id: string) {
    setTrip((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function shareTrip() {
    const url = new URL(window.location.href);
    url.searchParams.set("trip", trip.join(","));
    const share = { title: "My Texoma trip", text: "Here are the Texoma Collective places I saved.", url: url.toString() };
    try {
      if (navigator.share) await navigator.share(share);
      else { await navigator.clipboard.writeText(url.toString()); setShareMessage("Trip link copied"); }
    } catch { /* sharing dismissed */ }
  }

  return (
    <div className={styles.planner} data-reveal>
      <div className={styles.toolbar}>
        <div className={styles.filters} aria-label="Filter partners">
          {FILTERS.map((item) => <button key={item.id} className={filter === item.id ? styles.activeFilter : ""} onClick={() => setFilter(item.id)}>{item.label}</button>)}
        </div>
        <button className={styles.tripButton} onClick={() => setTripOpen(true)}>My Trip <b>{trip.length}</b></button>
      </div>

      <div className={styles.workspace}>
        <aside className={styles.results} aria-label="Partner listings">
          <p className={styles.resultCount}>{visible.length} curated {visible.length === 1 ? "place" : "places"}</p>
          {visible.map((partner, index) => (
            <button key={partner.id} className={`${styles.result} ${active?.id === partner.id ? styles.selectedResult : ""}`} onClick={() => selectPartner(partner.id)}>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <span><strong>{partner.name}</strong><small>{partner.area}</small></span>
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </aside>

        <div className={styles.map} aria-label="Map of Texoma Collective partner locations">
          <div
            className={`${styles.mapStage} ${zoom > 1 ? styles.isZoomed : ""}`}
            data-theme={mapSettings.theme}
            onWheel={(event) => { event.preventDefault(); changeZoom(zoom + (event.deltaY < 0 ? .25 : -.25)); }}
            onPointerDown={(event) => {
              if (event.button !== 0 || zoom === 1 || (event.target as HTMLElement).closest("button")) return;
              drag.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!drag.current) return;
              setPan({ x: clampPan(drag.current.panX + event.clientX - drag.current.x), y: clampPan(drag.current.panY + event.clientY - drag.current.y) });
            }}
            onPointerUp={(event) => { drag.current = null; event.currentTarget.releasePointerCapture(event.pointerId); }}
            onPointerCancel={() => { drag.current = null; }}
          >
            <div className={styles.mapCanvas} style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
              <LayeredMap url={mapSettings.map_url} roads={showRoads} labels={showLabels} />
              {visible.map((partner, index) => <button key={partner.id} className={`${styles.pin} ${active?.id === partner.id ? styles.activePin : ""}`} style={mapPosition(partner)} onClick={() => selectPartner(partner.id)} aria-label={`Open ${partner.name}`}><span>{index + 1}</span></button>)}
            </div>
            <span className={styles.mapCredit}>Lake Texoma · Texas + Oklahoma</span>
            <div className={styles.mapLayers} aria-label="Map layers"><button className={showRoads ? styles.activeLayer : ""} onClick={() => setShowRoads((value) => !value)}>Roads</button><button className={showLabels ? styles.activeLayer : ""} onClick={() => setShowLabels((value) => !value)}>Places</button></div>
            <div className={styles.zoomControls} aria-label="Map zoom controls">
              <button onClick={() => changeZoom(zoom + .5)} disabled={zoom >= 3} aria-label="Zoom in">+</button>
              <button onClick={() => changeZoom(zoom - .5)} disabled={zoom <= 1} aria-label="Zoom out">−</button>
              {zoom > 1 && <button className={styles.resetZoom} onClick={() => changeZoom(1)} aria-label="Reset map zoom">Reset</button>}
            </div>
            <span className={styles.zoomHint}>{zoom === 1 ? "Scroll or use + to zoom" : `${Math.round(zoom * 100)}% · drag to move`}</span>
          </div>

          {active && <article className={styles.detail} aria-live={selected ? "off" : "polite"}>
            <div className={styles.detailPhoto}><img src={active.image} alt={`${active.name} at Lake Texoma`} /></div>
            <div className={styles.detailCopy}>
              <div className={styles.carouselMeta}>
                <p>{selected ? active.area : `Featured around the lake · ${active.area}`}</p>
                {!selected && featured.length > 1 && <div className={styles.carouselControls} aria-label="Featured partner carousel">
                  <button onClick={() => setCarouselIndex((carouselIndex - 1 + featured.length) % featured.length)} aria-label="Previous featured partner">←</button>
                  <span>{carouselIndex + 1} / {featured.length}</span>
                  <button onClick={() => setCarouselIndex((carouselIndex + 1) % featured.length)} aria-label="Next featured partner">→</button>
                </div>}
                {selected && <button className={styles.backToFeatured} onClick={() => setSelected(null)}>Show featured places</button>}
              </div>
              <h3>{active.name}{active.featured && <span className={styles.featured}>Featured</span>}</h3>
              <p>{active.description}</p>
              <address>{active.address}</address>
              <div className={styles.actions}>
                <button onClick={() => toggleTrip(active.id)}>{trip.includes(active.id) ? "Remove from trip" : "+ Add to trip"}</button>
                {(active.booking || active.website) && <a href={active.booking || active.website} target="_blank" rel="noreferrer">Visit partner ↗</a>}
              </div>
            </div>
          </article>}
        </div>
      </div>

      {tripOpen && <div className={styles.tripBackdrop} onMouseDown={(event) => event.target === event.currentTarget && setTripOpen(false)}>
        <aside className={styles.tripPanel} aria-label="My Trip">
          <div className={styles.tripHead}><div><small>Your lake plan</small><h3>My Trip</h3></div><button onClick={() => setTripOpen(false)} aria-label="Close My Trip">×</button></div>
          {tripPartners.length ? <>
            <ol>{tripPartners.map((partner) => <li key={partner.id}><span><strong>{partner.name}</strong><small>{partner.area}</small></span><button onClick={() => toggleTrip(partner.id)} aria-label={`Remove ${partner.name}`}>Remove</button></li>)}</ol>
            <button className={styles.shareButton} onClick={shareTrip}>Share this trip</button>
            {shareMessage && <p className={styles.shareMessage} role="status">{shareMessage}</p>}
          </> : <div className={styles.empty}><strong>Your trip starts here.</strong><p>Choose a partner on the map, then tap “Add to trip.”</p></div>}
        </aside>
      </div>}
    </div>
  );
}
