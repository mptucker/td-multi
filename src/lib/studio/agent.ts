import "server-only";
import type { BrandSlug } from "@/config/types";
import { STUDIO_GUARDRAILS, isStudioNewPathAllowed, isStudioPathAllowed, readableStudioFiles, validateStudioReplacement, visibleStudioFiles } from "./policy";
import { readRepositoryFile, type StudioRepository } from "./github";

type Replacement = { path: string; find: string; replace: string };
type NewFile = { path: string; content: string };
export type StudioProposal = { summary: string; verification: string[]; changes: Replacement[]; new_files: NewFile[] };

type ResponseItem = { type?: string; name?: string; call_id?: string; arguments?: string };
type OpenAIResponse = { id: string; output?: ResponseItem[]; error?: { message?: string }; incomplete_details?: unknown };

function parseJson<T>(value: string, context: string): T {
  try { return JSON.parse(value) as T; }
  catch { throw new Error(`${context} returned malformed JSON. Please retry the request; no site files were changed.`); }
}

async function readOpenAIResponse(response: Response) {
  const text = await response.text();
  if (!text.trim()) throw new Error(`The AI service returned an empty response (${response.status}). Please retry.`);
  const result = parseJson<OpenAIResponse>(text, "The AI service");
  if (!response.ok) throw new Error(result.error?.message || `OpenAI request failed (${response.status}).`);
  return result;
}

const tool = (name: string, description: string, properties: Record<string, unknown>, required: string[]) => ({
  type: "function",
  name,
  description,
  strict: true,
  parameters: { type: "object", properties, required, additionalProperties: false },
});

export async function createStudioProposal(args: {
  repository: StudioRepository;
  brand: BrandSlug;
  route: string;
  prompt: string;
  screenshot?: { mime: string; base64: string };
}) {
  const deadline = Date.now() + 240_000;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  const allFiles = await import("./github").then(({ listRepositoryFiles }) => listRepositoryFiles(args.repository));
  const editableFiles = visibleStudioFiles(args.brand, allFiles);
  const readableFiles = readableStudioFiles(args.brand, allFiles);
  const tools = [
    tool("read_file", "Read a permitted source file, optionally by line range.", {
      path: { type: "string", enum: readableFiles },
      start_line: { type: ["integer", "null"], minimum: 1 },
      end_line: { type: ["integer", "null"], minimum: 1 },
    }, ["path", "start_line", "end_line"]),
    tool("submit_changes", "Submit the finished, minimal set of exact source replacements for preview.", {
      summary: { type: "string" },
      verification: { type: "array", items: { type: "string" } },
      changes: { type: "array", maxItems: 20, items: { type: "object", properties: {
        path: { type: "string", enum: editableFiles },
        find: { type: "string" },
        replace: { type: "string" },
      }, required: ["path", "find", "replace"], additionalProperties: false } },
      new_files: { type: "array", maxItems: 5, items: { type: "object", properties: {
        path: { type: "string" },
        content: { type: "string" },
      }, required: ["path", "content"], additionalProperties: false } },
    }, ["summary", "verification", "changes", "new_files"]),
  ];

  const content: Array<Record<string, unknown>> = [{
    type: "input_text",
    text: `Selected site: ${args.brand}\nTarget page or area: ${args.route || "home page / determine from request"}\n\nUser request:\n${args.prompt}\n\nEditable files:\n${editableFiles.join("\n")}\n\nAdditional read-only architecture references:\n${readableFiles.filter((file) => !editableFiles.includes(file)).join("\n")}\n\nInspect the relevant files, implement the request, and call submit_changes.`,
  }];
  if (args.screenshot) content.push({ type: "input_image", image_url: `data:${args.screenshot.mime};base64,${args.screenshot.base64}`, detail: "high" });

  let previousResponseId: string | undefined;
  let input: unknown = [{ role: "user", content }];
  for (let turn = 0; turn < 12; turn += 1) {
    const remaining = deadline - Date.now();
    if (remaining < 5_000) throw new Error("Studio needed more inspection time than this request allows. Try a more specific page or section, or attach a cropped screenshot.");
    let response: Response;
    try {
      response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(Math.min(55_000, remaining - 1_000)),
        body: JSON.stringify({
          model: process.env.OPENAI_STUDIO_MODEL || "gpt-6-astra",
          instructions: `You are the guarded visual website editor for Texoma Destinations. ${STUDIO_GUARDRAILS}`,
          input,
          tools,
          tool_choice: "required",
          parallel_tool_calls: false,
          store: true,
          ...(previousResponseId ? { previous_response_id: previousResponseId } : {}),
        }),
      });
    } catch (error) {
      if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) throw new Error("The AI service took too long to respond. Please retry; no site files were changed.");
      throw error;
    }
    const result = await readOpenAIResponse(response);
    previousResponseId = result.id;
    const call = result.output?.find((item) => item.type === "function_call");
    if (!call?.name || !call.call_id) throw new Error("Studio did not return a source change proposal.");
    const parameters = parseJson<Record<string, any>>(call.arguments || "{}", `Studio tool ${call.name}`);
    if (call.name === "submit_changes") {
      const proposal = parameters as StudioProposal;
      if (!proposal || typeof proposal.summary !== "string" || !Array.isArray(proposal.verification) || !Array.isArray(proposal.changes) || !Array.isArray(proposal.new_files)) throw new Error("Studio returned an incomplete change proposal. Please retry; no site files were changed.");
      for (const change of proposal.changes) {
        if (!isStudioPathAllowed(args.brand, change.path)) throw new Error(`Studio attempted to edit protected file ${change.path}.`);
        validateStudioReplacement(change.path, change.find, change.replace);
      }
      for (const file of proposal.new_files) {
        if (!isStudioNewPathAllowed(args.brand, file.path)) throw new Error(`Studio attempted to create protected file ${file.path}.`);
        if (!file.content || file.content.length > 120_000) throw new Error(`Studio proposed an invalid new file at ${file.path}.`);
      }
      if (!proposal.changes.length && !proposal.new_files.length) throw new Error("Studio did not propose any source changes.");
      return proposal;
    }
    if (call.name !== "read_file") throw new Error(`Unknown Studio tool: ${call.name}`);
    if (!readableFiles.includes(parameters.path)) throw new Error(`Studio attempted to read protected file ${parameters.path}.`);
    const file = await readRepositoryFile(args.repository, parameters.path);
    const lines = file.content.split("\n");
    const start = parameters.start_line ? Math.max(1, parameters.start_line) : 1;
    const end = parameters.end_line ? Math.min(lines.length, parameters.end_line) : Math.min(lines.length, start + 499);
    const excerpt = lines.slice(start - 1, end).join("\n");
    input = [{ type: "function_call_output", call_id: call.call_id, output: JSON.stringify({ path: parameters.path, start_line: start, end_line: end, total_lines: lines.length, content: excerpt }) }];
  }
  throw new Error("Studio reached its inspection limit without producing a change.");
}

export async function applyStudioProposal(repository: StudioRepository, branch: string, proposal: StudioProposal) {
  const grouped = new Map<string, Replacement[]>();
  for (const change of proposal.changes) grouped.set(change.path, [...(grouped.get(change.path) || []), change]);
  const changed: string[] = [];
  let lastCommit = "";
  for (const [path, replacements] of grouped) {
    const file = await readRepositoryFile(repository, path, branch);
    let content = file.content;
    for (const replacement of replacements) {
      const matches = content.split(replacement.find).length - 1;
      if (matches !== 1) throw new Error(`Could not safely apply ${path}: expected one exact match, found ${matches}.`);
      content = content.replace(replacement.find, replacement.replace);
    }
    const result = await import("./github").then(({ writeRepositoryFile }) => writeRepositoryFile(repository, branch, path, content, `Studio: ${proposal.summary}`));
    lastCommit = result.commit.sha;
    changed.push(path);
  }
  for (const file of proposal.new_files) {
    try {
      await readRepositoryFile(repository, file.path, branch);
      throw new Error(`Studio refused to overwrite existing file ${file.path} as a new file.`);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Studio refused")) throw error;
      if (!(error instanceof Error) || !error.message.startsWith("GitHub 404:")) throw error;
    }
    const result = await import("./github").then(({ writeRepositoryFile }) => writeRepositoryFile(repository, branch, file.path, file.content, `Studio: ${proposal.summary}`));
    lastCommit = result.commit.sha;
    changed.push(file.path);
  }
  return { changed, sha: lastCommit };
}
