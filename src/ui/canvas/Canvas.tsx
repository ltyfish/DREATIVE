import React, { useEffect, useState, useCallback, memo } from "react";
import { ReactFlow, Background, Controls, type Node, type NodeChange, applyNodeChanges } from "@xyflow/react";
import { useStore } from "../store";
import type { Page } from "../../shared/types";
import { BlockView, themeVars } from "../wireframe/BlockView";

const STEP_HINT: Record<Page["status"], string> = {
  skeleton: "Next: open it, tweak the layout, then generate a design",
  designed: "Designed — open it and switch to Preview",
};

const PageNode = memo(function PageNode({ data }: { data: { page: Page } }) {
  const { page } = data;
  const { select, selection, openPage } = useStore();
  const isSelected = selection.kind === "page" && selection.pageId === page.id;
  return (
    <div className={`page-node${isSelected ? " selected" : ""}`} title={STEP_HINT[page.status]}>
      <header onClick={() => select({ kind: "page", pageId: page.id })} onDoubleClick={() => openPage(page.id)}>
        <span className="name">{page.name}</span>
        <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {page.group && <span className="badge">{page.group}</span>}
          <span className={`badge${page.status === "designed" ? " designed" : ""}`}>{page.status}</span>
          <button
            className="open-btn"
            onClick={(e) => {
              e.stopPropagation();
              openPage(page.id);
            }}
          >
            Open
          </button>
        </span>
      </header>
      <div className="mini" style={{ zoom: 0.55 }}>
        <div className="wf-paper" style={themeVars(page.theme)}>
          <BlockView block={page.layout} />
        </div>
      </div>
    </div>
  );
});

const nodeTypes = { page: PageNode };

function toNodes(pages: Page[]): Node[] {
  return pages.map((page) => ({
    id: page.id,
    type: "page",
    position: page.canvasPos,
    data: { page },
    dragHandle: "header",
  }));
}

export default function Canvas() {
  const { project, setProject, select } = useStore();
  const [nodes, setNodes] = useState<Node[]>(() => toNodes(project.pages));

  // Sync from the project (AI results, undo, deletes) — not during drags,
  // because project only changes on drag-stop.
  useEffect(() => {
    setNodes(toNodes(project.pages));
  }, [project]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds);
        const dragStopped = changes.some((c) => c.type === "position" && c.dragging === false);
        if (dragStopped) {
          const projectCopy = structuredClone(useStore.getState().project);
          for (const n of updated) {
            const pg = projectCopy.pages.find((p) => p.id === n.id);
            if (pg) pg.canvasPos = n.position;
          }
          // defer store update out of the render cycle
          setTimeout(() => setProject(projectCopy), 0);
        }
        return updated;
      });
    },
    [setProject]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={[]}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onPaneClick={() => select({ kind: "none" })}
      onlyRenderVisibleElements
      fitView
      minZoom={0.15}
      proOptions={{ hideAttribution: true }}
      colorMode="dark"
    >
      <Background gap={24} color="#1e2129" />
      <Controls />
    </ReactFlow>
  );
}
