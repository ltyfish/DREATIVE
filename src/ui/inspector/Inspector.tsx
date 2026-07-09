import React, { useRef, useState } from "react";
import { useStore, findBlock } from "../store";
import { removeById, appendChild, makeBlock, cloneWithNewIds, findParent, ALL_TYPES } from "../blockOps";
import type { BlockType, DesignBrief } from "../../shared/types";

const AESTHETICS = ["", "minimal", "editorial", "premium", "playful", "brutalist", "dark-tech", "trust"];

const DIALS: { key: "variance" | "motion" | "density"; label: string; hint: string; def: number }[] = [
  { key: "variance", label: "Variance", hint: "symmetric ↔ experimental", def: 7 },
  { key: "motion", label: "Motion", hint: "static ↔ cinematic", def: 5 },
  { key: "density", label: "Density", hint: "airy ↔ packed", def: 4 },
];

/** Project-level design direction; sent to the agent with every design request. */
function BriefPanel() {
  const { project, setProject } = useStore();
  const brief = project.brief ?? {};
  const mutate = (fn: (b: DesignBrief) => void) => {
    const copy = structuredClone(project);
    copy.brief = copy.brief ?? {};
    fn(copy.brief);
    setProject(copy, { history: false });
  };
  return (
    <>
      <h3>Design brief</h3>
      <p className="hint">Sets the direction for every AI design pass. Leave blank to let the agent read the room.</p>
      <select value={brief.aesthetic ?? ""} onChange={(e) => mutate((b) => (b.aesthetic = e.target.value || undefined))}>
        {AESTHETICS.map((a) => (
          <option key={a} value={a}>{a || "aesthetic: auto"}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder='vibe, e.g. "calm, Linear-style"'
        value={brief.vibe ?? ""}
        onChange={(e) => mutate((b) => (b.vibe = e.target.value || undefined))}
      />
      <input
        type="text"
        placeholder='audience, e.g. "technical buyers"'
        value={brief.audience ?? ""}
        onChange={(e) => mutate((b) => (b.audience = e.target.value || undefined))}
      />
      {DIALS.map((d) => (
        <label key={d.key} className="dial" title={d.hint}>
          <span>
            {d.label} <em>{brief[d.key] ?? d.def}</em>
          </span>
          <input
            type="range"
            min={1}
            max={10}
            value={brief[d.key] ?? d.def}
            onChange={(e) => mutate((b) => (b[d.key] = Number(e.target.value)))}
          />
        </label>
      ))}
      <textarea
        rows={2}
        placeholder="notes for the designer agent (brand rules, must-keeps…)"
        value={brief.notes ?? ""}
        onChange={(e) => mutate((b) => (b.notes = e.target.value || undefined))}
      />
    </>
  );
}

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

/** Small click-to-upload ref image widget. */
function RefDrop({ current, onFile, hint }: { current?: string; onFile: (f: File) => void; hint: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="drop-ref" onClick={() => ref.current?.click()}>
        {current ? <img src={`/${current}`} alt="ref" /> : hint}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </>
  );
}

export default function Inspector() {
  const { project, selection, api, mutatePage, setProject, select, openPage, busy } = useStore();
  const [instruction, setInstruction] = useState("");
  const [addType, setAddType] = useState<BlockType>("text");
  const [elementRefPath, setElementRefPath] = useState<string | undefined>();

  if (selection.kind === "none") {
    return (
      <aside className="inspector">
        <h3>How it works</h3>
        <ol className="steps">
          <li><b>Propose</b> — describe pages in the top bar; AI drops wireframe cards on the canvas.</li>
          <li><b>Arrange</b> — open a page, drag blocks anywhere, or select one and tell AI what to change. Behavior notes become ⚡ intents.</li>
          <li><b>Design</b> — attach reference images (whole page, or per block) and generate. Then click elements in Preview to refine.</li>
        </ol>
        <p className="hint">
          Shortcuts: <kbd>Ctrl+Z</kbd> undo · <kbd>Ctrl+Shift+Z</kbd> redo · <kbd>Del</kbd> delete selected block ·{" "}
          <kbd>Esc</kbd> back
        </p>
        <BriefPanel />
      </aside>
    );
  }

  const page = project.pages.find((p) => p.id === selection.pageId);
  if (!page) return <aside className="inspector" />;

  if (selection.kind === "page") {
    return (
      <aside className="inspector">
        <h3>Page</h3>
        <input
          type="text"
          value={page.name}
          onChange={(e) => mutatePage(page.id, (pg) => (pg.name = e.target.value), { history: false })}
        />
        <div className="btn-row">
          <button className="ghost" onClick={() => openPage(page.id)}>Open editor</button>
          <button className="ghost" title="Copy this page" disabled={!!busy} onClick={() => api(`/api/pages/${page.id}/duplicate`)}>
            Duplicate
          </button>
        </div>
        <button
          className="ghost"
          title="AI proposes 2 alternative arrangements of this page"
          disabled={!!busy}
          onClick={() => api(`/api/pages/${page.id}/variants`)}
        >
          ✨ Propose 2 layout variants
        </button>

        <h3>Reference image (whole page)</h3>
        <RefDrop
          current={page.refImage}
          hint="Click to attach — the design will match this image's style"
          onFile={async (f) => api(`/api/pages/${page.id}/ref`, { name: f.name, dataBase64: await fileToBase64(f) })}
        />

        <h3>Design prompt</h3>
        <textarea
          rows={3}
          placeholder="e.g. clean SaaS look, dark hero, rounded cards"
          value={page.designPrompt ?? ""}
          onChange={(e) => mutatePage(page.id, (pg) => (pg.designPrompt = e.target.value), { history: false })}
        />
        <button disabled={!!busy} onClick={() => api(`/api/pages/${page.id}/design`, { designPrompt: page.designPrompt })}>
          {page.status === "designed" ? "Regenerate design" : "🎨 Generate design"}
        </button>
        {page.status === "designed" && (
          <p className="hint">Regenerating keeps the styling of unchanged blocks, including your element-level edits.</p>
        )}

        <button
          className="danger"
          onClick={() => {
            if (!confirm(`Delete page "${page.name}"?`)) return;
            const copy = structuredClone(project);
            copy.pages = copy.pages.filter((p) => p.id !== page.id);
            setProject(copy);
            select({ kind: "none" });
          }}
        >
          Delete page
        </button>
      </aside>
    );
  }

  if (selection.kind === "block") {
    const block = findBlock(page.layout, selection.blockId);
    if (!block) return <aside className="inspector" />;
    const isRoot = block.id === page.layout.id;

    const mutateBlock = (fn: (b: NonNullable<typeof block>) => void, history = true) =>
      mutatePage(
        page.id,
        (pg) => {
          const b = findBlock(pg.layout, block.id);
          if (b) fn(b);
        },
        { history }
      );

    return (
      <aside className="inspector">
        <h3>Block — {block.type}</h3>
        <input type="text" value={block.label} onChange={(e) => mutateBlock((b) => (b.label = e.target.value), false)} />

        <div className="btn-row">
          <button
            className="ghost"
            title="Cycle relative size (sm → md → lg)"
            onClick={() =>
              mutateBlock((b) => {
                b.sizeHint = b.sizeHint === "sm" ? "md" : b.sizeHint === "md" ? "lg" : "sm";
              })
            }
          >
            Size: {block.sizeHint ?? "md"}
          </button>
          <button
            className="ghost"
            title="Toggle whether children stack vertically or sit side-by-side"
            onClick={() => mutateBlock((b) => (b.direction = b.direction === "row" ? "column" : "row"))}
          >
            {block.direction === "row" ? "→ row" : "↓ column"}
          </button>
        </div>

        <div className="btn-row">
          <select value={addType} onChange={(e) => setAddType(e.target.value as BlockType)}>
            {ALL_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button
            className="ghost"
            title="Add a child block of the selected type inside this block"
            onClick={() => mutatePage(page.id, (pg) => (pg.layout = appendChild(pg.layout, block.id, makeBlock(addType))))}
          >
            + Add child
          </button>
        </div>

        {!isRoot && (
          <div className="btn-row">
            <button
              className="ghost"
              onClick={() =>
                mutatePage(page.id, (pg) => {
                  const loc = findParent(pg.layout, block.id);
                  const src = findBlock(pg.layout, block.id);
                  if (loc && src) loc.parent.children!.splice(loc.index + 1, 0, cloneWithNewIds(src));
                })
              }
            >
              Duplicate
            </button>
            <button
              className="danger"
              onClick={() => {
                mutatePage(page.id, (pg) => (pg.layout = removeById(pg.layout, block.id)));
                select({ kind: "page", pageId: page.id });
              }}
            >
              Delete
            </button>
          </div>
        )}

        <h3>Style reference (this block)</h3>
        <RefDrop
          current={block.refImage}
          hint="Optional: attach an image just for this block's style"
          onFile={async (f) =>
            api(`/api/pages/${page.id}/blocks/${block.id}/ref`, { name: f.name, dataBase64: await fileToBase64(f) })
          }
        />

        <h3>Edit with AI</h3>
        <p className="hint">Describe a structure or functionality change. Behavior notes land in ⚡ intents and get implemented in the design pass.</p>
        <textarea
          rows={3}
          placeholder='e.g. "make this a 3-card testimonial carousel" or "this button opens a signup modal"'
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />
        <button
          disabled={!!busy || !instruction.trim()}
          onClick={async () => {
            await api(`/api/pages/${page.id}/blocks/${block.id}/edit`, { instruction });
            setInstruction("");
          }}
        >
          Apply with AI
        </button>

        {block.intents && block.intents.length > 0 && (
          <>
            <h3>Intents</h3>
            {block.intents.map((it, i) => (
              <div key={i} className="intent">
                ⚡ {it}
                <span className="intent-x" title="Remove intent" onClick={() => mutateBlock((b) => b.intents!.splice(i, 1))}>
                  ×
                </span>
              </div>
            ))}
          </>
        )}
      </aside>
    );
  }

  // element selection (preview mode)
  return (
    <aside className="inspector">
      <h3>Element</h3>
      <p className="hint">
        Selected <code>{selection.elementId}</code> in the designed page. Describe the change, optionally with a style
        reference image.
      </p>
      <RefDrop
        current={elementRefPath}
        hint="Optional: style reference for this change"
        onFile={async (f) => {
          const res = await fetch(`/api/pages/${page.id}/blocks/${selection.elementId}/ref`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: f.name, dataBase64: await fileToBase64(f) }),
          });
          const data = await res.json();
          if (data.refPath) setElementRefPath(data.refPath);
        }}
      />
      <textarea
        rows={3}
        placeholder='e.g. "make the headline bigger and gold" or "match the reference image"'
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
      />
      <button
        disabled={!!busy || !instruction.trim()}
        onClick={async () => {
          await api(`/api/pages/${page.id}/element/${selection.elementId}/edit`, {
            instruction,
            refPath: elementRefPath,
          });
          setInstruction("");
          setElementRefPath(undefined);
        }}
      >
        Apply with AI
      </button>
    </aside>
  );
}
