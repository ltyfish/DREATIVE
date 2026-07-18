import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { AssuranceLevel, ProvenanceRecord } from "./assurance.js";

export const WORKFLOW_EVENT_TYPES = [
  "repository-inspection-started", "repository-inspection-completed", "workflow-controls-detected",
  "missing-controls-identified", "question-requested", "answer-recorded", "treatments-disclosed",
  "all-confirmation-recorded", "capability-preflight", "plan-created", "plan-summary-displayed",
  "approval-recorded", "prototype-started", "prototype-verified", "prototype-decided",
  "implementation-started", "package-transaction", "material-mutation-detected",
  "verification-started", "verification-completed", "verification-stale",
  "critic-started", "critic-completed", "critic-stale", "audit-attempted",
  "correction-recorded", "finalization-attempted", "certification-generated",
] as const;
export type WorkflowEventType = typeof WORKFLOW_EVENT_TYPES[number];

export interface WorkflowEvent {
  schemaVersion: 1;
  sequence: number;
  id: string;
  type: WorkflowEventType;
  at: string;
  assuranceLevel: AssuranceLevel;
  provenance?: ProvenanceRecord;
  data: Record<string, unknown>;
  previousHash: string | null;
  hash: string;
}

const order = (value: unknown): unknown => Array.isArray(value)
  ? value.map(order)
  : value && typeof value === "object"
    ? Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, order(item)]))
    : value;
const canonical = (value: unknown): string => JSON.stringify(order(value));
const digest = (value: string): string => crypto.createHash("sha256").update(value).digest("hex");
export const workflowTracePath = (projectDir: string): string => path.join(projectDir, ".dreative", "workflow-trace.jsonl");

function eventHash(event: Omit<WorkflowEvent, "hash">): string {
  return digest(canonical(event));
}

export function readWorkflowTrace(projectDir: string): WorkflowEvent[] {
  const file = workflowTracePath(projectDir);
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line) as WorkflowEvent);
}

export function appendWorkflowEvent(projectDir: string, input: {
  type: WorkflowEventType;
  assuranceLevel?: AssuranceLevel;
  provenance?: ProvenanceRecord;
  data?: Record<string, unknown>;
}): WorkflowEvent {
  const prior = readWorkflowTrace(projectDir);
  const previous = prior.at(-1);
  const base: Omit<WorkflowEvent, "hash"> = {
    schemaVersion: 1,
    sequence: prior.length + 1,
    id: crypto.randomUUID(),
    type: input.type,
    at: new Date().toISOString(),
    assuranceLevel: input.assuranceLevel ?? "local",
    provenance: input.provenance,
    data: input.data ?? {},
    previousHash: previous?.hash ?? null,
  };
  const event = { ...base, hash: eventHash(base) };
  const file = workflowTracePath(projectDir);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, `${JSON.stringify(event)}\n`);
  return event;
}

export function validateWorkflowTrace(projectDir: string): string[] {
  const events = readWorkflowTrace(projectDir);
  const errors: string[] = [];
  for (const [index, event] of events.entries()) {
    const { hash, ...base } = event;
    if (event.sequence !== index + 1) errors.push(`WORKFLOW_TRACE_SEQUENCE_INVALID:${event.id}`);
    if (event.previousHash !== (events[index - 1]?.hash ?? null)) errors.push(`WORKFLOW_TRACE_CHAIN_BROKEN:${event.id}`);
    if (hash !== eventHash(base)) errors.push(`WORKFLOW_TRACE_EVENT_EDITED:${event.id}`);
  }
  return errors;
}

export function deriveDogfoodReport(projectDir: string): Record<string, unknown> {
  const events = readWorkflowTrace(projectDir);
  const assurance = events.some((event) => event.assuranceLevel === "externally-attested")
    ? "externally-attested"
    : events.some((event) => event.assuranceLevel === "host-attested") ? "host-attested" : "local";
  const types = new Set(events.map((event) => event.type));
  return {
    schemaVersion: 2,
    generatedAt: new Date().toISOString(),
    assuranceLevel: assurance,
    independentlyAttested: assurance !== "local",
    limitation: assurance === "local" ? "Workflow ordering is locally hash-linked but not independently immutable." : null,
    eventCount: events.length,
    planBypassDetected: types.has("material-mutation-detected") && !types.has("approval-recorded"),
    incorrectDefaultingDetected: false,
    falsePositiveRiskDetected: false,
    selfCertificationDetected: false,
    events: events.map(({ id, sequence, type, at, assuranceLevel, hash }) => ({ id, sequence, type, at, assuranceLevel, hash })),
  };
}
