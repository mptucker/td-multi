"""Render brand guides → docs/brand-guides/<slug>.md + .pdf (via Chromium print)."""
import base64, html, json, os, subprocess, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from brands import BRANDS, MASTER

ASSETS = Path("/home/user/brand-assets")
OUT = Path("/home/user/td-brand-sites/docs/brand-guides")
OUT.mkdir(parents=True, exist_ok=True)
TMP = Path("/home/user/brand-guides/html"); TMP.mkdir(exist_ok=True)

def b64(p):
    f = ASSETS / p
    if not f.exists(): return ""
    mime = "image/png" if f.suffix == ".png" else "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(f.read_bytes()).decode()

def md(b):
    v = b["voice"]; L = []
    L += [f"# {b['name']} — Brand Style Guide & Voice", "",
          f"*{b['kind']} · {b['domain']} · Texoma Destinations family · v1.0 · September 2026*", "",
          f"**Tagline:** {b['tagline']}  ", f"**Hub descriptor:** {b['most']}", "",
          "## 1. Positioning", "", b["positioning"], "", f"**Who we're talking to.** {b['audience']}", "",
          "## 2. Personality", "", ", ".join(b["personality"]) + ".", "",
          f"Shared Texoma Destinations attributes (2023 campaign platform): {', '.join(MASTER['personality'])}. USP: *{MASTER['usp']}*.", "",
          "## 3. Voice", "", v["summary"], "", "**Do**", ""]
    L += [f"- {x}" for x in v["do"]] + ["", "**Don't**", ""] + [f"- {x}" for x in v["dont"]]
    L += ["", f"**Words we use:** {', '.join(v['words_use'])}  ", f"**Words we avoid:** {', '.join(v['words_avoid'])}", "",
          "## 4. Color", "", "| Name | Hex | Role |", "|---|---|---|"]
    L += [f"| {n} | `{h}` | {r} |" for n, h, r in b["palette"]]
    t = b["type"]
    L += ["", "## 5. Typography", "", f"- **Display:** {t['display']}", f"- **Body:** {t['body']}", f"- **Accent:** {t['accent']}", "", t["notes"], "",
          "## 6. Logo usage", ""] + [f"- {x}" for x in b["logo_rules"]]
    L += ["", "## 7. Photography", ""] + [f"- {x}" for x in b["photo"]]
    L += ["", "## 8. Key messages", ""] + [f"- {x}" for x in b["messages"]]
    s = b["samples"]
    L += ["", "## 9. Sample copy", "", f"**Headline:** {s['headline']}  ", f"**Subhead:** {s['sub']}  ", f"**Primary CTA:** {s['cta']}  ",
          f"**Social post:** {s['social']}  ", f"**Email subject:** {s['email']}", "",
          "---", "*Palette sampled from the production logo files; voice derived from the live sites, the 2023 Texoma Campaign Concepts deck and the hub's property descriptors. Facts referenced here are governed by the facts registry (content/facts.json).*"]
    return "\n".join(L)

CSS = """
@page { size: Letter; margin: 0.6in 0.65in; }
body { font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; color:#1a1f2b; font-size: 11pt; line-height:1.45; }
h1 { font-size: 26pt; margin: 0 0 4px; letter-spacing:-.01em }
h2 { font-size: 13pt; text-transform: uppercase; letter-spacing:.12em; margin: 26px 0 8px; padding-bottom:4px; border-bottom: 2px solid var(--p); color: var(--p) }
.meta { color:#667; font-size: 9.5pt; margin-bottom: 14px }
.hero { position:relative; height: 210px; border-radius: 10px; overflow:hidden; margin: 10px 0 18px; background:#ccc }
.hero img { width:100%; height:100%; object-fit:cover; display:block }
.hero .logo { position:absolute; left:16px; bottom:16px; background:#fff; padding:8px 12px; border-radius:8px; box-shadow:0 4px 18px rgba(0,0,0,.25) }
.hero .logo img { height:44px; width:auto; display:block }
.tag { position:absolute; right:16px; bottom:16px; background: var(--p); color:#fff; padding:6px 12px; border-radius: 999px; font-size: 10pt; font-weight:700 }
.two { display:grid; grid-template-columns: 1fr 1fr; gap: 18px }
.sw { display:grid; grid-template-columns: repeat(3, 1fr); gap: 10px }
.sw div { border-radius: 8px; padding: 10px; color:#fff; min-height: 74px; font-size: 9.5pt; box-shadow: inset 0 0 0 1px rgba(0,0,0,.08) }
.sw b { display:block; font-size: 10.5pt } .sw code { opacity:.9 }
ul { margin: 4px 0 0 18px; padding:0 } li { margin: 3px 0 }
.pill { display:inline-block; background:#eef1f5; border-radius: 999px; padding: 2px 10px; margin: 2px 4px 2px 0; font-size: 9.5pt }
.sample { background:#f5f6f8; border-left: 4px solid var(--p); padding: 10px 14px; border-radius: 6px; margin-top: 8px }
.sample .h { font-size: 16pt; font-weight: 700; line-height: 1.2 } .sample .s { color:#445; margin: 4px 0 8px }
.small { font-size: 9pt; color:#667 }
table { width:100%; border-collapse: collapse; font-size: 10pt } td, th { text-align:left; padding: 5px 6px; border-bottom: 1px solid #e3e6eb }
.dodont { display:grid; grid-template-columns: 1fr 1fr; gap: 14px } .dodont h4 { margin: 0 0 4px }
.break { page-break-before: always }
"""

def dark(hexc):
    h = hexc.lstrip('#'); r,g,b = int(h[0:2],16), int(h[2:4],16), int(h[4:6],16)
    return (0.299*r+0.587*g+0.114*b) < 150

def page(b):
    p = b["palette"][0][1]; v = b["voice"]; t = b["type"]; s = b["samples"]
    e = html.escape
    sw = "".join(f'<div style="background:{h};color:{"#fff" if dark(h) else "#111"}"><b>{e(n)}</b><code>{h}</code><br>{e(r)}</div>' for n,h,r in b["palette"])
    li = lambda xs: "".join(f"<li>{e(x)}</li>" for x in xs)
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>:root{{--p:{p}}}{CSS}</style></head><body>
<h1>{e(b['name'])}</h1>
<div class="meta">Brand style guide &amp; voice · {e(b['kind'])} · {e(b['domain'])} · Texoma Destinations family · v1.0 · September 2026</div>
<div class="hero"><img src="{b64(b['hero'])}"><div class="logo"><img src="{b64(b['logo'])}"></div><div class="tag">{e(b['most'])}</div></div>
<div class="two"><div><h2>Positioning</h2><p>{e(b['positioning'])}</p><p class="small"><b>Audience.</b> {e(b['audience'])}</p></div>
<div><h2>Personality</h2>{"".join(f'<span class="pill">{e(x)}</span>' for x in b['personality'])}
<p class="small" style="margin-top:10px">Shared platform (2023 campaign): {e(', '.join(MASTER['personality']))}.<br>USP: <i>{e(MASTER['usp'])}</i>. Tagline: <b>{e(b['tagline'])}</b></p></div></div>
<h2>Voice</h2><p>{e(v['summary'])}</p>
<div class="dodont"><div><h4>Do</h4><ul>{li(v['do'])}</ul></div><div><h4>Don't</h4><ul>{li(v['dont'])}</ul></div></div>
<p class="small" style="margin-top:8px"><b>Words we use:</b> {e(', '.join(v['words_use']))}<br><b>Words we avoid:</b> {e(', '.join(v['words_avoid']))}</p>
<div class="break"></div>
<h2>Color</h2><div class="sw">{sw}</div>
<h2>Typography</h2><table><tr><th style="width:18%">Display</th><td>{e(t['display'])}</td></tr><tr><th>Body</th><td>{e(t['body'])}</td></tr><tr><th>Accent</th><td>{e(t['accent'])}</td></tr></table><p class="small">{e(t['notes'])}</p>
<div class="two"><div><h2>Logo usage</h2><ul>{li(b['logo_rules'])}</ul></div><div><h2>Photography</h2><ul>{li(b['photo'])}</ul></div></div>
<h2>Key messages</h2><ul>{li(b['messages'])}</ul>
<h2>Sample copy</h2><div class="sample"><div class="h">{e(s['headline'])}</div><div class="s">{e(s['sub'])}</div>
<b>CTA:</b> {e(s['cta'])} &nbsp;·&nbsp; <b>Email subject:</b> {e(s['email'])}<br><b>Social:</b> {e(s['social'])}</div>
<p class="small" style="margin-top:18px">Palette sampled from production logo files; voice derived from the live sites, the 2023 Texoma Campaign Concepts deck and the hub's property descriptors. Numbers referenced here are governed by the facts registry (content/facts.json).</p>
</body></html>"""

for b in BRANDS:
    (OUT / f"{b['slug']}.md").write_text(md(b))
    (TMP / f"{b['slug']}.html").write_text(page(b))
print("rendered", len(BRANDS))
