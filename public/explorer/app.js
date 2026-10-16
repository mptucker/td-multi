/* Texoma Explorer — lake → place → property. Needs d3 v7, geo.js, plans.js, data.js. */
(function () {
  "use strict";
  const { BRANDS, PLACES, CATS, UNIT_TYPES, UNITS, link } = window.TX;
  const G = window.GEO, PR = G.proj, PLANS = window.PLANS;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MOBILE = () => matchMedia("(max-width: 760px)").matches;
  const ASSET = "assets/";
  const logo = (b) => ASSET + "logo/" + BRANDS[b].logo;
  const photo = (f) => ASSET + "photo/" + f;

  const project = (lng, lat) => [(lng - PR.LON0) * PR.K * PR.COS, (PR.LAT0 - lat) * PR.K];
  const unproject = (x, y) => [x / (PR.K * PR.COS) + PR.LON0, PR.LAT0 - y / PR.K];
  const M_PER_UNIT = 111320 / PR.K;

  PLACES.forEach((p) => { [p.x, p.y] = project(p.lng, p.lat); p.spots.forEach((s) => { [s.x, s.y] = project(s.lng, s.lat); }); });

  const state = { cat: "all", place: null, brand: null, plan: null, unit: null, tow: false, hover: null };

  // ------------------------------------------------------------------ map
  const stage = $("#stage"), svg = d3.select("#map"), world = d3.select("#world"), overlay = $("#overlay");
  const lakeD = G.lake;
  world.append("path").attr("class", "lake-shore").attr("d", lakeD).attr("vector-effect", "non-scaling-stroke");
  world.append("path").attr("class", "lake-fill").attr("d", lakeD).attr("fill-rule", "evenodd");
  world.append("path").attr("d", lakeD).attr("fill", "url(#depth)").attr("fill-rule", "evenodd").attr("pointer-events", "none");
  world.append("path").attr("class", "tow-zone").attr("d", lakeD).attr("vector-effect", "non-scaling-stroke").attr("stroke-width", 2);
  world.append("path").attr("class", "state-line").attr("d", G.border).attr("vector-effect", "non-scaling-stroke").attr("stroke-width", 1.2);
  const local = world.append("g").attr("class", "local");
  local.append("path").attr("class", "local-service").attr("d", G.local.service).attr("vector-effect", "non-scaling-stroke");
  local.append("path").attr("class", "local-road").attr("d", G.local.road).attr("vector-effect", "non-scaling-stroke");
  local.append("path").attr("class", "local-pier").attr("d", G.local.pier).attr("vector-effect", "non-scaling-stroke");
  world.append("path").attr("class", "road-minor").attr("d", G.roads.minor).attr("vector-effect", "non-scaling-stroke").attr("stroke-width", 1.3);
  world.append("path").attr("class", "road-major-case").attr("d", G.roads.major).attr("vector-effect", "non-scaling-stroke").attr("stroke-width", 4.5);
  world.append("path").attr("class", "road-major").attr("d", G.roads.major).attr("vector-effect", "non-scaling-stroke").attr("stroke-width", 2.5);

  // labels (screen-space, repositioned on zoom)
  const LABELS = [
    { t: "Lake Texoma", lat: 33.965, lng: -96.715, c: "water big", max: 2.4 },
    { t: "Little Mineral", lat: 33.868, lng: -96.652, c: "water", min: 1.6, max: 30 },
    { t: "Big Mineral", lat: 33.832, lng: -96.792, c: "water", min: 1.2, max: 30 },
    { t: "Lake Texoma", lat: 33.905, lng: -96.64, c: "water", min: 2.4, max: 30 },
    { t: "Red River", lat: 33.86, lng: -96.965, c: "water", min: .35, max: 6 },
    { t: "Washita Arm", lat: 34.08, lng: -96.61, c: "water", min: .35, max: 6 },
    { t: "Denison Dam", lat: 33.8155, lng: -96.566, c: "dam", min: .8, max: 30 },
    { t: "Texas", lat: 33.73, lng: -96.9, c: "state", max: 2 },
    { t: "Oklahoma", lat: 34.13, lng: -96.9, c: "state", max: 2 },
  ];
  const TOWNS = { Pottsboro: .35, Denison: .35, Kingston: .35, Madill: .35, Cartwright: 1.5, Sherman: .35, Colbert: 1.5 };
  G.places.filter((p) => p.name in TOWNS).forEach((p) => {
    const [lng, lat] = unproject(p.x, p.y);
    LABELS.push({ t: p.name, lat, lng, c: "town", min: TOWNS[p.name], max: 40 });
  });
  LABELS.forEach((l) => {
    [l.x, l.y] = project(l.lng, l.lat);
    l.el = document.createElement("div");
    l.el.className = "lbl " + l.c;
    l.el.textContent = l.t;
    overlay.appendChild(l.el);
  });

  // markers: one grouped pin per place, splitting into one pin per spot once the spots are far enough apart on screen
  const leaders = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  leaders.setAttribute("class", "leaders");
  overlay.appendChild(leaders);
  const MARKERS = [];
  function makeMarker(p, brands, x, y, group, spot) {
    const b0 = brands[0];
    const el = document.createElement("button");
    el.className = "pin";
    el.style.setProperty("--pc", BRANDS[b0].color);
    const title = group && p.brands.length > 1 ? p.name : brands.map((b) => BRANDS[b].name).join(" & ");
    el.setAttribute("aria-label", `${group ? p.brands.map((b) => BRANDS[b].name).join(", ") : title}. Open details`);
    const logos = group ? `<img src="${logo(b0)}" alt="">${p.brands.length > 1 ? `<span class="more">+${p.brands.length - 1}</span>` : ""}`
      : brands.map((b) => `<img src="${logo(b)}" alt="">`).join("");
    el.innerHTML = `<span class="card ${brands.length > 1 && !group ? "duo" : ""}">${logos}</span><span class="dot"></span><span class="tip">${esc(title)}</span>`;
    const m = { id: group ? p.id : `${p.id}:${brands[0]}`, place: p, brands: group ? p.brands : brands, x, y, group, el, card: el.querySelector(".card"), spot, w: 0, h: 0 };
    el.addEventListener("click", () => openPlace(p.id, group ? null : brands[0], true));
    el.addEventListener("mouseenter", () => hotList(p.id, true));
    el.addEventListener("mouseleave", () => hotList(p.id, false));
    el.querySelectorAll("img").forEach((img) => img.addEventListener("load", () => { m.w = 0; renderOverlay(); }));
    overlay.appendChild(el);
    MARKERS.push(m);
    return m;
  }
  PLACES.forEach((p, i) => {
    p.prio = i;
    p.groupMarker = makeMarker(p, p.brands, p.spots.length > 1 ? p.x : p.spots[0].x, p.spots.length > 1 ? p.y : p.spots[0].y, true, null);
    p.spotMarkers = p.spots.length > 1 ? p.spots.map((s) => makeMarker(p, s.brands, s.x, s.y, false, s)) : [];
  });
  const TOW = { lat: 33.93, lng: -96.72 };
  [TOW.x, TOW.y] = project(TOW.lng, TOW.lat);
  const towEl = document.createElement("button");
  towEl.className = "tow-chip";
  towEl.innerHTML = `<span class="tow-ring"></span><span>TowBoatU.S. <small>· lakewide 24/7</small></span>`;
  towEl.addEventListener("click", () => openTow());
  overlay.appendChild(towEl);

  // zoom
  let T = d3.zoomIdentity;
  const zoom = d3.zoom().scaleExtent([0.25, 60]).on("zoom", (e) => {
    T = e.transform;
    world.attr("transform", T);
    renderOverlay();
  });
  svg.call(zoom).on("dblclick.zoom", null);

  function size() { return [stage.clientWidth, stage.clientHeight]; }
  function fitBounds(x0, y0, x1, y1, pad = 40) {
    const [w, h] = size();
    const sheet = MOBILE() && !state.plan ? h * 0.46 : 0;
    const k = Math.min((w - pad * 2) / (x1 - x0), (h - sheet - pad * 2) / (y1 - y0));
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return d3.zoomIdentity.translate(w / 2 - k * cx, (h - sheet) / 2 - k * cy).scale(k);
  }
  function go(t, ms = 900) {
    if (REDUCE || !ms) svg.call(zoom.transform, t);
    else svg.transition().duration(ms).ease(d3.easeCubicInOut).call(zoom.transform, t);
  }
  const LB = G.lakeBounds;
  const lakeView = () => fitBounds(LB[0], LB[1], LB[2], LB[3], 24);
  function shoreView() {
    const xs = PLACES.map((p) => p.x), ys = PLACES.map((p) => p.y);
    return fitBounds(Math.min(...xs) - 60, Math.min(...ys) - 90, Math.max(...xs) + 60, Math.max(...ys) + 50, 30);
  }
  function placeView(p, k = 14) {
    const [w, h] = size();
    const sheet = MOBILE() ? h * 0.46 : 0;
    return d3.zoomIdentity.translate(w / 2 - k * p.x, (h - sheet) / 2 + 40 - k * p.y).scale(k);
  }

  let lastLocalW = -1;
  function renderOverlay() {
    const k = T.k;
    // stroke widths that grow gently with zoom
    const shore = Math.max(1.5, Math.min(7, 0.9 + k * 0.35));
    world.select(".lake-shore").attr("stroke-width", shore);
    const lw = k < 2.2 ? 0 : Math.min(7, 0.6 + (k - 2.2) * 0.32);
    if (Math.abs(lw - lastLocalW) > 0.05) {
      local.attr("opacity", lw ? Math.min(1, (k - 2.2) / 1.5) : 0);
      local.select(".local-road").attr("stroke-width", lw);
      local.select(".local-service").attr("stroke-width", lw * 0.6);
      local.select(".local-pier").attr("stroke-width", Math.max(1, lw * 0.35));
      lastLocalW = lw;
    }
    for (const l of LABELS) {
      const vis = k >= (l.min ?? 0) && k < (l.max ?? 99);
      l.el.style.opacity = vis ? 1 : 0;
      if (vis) {
        const [sx, sy] = T.apply([l.x, l.y]);
        l.el.style.transform = `translate(${sx}px,${sy}px) translate(-50%,-50%)`;
      }
    }
    layoutMarkers();
    const [tx, ty] = T.apply([TOW.x, TOW.y]);
    towEl.style.left = tx + "px";
    towEl.style.top = ty + "px";
    towEl.style.opacity = k < 3 ? 1 : 0;
    towEl.style.pointerEvents = k < 3 ? "auto" : "none";
    scaleBar(k);
  }


  const SPLIT_PX = 40;
  function placeSplit(p) {
    if (p.spots.length < 2) return false;
    let d = 0;
    for (const a of p.spots) for (const b of p.spots) d = Math.max(d, Math.hypot(a.x - b.x, a.y - b.y) * T.k);
    return d > SPLIT_PX;
  }
  function markerActive(m) {
    if (state.hover === m.place.id) return true;
    if (state.place !== m.place.id) return false;
    return m.group || m.brands.includes(state.brand);
  }
  function layoutMarkers() {
    const [W, H] = size();
    const vis = [];
    for (const p of PLACES) {
      const split = placeSplit(p);
      p.groupMarker.el.hidden = split;
      p.spotMarkers.forEach((m) => { m.el.hidden = !split; });
      (split ? p.spotMarkers : [p.groupMarker]).forEach((m) => vis.push(m));
    }
    for (const m of vis) {
      [m.sx, m.sy] = T.apply([m.x, m.y]);
      m.el.style.transform = `translate(${m.sx}px,${m.sy}px)`;
      if (!m.w) { m.w = m.card.offsetWidth || 90; m.h = m.card.offsetHeight || 44; }
      const on = state.cat === "all" || m.brands.some((b) => BRANDS[b].cats.includes(state.cat));
      m.el.classList.toggle("dim", !on);
      m.el.classList.toggle("active", markerActive(m));
    }
    // labels: try spots around each dot, keep clear of other cards and dots; fall back to a bare dot
    const dots = vis.map((m) => [m.sx - 9, m.sy - 9, m.sx + 9, m.sy + 9, m]);
    const placed = [];
    const hit = (r, self) => placed.some((q) => !(r[2] < q[0] || r[0] > q[2] || r[3] < q[1] || r[1] > q[3]))
      || dots.some((d) => d[4] !== self && !(r[2] < d[0] || r[0] > d[2] || r[3] < d[1] || r[1] > d[3]));
    const order = vis.slice().sort((a, b) => markerActive(b) - markerActive(a) || a.place.prio - b.place.prio || (a.group ? 0 : a.place.spotMarkers.indexOf(a)) - (b.group ? 0 : b.place.spotMarkers.indexOf(b)));
    let lines = "";
    for (const m of order) {
      const w = m.w, h = m.h;
      const cands = [
        ["top", 0, -(h / 2 + 15)], ["tr", w / 2 + 6, -(h / 2 + 10)], ["tl", -(w / 2 + 6), -(h / 2 + 10)],
        ["r", w / 2 + 18, 0], ["l", -(w / 2 + 18), 0], ["b", 0, h / 2 + 18],
        ["tr", w / 2 + 26, -(h / 2 + 34)], ["tl", -(w / 2 + 26), -(h / 2 + 34)], ["top", 0, -(h / 2 + 50)],
        ["r", w / 2 + 52, 0], ["l", -(w / 2 + 52), 0], ["b", 0, h / 2 + 50],
      ];
      let pick = null;
      if (T.k >= 0.42) {
        for (const c of cands) {
          const cx = m.sx + c[1], cy = m.sy + c[2];
          const r = [cx - w / 2 - 3, cy - h / 2 - 3, cx + w / 2 + 3, cy + h / 2 + 3];
          if (!hit(r, m)) { pick = { c, cx, cy, r }; break; }
        }
      }
      m.el.classList.toggle("compact", !pick);
      m.el.style.zIndex = markerActive(m) ? 4 : pick ? 2 : 1;
      if (!pick) continue;
      placed.push(pick.r);
      const [pos, dx, dy] = pick.c;
      m.card.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
      const stem = pos === "top" && dy > -(h / 2 + 20);
      m.card.classList.toggle("stem", stem);
      if (!stem && !m.el.classList.contains("dim")) {
        // leader from the dot to the nearest point on the card
        const ex = Math.max(pick.r[0] + 3, Math.min(m.sx, pick.r[2] - 3)), ey = Math.max(pick.r[1] + 3, Math.min(m.sy, pick.r[3] - 3));
        lines += `<line x1="${m.sx.toFixed(1)}" y1="${m.sy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="${BRANDS[m.brands[0]].color}"/>`;
      }
    }
    leaders.setAttribute("viewBox", `0 0 ${W} ${H}`);
    leaders.innerHTML = lines;
  }

  function scaleBar(k) {
    const mPerPx = M_PER_UNIT / k;
    const opts = [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 20];
    let mi = opts[0];
    for (const o of opts) if ((o * 1609.34) / mPerPx <= 96) mi = o;
    const px = (mi * 1609.34) / mPerPx;
    $("#scale-bar").style.width = px.toFixed(0) + "px";
    $("#scale-lbl").textContent = mi < 0.25 ? `${Math.round(mi * 5280)} ft` : `${mi} mi`;
  }
  svg.on("mousemove.coords", (e) => {
    const [x, y] = T.invert(d3.pointer(e));
    const [lng, lat] = unproject(x, y);
    $("#coords").textContent = `${lat.toFixed(3)}°N ${Math.abs(lng).toFixed(3)}°W`;
  });

  $("#zin").onclick = () => svg.transition().duration(REDUCE ? 0 : 300).call(zoom.scaleBy, 1.8);
  $("#zout").onclick = () => svg.transition().duration(REDUCE ? 0 : 300).call(zoom.scaleBy, 1 / 1.8);
  $("#zhome").onclick = () => { closePlan(true); showHome(); go(lakeView()); };

  // ------------------------------------------------------------------ light / dark
  const root = document.documentElement, THEME_KEY = "texoma-explorer-theme";
  const effectiveTheme = () => (root.dataset.theme === "dark" || root.dataset.theme === "light" ? root.dataset.theme : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const themeBtn = $("#theme-btn");
  function paintThemeBtn() {
    const dark = effectiveTheme() === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light map" : "Switch to dark map");
    themeBtn.title = dark ? "Light map" : "Dark map";
    themeBtn.innerHTML = dark
      ? `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10" cy="10" r="3.6"/><path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"/></svg><span>Light</span>`
      : `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7z"/></svg><span>Dark</span>`;
  }
  try { const t = localStorage.getItem(THEME_KEY); if (t === "light" || t === "dark") root.dataset.theme = t; } catch (e) { /* storage blocked */ }
  themeBtn.addEventListener("click", () => {
    const next = effectiveTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage blocked */ }
    paintThemeBtn();
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", paintThemeBtn);
  paintThemeBtn();

  // ------------------------------------------------------------------ panel
  const panel = $("#panel"), scroller = $("#panel-scroll");
  $("#sheet-handle").onclick = () => {
    if (panel.classList.contains("full")) { panel.classList.remove("full"); panel.classList.add("peek"); }
    else if (panel.classList.contains("peek")) panel.classList.remove("peek");
    else panel.classList.add("full");
  };
  function setSheet(mode) { panel.classList.toggle("full", mode === "full"); panel.classList.toggle("peek", mode === "peek"); }

  const placeHasCat = (p, cat) => cat === "all" || p.brands.some((b) => BRANDS[b].cats.includes(cat));

  function showHome() {
    state.place = state.brand = null;
    state.tow = false;
    world.classed("tow-on", false);
    state.hover = null;
    setHash("");
    const nBiz = Object.keys(BRANDS).length;
    scroller.innerHTML = `
      <header class="masthead pad">
        <div class="kicker">Texoma Destinations <span class="sep"></span> Big Water</div>
        <h1>Lake Texoma</h1>
        <p>Where to stay, play and launch along the Texas shore. Pick a spot on the map to see what you can book there.</p>
        <div class="lake-stats"><span><b>${PLACES.length}</b>locations</span><span><b>${nBiz}</b>businesses</span><span><b>89,000</b>acres of lake</span></div>
      </header>
      <div class="chips pad" role="group" aria-label="Filter by activity">${CATS.map((c) => `<button class="chip" data-cat="${c.id}" aria-pressed="${state.cat === c.id}">${c.label}</button>`).join("")}</div>
      <ul class="place-list">${PLACES.map((p) => placeItem(p)).join("")}</ul>
      <button class="tow-card" id="tow-card"><span class="tow-ring"></span><span><b>TowBoatU.S. Lake Texoma</b><span>On-water assistance anywhere on the lake, 24/7</span></span></button>
      <p class="sources pad">Prices and counts verified Sep 3, 2026 and charged at booking. Booking opens the existing reservation pages.</p>`;
    scroller.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => { state.cat = c.dataset.cat; applyCat(); }));
    scroller.querySelectorAll(".place-btn").forEach((b) => {
      b.addEventListener("click", () => openPlace(b.dataset.place));
      b.addEventListener("mouseenter", () => { state.hover = b.dataset.place; renderOverlay(); });
      b.addEventListener("mouseleave", () => { state.hover = null; renderOverlay(); });
    });
    $("#tow-card").addEventListener("click", openTow);
    applyCat();
    scroller.scrollTop = 0;
    renderOverlay();
  }
  function placeItem(p) {
    const b = BRANDS[p.brands[0]];
    const multi = p.brands.length > 1;
    return `<li class="place-item" data-place="${p.id}"><button class="place-btn" data-place="${p.id}">
      <span class="logo-tile"><img src="${logo(p.brands[0])}" alt=""></span>
      <span><h3>${esc(multi ? b.name : b.name)}</h3><span class="sub">${esc(b.tagline)}</span>
      ${multi ? `<span class="co-brands">${p.brands.slice(1).map((x) => `<span>${esc(BRANDS[x].short)}</span>`).join("")}</span>` : ""}</span>
      <span class="where">${esc(p.area)}</span></button></li>`;
  }
  function applyCat() {
    scroller.querySelectorAll(".chip[data-cat]").forEach((c) => c.setAttribute("aria-pressed", c.dataset.cat === state.cat));
    PLACES.forEach((p) => {
      const on = placeHasCat(p, state.cat);
      const li = scroller.querySelector(`.place-item[data-place="${p.id}"]`);
      if (li) li.classList.toggle("dim", !on);
    });
    renderOverlay();
  }
  function hotList(id, on) {
    const b = scroller.querySelector(`.place-btn[data-place="${id}"]`);
    if (b) b.classList.toggle("hot", on);
  }

  function openPlace(id, brandId, fly = true) {
    const p = PLACES.find((x) => x.id === id);
    if (!p) return;
    if (state.plan) closePlan(false);
    state.place = id;
    state.tow = false;
    world.classed("tow-on", false);
    state.brand = brandId && p.brands.includes(brandId) ? brandId : p.brands[0];
    state.hover = null;
    renderPlace();
    setSheet(null);
    if (fly) go(placeView(p, p.plan ? 15 : 11), 1100);
    setHash(state.brand === p.brands[0] ? p.id : state.brand);
  }

  function renderPlace() {
    const p = PLACES.find((x) => x.id === state.place);
    const bid = state.brand, b = BRANDS[bid];
    const facts = b.facts || [];
    const tabs = p.brands.length > 1
      ? `<div class="brand-tabs" role="tablist" aria-label="Businesses at ${esc(p.name)}">${p.brands.map((x) => `<button class="brand-tab" role="tab" data-brand="${x}" aria-selected="${x === bid}" style="--bc:${BRANDS[x].color}"><img src="${logo(x)}" alt="">${esc(BRANDS[x].short)}</button>`).join("")}</div>`
      : "";
    const plan = p.plan && p.plan !== "sundance" ? PLANS[p.plan] : null;
    const planCounts = plan ? planSummary(p.plan) : "";
    scroller.innerHTML = `<div class="detail pad" style="--bc:${b.color};--bc-ink:${b.color};--bc-line:${b.accent}">
      <button class="back" id="back">← All locations</button>
      ${tabs}
      <div class="hero ${b.photo ? "" : "no-photo"}">${b.photo ? `<img class="photo" src="${photo(b.photo)}" alt="">` : ""}<span class="badge"><img src="${logo(bid)}" alt="${esc(b.name)} logo"></span></div>
      <h2>${esc(b.name)}</h2>
      <p class="tagline">${esc(b.tagline)}</p>
      <p class="blurb">${esc(b.blurb)}</p>
      ${facts.length ? `<dl class="facts ${facts.length % 2 ? "odd" : ""}">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
      ${plan ? `<button class="explore-btn" id="explore"><span>Explore the property map<small>${planCounts}</small></span><span aria-hidden="true">→</span></button>` : ""}
      ${bid === "sundance" ? sundanceCabins() : ""}
      <div class="sec-h">Book & plan <small>opens the booking page</small></div>
      ${b.offers.map((o) => `<div class="offer"><h4>${esc(o.t)}</h4>${o.p ? `<span class="price">${esc(o.p)}</span>` : ""}<p>${esc(o.d)}</p><a href="${esc(link(o.u, bid, "offer"))}" target="_blank" rel="noopener">${esc(o.cta)} ↗</a></div>`).join("")}
      <div class="contact">
        <div class="row"><span>Phone</span><span class="phone">${esc(b.phone)}</span></div>
        <div class="row"><span>Address</span><span>${esc(b.address)}</span></div>
        ${b.hours ? `<div class="row"><span>Hours</span><span>${esc(b.hours)}</span></div>` : ""}
      </div>
      <div class="links">
        <a class="btn solid" href="${esc(link(b.site, bid, "website"))}" target="_blank" rel="noopener">Visit website ↗</a>
        <a class="btn" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" rel="noopener">Directions ↗</a>
      </div></div>`;
    $("#back").onclick = () => { showHome(); go(shoreView()); };
    scroller.querySelectorAll(".brand-tab").forEach((t) => t.addEventListener("click", () => { state.brand = t.dataset.brand; renderPlace(); setHash(state.brand); }));
    const ex = $("#explore");
    if (ex) ex.onclick = () => openPlan(p.plan);
    scroller.scrollTop = 0;
    renderOverlay();
  }
  function sundanceCabins() {
    const b = BRANDS.sundance;
    return `<div class="sec-h">The Tiny Cabin Village <small>property map coming</small></div>
      <div class="cabin-grid">${b.cabins.map((c) => `<div class="cabin-card"><img src="${photo(c.img)}" alt="${esc(c.n)} cabin" loading="lazy"><div><b>${esc(c.n)}</b><span>${esc(c.beds)} · sleeps ${c.sleeps}</span></div></div>`).join("")}</div>
      <a class="btn" style="margin:6px 0 4px" href="${esc(link("https://texomadestinations.com/where-to-stay/cabins#/sundance", "sundance", "cabin-village"))}" target="_blank" rel="noopener">Book a tiny cabin ↗</a>`;
  }

  function openTow() {
    if (state.plan) closePlan(false);
    state.place = null;
    state.tow = true;
    world.classed("tow-on", true);
    const b = BRANDS.towboatus;
    scroller.innerHTML = `<div class="detail pad" style="--bc:${b.color};--bc-ink:${b.color};--bc-line:${b.accent}">
      <button class="back" id="back">← All locations</button>
      <div class="hero no-photo" style="background:#fff;border:1px solid var(--line-2)"><span class="badge" style="box-shadow:none"><img src="${logo("towboatus")}" alt="TowBoatU.S. Lake Texoma logo"></span></div>
      <h2>${esc(b.name)}</h2><p class="tagline">${esc(b.tagline)}</p><p class="blurb">${esc(b.blurb)}</p>
      <dl class="facts"><div><dt>Dispatch</dt><dd style="font-family:var(--mono)">${esc(b.phone)}</dd></div><div><dt>Hours</dt><dd>24/7/365</dd></div></dl>
      <div class="sec-h">Service area</div><p class="blurb">The dotted red line on the map is the whole service area: every cove, arm and marina on the lake.</p>
      ${b.offers.map((o) => `<div class="offer"><h4>${esc(o.t)}</h4><p>${esc(o.d)}</p><a href="${esc(link(o.u, "towboatus", "offer"))}" target="_blank" rel="noopener">${esc(o.cta)} ↗</a></div>`).join("")}
      <div class="links"><a class="btn solid" href="${esc(link(b.site, "towboatus", "website"))}" target="_blank" rel="noopener">Visit website ↗</a></div></div>`;
    $("#back").onclick = () => { showHome(); go(shoreView()); };
    setHash("towboatus");
    setSheet(null);
    go(lakeView());
  }

  // ------------------------------------------------------------------ plans
  const planEl = $("#plan"), planSvg = d3.select("#plan-svg"), planG = d3.select("#plan-g"), hover = $("#hovercard");
  let PT = d3.zoomIdentity;
  const pzoom = d3.zoom().scaleExtent([0.2, 12]).on("zoom", (e) => { PT = e.transform; planG.attr("transform", PT); planScaleFix(); });
  planSvg.call(pzoom).on("dblclick.zoom", null);

  const KIND_LABEL = { cabin: "Cabins", rv: "RV sites", slip: "Boathouses", kabana: "Kabanas", kasita: "Kasitas", kima: "Kimas", tent: "Tent sites", shelter: "Shelters", poi: "Amenities" };
  const FILTERS = {
    lighthouse: [["cabin", "Cabins"], ["rv", "RV sites"], ["slip", "Boathouses"], ["poi", "Amenities"]],
    paradise: [["glamp", "Glamping"], ["cabin", "Cabins"], ["rv", "RV sites"], ["tent", "Tent sites"], ["poi", "Amenities"]],
    "island-view": [["shelter", "Shelters"], ["poi", "Amenities"]],
  };
  const groupOf = (kind) => (["kabana", "kasita", "kima"].includes(kind) ? "glamp" : kind);
  const PLACE_OF_PLAN = { lighthouse: "lighthouse", paradise: "paradise", "island-view": "island-view" };

  function planSummary(id) {
    const P = PLANS[id], c = {};
    [...P.units, ...(P.docks || [])].forEach((u) => { const g = groupOf(u.kind); c[g] = (c[g] || 0) + 1; });
    const name = { cabin: "cabins", rv: "RV sites", slip: "boathouses", glamp: "glamping units", tent: "tent sites", shelter: "shelters" };
    return Object.entries(c).map(([k, n]) => `${n} ${name[k]}`).join(" · ");
  }

  const ICON = {
    office: "M0 -3.6v.2M0 -1v4.4", venue: "M-4 4h8M-3.2 4v-4l3.2-2.6 3.2 2.6v4", ramp: "M-5 3.5L4.5 -3M-5 3.5h10",
    fuel: "M-3.5 4v-8h5v8M-3.5 -.5h5M1.5 -2.5l2.5 1.2v3.8", fish: "M-5 0c2-3.2 6-3.2 8 0c-2 3.2-6 3.2-8 0zM3 0l2.6-2.2v4.4z",
    cruise: "M-5.5 1h11l-2.2 3h-6.6zM-3 1v-3h5v3M0 -2v-2", boat: "M-5 1.5h10l-2 3h-6zM0 1.5v-6.5l3.5 5",
    club: "M0 -4.5v8.5M-3 -2h6M-4.5 1.5c.5 3 8.5 3 9 0", rvdump: "M-4.5 -3h7v5h-7zM2.5 -1h2l.8 3h-2.8M-2.5 3.6v0M1.8 3.6v0",
    bath: "M-2.6-3.2v.1M2.6-3.2v.1M-2.6-.8v4.6M2.6-.8v4.6M-4 0h2.8M1.2 0h2.8", parking: "M-2 4.5v-9h3.2a2.6 2.6 0 0 1 0 5.2h-3.2",
    beach: "M-5 .5a5 5 0 0 1 10 0zM0 .5v4.5", view: "M-5 0c2-3.3 8-3.3 10 0c-2 3.3-8 3.3-10 0zM0 -1v2", entrance: "M-4.5 0h8M1 -3.2l3.2 3.2-3.2 3.2",
    play: "M-4.5 4.5l4.5-9 4.5 9M-2.2 0h4.4", nature: "M-4 4c0-6 4-8.5 8.5-8.5c0 6-4 8.5-8.5 8.5zM-4 4l5.5-5.5", day: "M0 -2.2a2.2 2.2 0 1 0 .01 0M0-5v1.2M0 3.8v1.2M-5 0h1.2M3.8 0h1.2",
  };
  const POI_BRAND = { fuel: "fuel", rentals: "fuel", fastrac: "fastrac", club: "boatclub" };
  const POI_TEXT = {
    office: "Check in here. Reservations are handled by Texoma Destinations at 903.361.8500.",
    lodge: "Event hall for up to 80 guests: reunions, retreats and weddings.",
    fireside: "Lakeside gathering spot for up to 25.",
    fastrac: "Every public cruise and private charter boards here.",
    club: "Big Water Boat Club members pick up their boats at the fuel dock.",
    fuel: "Year-round fuel, plus ice, bait, snacks and firewood in the store.",
    rentals: "Tritoons, sailboats, kayaks and paddleboards leave from here.",
  };

  function openPlan(id) {
    const P = PLANS[id];
    if (!P) return;
    state.plan = id;
    state.unit = null;
    state.planFilter = new Set(FILTERS[id].map((f) => f[0]));
    drawPlan(P);
    const p = PLACES.find((x) => x.id === PLACE_OF_PLAN[id]);
    const b = BRANDS[p.brands[0]];
    $("#plan-ttl").innerHTML = `<img src="${logo(p.brands[0])}" alt=""><span><small>Property map</small><b>${esc(b.name)}</b></span>`;
    $("#plan-filters").innerHTML = FILTERS[id].map(([k, l]) => `<button class="chip" data-f="${k}" aria-pressed="true">${l}</button>`).join("");
    $("#plan-filters").querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => {
      const f = c.dataset.f;
      state.planFilter.has(f) ? state.planFilter.delete(f) : state.planFilter.add(f);
      c.setAttribute("aria-pressed", state.planFilter.has(f));
      applyPlanFilter();
    }));
    $("#plan-note").textContent = "Redrawn from the printed property map, which may be out of date. Unit positions are being verified.";
    planEl.hidden = false;
    void planEl.offsetWidth;
    planEl.classList.add("show");
    fitPlan(P, false);
    renderPlanPanel();
    if (MOBILE()) setSheet("peek");
    setHash(id + "-map");
  }
  function closePlan(anim = true) {
    if (!state.plan) return;
    state.plan = null;
    planEl.classList.remove("show");
    hover.style.opacity = 0;
    const done = () => { if (!state.plan) planEl.hidden = true; };
    anim && !REDUCE ? setTimeout(done, 380) : done();
  }
  $("#plan-close").onclick = () => { const id = state.place; closePlan(); if (id) { renderPlace(); setHash(id); } };

  function fitPlan(P, animate) {
    const wrap = $("#plan-wrap");
    const w = wrap.clientWidth || stage.clientWidth, h = wrap.clientHeight || stage.clientHeight - 60;
    const [vx, vy, vw, vh] = P.view;
    const sheet = MOBILE() ? 128 : 0;
    const k = Math.min((w - 32) / vw, (h - sheet - 32) / vh);
    const t = d3.zoomIdentity.translate(w / 2 - k * (vx + vw / 2), (h - sheet) / 2 - k * (vy + vh / 2)).scale(k);
    pzoom.scaleExtent([k * 0.8, k * 10]);
    animate && !REDUCE ? planSvg.transition().duration(600).call(pzoom.transform, t) : planSvg.call(pzoom.transform, t);
  }

  function rectEl(g, r, rx = 0.2) {
    const [x, y, w, h, a] = r;
    const gg = g.append("g").attr("transform", `translate(${x},${y}) rotate(${a})`);
    gg.append("rect").attr("x", -w / 2).attr("y", -h / 2).attr("width", w).attr("height", h).attr("rx", Math.min(w, h) * rx);
    return gg;
  }

  function drawPlan(P) {
    planG.selectAll("*").remove();
    const base = planG.append("g");
    const [vx, vy, vw, vh] = P.view;
    const bleed = 4000;
    if (P.id === "lighthouse") {
      base.append("rect").attr("class", "p-water").attr("x", vx - bleed).attr("y", vy - bleed).attr("width", vw + bleed * 2).attr("height", vh + bleed * 2);
      base.append("path").attr("class", "p-shore").attr("d", P.land).attr("stroke-width", 5);
      base.append("path").attr("class", "p-land").attr("d", P.land).attr("fill-rule", "evenodd");
      base.append("path").attr("class", "p-water").attr("d", P.pond);
      base.append("path").attr("class", "p-shore").attr("d", P.pond).attr("stroke-width", 3);
      base.append("path").attr("class", "p-road-case").attr("d", P.roads).attr("stroke", "var(--road-case)").attr("stroke-width", 3).attr("vector-effect", "non-scaling-stroke");
      base.append("path").attr("class", "p-road").attr("d", P.roads);
      const s = base.append("g");
      P.seasonal.forEach((r) => rectEl(s, r, 0.15).select("rect").attr("class", "p-seasonal"));
      const m = base.append("g");
      m.append("polygon").attr("class", "marina-shape").attr("points", P.marina.fuel.map((q) => q.join(",")).join(" "));
      rectEl(m, P.marina.store, 0.1).select("rect").attr("class", "marina-shape");
      rectEl(m, P.marina.rentals, 0.1).select("rect").attr("class", "marina-shape");
      rectEl(m, P.marina.pier, 0.3).select("rect").attr("class", "marina-shape");
      rectEl(m, P.marina.fastrac, 0.1).select("rect").attr("class", "fastrac-shape");
      rectEl(m, P.marina.fastrac2, 0.2).select("rect").attr("class", "fastrac-shape");
    } else if (P.id === "paradise") {
      base.append("rect").attr("class", "p-land").attr("x", vx - bleed).attr("y", vy - bleed).attr("width", vw + bleed * 2).attr("height", vh + bleed * 2);
      base.append("path").attr("class", "p-trees").attr("d", P.trees);
      base.append("path").attr("class", "p-shore").attr("d", P.water).attr("stroke-width", 5);
      base.append("path").attr("class", "p-water").attr("d", P.water);
      base.append("path").attr("class", "p-road").attr("d", P.roads).attr("stroke", "var(--road)").attr("stroke-width", 2.5).attr("stroke-linejoin", "round").attr("vector-effect", "non-scaling-stroke");
    } else {
            base.append("rect").attr("class", "p-land").attr("x", vx - bleed).attr("y", vy - bleed).attr("width", vw + bleed * 2).attr("height", vh + bleed * 2);
      base.append("path").attr("class", "p-sand").attr("d", P.sand);
      base.append("path").attr("class", "p-shore").attr("d", P.water).attr("stroke-width", 4);
      base.append("path").attr("class", "p-water").attr("d", P.water);
      base.append("path").attr("class", "p-water").attr("d", P.pond).attr("opacity", .8);
      base.append("path").attr("class", "p-parking").attr("d", P.parking);
      base.append("path").attr("class", "p-hwy").attr("d", P.hwy).attr("stroke", "var(--road-major-case)").attr("stroke-width", 1).attr("vector-effect", "non-scaling-stroke");
      base.append("path").attr("class", "p-road").attr("d", P.roads).attr("stroke", "var(--road-case)").attr("stroke-width", 1).attr("vector-effect", "non-scaling-stroke");
    }
    (P.labels || []).forEach(([t, x, y, c]) => base.append("text").attr("class", "p-lbl " + c).attr("x", x).attr("y", y).attr("font-size", c === "water" ? 30 * (P.w / 1472) + 8 : 12 * (P.w / 1472) + 7).attr("text-anchor", "middle").text(t));

    const ug = planG.append("g");
    const all = [...(P.docks || []), ...P.units];
    all.forEach((u) => {
      const cls = ["unit", u.kind];
      if (u.hook) cls.push("h" + u.hook[0]);
      const g = rectEl(ug, u.r, u.kind === "rv" && P.id === "paradise" ? 0.5 : 0.18).attr("class", cls.join(" ")).attr("data-id", u.id)
        .attr("tabindex", 0).attr("role", "button").attr("aria-label", unitTitle(P.id, u));
      if (u.n) g.append("text").attr("transform", `rotate(${-u.r[4]})`).text(u.n);
      g.on("click", (e) => { e.stopPropagation(); selectUnit(u.id); })
        .on("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectUnit(u.id); } })
        .on("mouseenter", (e) => showHover(e, unitTitle(P.id, u), unitSub(P.id, u)))
        .on("mousemove", moveHover).on("mouseleave", hideHover);
      u._g = g;
    });
    const pg = planG.append("g");
    P.pois.forEach((q) => {
      const g = pg.append("g").attr("class", "poi").attr("data-id", "poi-" + q.id).attr("data-x", q.x).attr("data-y", q.y)
        .attr("tabindex", 0).attr("role", "button").attr("aria-label", q.name);
      g.append("circle").attr("r", 10);
      g.append("path").attr("d", ICON[q.kind] || ICON.office);
      g.on("click", (e) => { e.stopPropagation(); selectUnit("poi-" + q.id); })
        .on("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectUnit("poi-" + q.id); } })
        .on("mouseenter", (e) => showHover(e, q.name, "")).on("mousemove", moveHover).on("mouseleave", hideHover);
    });
    planSvg.on("click.clear", () => { if (state.unit) { state.unit = null; markUnit(); renderPlanPanel(); } });
  }

  function planScaleFix() {
    const k = PT.k;
    planG.selectAll(".poi").attr("transform", function () { return `translate(${this.dataset.x},${this.dataset.y}) scale(${1 / k})`; });
    planG.selectAll(".unit text").attr("font-size", function () {
      const u = findUnit(this.parentNode.dataset.id);
      const px = Math.min(u.r[2], u.r[3]) * k;
      return px < 12 ? 0 : Math.min(12, px * 0.62) / k;
    });
    hideHover();
  }
  function findUnit(id) {
    const P = PLANS[state.plan];
    if (!P) return null;
    if (id.startsWith("poi-")) return P.pois.find((q) => "poi-" + q.id === id);
    return [...(P.docks || []), ...P.units].find((u) => u.id === id);
  }

  function unitTitle(pid, u) {
    const over = (UNITS[pid] || {})[u.id] || {};
    if (over.name) return over.name;
    if (u.name) return u.name;
    const t = UNIT_TYPES[pid][u.kind];
    const lbl = t ? t.label : u.kind;
    return u.n ? `${lbl} ${u.n}` : lbl;
  }
  function unitSub(pid, u) {
    if (u.hookup) return u.hookup;
    if (u.slips) return u.slips;
    return "";
  }

  function showHover(e, t, s) {
    if (MOBILE()) return;
    hover.innerHTML = esc(t) + (s ? `<small>${esc(s)}</small>` : "");
    hover.style.opacity = 1;
    moveHover(e);
  }
  function moveHover(e) {
    const r = stage.getBoundingClientRect();
    hover.style.left = e.clientX - r.left + 14 + "px";
    hover.style.top = e.clientY - r.top + 12 + "px";
  }
  function hideHover() { hover.style.opacity = 0; }

  function applyPlanFilter() {
    const P = PLANS[state.plan];
    [...(P.docks || []), ...P.units].forEach((u) => u._g.classed("off", !state.planFilter.has(groupOf(u.kind))));
    planG.selectAll(".poi").classed("off", !state.planFilter.has("poi"));
    renderPlanPanel();
  }

  function selectUnit(id) {
    state.unit = id;
    markUnit();
    renderPlanPanel();
    if (MOBILE()) setSheet(null);
  }
  function markUnit() {
    planG.selectAll(".unit").classed("sel", function () { return this.dataset.id === state.unit; });
    planG.selectAll(".poi").classed("sel", function () { return this.dataset.id === state.unit; });
  }

  function renderPlanPanel() {
    const id = state.plan, P = PLANS[id];
    const pl = PLACES.find((x) => x.id === PLACE_OF_PLAN[id]);
    const b = BRANDS[pl.brands[0]];
    const u = state.unit ? findUnit(state.unit) : null;
    let card = "";
    if (u && state.unit.startsWith("poi-")) {
      const bid = POI_BRAND[u.id];
      card = `<div class="unit-card"><div class="kind">On the property</div><div class="num" style="font-size:28px;margin-top:6px">${esc(u.name)}</div>
        ${POI_TEXT[u.id] ? `<p>${esc(POI_TEXT[u.id])}</p>` : ""}
        ${bid ? `<div class="links" style="margin:12px 0 0"><button class="btn solid" style="--bc:${BRANDS[bid].color};cursor:pointer" id="poi-brand" data-brand="${bid}">${esc(BRANDS[bid].name)} →</button></div>` : ""}</div>`;
    } else if (u) {
      const t = UNIT_TYPES[id][u.kind] || {};
      const over = (UNITS[id] || {})[u.id] || {};
      const tags = [...(u.hookup ? [u.hookup] : []), ...(u.slips ? [u.slips] : []), ...(t.tags || [])];
      card = `<div class="unit-card"><div class="kind">${esc(t.label || u.kind)}${u.kind === "rv" && id === "paradise" ? " · South Loop" : ""}</div>
        <div class="num">${esc(over.name || u.name || (u.n ? (u.kind === "slip" ? "BH " : "#") + u.n : t.label))}</div>
        ${t.img ? `<img src="${photo(t.img)}" alt="" loading="lazy">` : ""}
        <p>${esc(over.note || t.body || "")}</p>
        ${tags.length ? `<div class="tags">${tags.map((x) => `<span>${esc(x)}</span>`).join("")}</div>` : ""}
        ${over.confirm || u.confirm ? `<div class="confirm">This unit's position on the map is being confirmed.</div>` : `<div class="confirm">Photos, bedrooms and live availability for this ${esc((t.label || "unit").toLowerCase())} are on the booking page.</div>`}
        ${t.u ? `<div class="links" style="margin:14px 0 0"><a class="btn solid" style="--bc:${b.color}" href="${esc(link(t.u, t.brand || pl.brands[0], "plan-" + u.id))}" target="_blank" rel="noopener">${esc(t.cta)} ↗</a></div>` : ""}</div>`;
    }
    const groups = {};
    [...(P.docks || []), ...P.units].forEach((x) => { (groups[x.kind] = groups[x.kind] || []).push(x); });
    const order = { lighthouse: ["cabin", "rv", "slip"], paradise: ["kabana", "kasita", "kima", "cabin", "rv", "tent"], "island-view": ["shelter"] }[id];
    const legend = id === "paradise"
      ? `<div class="sec-h">RV hookups</div><div class="legend"><div><i style="background:var(--hook-y)"></i>50/30 amp · water · sewer</div><div><i style="background:var(--hook-o)"></i>50/30 amp · water</div><div><i style="background:var(--hook-b)"></i>30 amp · water · sewer</div><div><i style="background:var(--hook-r)"></i>30 amp · water</div></div><p class="verified" style="margin:0 0 6px">Sites 33–50 need about 100 ft of water hose and 25 ft of sewer hose.</p>`
      : "";
    const numSort = (a, c) => (parseInt(a.n, 10) || 0) - (parseInt(c.n, 10) || 0) || String(a.n).localeCompare(String(c.n));
    scroller.innerHTML = `<div class="detail pad" style="--bc:${b.color}">
      <button class="back" id="back">← ${esc(b.short)} details</button>
      <h2 style="margin-top:6px">${esc(b.short)} property map</h2>
      <p class="tagline" style="font-weight:400;color:var(--muted)">${u ? "Tap another spot on the map, or pick from the list." : "Tap a cabin, site or building on the map to see what's there and how to book it."}</p>
      ${card}
      ${legend}
      ${order.filter((k) => groups[k] && state.planFilter.has(groupOf(k))).map((k) => `<div class="sec-h">${KIND_LABEL[k]} <small>${groups[k].length}</small></div>
        <div class="unit-index">${groups[k].slice().sort(numSort).map((x) => `<button data-u="${x.id}" aria-current="${x.id === state.unit}">${esc(x.n || ((UNITS[id] || {})[x.id] || {}).short || unitTitle(id, x))}</button>`).join("")}</div>`).join("")}
      ${state.planFilter.has("poi") ? `<div class="sec-h">Amenities</div><div class="unit-index">${P.pois.map((q) => `<button data-u="poi-${q.id}" aria-current="${"poi-" + q.id === state.unit}" style="font-family:var(--body)">${esc(q.name)}</button>`).join("")}</div>` : ""}
      <div style="height:28px"></div></div>`;
    $("#back").onclick = () => { closePlan(); renderPlace(); setHash(state.place); };
    scroller.querySelectorAll("[data-u]").forEach((x) => x.addEventListener("click", () => { selectUnit(x.dataset.u); focusUnit(x.dataset.u); }));
    const pb = $("#poi-brand");
    if (pb) pb.onclick = () => { const bid = pb.dataset.brand; closePlan(); state.brand = bid; renderPlace(); setHash(bid); };
  }
  function focusUnit(id) {
    const u = findUnit(id);
    if (!u) return;
    const [x, y] = u.r ? [u.r[0], u.r[1]] : [u.x, u.y];
    const wrap = $("#plan-wrap");
    const k = Math.max(PT.k, pzoom.scaleExtent()[0] * 2.2);
    const sheet = MOBILE() ? wrap.clientHeight * 0.46 : 0;
    const t = d3.zoomIdentity.translate(wrap.clientWidth / 2 - k * x, (wrap.clientHeight - sheet) / 2 - k * y).scale(k);
    REDUCE ? planSvg.call(pzoom.transform, t) : planSvg.transition().duration(600).call(pzoom.transform, t);
  }

  // ------------------------------------------------------------------ routing & boot
  function setHash(h) {
    // absolute URL so a <base href> (standalone hosting) can't move the page path
    try { history.replaceState(null, "", location.pathname + location.search + (h ? "#" + h : "")); } catch (e) { /* sandboxed */ }
  }
  function route(hash = location.hash) {
    const h = decodeURIComponent(hash.slice(1));
    if (!h) return false;
    if (h === "towboatus") { openTow(); return true; }
    const planId = h.endsWith("-map") ? h.slice(0, -4) : null;
    if (planId && PLANS[planId]) { openPlace(PLACE_OF_PLAN[planId], null, false); go(placeView(PLACES.find((p) => p.id === PLACE_OF_PLAN[planId]), 15), 0); openPlan(planId); return true; }
    const place = PLACES.find((p) => p.id === h) || PLACES.find((p) => p.brands.includes(h));
    if (place) { openPlace(place.id, h, false); go(placeView(place, place.plan ? 15 : 11), 0); return true; }
    return false;
  }

  addEventListener("hashchange", () => { if (!route()) { closePlan(false); showHome(); go(shoreView()); } });

  let rz;
  addEventListener("resize", () => {
    clearTimeout(rz);
    rz = setTimeout(() => { renderOverlay(); if (state.plan) fitPlan(PLANS[state.plan], false); }, 120);
  });

  const bootHash = location.hash;
  showHome();
  svg.call(zoom.transform, lakeView());
  if (!route(bootHash)) {
    const intro = () => go(shoreView(), 1800);
    REDUCE ? svg.call(zoom.transform, shoreView()) : setTimeout(intro, 700);
  }
})();
