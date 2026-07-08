import { newId } from "./store.js";

/**
 * Bridge between the web UI and the host coding agent (e.g. Claude Code
 * running the dreative skill). UI actions enqueue requests; the agent
 * long-polls /api/agent/next, does the work, and posts the result back.
 */

export type AgentEvent =
  | { kind: "request"; id: string; type: string; payload: unknown }
  | { kind: "finish"; diff: unknown };

interface Pending {
  event: AgentEvent & { kind: "request" };
  resolve: (result: unknown) => void;
  reject: (err: Error) => void;
  onStatus?: (s: string) => void;
  taken: boolean;
}

const queue: AgentEvent[] = [];
const pending = new Map<string, Pending>();
let waiter: ((ev: AgentEvent | null) => void) | null = null;

function deliver(ev: AgentEvent) {
  if (waiter) {
    const w = waiter;
    waiter = null;
    w(ev);
  } else {
    queue.push(ev);
  }
}

/** Enqueue a request for the agent; resolves when the agent responds. */
export function requestAgent<T>(type: string, payload: unknown, onStatus?: (s: string) => void): Promise<T> {
  const event: AgentEvent & { kind: "request" } = { kind: "request", id: newId("req"), type, payload };
  onStatus?.("Waiting for agent… (run `dreative wait` in your coding CLI)");
  return new Promise<T>((resolve, reject) => {
    pending.set(event.id, { event, resolve: resolve as (r: unknown) => void, reject, onStatus, taken: false });
    deliver(event);
  });
}

export function pushFinish(diff: unknown) {
  deliver({ kind: "finish", diff });
}

/** Long-poll: resolve with the next event, or null after timeoutMs. */
export function nextEvent(timeoutMs: number): Promise<AgentEvent | null> {
  const ev = queue.shift();
  if (ev) {
    markTaken(ev);
    return Promise.resolve(ev);
  }
  if (waiter) waiter(null); // only one agent poller at a time
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      if (waiter === wrapped) waiter = null;
      resolve(null);
    }, timeoutMs);
    const wrapped = (e: AgentEvent | null) => {
      clearTimeout(timer);
      if (e) markTaken(e);
      resolve(e);
    };
    waiter = wrapped;
  });
}

function markTaken(ev: AgentEvent) {
  if (ev.kind !== "request") return;
  const p = pending.get(ev.id);
  if (p && !p.taken) {
    p.taken = true;
    p.onStatus?.("Agent working…");
  }
}

export function respond(id: string, body: { result?: unknown; error?: string }): boolean {
  const p = pending.get(id);
  if (!p) return false;
  pending.delete(id);
  if (body.error) p.reject(new Error(body.error));
  else p.resolve(body.result);
  return true;
}
