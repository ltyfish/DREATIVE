import React from "react";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { useStore, findPath } from "../store";
import { BlockView, themeVars } from "../wireframe/BlockView";
import { moveBlock } from "../blockOps";
import type { Page } from "../../shared/types";

export default function PageEditor({ page }: { page: Page }) {
  const { selection, select, mutatePage, viewMode, setViewMode, openPage, previewNonce } = useStore();
  const selectedBlockId = selection.kind === "block" ? selection.blockId : undefined;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    mutatePage(page.id, (pg) => {
      pg.layout = moveBlock(pg.layout, String(e.active.id), String(e.over!.id));
    });
  };

  return (
    <div className="editor-view">
      <div className="editor-toolbar">
        <button className="ghost" onClick={() => openPage(null)}>← Canvas</button>
        <strong>{page.name}</strong>
        {selectedBlockId && (
          <span className="breadcrumb">
            {findPath(page.layout, selectedBlockId).map((b, i, arr) => (
              <React.Fragment key={b.id}>
                <span
                  className={`crumb${i === arr.length - 1 ? " current" : ""}`}
                  onClick={() => select({ kind: "block", pageId: page.id, blockId: b.id })}
                >
                  {b.label || b.type}
                </span>
                {i < arr.length - 1 && <span className="crumb-sep">›</span>}
              </React.Fragment>
            ))}
          </span>
        )}
        <span style={{ flex: 1 }} />
        <button className={viewMode === "layout" ? "" : "ghost"} onClick={() => setViewMode("layout")}>Layout</button>
        <button
          className={viewMode === "replica" ? "" : "ghost"}
          onClick={() => setViewMode("replica")}
          disabled={!page.replicaFile}
          title={page.replicaFile ? "1:1 replica of your real page — hover elements to see what they do" : "No replica extracted for this page"}
        >
          Replica
        </button>
        <button
          className={viewMode === "preview" ? "" : "ghost"}
          onClick={() => setViewMode("preview")}
          disabled={page.status !== "designed"}
          title={page.status !== "designed" ? "Generate a design first" : ""}
        >
          Preview
        </button>
      </div>

      {viewMode === "replica" && page.replicaFile ? (
        <iframe key={`r${previewNonce}`} className="preview-frame" src={`/replica/${page.id}`} title="replica" />
      ) : viewMode === "preview" && page.status === "designed" ? (
        <iframe key={previewNonce} className="preview-frame" src={`/preview/${page.id}`} title="preview" />
      ) : (
        <div className="editor-scroll" onClick={() => select({ kind: "page", pageId: page.id })}>
          <div className="editor-page wf-paper" style={themeVars(page.theme)}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <BlockView
                block={page.layout}
                interactive
                sortable
                selectedId={selectedBlockId}
                onSelect={(blockId) => select({ kind: "block", pageId: page.id, blockId })}
              />
            </DndContext>
          </div>
        </div>
      )}
    </div>
  );
}
