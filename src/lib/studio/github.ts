import "server-only";

type GitHubTreeItem = { path?: string; type?: "blob" | "tree"; size?: number; sha?: string };

export type StudioRepository = {
  owner: string;
  repo: string;
  baseBranch: string;
  token: string;
};

export function studioRepository(): StudioRepository | null {
  const token = process.env.GITHUB_STUDIO_TOKEN;
  const [owner, repo] = (process.env.GITHUB_STUDIO_REPO || "mptucker/td-multi").split("/");
  if (!token || !owner || !repo) return null;
  return { owner, repo, baseBranch: process.env.GITHUB_STUDIO_BASE_BRANCH || "master", token };
}

async function github<T>(repository: StudioRepository, path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${repository.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub ${response.status}: ${body.slice(0, 500)}`);
  }
  return response.json() as Promise<T>;
}

function repoPath(repository: StudioRepository, suffix: string) {
  return `/repos/${repository.owner}/${repository.repo}${suffix}`;
}

export async function getBranchHead(repository: StudioRepository, branch = repository.baseBranch) {
  return github<{ object: { sha: string } }>(repository, repoPath(repository, `/git/ref/heads/${encodeURIComponent(branch)}`));
}

export async function createStudioBranch(repository: StudioRepository, branch: string) {
  const base = await getBranchHead(repository);
  await github(repository, repoPath(repository, "/git/refs"), {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: base.object.sha }),
  });
  return base.object.sha;
}

export async function listRepositoryFiles(repository: StudioRepository, ref = repository.baseBranch) {
  const head = await getBranchHead(repository, ref);
  const tree = await github<{ tree: GitHubTreeItem[]; truncated: boolean }>(
    repository,
    repoPath(repository, `/git/trees/${head.object.sha}?recursive=1`),
  );
  if (tree.truncated) throw new Error("The repository tree is too large for Studio to inspect safely.");
  return tree.tree.filter((item) => item.type === "blob" && item.path).map((item) => item.path!);
}

export async function readRepositoryFile(repository: StudioRepository, path: string, ref = repository.baseBranch) {
  const result = await github<{ content?: string; encoding?: string; sha: string }>(
    repository,
    repoPath(repository, `/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(ref)}`),
  );
  if (result.encoding !== "base64" || !result.content) throw new Error(`Unable to read ${path}`);
  return { content: Buffer.from(result.content.replace(/\n/g, ""), "base64").toString("utf8"), sha: result.sha };
}

export async function writeRepositoryFile(repository: StudioRepository, branch: string, path: string, content: string, message: string) {
  let sha: string | undefined;
  try { sha = (await readRepositoryFile(repository, path, branch)).sha; } catch { /* new file */ }
  return github<{ commit: { sha: string }; content: { path: string } }>(repository, repoPath(repository, `/contents/${path.split("/").map(encodeURIComponent).join("/")}`), {
    method: "PUT",
    body: JSON.stringify({ message, branch, content: Buffer.from(content, "utf8").toString("base64"), ...(sha ? { sha } : {}) }),
  });
}

export async function createStudioPullRequest(repository: StudioRepository, branch: string, title: string, body: string) {
  return github<{ number: number; html_url: string; head: { sha: string } }>(repository, repoPath(repository, "/pulls"), {
    method: "POST",
    body: JSON.stringify({ title, body, head: branch, base: repository.baseBranch, draft: false }),
  });
}

export async function getStudioPullRequest(repository: StudioRepository, number: number) {
  return github<{ number: number; html_url: string; state: string; draft: boolean; mergeable: boolean | null; head: { sha: string; ref: string } }>(repository, repoPath(repository, `/pulls/${number}`));
}

export async function findPreviewUrl(repository: StudioRepository, sha: string) {
  try {
    const deployments = await github<Array<{ id: number; environment?: string }>>(
      repository,
      repoPath(repository, `/deployments?sha=${encodeURIComponent(sha)}&per_page=20`),
    );
    for (const deployment of deployments.filter((item) => /preview/i.test(item.environment || ""))) {
      const statuses = await github<Array<{ state: string; environment_url?: string; target_url?: string }>>(
        repository,
        repoPath(repository, `/deployments/${deployment.id}/statuses?per_page=10`),
      );
      const latest = statuses.find((status) => status.environment_url || status.target_url);
      if (latest) return { previewUrl: latest.environment_url || latest.target_url || null, previewState: latest.state || "pending" };
    }
  } catch { /* Some GitHub tokens expose Vercel only through commit statuses. */ }
  const combined = await github<{ statuses: Array<{ context: string; state: string; target_url?: string; description?: string }> }>(
    repository,
    repoPath(repository, `/commits/${sha}/status`),
  );
  const vercel = combined.statuses.find((status) => /vercel/i.test(`${status.context} ${status.description || ""}`) && status.target_url);
  return { previewUrl: vercel?.target_url || null, previewState: vercel?.state || "pending" };
}

export async function mergeStudioPullRequest(repository: StudioRepository, number: number) {
  return github<{ merged: boolean; message: string; sha?: string }>(repository, repoPath(repository, `/pulls/${number}/merge`), {
    method: "PUT",
    body: JSON.stringify({ merge_method: "squash", commit_title: `Studio: approve site change (#${number})` }),
  });
}
