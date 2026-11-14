"""Write src/bigwatermarine/media-manifest.json: size and a tiny blur preview for
every image in public/bigwatermarine, so CMS-chosen photos keep their blur-up.
Run after adding images:  python3 scripts/bwm-media-manifest.py"""
import base64, io, json, os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")
out = {}
for folder in ("bigwatermarine/media", "bigwatermarine/brand", "bigwatermarine/brands"):
    d = os.path.join(PUB, folder)
    for name in sorted(os.listdir(d)):
        if not name.lower().endswith((".webp", ".png", ".jpg", ".jpeg")):
            continue
        im = Image.open(os.path.join(d, name))
        w, h = im.size
        tiny = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
        tiny.thumbnail((10, 10))
        buf = io.BytesIO()
        tiny.save(buf, "WEBP", quality=50)
        out[f"/{folder}/{name}"] = {"width": w, "height": h, "blurDataURL": "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()}
path = os.path.join(ROOT, "src/bigwatermarine/media-manifest.json")
with open(path, "w") as f:
    json.dump(out, f, indent=1)
    f.write("\n")
print(len(out), "images ->", path)
