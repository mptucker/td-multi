import { NextResponse } from "next/server";
import { cmsUserFromRequest, canAccessBrand, canWrite } from "@/app/admin/_auth";
import { BRAND_SLUGS } from "@/config/brands";
import type { BrandSlug } from "@/config/types";
import { versionContentPatch } from "@/lib/content-merge";
import { studioRepository, readRepositoryFile, writeRepositoryFile } from "@/lib/studio/github";
import { supabaseService } from "@/lib/supabase";

export const runtime = "nodejs";

type PublishRequest = { brand?: string; content?: unknown };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function errorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "The site could not be published.";
  if (/GitHub 401|GitHub 403/.test(message)) return "The CMS GitHub connection needs attention. Ask an administrator to check the Studio token.";
  if (/GitHub 409|sha.*does not match|conflict/i.test(message)) return "The site changed in Git while you were editing. Reload the CMS, review the latest version, and publish again.";
  return message;
}

export async function POST(request: Request) {
  const user = await cmsUserFromRequest(request);
  if (!user || !canWrite(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let payload: PublishRequest;
  try { payload = await request.json() as PublishRequest; }
  catch { return NextResponse.json({ error: "The publish request was not valid JSON." }, { status: 400 }); }

  if (!payload.brand || !BRAND_SLUGS.includes(payload.brand as BrandSlug) || !canAccessBrand(user, payload.brand)) {
    return NextResponse.json({ error: "You do not have access to that site." }, { status: 403 });
  }
  if (!isPlainObject(payload.content)) return NextResponse.json({ error: "The site content is missing or invalid." }, { status: 400 });

  const serialized = JSON.stringify(payload.content, null, 2) + "\n";
  if (serialized.length > 1_000_000) return NextResponse.json({ error: "The site content is too large to publish safely." }, { status: 413 });

  const brand = payload.brand as BrandSlug;
  const repository = studioRepository();
  if (!repository) return NextResponse.json({ error: "Git publishing is not configured for this deployment." }, { status: 503 });
  const path = `content/${brand}.json`;

  try {
    const previousFile = await readRepositoryFile(repository, path, repository.baseBranch);
    let previousContent: unknown = null;
    try { previousContent = JSON.parse(previousFile.content); } catch { /* Preserve the commit even if an old file is malformed. */ }

    if (previousFile.content.trim() === serialized.trim()) {
      const service = supabaseService();
      if (service) {
        const marker = versionContentPatch({});
        await service.from("brand_content").upsert({ brand, content: marker, draft_content: marker, published_at: new Date().toISOString() });
      }
      return NextResponse.json({ ok: true, unchanged: true, message: "Git already contains these changes." });
    }

    const result = await writeRepositoryFile(
      repository,
      repository.baseBranch,
      path,
      serialized,
      `CMS(${brand}): publish site content`,
    );
    const commitUrl = `https://github.com/${repository.owner}/${repository.repo}/commit/${result.commit.sha}`;

    // Git is authoritative. Supabase keeps only an empty editing workspace after
    // a successful commit, so a stale CMS patch can never override later code.
    const service = supabaseService();
    let cleanupWarning: string | undefined;
    if (service) {
      const marker = versionContentPatch({});
      const now = new Date().toISOString();
      const [{ error: contentError }, { error: revisionError }, { error: auditError }] = await Promise.all([
        service.from("brand_content").upsert({ brand, content: marker, draft_content: marker, published_at: now }),
        previousContent
          ? service.from("content_revisions").insert({ entity_type: "brand_content", entity_id: brand, brand, snapshot: previousContent, action: "git_publish", created_by: user.userId })
          : Promise.resolve({ error: null }),
        service.from("cms_audit_log").insert({
          user_id: user.userId,
          action: "git_publish",
          entity_type: "brand_content",
          entity_id: brand,
          brand,
          details: { commit_sha: result.commit.sha, commit_url: commitUrl, repository: `${repository.owner}/${repository.repo}` },
        }),
      ]);
      const cleanupError = contentError || revisionError || auditError;
      if (cleanupError) cleanupWarning = "The Git commit succeeded, but the CMS history could not be fully updated.";
    } else {
      cleanupWarning = "The Git commit succeeded, but the CMS service connection was unavailable for cleanup.";
    }

    return NextResponse.json({ ok: true, sha: result.commit.sha, commitUrl, warning: cleanupWarning });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 502 });
  }
}
