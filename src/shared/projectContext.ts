import fs from "node:fs";
import path from "node:path";

export const PROJECT_CONTEXT_FILE = path.join(".dreative", "context.json");

export interface ProjectContext {
  schemaVersion: 1;
  status: "draft" | "current";
  productPurpose: string;
  creativeFingerprint: {
    premise: string;
    composition: string;
    typeVoice: string;
    materialAndMedia: string;
    motionAndInteraction: string;
    continuity: string;
  };
  protectedContracts: string[];
  runtimeOwners: {
    scroll: string;
    animation: string;
    spatial: string;
  };
  importantAssets: { path: string; role: string; status: "available" | "missing" | "replace" }[];
  testedStates: { route: string; viewport: string; checks: string[] }[];
  deliberateDecisions: { decision: string; reason: string }[];
  outstandingVisualIssues: { route: string; issue: string; priority: "high" | "medium" | "low" }[];
}

export function emptyProjectContext(): ProjectContext {
  return {
    schemaVersion: 1,
    status: "draft",
    productPurpose: "",
    creativeFingerprint: {
      premise: "",
      composition: "",
      typeVoice: "",
      materialAndMedia: "",
      motionAndInteraction: "",
      continuity: "",
    },
    protectedContracts: [],
    runtimeOwners: { scroll: "native", animation: "native", spatial: "none" },
    importantAssets: [],
    testedStates: [],
    deliberateDecisions: [],
    outstandingVisualIssues: [],
  };
}

const isString = (value: unknown): value is string => typeof value === "string";
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(isString);

export function validateProjectContext(value: unknown): string[] {
  const errors: string[] = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) return ["context must be a JSON object"];
  const item = value as Record<string, unknown>;
  if (item.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  if (item.status !== "draft" && item.status !== "current") errors.push("status must be draft or current");
  if (!isString(item.productPurpose)) errors.push("productPurpose must be a string");

  const fingerprint = item.creativeFingerprint as Record<string, unknown> | undefined;
  for (const key of ["premise", "composition", "typeVoice", "materialAndMedia", "motionAndInteraction", "continuity"])
    if (!fingerprint || !isString(fingerprint[key])) errors.push(`creativeFingerprint.${key} must be a string`);

  const owners = item.runtimeOwners as Record<string, unknown> | undefined;
  for (const key of ["scroll", "animation", "spatial"])
    if (!owners || !isString(owners[key])) errors.push(`runtimeOwners.${key} must be a string`);

  if (!strings(item.protectedContracts)) errors.push("protectedContracts must be an array of strings");
  if (!Array.isArray(item.importantAssets) || item.importantAssets.some((entry) => {
    const record = entry as Record<string, unknown>;
    return !record || !isString(record.path) || !isString(record.role) || !["available", "missing", "replace"].includes(String(record.status));
  })) errors.push("importantAssets entries require path, role, and available|missing|replace status");
  if (!Array.isArray(item.testedStates) || item.testedStates.some((entry) => {
    const record = entry as Record<string, unknown>;
    return !record || !isString(record.route) || !isString(record.viewport) || !strings(record.checks);
  })) errors.push("testedStates entries require route, viewport, and checks");
  if (!Array.isArray(item.deliberateDecisions) || item.deliberateDecisions.some((entry) => {
    const record = entry as Record<string, unknown>;
    return !record || !isString(record.decision) || !isString(record.reason);
  })) errors.push("deliberateDecisions entries require decision and reason");
  if (!Array.isArray(item.outstandingVisualIssues) || item.outstandingVisualIssues.some((entry) => {
    const record = entry as Record<string, unknown>;
    return !record || !isString(record.route) || !isString(record.issue) || !["high", "medium", "low"].includes(String(record.priority));
  })) errors.push("outstandingVisualIssues entries require route, issue, and high|medium|low priority");

  if (item.status === "current") {
    if (!String(item.productPurpose).trim()) errors.push("current context requires productPurpose");
    for (const key of ["premise", "composition", "typeVoice", "materialAndMedia", "motionAndInteraction", "continuity"])
      if (!String(fingerprint?.[key] ?? "").trim()) errors.push(`current context requires creativeFingerprint.${key}`);
  }
  return errors;
}

export function readProjectContext(projectDir: string): { file: string; context: ProjectContext | null; errors: string[] } {
  const file = path.join(projectDir, PROJECT_CONTEXT_FILE);
  if (!fs.existsSync(file)) return { file, context: null, errors: [] };
  try {
    const context = JSON.parse(fs.readFileSync(file, "utf8"));
    return { file, context, errors: validateProjectContext(context) };
  } catch (error) {
    return { file, context: null, errors: [`context is not valid JSON: ${String(error)}`] };
  }
}

export function initializeProjectContext(projectDir: string): { file: string; created: boolean; context: ProjectContext } {
  const existing = readProjectContext(projectDir);
  if (existing.context && !existing.errors.length) return { file: existing.file, created: false, context: existing.context };
  if (fs.existsSync(existing.file)) throw new Error(existing.errors.join("\n"));
  const context = emptyProjectContext();
  fs.mkdirSync(path.dirname(existing.file), { recursive: true });
  fs.writeFileSync(existing.file, `${JSON.stringify(context, null, 2)}\n`);
  return { file: existing.file, created: true, context };
}
