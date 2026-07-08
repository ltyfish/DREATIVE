import { query } from "@anthropic-ai/claude-agent-sdk";
import type { Block } from "../shared/types.js";

export type Progress = (detail: string) => void;

const BLOCK_SCHEMA = `
A block is a JSON object:
{
  "id": "string (short unique id)",
  "type": "section|row|column|nav|hero|card-grid|list|form|footer|text|image|button",
  "label": "short human label, e.g. 'Hero', 'Pricing cards'",
  "direction": "row" | "column" (optional, layout of children),
  "sizeHint": "sm" | "md" | "lg" (optional, relative vertical size),
  "intents": ["optional behavior notes, e.g. 'CTA scrolls to pricing'"],
  "children": [ ...nested blocks ] (optional)
}
Keep trees shallow (max depth 3) and wireframe-level: structure, not styling.`;

/** Run an Agent SDK query and return the final result text, reporting progress. */
async function run(
  prompt: string,
  opts: { allowRead?: boolean; progress?: Progress } = {}
): Promise<string> {
  let result = "";
  const q = query({
    prompt,
    options: {
      allowedTools: opts.allowRead ? ["Read"] : [],
      permissionMode: "bypassPermissions",
      maxTurns: opts.allowRead ? 6 : 2,
    },
  });
  for await (const message of q) {
    if (message.type === "assistant") {
      const blocks = (message as any).message?.content ?? [];
      for (const b of blocks) {
        if (b.type === "tool_use") opts.progress?.("Looking at the reference image...");
        else if (b.type === "text") opts.progress?.("Writing...");
      }
    } else if (message.type === "result") {
      if (message.subtype === "success") result = message.result;
      else throw new Error(`AI call failed: ${message.subtype}`);
    }
  }
  if (!result) throw new Error("AI call returned no result");
  return result;
}

/** Run + parse, with one retry that feeds the failure back to the model. */
async function runParsed<T>(
  prompt: string,
  parse: (text: string) => T,
  opts: { allowRead?: boolean; progress?: Progress } = {}
): Promise<T> {
  const text = await run(prompt, opts);
  try {
    return parse(text);
  } catch (err) {
    opts.progress?.("Output was malformed - retrying...");
    const retryText = await run(
      `${prompt}\n\nIMPORTANT: Your previous response could not be parsed (${String(
        err
      )}). Respond again, strictly following the output format instructions.`,
      opts
    );
    return parse(retryText);
  }
}

/** Extract the first JSON value (object or array) from model output. */
function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.search(/[[{]/);
  if (start === -1) throw new Error("No JSON found in AI response");
  for (let end = candidate.length; end > start; end--) {
    const ch = candidate[end - 1];
    if (ch !== "}" && ch !== "]") continue;
    try {
      return JSON.parse(candidate.slice(start, end));
    } catch {
      /* keep scanning */
    }
  }
  throw new Error("Could not parse JSON from AI response");
}

function extractCode(text: string): string {
  const fence = text.match(/```(?:tsx|jsx|typescript|ts)?\s*([\s\S]*?)```/);
  const code = fence ? fence[1].trim() : text.trim();
  if (!code.includes("export default")) throw new Error("Generated code has no default export");
  return code;
}

type Proposal = { name: string; layout: Block };

export async function proposeSkeletons(userPrompt: string, progress?: Progress): Promise<Proposal[]> {
  progress?.("Proposing page layouts...");
  return runParsed(
    `You are a UX/information-architecture expert. Propose 3 distinct page layout skeletons (wireframe-level) for this request:

"${userPrompt}"

${BLOCK_SCHEMA}

Respond with ONLY a JSON array of 3 items, each: {"name": "page variant name", "layout": <block tree with root type "section">}. No prose.`,
    (t) => extractJson(t) as Proposal[],
    { progress }
  );
}

export async function proposeVariants(pageName: string, layout: Block, progress?: Progress): Promise<Proposal[]> {
  progress?.(`Proposing variants of "${pageName}"...`);
  return runParsed(
    `You are a UX expert. Here is the current wireframe skeleton for the page "${pageName}":

${JSON.stringify(layout, null, 2)}

Propose 2 meaningfully different alternative layouts for the SAME content and purpose (e.g. different section order, grid vs list, split vs stacked). Preserve all "intents" values, attached to the equivalent blocks. Use fresh ids.

${BLOCK_SCHEMA}

Respond with ONLY a JSON array of 2 items: {"name": "<pageName> - <variant descriptor>", "layout": <block tree>}. No prose.`,
    (t) => extractJson(t) as Proposal[],
    { progress }
  );
}

export async function editBlock(block: Block, instruction: string, progress?: Progress): Promise<Block> {
  progress?.("Editing block...");
  return runParsed(
    `You are editing one block of a page wireframe. Current block subtree:

${JSON.stringify(block, null, 2)}

User instruction: "${instruction}"

${BLOCK_SCHEMA}

Apply the instruction. Structural changes go into the tree; behavior/functionality changes go into "intents" arrays on the relevant blocks. If the instruction replaces an existing behavior, replace the corresponding intent instead of appending. Keep existing ids where blocks are unchanged; give new blocks new ids.
Respond with ONLY the updated block subtree as JSON. No prose.`,
    (t) => extractJson(t) as Block,
    { progress }
  );
}

export async function designPage(args: {
  pageName: string;
  layout: Block;
  refImagePath?: string;
  blockRefs?: { id: string; label: string; path: string }[];
  designPrompt?: string;
  previousCode?: string;
  siblingPages?: string[];
  progress?: Progress;
}): Promise<string> {
  const { progress } = args;
  progress?.("Designing page...");

  const refPart = args.refImagePath
    ? `First, use the Read tool to view the reference image at: ${args.refImagePath}\nMatch its visual style (colors, typography feel, spacing, mood) closely.`
    : "No page-level reference image provided; choose a distinctive, non-generic visual style appropriate to the content.";

  const blockRefPart = args.blockRefs?.length
    ? `These specific blocks have their own style reference images. Use the Read tool to view each, and match that image's style for that block specifically (it overrides the page-level style for that block):\n${args.blockRefs
        .map((r) => `- block "${r.id}" (${r.label}): ${r.path}`)
        .join("\n")}`
    : "";

  const previousPart = args.previousCode
    ? `A previous version of this page exists below. The user may have made deliberate element-level edits to it. Where a block from the skeleton already exists in the previous version, PRESERVE its styling and content choices; only restructure/add/remove what the updated skeleton requires.

Previous version:
\`\`\`tsx
${args.previousCode}
\`\`\`
`
    : "";

  const siblingPart = args.siblingPages?.length
    ? `Other pages in this project (use these names for nav/footer links, href="#"): ${args.siblingPages.join(", ")}.`
    : "";

  return runParsed(
    `${refPart}
${blockRefPart}

Then generate a complete React component for the page "${args.pageName}" implementing this wireframe skeleton exactly (same structure and order of blocks):

${JSON.stringify(args.layout, null, 2)}

${previousPart}
Every "intents" entry describes required behavior - implement it with React state/handlers (mock data is fine, no network calls).
${args.designPrompt ? `Additional design direction: "${args.designPrompt}"` : ""}
${siblingPart}

Requirements:
- Single self-contained .tsx file, default-exporting the page component.
- Import only from "react". Style with Tailwind CSS utility classes (Tailwind is available globally).
- Put data-dreative-id="<block id>" on the top-level element rendered for each block from the skeleton.
- Realistic placeholder copy, no lorem ipsum. For images use https://picsum.photos placeholders or CSS.

Respond with ONLY the .tsx source in a single \`\`\`tsx code fence. No prose.`,
    extractCode,
    { allowRead: !!args.refImagePath || !!args.blockRefs?.length, progress }
  );
}

export async function editDesignedElement(args: {
  code: string;
  elementId: string;
  instruction: string;
  refImagePath?: string;
  progress?: Progress;
}): Promise<string> {
  args.progress?.("Editing element...");
  const refPart = args.refImagePath
    ? `First, use the Read tool to view the style reference image at: ${args.refImagePath}\nMatch its visual style when applying the change.\n\n`
    : "";
  return runParsed(
    `${refPart}Here is a React+Tailwind page component:

\`\`\`tsx
${args.code}
\`\`\`

Modify ONLY the element (and its contents) marked data-dreative-id="${args.elementId}" according to this instruction: "${args.instruction}". Keep everything else byte-identical where possible, keep all data-dreative-id attributes.

Respond with ONLY the full updated .tsx source in a single \`\`\`tsx code fence. No prose.`,
    extractCode,
    { allowRead: !!args.refImagePath, progress: args.progress }
  );
}
