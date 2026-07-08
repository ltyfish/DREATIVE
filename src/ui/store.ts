import { create } from "zustand";
import type { Project, Page, Block } from "../shared/types";

export type Selection =
  | { kind: "none" }
  | { kind: "page"; pageId: string }
  | { kind: "block"; pageId: string; blockId: string }
  | { kind: "element"; pageId: string; elementId: string };

interface State {
  project: Project;
  selection: Selection;
  openPageId: string | null;
  previewMode: boolean;
  busy: string | null;
  error: string | null;
  previewNonce: number;
  past: Project[];
  future: Project[];

  load: () => Promise<void>;
  setProject: (p: Project, opts?: { persist?: boolean; history?: boolean }) => void;
  select: (s: Selection) => void;
  openPage: (id: string | null) => void;
  setPreviewMode: (on: boolean) => void;
  api: (path: string, body?: unknown) => Promise<void>;
  mutatePage: (pageId: string, fn: (page: Page) => void, opts?: { history?: boolean }) => void;
  undo: () => void;
  redo: () => void;
}

// Debounced persistence — typing shouldn't hit the network per keystroke.
let persistTimer: ReturnType<typeof setTimeout> | undefined;
let pendingProject: Project | null = null;
function schedulePersist(project: Project) {
  pendingProject = project;
  clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    const p = pendingProject;
    pendingProject = null;
    if (!p) return;
    void fetch("/api/project", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
  }, 500);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useStore = create<State>((set, get) => ({
  project: { version: 1, pages: [] },
  selection: { kind: "none" },
  openPageId: null,
  previewMode: false,
  busy: null,
  error: null,
  previewNonce: 0,
  past: [],
  future: [],

  load: async () => {
    const project = (await (await fetch("/api/project")).json()) as Project;
    set({ project });
  },

  setProject: (project, opts = {}) => {
    const { persist = true, history = true } = opts;
    if (history) {
      set((s) => ({ past: [...s.past.slice(-49), s.project], future: [], project }));
    } else {
      set({ project });
    }
    if (persist) schedulePersist(project);
  },

  select: (selection) => set({ selection }),
  openPage: (openPageId) => set({ openPageId, previewMode: false, selection: { kind: "none" } }),
  setPreviewMode: (previewMode) => set({ previewMode, selection: { kind: "none" } }),

  api: async (path, body) => {
    if (get().busy) return;
    set({ busy: "Starting…", error: null });
    const started = Date.now();
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body ?? {}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || res.statusText);

      let result: unknown = data;
      if (data.jobId) {
        while (true) {
          await sleep(1200);
          const jr = await fetch(`/api/jobs/${data.jobId}`);
          const job = await jr.json();
          if (!jr.ok) throw new Error(job.error || jr.statusText);
          const secs = Math.round((Date.now() - started) / 1000);
          set({ busy: `${job.label}: ${job.detail} (${secs}s)` });
          if (job.status === "error") throw new Error(job.error);
          if (job.status === "done") {
            result = job.result;
            break;
          }
        }
      }

      const project = result as Project | undefined;
      if (project && Array.isArray(project.pages)) {
        set((s) => ({ past: [...s.past.slice(-49), s.project], future: [], project }));
      }
      set((s) => ({ previewNonce: s.previewNonce + 1 }));
    } catch (err) {
      set({ error: String(err) });
    } finally {
      set({ busy: null });
    }
  },

  mutatePage: (pageId, fn, opts = {}) => {
    const project = structuredClone(get().project);
    const page = project.pages.find((p) => p.id === pageId);
    if (!page) return;
    fn(page);
    get().setProject(project, { history: opts.history ?? true });
  },

  undo: () => {
    const { past, project, future } = get();
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    set({ past: past.slice(0, -1), future: [project, ...future].slice(0, 50), project: prev });
    schedulePersist(prev);
  },

  redo: () => {
    const { past, project, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({ past: [...past, project].slice(-50), future: future.slice(1), project: next });
    schedulePersist(next);
  },
}));

export function findBlock(root: Block, id: string): Block | undefined {
  if (root.id === id) return root;
  for (const c of root.children ?? []) {
    const f = findBlock(c, id);
    if (f) return f;
  }
  return undefined;
}

/** Path of blocks from root to the block with `id` (inclusive). */
export function findPath(root: Block, id: string): Block[] {
  if (root.id === id) return [root];
  for (const c of root.children ?? []) {
    const p = findPath(c, id);
    if (p.length) return [root, ...p];
  }
  return [];
}
