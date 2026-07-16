import type {
  Block,
  DesignBrief,
  ExpressionContract,
  MobileBlueprint,
  Page,
  PageRegister,
  SourceStrategy,
  StructuralDelta,
  TransformationDepth,
} from "./types.js";
import {
  detectSpecialistSkills,
  resolveAmbitionTier,
  resolveSkillDependencies,
  routeSkillsAcrossPages,
  TIER_REQUIREMENTS,
  type AmbitionTier,
  type SkillRoutingResult,
  type SpecialistSkill,
} from "./skillSystem.js";

/**
 * Deterministic design intelligence — zero LLM tokens.
 * Dreative makes the design decisions here (dial resolution, per-section layout
 * families, doctrine lints); the coding agent only executes the resulting plan.
 * Rules mirror skill/dreative/DESIGN.md.
 */

export interface DesignPlan {
  version: 2;
  /** resolved dials after brief + aesthetic defaults */
  dials: { variance: number; motion: number; density: number };
  aesthetic: string;
  tier: AmbitionTier;
  depth: TransformationDepth;
  sourceStrategy: SourceStrategy;
  register: PageRegister;
  structuralDelta: StructuralDelta;
  mobileBlueprint: MobileBlueprint;
  expression?: ExpressionContract;
  /** Existing section identities are inputs to the contract, not mechanically assigned compositions. */
  sections: { id: string; label: string; role: string; skills?: SpecialistSkill[] }[];
  /** compact executable directives for the agent */
  directives: string[];
  /** doctrine violations found in the current layout */
  lints: string[];
  /** specialist skill files the agent must read before designing (skills/<name>.md) */
  skills: SpecialistSkill[];
  verification: string[];
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

const STYLE_ONLY = /\b(colou?r|font|typograph|radius|shadow|gradient|animation|fade|slide|scale|hover|spacing|token)\b/i;
const STRUCTURAL_LANGUAGE = /\b(architecture|boundary|workflow|navigation|hierarchy|order|interaction|task|workspace|model|rebuild|recompose|replace|merge|move|remove)\b/i;

/** Blocking contract lints used by tests and agent-facing runtime plans. */
export function lintDesignPlan(plan: Pick<DesignPlan, "depth" | "structuralDelta" | "mobileBlueprint" | "tier" | "expression">): string[] {
  const lints: string[] = [];
  const delta = plan.structuralDelta;
  const deltaText = [delta.proposedModel, delta.proposedParadigm, delta.depthHonesty, ...delta.materialChanges].join(" ");
  if ((plan.depth === "restructure" || plan.depth === "reimagine") && (!STRUCTURAL_LANGUAGE.test(deltaText) || (STYLE_ONLY.test(deltaText) && !STRUCTURAL_LANGUAGE.test(delta.materialChanges.join(" ")))))
    lints.push(`${plan.depth} requires a concrete architectural or interaction-model delta; stylesheet and generic motion changes cannot satisfy it`);
  if (plan.depth !== "restyle" && delta.materialChanges.length < 2)
    lints.push(`${plan.depth} requires multiple concrete changes to composition, hierarchy, architecture, or interaction`);
  const mobileText = [plan.mobileBlueprint.mobileOnlyComposition, plan.mobileBlueprint.composition390, plan.mobileBlueprint.fallback320, plan.mobileBlueprint.stackingRejection].join(" ");
  if (/^\s*stack(?:ed)?(?:\s+vertically)?\s*$/i.test(plan.mobileBlueprint.mobileOnlyComposition) || !/\b(order|disclosure|navigation|task|action|media|thumb|viewport|recompose|context)\b/i.test(mobileText))
    lints.push("mobile blueprint must define a mobile-native composition; ‘stack vertically’ alone is blocking");
  if ((plan.tier === "expressive" || plan.tier === "award" || plan.tier === "experimental") && !plan.expression)
    lints.push(`${plan.tier} requires a project-specific expression contract or a documented intentional-calm exception in the direct plan`);
  if (plan.expression && /\b(fade|slide|scale|hover|gradient|large typography)\b/i.test(plan.expression.mechanism) && !/\b(state|selection|progress|navigation|transform|content|spatial)\b/i.test(plan.expression.communicates))
    lints.push("expression mechanism is decorative-only and does not communicate content, state, progression, selection, navigation, or transformation");
  return lints;
}

/** Build the compact, executable plan sent to the agent with design-page. */
export function buildDesignPlan(page: Page, brief: DesignBrief | undefined, assignedSkills?: SpecialistSkill[]): DesignPlan {
  const dials = resolveDials(brief);
  const aesthetic = brief?.aesthetic || "auto (infer per DESIGN.md, then commit)";
  const allowedSkills = assignedSkills ? new Set(resolveSkillDependencies(assignedSkills)) : undefined;
  const sections = (page.layout.children ?? []).map((s) => {
    const detected = resolveSkillDependencies(detectSpecialistSkills(blockTexts(s)));
    const secSkills = allowedSkills ? detected.filter((skill) => allowedSkills.has(skill)) : detected;
    const role = s.type === "nav" ? "navigation" : s.type === "footer" ? "closure" : s.type === "form" ? "task-input" : s.type === "hero" ? "orientation-or-promotion" : "content-or-task-support";
    return secSkills.length ? { id: s.id, label: s.label, role, skills: secSkills } : { id: s.id, label: s.label, role };
  });

  // page-level specialist skills: brief/prompt keywords + section hits + motion dial
  const requestedSkills = new Set<SpecialistSkill>([
    ...detectSpecialistSkills([brief?.vibe, brief?.notes, page.designPrompt]),
    ...sections.flatMap((s) => s.skills ?? []),
  ]);
  if (dials.motion >= 6) requestedSkills.add("motion");
  const skills = assignedSkills ? resolveSkillDependencies(assignedSkills) : resolveSkillDependencies(requestedSkills);
  const tier = resolveAmbitionTier({
    ...dials,
    aesthetic,
    texts: [brief?.vibe, brief?.notes, page.designPrompt, ...blockTexts(page.layout)],
  });
  const depth = depthFor(brief, page);
  const register = inferRegister(page);
  const delta = structuralDelta(page, depth, register);
  const mobile = mobileBlueprint(page, register);
  const expression = expressionContract(page, tier, register);

  const spacing = dials.density <= 3 ? "py-24/py-32 section gaps" : dials.density <= 6 ? "py-16/py-20" : "py-8/py-12, hairline dividers, mono numerals";
  const motionBudget =
    tier === "expressive" || tier === "award" || tier === "experimental"
      ? "write section motion treatments; concentrate structural/transformational choreography into a few hero moments with calm sections, mobile translations, and reduced-motion states"
      : dials.motion <= 3
      ? "hover/active states only, no scroll animation"
      : dials.motion <= 6
        ? "purposeful local motion; use structural transitions only where content changes state, with visible defaults"
        : "write section motion treatments; concentrate structural/transformational choreography into a few hero moments with calm sections, mobile translations, and reduced-motion states";

  const directives = [
    `aesthetic: ${aesthetic}; dials variance=${dials.variance} motion=${dials.motion} density=${dials.density}`,
    `spacing scale: ${spacing}`,
    `motion budget: ${motionBudget}`,
    `transformation depth: ${depth}; source strategy: ${sourceStrategyFor(depth)}; ambition remains independently ${tier}`,
    `page register: ${register}; compose for this page's task model rather than inheriting a shared marketing shell`,
    "choose the simplest mechanism that makes each intended transformation convincing; do not default blindly to fade/slide/scale or to WebGL/3D",
    "one accent color, one neutral family, one radius system, locked across ALL pages of this project",
    "section entries describe existing semantic roles only; author the proposed composition from the structural delta instead of cycling through layout families",
    "preserve routes, handlers, data flow, fields, states, accessibility, analytics, required copy, and public APIs; treat the existing rendered interface as a quality baseline and preserve, transform, or surpass its valuable typography, composition, motion, interaction, and brand equity without letting its DOM tree dictate the new composition",
    ...(dials.variance > 4 ? ["avoid centered-hero-over-gradient; use split or asymmetric composition"] : []),
    ...(skills.length
      ? [
          `specialist skills required: ${skills.join(", ")} — read skills/<name>.md (next to DESIGN.md) before writing code; sections tagged with "skills" get that treatment`,
        ]
      : []),
  ];

  return {
    version: 2,
    dials,
    aesthetic,
    tier,
    depth,
    sourceStrategy: sourceStrategyFor(depth),
    register,
    structuralDelta: delta,
    mobileBlueprint: mobile,
    ...(expression ? { expression } : {}),
    sections,
    directives,
    lints: [...lintLayout(page.layout), ...lintDesignPlan({ depth, structuralDelta: delta, mobileBlueprint: mobile, tier, expression })],
    skills,
    verification: TIER_REQUIREMENTS[tier],
  };
}

function depthFor(brief: DesignBrief | undefined, page: Page): TransformationDepth {
  if (brief?.transformationDepth) return brief.transformationDepth;
  const text = `${page.designPrompt ?? ""} ${brief?.notes ?? ""}`;
  if (/\breimagine\b/i.test(text)) return "reimagine";
  if (/\brestructure\b|\brebuild\b/i.test(text)) return "restructure";
  if (/\brelayout\b|\brecompose\b/i.test(text)) return "relayout";
  return "restyle";
}

export function sourceStrategyFor(depth: TransformationDepth): SourceStrategy {
  if (depth === "restyle") return "patch";
  if (depth === "relayout") return "recompose";
  return "rebuild-from-contracts";
}

export interface DesignSourceContext {
  strategy: SourceStrategy;
  previousFile?: string;
  behaviorReferenceFile?: string;
  compositionDirective: string;
}

export function buildDesignSourceContext(depth: TransformationDepth, generatedFile?: string): DesignSourceContext {
  const strategy = sourceStrategyFor(depth);
  if (strategy === "patch") {
    return { strategy, previousFile: generatedFile, compositionDirective: "Patch the existing composition while preserving its markup and interaction architecture." };
  }
  if (strategy === "recompose") {
    return {
      strategy,
      behaviorReferenceFile: generatedFile,
      compositionDirective: "Use the existing file for behavior and content inventory, but recompose ordering, hierarchy, and layout before styling.",
    };
  }
  return {
    strategy,
    behaviorReferenceFile: generatedFile,
    compositionDirective: "Create a from-scratch counterfactual independently from the previous visual tree, then reconcile it with routes, handlers, data flow, fields, states, accessibility, analytics, copy, public APIs, and the rendered interface's valuable design equity. Rebuild markup and component boundaries without lowering the approved concept's creative ambition.",
  };
}

function inferRegister(page: Page): PageRegister {
  const text = [page.name, page.designPrompt, ...blockTexts(page.layout)].join(" ").toLowerCase();
  if (/\b(login|sign in|sign up|password|authentication)\b/.test(text)) return "authentication";
  if (/\b(admin|moderation|manage users|cms)\b/.test(text)) return "administration";
  if (/\b(account|profile|order status|billing|settings)\b/.test(text)) return "account-status";
  if (/\b(search|select|checkout|order|booking|form|continue|payment|outlet)\b/.test(text)) return "task-transaction";
  if (/\b(error|empty|loading|not found)\b/.test(text)) return "system-state";
  if (/\b(dashboard|table|analytics|report|data)\b/.test(text)) return "data-dense-utility";
  if (/\b(catalog|browse|collection|discover|filter)\b/.test(text)) return "discovery-browse";
  return "marketing-storytelling";
}

function describeExisting(page: Page): string {
  const sections = (page.layout.children ?? []).map((section) => section.label).filter(Boolean);
  return sections.length ? sections.join(" followed by ") : page.layout.label;
}

function taskFor(page: Page): string {
  const form = (page.layout.children ?? []).find((section) => section.type === "form");
  const action = blockTexts(page.layout).find((text) => /\b(select|continue|submit|search|choose|buy|book|save|sign in)\b/i.test(text));
  return action ?? form?.label ?? `complete ${page.name}`;
}

function structuralDelta(page: Page, depth: TransformationDepth, register: PageRegister): StructuralDelta {
  const existing = describeExisting(page);
  const task = taskFor(page);
  if (depth === "restyle") {
    return {
      existingModel: existing,
      proposedModel: `${existing}, retained intentionally with a newly authored visual and state language`,
      existingParadigm: "Existing DOM order, component boundaries, and interaction flow",
      proposedParadigm: "The same interaction architecture with a coherent visual, type, surface, and authored-state treatment",
      materialChanges: ["Restyle tokens, typography, surfaces, responsive polish, and state presentation without claiming structural transformation"],
      survivingBoundaries: (page.layout.children ?? []).map((section) => section.label),
      rebuiltBoundaries: [],
      preservedContracts: ["Routes, handlers, data flow, field names, states, accessibility, analytics, copy, and public APIs"],
      retainedPatterns: [{ pattern: "Existing section and task order", rationale: "Restyle explicitly permits structural continuity." }],
      forbiddenCarryovers: ["Unexamined accessibility defects", "Decorative motion presented as structural change"],
      depthHonesty: "This is a restyle: structure is retained and the plan makes no relayout, restructure, or reimagine claim.",
    };
  }
  const proposedModel = register === "task-transaction"
    ? `A task-first ${page.name} workspace organized around “${task}”, with supporting context revealed at the point of decision`
    : depth === "reimagine"
      ? `A new ${page.name} experience model organized around its ${register.replaceAll("-", " ")} purpose rather than the inherited section sequence`
      : `A recomposed ${page.name} hierarchy organized by user intent rather than the inherited ${existing}`;
  const deep = depth === "restructure" || depth === "reimagine";
  return {
    existingModel: existing,
    proposedModel,
    existingParadigm: `Linear inherited composition: ${existing}`,
    proposedParadigm: register === "task-transaction" ? "Task-first contextual workspace with action and decision state in one flow" : "Intent-led page composition with page-specific hierarchy",
    materialChanges: deep
      ? [
          `Rebuild the page architecture around “${task}” instead of preserving the inherited section tree`,
          "Move supporting or promotional content after the primary task unless it is required for the decision",
          "Reconcile preserved behavior only after the new component boundaries exist",
        ]
      : ["Change section order and hierarchy", "Replace the inherited layout family with an intent-led composition", "Translate desktop grouping deliberately for mobile"],
    survivingBoundaries: ["Behavior, data, route, and accessibility contracts"],
    rebuiltBoundaries: deep ? (page.layout.children ?? []).filter((section) => !["nav", "footer"].includes(section.type)).map((section) => section.label) : ["Page composition boundary"],
    preservedContracts: ["Routes, handlers, data flow, field names, states, accessibility, analytics, required copy, and public APIs"],
    retainedPatterns: [{ pattern: "Semantic task controls", rationale: "Their behavior is contractual even when their visual grouping and DOM position change." }],
    forbiddenCarryovers: ["Inherited DOM hierarchy as the composition source", "Card shells and section order without page-specific rationale", "Desktop grouping copied directly to mobile"],
    depthHonesty: deep
      ? `${depth} changes page architecture and component boundaries; token, font, color, radius, shadow, and entrance-animation changes cannot satisfy it.`
      : "Relayout changes ordering, hierarchy, and layout family while preserving the underlying workflow and most component responsibilities.",
  };
}

function mobileBlueprint(page: Page, register: PageRegister): MobileBlueprint {
  const task = taskFor(page);
  const taskFirst = register === "task-transaction" || register === "authentication" || register === "data-dense-utility";
  return {
    primaryTask: task,
    firstViewportPurpose: taskFirst ? `Let the user begin “${task}” immediately, before promotional or decorative material` : `Establish the ${page.name} purpose and expose its primary next action`,
    contentOrder: taskFirst ? ["compact navigation/context", `controls and information required to ${task}`, "current state or result", "supporting explanation", "promotional or decorative material"] : ["identity and purpose", "primary action or navigation", "core content", "supporting content"],
    beforeFirstScroll: ["Page identity", `The control or information needed to ${task}`, "Primary action or current selection state"],
    primaryThumbAction: { action: task, placement: "Within the lower-thumb reach zone; sticky only when it does not cover content or duplicate navigation" },
    stickyElements: ["Only task-critical action or compact navigation; never duplicate the same CTA"],
    safeArea: "Inset fixed controls with env(safe-area-inset-bottom) and reserve matching content padding",
    navigationModel: "Compact mobile navigation appropriate to this page register, with no duplicate desktop navigation row",
    mobileOnlyComposition: taskFirst ? "Collapse supporting context into contextual disclosure while keeping task controls and state in one continuous decision surface" : "Use mobile pacing and disclosure designed around reading and thumb reach, not desktop columns",
    desktopTranslation: { retained: ["Required functionality and semantic content"], translated: ["Spatial grouping, navigation, media, and state transitions"], removed: ["Nonessential decorative blockers before the task"], replaced: ["Hover-only affordances with visible tap/focus controls"] },
    mediaStrategy: "Use task-supporting media at mobile scale; defer or remove decorative media that delays the primary task",
    motionStrategy: "Translate authored state changes to short, interruptible mobile transitions; preserve visible defaults and reduced motion",
    keyboardAndForms: "Keep focused fields and the primary action visible above the software keyboard; use appropriate input modes and no focus traps",
    composition390: `At 390×844, ${taskFirst ? "the task begins in the first viewport and its action remains reachable" : "identity, purpose, and primary navigation form a complete first viewport"}`,
    fallback320: "At 320px, remove nonessential decoration, allow labels to wrap, keep controls within the viewport, and avoid fixed minimum typography or widths",
    stackingRejection: "The mobile content order, disclosure, navigation, task action, and media treatment are explicitly recomposed; desktop columns are not merely stacked.",
    verificationChecks: [
      "no-horizontal-overflow", "no-clipped-content", "fixed-elements-clear-content", "safe-area-spacing",
      "primary-task-discoverable", "primary-action-reachable", "touch-targets", "software-keyboard-usable",
      "no-hover-only", "intentional-mobile-composition", "mobile-content-order", "motion-media-translated",
      "no-decorative-task-blocker",
    ],
  };
}

function expressionContract(page: Page, tier: AmbitionTier, register: PageRegister): ExpressionContract | undefined {
  if (tier !== "expressive" && tier !== "award" && tier !== "experimental") return undefined;
  const task = taskFor(page);
  return {
    mechanism: register === "task-transaction" ? `The user’s current “${task}” selection becomes the persistent context for the next task state` : `${page.name} navigation changes form to reflect the user’s current content or progression state`,
    communicates: register === "task-transaction" ? "Selection, operational state, and readiness to continue" : "Position, progression, and relationship between content states",
    projectFit: `The behavior is derived from ${page.name} and its ${register.replaceAll("-", " ")} role, rather than a reusable reveal effect.`,
    location: `The primary ${page.name} task and its transition to the next meaningful state`,
    mobileTranslation: "Keep the state-carrying behavior, shorten travel, and place feedback beside the thumb action",
    reducedMotion: "Render the communicated state directly with a short cross-state update and no spatial travel",
    fallback: "Semantic state text and conventional navigation preserve the complete task without animation",
    verification: "Verify that content or application state—not only opacity, translate, scale, color, or decoration—changes and remains understandable on mobile and reduced motion",
  };
}

export interface MultiPageDesignPlans {
  routing: SkillRoutingResult;
  coherence: RuntimeCoherence;
  pages: { pageId: string; plan: DesignPlan }[];
}

export interface RuntimeCoherence {
  globalVisualLanguage: string;
  globalInteractionLanguage: string;
  pages: { pageId: string; name: string; register: PageRegister; primaryTask: string }[];
  prohibitedRepeatedShells: string[];
}

export function buildRuntimeCoherence(pages: Page[], brief: DesignBrief | undefined): RuntimeCoherence {
  return {
    globalVisualLanguage: "Share tokens, type roles, material logic, and state markers without sharing one page composition.",
    globalInteractionLanguage: "Use consistent control feedback and continuity; let each page register define navigation, density, and task flow.",
    pages: pages.map((page) => {
      const register = inferRegister(page);
      return { pageId: page.id, name: page.name, register, primaryTask: taskFor(page) };
    }),
    prohibitedRepeatedShells: [
      "Oversized headline plus decorative image panel plus rounded card container on unrelated routes",
      "The same layout family assigned by page or section array position",
      "Pages differing only by headline, color, and image",
    ],
  };
}

/** Build page plans from a user-approved pool. Unselected optional skills are
 * suggestions only; explicit page assignments win. */
export function buildMultiPageDesignPlans(
  pages: Page[],
  brief: DesignBrief | undefined,
  selection: {
    selected: SpecialistSkill[];
    assignments?: Record<string, SpecialistSkill[]>;
    autoRouteUnassigned?: boolean;
  },
): MultiPageDesignPlans {
  const routing = routeSkillsAcrossPages({
    pages: pages.map((page) => ({
      id: page.id,
      texts: [page.name, page.designPrompt, brief?.vibe, brief?.notes, ...blockTexts(page.layout)],
    })),
    ...selection,
  });
  return {
    routing,
    coherence: buildRuntimeCoherence(pages, brief),
    pages: pages.map((page) => ({ pageId: page.id, plan: buildDesignPlan(page, brief, routing.byPage[page.id]) })),
  };
}
