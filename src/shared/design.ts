import type { Block, DesignBrief, Page } from "./types.js";

/**
 * Deterministic design intelligence — zero LLM tokens.
 * Dreative makes the design decisions here (dial resolution, per-section layout
 * families, doctrine lints); the coding agent only executes the resulting plan.
 * Rules mirror skill/dreative/DESIGN.md.
 */

export interface DesignPlan {
  /** resolved dials after brief + aesthetic defaults */
  dials: { variance: number; motion: number; density: number };
  aesthetic: string;
  /** per top-level section: assigned layout family (guarantees diversity) */
  sections: { id: string; label: string; family: string }[];
  /** compact executable directives for the agent */
  directives: string[];
  /** doctrine violations found in the current layout */
  lints: string[];
}

const AESTHETIC_DIALS: Record<string, [number, number, number]> = {
  minimal: [5, 3, 3],
  editorial: [6, 4, 3],
  premium: [7, 6, 3],
  playful: [9, 8, 3],
  brutalist: [7, 2, 5],
  "dark-tech": [6, 5, 5],
  trust: [3, 2, 5],
};

/** Layout families rotated across sections so no page repeats itself. */
const FAMILIES = [
  "asymmetric-split",
  "bento-grid",
  "full-width-statement",
  "stacked-vertical",
  "offset-two-col",
  "horizontal-scroll-strip",
  "editorial-columns",
];

function resolveDials(brief?: DesignBrief) {
  const base = AESTHETIC_DIALS[brief?.aesthetic ?? ""] ?? [7, 5, 4];
  return {
    variance: brief?.variance ?? base[0],
    motion: brief?.motion ?? base[1],
    density: brief?.density ?? base[2],
  };
}

/** Rough family signature of a block, for repetition detection. */
function familySignature(b: Block): string {
  const kids = b.children ?? [];
  if (b.type === "hero") return "hero";
  if (b.type === "card-grid" || (b.direction === "row" && kids.length >= 3)) return `grid-${kids.length}`;
  if (b.direction === "row" && kids.length === 2) {
    const types = kids.map((k) => k.type).sort().join("+");
    return `split-${types}`;
  }
  return `${b.type}-${b.direction ?? "column"}`;
}

function countBlocks(b: Block, pred: (x: Block) => boolean): number {
  return (pred(b) ? 1 : 0) + (b.children ?? []).reduce((n, c) => n + countBlocks(c, pred), 0);
}

/** Doctrine lints over the wireframe structure (DESIGN.md §2, §7). */
export function lintLayout(layout: Block): string[] {
  const lints: string[] = [];
  const sections = layout.children ?? [];

  // consecutive repeated layout family (zigzag cap / repetition ban)
  let run = 1;
  for (let i = 1; i < sections.length; i++) {
    if (familySignature(sections[i]) === familySignature(sections[i - 1])) {
      run++;
      if (run === 3)
        lints.push(`3+ consecutive sections share the same layout ("${sections[i].label}") — break the pattern with a different family`);
    } else run = 1;
  }

  // same family appearing >2 times anywhere on the page
  const sigCount = new Map<string, number>();
  sections.forEach((s) => sigCount.set(familySignature(s), (sigCount.get(familySignature(s)) ?? 0) + 1));
  for (const [sig, n] of sigCount) {
    if (n > 2 && sig !== "hero") lints.push(`layout family "${sig}" used ${n}× — a page needs distinct section compositions`);
  }

  // 3-equal-cards row
  const walk = (b: Block) => {
    const kids = b.children ?? [];
    if (
      kids.length >= 3 &&
      (b.direction === "row" || b.type === "card-grid") &&
      kids.every((k) => k.type === kids[0].type && (k.sizeHint ?? "md") === (kids[0].sizeHint ?? "md"))
    ) {
      lints.push(`"${b.label}": ${kids.length} identical cells in a row — vary sizes or restructure as an asymmetric bento`);
    }
    if (b.type === "list" && kids.length > 5) {
      lints.push(`"${b.label}": ${kids.length}-item list — group into chunks, cards, or tabs instead of one long list`);
    }
    kids.forEach(walk);
  };
  walk(layout);

  // hero discipline: too much stacked inside a hero
  const heroes: Block[] = [];
  const findHeroes = (b: Block) => {
    if (b.type === "hero") heroes.push(b);
    b.children?.forEach(findHeroes);
  };
  findHeroes(layout);
  for (const h of heroes) {
    const textish = countBlocks(h, (x) => x.type === "text" || x.type === "button");
    if (textish > 4) lints.push(`hero "${h.label}" stacks ${textish} text/button elements — max 4 (headline, subtext, CTAs, one eyebrow)`);
  }

  // CTA duplication (very rough: many buttons at top level)
  const buttons = countBlocks(layout, (b) => b.type === "button");
  if (buttons > 5) lints.push(`${buttons} buttons on one page — consolidate duplicate CTA intents (one label per intent)`);

  return lints;
}

/** Build the compact, executable plan sent to the agent with design-page. */
export function buildDesignPlan(page: Page, brief: DesignBrief | undefined): DesignPlan {
  const dials = resolveDials(brief);
  const aesthetic = brief?.aesthetic || "auto (infer per DESIGN.md, then commit)";
  const sections = (page.layout.children ?? []).map((s, i) => {
    let family: string;
    if (s.type === "nav") family = "nav-single-line";
    else if (s.type === "hero") family = dials.variance > 4 ? "asymmetric-split-hero" : "centered-hero";
    else if (s.type === "footer") family = "footer";
    else family = FAMILIES[i % FAMILIES.length];
    return { id: s.id, label: s.label, family };
  });

  const spacing = dials.density <= 3 ? "py-24/py-32 section gaps" : dials.density <= 6 ? "py-16/py-20" : "py-8/py-12, hairline dividers, mono numerals";
  const motionBudget =
    dials.motion <= 3
      ? "hover/active states only, no scroll animation"
      : dials.motion <= 6
        ? "entry fade+rise on hero, whileInView reveals on 2-3 key sections, nothing infinite"
        : "scroll choreography allowed on ≤2 sections + hero entry; everything reduced-motion safe";

  const directives = [
    `aesthetic: ${aesthetic}; dials variance=${dials.variance} motion=${dials.motion} density=${dials.density}`,
    `spacing scale: ${spacing}`,
    `motion budget: ${motionBudget}`,
    "one accent color, one neutral family, one radius system, locked across ALL pages of this project",
    "section layout families are assigned below — follow them, do not default to repeated card rows",
    ...(dials.variance > 4 ? ["avoid centered-hero-over-gradient; use split or asymmetric composition"] : []),
  ];

  return { dials, aesthetic, sections, directives, lints: lintLayout(page.layout) };
}
