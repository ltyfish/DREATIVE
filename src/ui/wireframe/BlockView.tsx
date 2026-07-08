import React from "react";
import type { Block } from "../../shared/types";
import { SortableContext, useSortable, verticalListSortingStrategy, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  block: Block;
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** present when rendered inside a root-level DndContext (PageEditor) */
  sortable?: boolean;
  interactive?: boolean;
}

/** Visual placeholder glyphs for leaf blocks — mockup style, no labels. */
function Glyph({ block }: { block: Block }) {
  switch (block.type) {
    case "text": {
      const lines = block.sizeHint === "lg" ? 5 : block.sizeHint === "sm" ? 2 : 3;
      return (
        <div className="g-text">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="g-line" style={{ width: `${92 - i * 14}%` }} />
          ))}
        </div>
      );
    }
    case "button":
      return <div className="g-button" />;
    case "image":
      return <div className="g-image" />;
    case "nav":
      return (
        <div className="g-nav">
          <div className="g-nav-dot" />
          <div className="g-nav-links">
            <span /><span /><span />
          </div>
          <div className="g-nav-cta" />
        </div>
      );
    case "hero":
      return (
        <div className="g-hero">
          <div className="g-hero-title" />
          <div className="g-line" style={{ width: "55%" }} />
          <div className="g-line" style={{ width: "40%" }} />
          <div className="g-button" style={{ marginTop: 8 }} />
        </div>
      );
    case "card-grid":
      return (
        <div className="g-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="g-card">
              <div className="g-card-media" />
              <div className="g-line" style={{ width: "80%" }} />
              <div className="g-line" style={{ width: "55%" }} />
            </div>
          ))}
        </div>
      );
    case "list":
      return (
        <div className="g-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="g-list-row">
              <div className="g-list-thumb" />
              <div className="g-text" style={{ flex: 1 }}>
                <div className="g-line" style={{ width: "70%" }} />
                <div className="g-line" style={{ width: "45%" }} />
              </div>
            </div>
          ))}
        </div>
      );
    case "form":
      return (
        <div className="g-form">
          <div className="g-input" />
          <div className="g-input" />
          <div className="g-button" />
        </div>
      );
    case "footer":
      return (
        <div className="g-footer">
          <div className="g-text">
            <div className="g-line" style={{ width: "30%" }} />
            <div className="g-line" style={{ width: "22%" }} />
          </div>
          <div className="g-nav-links"><span /><span /><span /></div>
        </div>
      );
    default:
      return null;
  }
}

function classNames(block: Block, selected: boolean, hasChildren: boolean) {
  const cls = ["wf-block", `wf-${block.type}`];
  if (selected) cls.push("selected");
  if (block.intents?.length) cls.push("has-intents");
  if (block.refImage) cls.push("has-ref");
  if (!hasChildren) cls.push("leaf");
  return cls.join(" ");
}

function SortableChild({ block, ...rest }: Props & { block: Block }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  return (
    <div
      ref={setNodeRef}
      className="wf-sortable"
      style={{ transform: CSS.Transform.toString(transform), transition, flex: 1, minWidth: 0 }}
      {...attributes}
      {...listeners}
    >
      <BlockView block={block} {...rest} />
    </div>
  );
}

export function BlockView({ block, selectedId, onSelect, sortable, interactive }: Props) {
  const children = block.children ?? [];
  const selected = selectedId === block.id;
  const hasChildren = children.length > 0;

  const body = hasChildren ? (
    <div className="wf-children" style={{ flexDirection: block.direction === "row" ? "row" : "column" }}>
      {interactive && sortable ? (
        <SortableContext
          items={children.map((c) => c.id)}
          strategy={block.direction === "row" ? horizontalListSortingStrategy : verticalListSortingStrategy}
        >
          {children.map((c) => (
            <SortableChild key={c.id} block={c} selectedId={selectedId} onSelect={onSelect} sortable interactive />
          ))}
        </SortableContext>
      ) : (
        children.map((c) => (
          <BlockView key={c.id} block={c} selectedId={selectedId} onSelect={onSelect} interactive={interactive} />
        ))
      )}
    </div>
  ) : (
    <Glyph block={block} />
  );

  return (
    <div
      className={classNames(block, selected, hasChildren)}
      title={`${block.label}${block.intents?.length ? ` — ⚡ ${block.intents.join("; ")}` : ""}`}
      onClick={
        interactive && onSelect
          ? (e) => {
              e.stopPropagation();
              onSelect(block.id);
            }
          : undefined
      }
    >
      {interactive && <span className="wf-tag">{block.label}</span>}
      {body}
    </div>
  );
}

export { arrayMove };
