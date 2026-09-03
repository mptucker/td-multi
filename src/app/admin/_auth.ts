import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Minimal admin gate: a shared password (ADMIN_PASSWORD) exchanged for a signed cookie.
 * Good enough for a small internal team on day one; swap for Supabase Auth (magic link)
 * when more than a handful of editors need audit trails — the data layer won't change.
 */
const COOKIE = "td_admin";

function sign(value: string) {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return false;
  const [v, sig] = c.split(".");
  if (!v || !sig) return false;
  const expected = sign(v);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function login(password: string): Promise<boolean> {
  if (!adminConfigured() || password !== process.env.ADMIN_PASSWORD) return false;
  const v = String(Date.now());
  (await cookies()).set(COOKIE, `${v}.${sign(v)}`, { httpOnly: true, sameSite: "lax", path: "/admin", maxAge: 60 * 60 * 12, secure: process.env.NODE_ENV === "production" });
  return true;
}

export async function logout() {
  (await cookies()).delete(COOKIE);
}
