import { NextResponse } from "next/server";
import { cmsUserFromRequest, canAccessBrand, canWrite } from "@/app/admin/_auth";
import { BRANDS } from "@/config/brands";
import type { BrandSlug } from "@/config/types";
import { applyStudioProposal, createStudioProposal } from "@/lib/studio/agent";
import { createStudioBranch, createStudioPullRequest, studioRepository } from "@/lib/studio/github";

export const maxDuration = 300;

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 34) || "site-change";
}

export async function POST(request: Request) {
  const user = await cmsUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Sign in to use Studio." }, { status: 401 });
  if (!canWrite(user)) return NextResponse.json({ error: "Your account has view-only access." }, { status: 403 });
  const repository = studioRepository();
  if (!repository) return NextResponse.json({ error: "Studio is not connected to GitHub yet." }, { status: 503 });

  try {
    const form = await request.formData();
    const brand = String(form.get("brand") || "") as BrandSlug;
    const route = String(form.get("route") || "").trim().slice(0, 180);
    const prompt = String(form.get("prompt") || "").trim();
    if (!BRANDS[brand] || !canAccessBrand(user, brand)) return NextResponse.json({ error: "You do not have access to that site." }, { status: 403 });
    if (prompt.length < 8 || prompt.length > 8_000) return NextResponse.json({ error: "Describe the change in 8 to 8,000 characters." }, { status: 400 });

    const upload = form.get("screenshot");
    let screenshot: { mime: string; base64: string } | undefined;
    if (upload instanceof File && upload.size) {
      if (!/^image\/(png|jpeg|webp)$/.test(upload.type)) return NextResponse.json({ error: "Use a PNG, JPEG, or WebP screenshot." }, { status: 400 });
      if (upload.size > 8 * 1024 * 1024) return NextResponse.json({ error: "The screenshot must be smaller than 8 MB." }, { status: 400 });
      screenshot = { mime: upload.type, base64: Buffer.from(await upload.arrayBuffer()).toString("base64") };
    }

    const proposal = await createStudioProposal({ repository, brand, route, prompt, screenshot });
    const branch = `studio/${brand}-${slug(prompt)}-${Date.now().toString(36)}`;
    await createStudioBranch(repository, branch);
    const applied = await applyStudioProposal(repository, branch, proposal);
    const title = `[Studio] ${BRANDS[brand].nap.shortName}: ${proposal.summary}`.slice(0, 120);
    const pr = await createStudioPullRequest(repository, branch, title, [
      `Requested in the authenticated Site Studio by **${user.displayName}**.`,
      "",
      `**Site:** ${BRANDS[brand].nap.displayName}`,
      `**Page/area:** ${route || "Not specified"}`,
      "",
      "### Request",
      prompt,
      "",
      "### Studio summary",
      proposal.summary,
      "",
      "### Suggested checks",
      ...proposal.verification.map((item) => `- ${item}`),
      "",
      "This pull request remains unmerged until an authorized Studio approver publishes it.",
    ].join("\n"));

    return NextResponse.json({
      summary: proposal.summary,
      verification: proposal.verification,
      files: applied.changed,
      branch,
      sha: pr.head.sha || applied.sha,
      pullRequestNumber: pr.number,
      pullRequestUrl: pr.html_url,
      status: "preview_building",
    });
  } catch (error) {
    console.error("Studio change failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Studio could not prepare this change." }, { status: 500 });
  }
}
