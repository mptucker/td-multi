import sharp from "sharp";

// Resizes Boats Group listing photos to WebP at the size each device needs.
// Vercel's built-in optimizer refuses these remote photos, so we do it here.
// Responses are cached by the CDN for a year (photo URLs never change).

const ALLOWED_HOSTS = new Set(["images.boatsgroup.com"]);
const WIDTHS = [256, 384, 640, 750, 828, 1080, 1200, 1600, 1920];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get("u") ?? "";
  const w = Number(searchParams.get("w"));
  const q = Math.min(85, Math.max(40, Number(searchParams.get("q")) || 72));

  let remote: URL;
  try {
    remote = new URL(src);
  } catch {
    return new Response("Bad image URL", { status: 400 });
  }
  if (remote.protocol !== "https:" || !ALLOWED_HOSTS.has(remote.hostname)) {
    return new Response("Host not allowed", { status: 400 });
  }
  const width = WIDTHS.find((x) => x >= w) ?? WIDTHS[WIDTHS.length - 1];

  const upstream = await fetch(remote, { cache: "force-cache" });
  if (!upstream.ok) return new Response("Image not found", { status: 404 });

  const input = Buffer.from(await upstream.arrayBuffer());
  const output = await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: q }).toBuffer();

  return new Response(new Uint8Array(output), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}
