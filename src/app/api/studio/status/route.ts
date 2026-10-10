import { NextResponse } from "next/server";
import { cmsUserFromRequest } from "@/app/admin/_auth";
import { findPreviewUrl, getStudioPullRequest, studioRepository } from "@/lib/studio/github";

export async function GET(request: Request) {
  const user = await cmsUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const repository = studioRepository();
  if (!repository) return NextResponse.json({ error: "Studio is not connected to GitHub yet." }, { status: 503 });
  const number = Number(new URL(request.url).searchParams.get("pr"));
  if (!Number.isInteger(number) || number < 1) return NextResponse.json({ error: "Invalid preview request." }, { status: 400 });
  try {
    const pr = await getStudioPullRequest(repository, number);
    const preview = await findPreviewUrl(repository, pr.head.sha);
    return NextResponse.json({ ...preview, pullRequestUrl: pr.html_url, pullRequestState: pr.state, draft: pr.draft, mergeable: pr.mergeable });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not check preview." }, { status: 500 });
  }
}
