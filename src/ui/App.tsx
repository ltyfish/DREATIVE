import React, { useEffect, useState } from "react";
import { useStore } from "./store";
import { removeById } from "./blockOps";
import Canvas from "./canvas/Canvas";
import PageEditor from "./editor/PageEditor";
import Inspector from "./inspector/Inspector";

const EXAMPLES = [
  "Landing page for a specialty coffee brand",
  "SaaS dashboard with sidebar, stats, and activity feed",
  "Portfolio site for a photographer",
  "E-commerce product page with reviews",
];

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="empty-state">
      <div className="empty-card">
        <div className="empty-logo">◆</div>
        <h1>Start with a prompt</h1>
        <p>
          Describe what you want to build. AI proposes <b>3 wireframe layouts</b> — you arrange the structure, then AI
          designs each page from your reference image.
        </p>
        <div className="empty-examples">
          {EXAMPLES.map((ex) => (
            <button key={ex} className="ghost" onClick={() => onPick(ex)}>
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { project, load, api, busy, error, openPageId, select, selection, viewMode, openPage, mutatePage } =
    useStore();
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    void load();
  }, [load]);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !typing) {
        e.preventDefault();
        if (e.shiftKey) useStore.getState().redo();
        else useStore.getState().undo();
        return;
      }

      if (typing) return;
      const s = useStore.getState();

      if (e.key === "Delete" || e.key === "Backspace") {
        if (s.selection.kind === "block") {
          const page = s.project.pages.find((p) => p.id === s.selection.pageId);
          if (page && s.selection.blockId !== page.layout.id) {
            const blockId = s.selection.blockId;
            mutatePage(page.id, (pg) => (pg.layout = removeById(pg.layout, blockId)));
            select({ kind: "page", pageId: page.id });
          }
        }
      } else if (e.key === "Escape") {
        if (s.selection.kind === "block" || s.selection.kind === "element") {
          select({ kind: "page", pageId: s.selection.pageId });
        } else if (s.openPageId) {
          openPage(null);
        } else {
          select({ kind: "none" });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mutatePage, openPage, select]);

  // element selection messages from the preview iframe
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "dreative-select" && openPageId && viewMode === "preview") {
        select({ kind: "element", pageId: openPageId, elementId: e.data.id });
      }
      // replica clicks map to the wireframe block with the same id
      if (e.data?.type === "dreative-select-block" && openPageId && viewMode === "replica") {
        select({ kind: "block", pageId: openPageId, blockId: e.data.id });
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [openPageId, viewMode, select]);

  const openPageObj = project.pages.find((p) => p.id === openPageId);

  const generate = async () => {
    if (!prompt.trim()) return;
    await api("/api/skeletons", { prompt });
    setPrompt("");
  };

  return (
    <div className="app">
      <div className="topbar">
        <span className="logo">◆ Dreative</span>
        <input
          placeholder="Describe pages to generate, e.g. “landing page for a specialty coffee brand”"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
        />
        <button disabled={!!busy || !prompt.trim()} onClick={generate} title="AI proposes 3 wireframe layouts">
          ✨ Propose layouts
        </button>
        <button
          title="AI designs every page to the project's design brief (doctrine-checked)"
          disabled={!!busy || project.pages.length === 0}
          onClick={() => api("/api/design-all", {})}
        >
          🎨 Design all
        </button>
        <button
          className="ghost"
          title="Copy designed pages as .tsx into ./src/pages"
          disabled={!project.pages.some((p) => p.status === "designed")}
          onClick={async () => {
            const res = await fetch("/api/export", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({}),
            });
            const data = await res.json();
            alert(`Exported:\n${(data.exported ?? []).join("\n") || "nothing"}`);
          }}
        >
          Export
        </button>
        <button
          title="Hand the final layout (as a diff vs the extracted baseline) to your coding CLI to apply"
          disabled={!!busy || project.pages.length === 0}
          onClick={async () => {
            const res = await fetch("/api/finish", { method: "POST" });
            const data = await res.json();
            if (!res.ok) {
              alert(`Finish failed: ${data.error || res.statusText}`);
              return;
            }
            const d = data.diff ?? {};
            alert(
              `Handed to your coding CLI.\nAdded pages: ${d.pagesAdded?.length ?? 0} · Removed: ${d.pagesRemoved?.length ?? 0} · Changed: ${d.pagesChanged?.length ?? 0}\n\nThe agent will now apply these changes to your codebase.`,
            );
          }}
        >
          ✅ Finish
        </button>
      </div>

      <div className="main">
        <div className="workspace">
          {openPageObj ? (
            <PageEditor page={openPageObj} />
          ) : project.pages.length === 0 && !busy ? (
            <EmptyState onPick={(s) => setPrompt(s)} />
          ) : (
            <Canvas />
          )}
        </div>
        <Inspector />
      </div>

      {busy && (
        <div className="statusbar">
          <span className="spinner" />
          <span>{busy}</span>
        </div>
      )}
      {error && !busy && (
        <div className="errorbar" onClick={() => useStore.setState({ error: null })}>
          {error} (click to dismiss)
        </div>
      )}
    </div>
  );
}
