import type { Block, BlockType } from "../shared/types";
import { findBlock } from "./store";

export function findParent(root: Block, id: string): { parent: Block; index: number } | undefined {
  const children = root.children ?? [];
  const index = children.findIndex((c) => c.id === id);
  if (index >= 0) return { parent: root, index };
  for (const c of children) {
    const found = findParent(c, id);
    if (found) return found;
  }
  return undefined;
}

export function removeById(root: Block, id: string): Block {
  return {
    ...root,
    children: root.children?.filter((c) => c.id !== id).map((c) => removeById(c, id)),
  };
}

function insertBefore(root: Block, parentId: string, index: number, block: Block): Block {
  if (root.id === parentId) {
    const children = [...(root.children ?? [])];
    children.splice(index, 0, block);
    return { ...root, children };
  }
  return { ...root, children: root.children?.map((c) => insertBefore(c, parentId, index, block)) };
}

/** Move block `activeId` to sit at `overId`'s position (works across parents). */
export function moveBlock(root: Block, activeId: string, overId: string): Block {
  if (activeId === overId) return root;
  const active = findBlock(root, activeId);
  if (!active) return root;
  if (findBlock(active, overId)) return root; // can't drop into own descendant

  const before = findParent(root, activeId);
  const removed = removeById(root, activeId);
  const target = findParent(removed, overId);
  if (!target || !before) return root;

  let index = target.index;
  // moving forward within the same parent: account for the removed slot
  if (target.parent.id === before.parent.id && before.index < target.index) index += 1;
  return insertBefore(removed, target.parent.id, index, active);
}

export function appendChild(root: Block, parentId: string, child: Block): Block {
  if (root.id === parentId) {
    return { ...root, children: [...(root.children ?? []), child] };
  }
  return { ...root, children: root.children?.map((c) => appendChild(c, parentId, child)) };
}

let counter = 0;
export function newBlockId() {
  counter += 1;
  return `blk_${Date.now().toString(36)}${counter}`;
}

export function makeBlock(type: BlockType): Block {
  const label = type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ");
  const base: Block = { id: newBlockId(), type, label };
  if (type === "row") base.direction = "row";
  if (type === "section" || type === "column") base.direction = "column";
  return base;
}

export function cloneWithNewIds(block: Block): Block {
  return { ...block, id: newBlockId(), children: block.children?.map(cloneWithNewIds) };
}

export const CONTAINER_TYPES = new Set(["section", "row", "column", "nav", "hero", "card-grid", "list", "form", "footer"]);
export const ALL_TYPES: BlockType[] = ["section", "row", "column", "nav", "hero", "card-grid", "list", "form", "footer", "text", "image", "button"];
