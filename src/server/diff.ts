import type { Block, Page, Project } from "../shared/types.js";

/**
 * Compact layout diff sent to the agent on "finish". Token efficiency is the
 * point: only changed pages/blocks appear, changed blocks list only the props
 * that differ (children compared structurally via the added/removed/moved
 * lists, not by inclusion).
 */

const BLOCK_PROPS = ["type", "label", "direction", "sizeHint", "intents", "refImage", "source"] as const;

interface FlatBlock {
  block: Block;
  parentId: string | null;
  index: number;
}

function flatten(root: Block): Map<string, FlatBlock> {
  const map = new Map<string, FlatBlock>();
  const walk = (b: Block, parentId: string | null, index: number) => {
    map.set(b.id, { block: b, parentId, index });
    b.children?.forEach((c, i) => walk(c, b.id, i));
  };
  walk(root, null, 0);
  return map;
}

export interface PageDiff {
  id: string;
  name: string;
  source?: string;
  renamedFrom?: string;
  refImage?: string;
  designPrompt?: string;
  blocksAdded?: { parentId: string | null; index: number; block: Block }[];
  blocksRemoved?: { id: string; label: string }[];
  blocksMoved?: { id: string; label: string; toParent: string | null; index: number }[];
  blocksChanged?: ({ id: string; label: string } & Partial<Block>)[];
}

export interface ProjectDiff {
  pagesAdded: { id: string; name: string; refImage?: string; designPrompt?: string; layout: Block }[];
  pagesRemoved: { id: string; name: string; source?: string }[];
  pagesChanged: PageDiff[];
}

function diffPage(before: Page, after: Page): PageDiff | null {
  const d: PageDiff = { id: after.id, name: after.name, source: after.source };
  let changed = false;
  if (before.name !== after.name) {
    d.renamedFrom = before.name;
    changed = true;
  }
  if (before.refImage !== after.refImage && after.refImage) {
    d.refImage = after.refImage;
    changed = true;
  }
  if (before.designPrompt !== after.designPrompt && after.designPrompt) {
    d.designPrompt = after.designPrompt;
    changed = true;
  }

  const a = flatten(before.layout);
  const b = flatten(after.layout);

  for (const [id, fb] of b) {
    const fa = a.get(id);
    if (!fa) {
      // report only the topmost added block (its subtree comes along)
      if (!fb.parentId || a.has(fb.parentId)) {
        (d.blocksAdded ??= []).push({ parentId: fb.parentId, index: fb.index, block: fb.block });
        changed = true;
      }
      continue;
    }
    if (fa.parentId !== fb.parentId || fa.index !== fb.index) {
      (d.blocksMoved ??= []).push({ id, label: fb.block.label, toParent: fb.parentId, index: fb.index });
      changed = true;
    }
    const delta: Record<string, unknown> = {};
    for (const key of BLOCK_PROPS) {
      const va = fa.block[key];
      const vb = fb.block[key];
      if (JSON.stringify(va) !== JSON.stringify(vb)) delta[key] = vb ?? null;
    }
    if (Object.keys(delta).length) {
      (d.blocksChanged ??= []).push({ id, label: fb.block.label, ...delta });
      changed = true;
    }
  }
  for (const [id, fa] of a) {
    if (!b.has(id)) {
      // report only topmost removed block
      if (!fa.parentId || b.has(fa.parentId)) {
        (d.blocksRemoved ??= []).push({ id, label: fa.block.label });
        changed = true;
      }
    }
  }
  return changed ? d : null;
}

export function computeDiff(baseline: Project, current: Project): ProjectDiff {
  const beforePages = new Map(baseline.pages.map((p) => [p.id, p]));
  const afterPages = new Map(current.pages.map((p) => [p.id, p]));
  const diff: ProjectDiff = { pagesAdded: [], pagesRemoved: [], pagesChanged: [] };

  for (const page of current.pages) {
    const before = beforePages.get(page.id);
    if (!before) {
      diff.pagesAdded.push({
        id: page.id,
        name: page.name,
        refImage: page.refImage,
        designPrompt: page.designPrompt,
        layout: page.layout,
      });
    } else {
      const d = diffPage(before, page);
      if (d) diff.pagesChanged.push(d);
    }
  }
  for (const page of baseline.pages) {
    if (!afterPages.has(page.id)) diff.pagesRemoved.push({ id: page.id, name: page.name, source: page.source });
  }
  return diff;
}
