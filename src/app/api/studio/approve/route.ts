import { NextResponse } from "next/server";
import { cmsUserFromRequest } from "@/app/admin/_auth";
import { findPreviewUrl, getStudioPullRequest, mergeStudioPullRequest, studioRepository } from "@/lib/studio/github";

export async function POST(request: Request) {
  const user = await cmsUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin" && user.role !== "director") return NextResponse.json({ error: "A director or administrator must approve production changes." }, { status: 403 });
  const repository = studioRepository();
  if (!repository) return NextResponse.json({ error: "Studio is not connected to GitHub yet." }, { status: 503 });
  const { pullRequestNumber, confirmation } = await request.json() as { pullRequestNumber?: number; confirmation?: string };
  if (!pullRequestNumber || confirmation !== "PUBLISH") return NextResponse.json({ error: "Publication confirmation is required." }, { status: 400 });
  try {
    const pullRequest = await getStudioPullRequest(repository, pullRequestNumber);
    if (!pullRequest.head.ref.startsWith("studio/")) return NextResponse.json({ error: "Only changes created by Site Studio can be approved here." }, { status: 400 });
    if (pullRequest.state !== "open") return NextResponse.json({ error: "This Studio change is no longer open." }, { status: 409 });
    const preview = await findPreviewUrl(repository, pullRequest.head.sha);
    if (!preview.previewUrl || preview.previewState !== "success") return NextResponse.json({ error: "The Vercel preview must finish successfully before publication." }, { status: 409 });
    const result = await mergeStudioPullRequest(repository, pullRequestNumber);
    if (!result.merged) return NextResponse.json({ error: result.message || "GitHub did not merge the change." }, { status: 409 });
    return NextResponse.json({ merged: true, sha: result.sha, message: "Approved and sent to production deployment." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not publish the change." }, { status: 500 });
  }
}
