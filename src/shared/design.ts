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
  sections: { id: string; label: string; family: string; skills?: string[] }[];
  /** compact executable directives for the agent */
  directives: string[];
  /** doctrine violations found in the current layout */
  lints: string[];
  /** specialist skill files the agent must read before designing (skills/<name>.md) */
  skills: string[];
}

/** Specialist skill detection — keyword signatures over brief/prompt/block text.
 *  Names map to skill/dreative/skills/<name>.md. */
const SKILL_SIGNATURES: Record<string, RegExp> = {
  "3d": /\b(3d|three\.?js|webgl|r3f|shader|glsl|particles?|point ?cloud|globe|mesh gradient|orbit|spline)\b/i,
  motion: /\b(animat|motion|parallax|scroll[- ]?(driven|trigger|story|choreo)|gsap|framer|lenis|marquee|kinetic|cinematic|stagger|reveal|transition)\b/i,
  interaction: /\b(micro[- ]?interaction|hover (effect|state)s?|cursor|magnetic|tilt|spotlight|glow|ripple|tactile|interactive|draggable)\b/i,
  immersive:
    /\b(immersive|award[- ]?(site|winning)|awwwards|spatial( (transition|nav(igation)?))?|scene[- ]?based|world|page[- ]transitions?|camera (move|travel|path)|preloader|scroll (journey|story|as travel)|explorable|experience site|epic\.net)\b/i,
  cinematic:
    /\b(cinematic|experiential|unseen\.co|fluid (sim(ulation)?|distortion)|gpgpu|drag[- ]to[- ]explore|click ?(&|and) ?hold|film grain|graded|velocity[- ]reactive|sound design|ambient (audio|sound))\b/i,
  refined:
    /\b(clean (and )?(modern|professional)|modern clean|business (site|website|use)|corporate|professional look|premium (minimal|clean)|dtc|d2c|e[- ]?commerce|ecommerce|shopify|maswitzerland|lovvelavva|not (too )?(flashy|animated)|calm|understated)\b/i,
};

function detectSkills(texts: (string | undefined)[]): string[] {
  const hay = texts.filter(Boolean).join(" \n ");
  return Object.keys(SKILL_SIGNATURES).filter((k) => SKILL_SIGNATURES[k].test(hay));
}

/** All text a block subtree carries that can signal a specialist skill. */
function blockTexts(b: Block): string[] {
  return [
    b.label,
    b.summary,
    ...(b.intents ?? []),
    ...(b.children ?? []).flatMap(blockTexts),
  ].filter((t): t is string => Boolean(t));
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
    const secSkills = detectSkills(blockTexts(s));
    return secSkills.length ? { id: s.id, label: s.label, family, skills: secSkills } : { id: s.id, label: s.label, family };
  });

  // page-level specialist skills: brief/prompt keywords + section hits + motion dial
  const skills = new Set<string>([
    ...detectSkills([brief?.vibe, brief?.notes, page.designPrompt]),
    ...sections.flatMap((s) => s.skills ?? []),
  ]);
  if (dials.motion >= 6) skills.add("motion");

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
    ...(skills.size
      ? [
          `specialist skills required: ${[...skills].join(", ")} — read skills/<name>.md (next to DESIGN.md) before writing code; sections tagged with "skills" get that treatment`,
        ]
      : []),
  ];

  return { dials, aesthetic, sections, directives, lints: lintLayout(page.layout), skills: [...skills] };
}
