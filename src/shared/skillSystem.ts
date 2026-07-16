export type SpecialistSkill =
  | "ux"
  | "mobile"
  | "refined"
  | "motion"
  | "interaction"
  | "media"
  | "3d"
  | "immersive"
  | "cinematic"
  | "experimental";

export type AmbitionTier = "standard" | "expressive" | "award" | "experimental";
export type LegacyAmbitionTier = "solid" | "premium";

export interface SkillDefinition {
  name: SpecialistSkill;
  description: string;
  dependencies: SpecialistSkill[];
  signature: RegExp;
}

export interface SkillRoutingPage {
  id: string;
  texts: (string | undefined)[];
}

export interface SkillRoutingRequest {
  pages: SkillRoutingPage[];
  /** User-approved treatment pool. Unselected treatments are suggestions only. */
  selected: SpecialistSkill[];
  /** Explicit user assignments. These always win over automatic placement. */
  assignments?: Record<string, SpecialistSkill[]>;
  /** True enables legacy suggestion placement. Canonical v9 allocation is explicit and concept-led. */
  autoRouteUnassigned?: boolean;
}

export interface SkillRoutingResult {
  selected: SpecialistSkill[];
  resolved: SpecialistSkill[];
  byPage: Record<string, SpecialistSkill[]>;
  suggestions: Record<string, SpecialistSkill[]>;
  unassigned: SpecialistSkill[];
}

export const SKILL_DEFINITIONS: SkillDefinition[] = [
  {
    name: "ux",
    description: "Working navigation, forms, states, keyboard access, focus, and interaction audits.",
    dependencies: [],
    signature: /\b(ux|accessib|a11y|forms?|navigation|keyboard|focus|states?|dashboard|product ui)\b/i,
  },
  {
    name: "mobile",
    description: "Mobile-native composition, touch ergonomics, responsive effects, and phone verification.",
    dependencies: ["ux"],
    signature: /\b(mobile|phone|tablet|responsive|touch|thumb|small screen)\b/i,
  },
  {
    name: "refined",
    description: "A finish, material, and craft treatment for calm or clean work; independent of composition and motion ambition.",
    dependencies: ["ux", "mobile"],
    signature: /\b(clean(?: and)? (?:modern|professional|luxury|minimal(?:istic)?)|modern clean|clean luxury|minimal(?:istic)?|luxury|business (?:site|website|use)|corporate|professional(?: look)?|premium (?:minimal|clean)|dtc|d2c|e[- ]?commerce|ecommerce|shopify|calm|understated)\b/i,
  },
  {
    name: "motion",
    description: "Scroll choreography, entrances, kinetic type, springs, parallax, and transitions.",
    dependencies: ["ux", "mobile"],
    signature: /\b(animat\w*|motion|parallax|scroll[- ]?(driven|trigger|story|choreo)|gsap|framer|lenis|marquee|kinetic|stagger|reveal|transition)\b/i,
  },
  {
    name: "interaction",
    description: "Hover craft, magnetic controls, cursor effects, tactile feedback, and state morphs.",
    dependencies: ["ux", "mobile"],
    signature: /\b(micro[- ]?interaction|hover (effect|state)s?|cursor|magnetic|tilt|spotlight|glow|ripple|tactile|interactive|draggable|authored|memorable|visually striking|impressive)\b/i,
  },
  {
    name: "media",
    description: "Generated and sourced image/video production, grading, motion treatments, and media planes.",
    dependencies: ["ux", "mobile"],
    signature: /\b(generated? (image|video|media)|hero video|image treatment|media plane|gallery|photography|video loop|distortion|living thumbnail)\b/i,
  },
  {
    name: "3d",
    description: "Three.js/R3F, WebGL, shaders, particles, models, lighting, and robust fallbacks.",
    dependencies: ["ux", "mobile"],
    signature: /\b(3d|three\.?js|webgl|r3f|shader|glsl|particles?|point ?cloud|globe|mesh gradient|orbit|spline)\b/i,
  },
  {
    name: "immersive",
    description: "Persistent spatial stages, preloaders, scene transitions, and scroll-as-journey.",
    dependencies: ["motion", "interaction", "media", "ux", "mobile"],
    signature: /\b(immersive|award[- ]?(site|winning)|awwwards|spatial|scene[- ]?based|world|camera (move|travel|path)|preloader|scroll (journey|story|as travel)|explorable|experience site)\b/i,
  },
  {
    name: "cinematic",
    description: "Scene-based pacing, atmospheric transitions, living media, and intentional framing in any tonal register.",
    dependencies: ["motion", "interaction", "media", "ux", "mobile"],
    signature: /\b(cinematic|experiential|unseen\.co|fluid (sim(ulation)?|distortion)|gpgpu|drag[- ]to[- ]explore|click ?(&|and) ?hold|film grain|graded|velocity[- ]reactive|sound design|ambient (audio|sound))\b/i,
  },
  {
    name: "experimental",
    description: "Unconventional composition, material shifts, provocations, and high-variance creative direction.",
    dependencies: ["motion", "interaction", "media", "ux", "mobile"],
    signature: /\b(experimental|crazy|bizarre|never seen before|more creative|creative|unique|wow factor|unconventional|unexpected|provocation)\b/i,
  },
];

const BY_NAME = new Map(SKILL_DEFINITIONS.map((skill) => [skill.name, skill]));

export function detectSpecialistSkills(texts: (string | undefined)[]): SpecialistSkill[] {
  const haystack = texts.filter(Boolean).join("\n");
  return SKILL_DEFINITIONS.filter((skill) => skill.signature.test(haystack)).map((skill) => skill.name);
}

export function resolveSkillDependencies(requested: Iterable<SpecialistSkill>): SpecialistSkill[] {
  const resolved = new Set<SpecialistSkill>(["ux", "mobile"]);
  const visit = (name: SpecialistSkill) => {
    if (resolved.has(name)) return;
    for (const dependency of BY_NAME.get(name)?.dependencies ?? []) visit(dependency);
    resolved.add(name);
  };
  for (const name of requested) visit(name);
  return SKILL_DEFINITIONS.map((skill) => skill.name).filter((name) => resolved.has(name));
}

function skillScore(name: SpecialistSkill, texts: (string | undefined)[]): number {
  const definition = BY_NAME.get(name);
  if (!definition) return 0;
  const haystack = texts.filter(Boolean).join("\n");
  const flags = definition.signature.flags.includes("g") ? definition.signature.flags : `${definition.signature.flags}g`;
  return [...haystack.matchAll(new RegExp(definition.signature.source, flags))].length;
}

/**
 * Hybrid multi-page routing: user selection is authoritative, explicit page
 * assignments are locked, and only selected-but-unassigned treatments are
 * placed automatically. Detected unselected skills are returned as suggestions
 * and never activated silently.
 */
export function routeSkillsAcrossPages(request: SkillRoutingRequest): SkillRoutingResult {
  const selected = [...new Set(request.selected)];
  const resolved = resolveSkillDependencies(selected);
  const byPageSets = new Map(request.pages.map((page) => [page.id, new Set<SpecialistSkill>(["ux", "mobile"])]));
  for (const [pageId, skills] of Object.entries(request.assignments ?? {})) {
    const target = byPageSets.get(pageId);
    if (!target) continue;
    for (const skill of skills) {
      if (!resolved.includes(skill)) continue;
      for (const dependency of resolveSkillDependencies([skill])) target.add(dependency);
    }
  }

  const optionalSelected = selected.filter((skill) => skill !== "ux" && skill !== "mobile");
  const unassigned = optionalSelected.filter((skill) => ![...byPageSets.values()].some((skills) => skills.has(skill)));
  if (request.autoRouteUnassigned === true && request.pages.length > 0) {
    for (const skill of unassigned) {
      const ranked = request.pages
        .map((page, index) => ({
          page,
          index,
          score: skillScore(skill, page.texts),
          load: [...(byPageSets.get(page.id) ?? [])].filter((name) => name !== "ux" && name !== "mobile").length,
        }))
        .sort((a, b) => b.score - a.score || a.load - b.load || a.index - b.index);
      const target = byPageSets.get(ranked[0].page.id)!;
      for (const dependency of resolveSkillDependencies([skill])) target.add(dependency);
    }
  }

  const suggestions: Record<string, SpecialistSkill[]> = {};
  for (const page of request.pages) {
    suggestions[page.id] = detectSpecialistSkills(page.texts).filter((skill) => !resolved.includes(skill));
  }

  const byPage = Object.fromEntries(
    request.pages.map((page) => [
      page.id,
      SKILL_DEFINITIONS.map((definition) => definition.name).filter((name) => byPageSets.get(page.id)?.has(name)),
    ]),
  );
  return {
    selected,
    resolved,
    byPage,
    suggestions,
    unassigned: request.autoRouteUnassigned === true ? [] : unassigned,
  };
}

export function resolveAmbitionTier(input: {
  variance: number;
  motion: number;
  aesthetic?: string;
  texts?: (string | undefined)[];
}): AmbitionTier {
  const haystack = [input.aesthetic, ...(input.texts ?? [])].filter(Boolean).join(" ");
  if (/\b(experimental|unconventional|provocation)\b/i.test(haystack)) return "experimental";
  if (/\b(award|awwwards|immersive|cinematic|unseen\.co)\b/i.test(haystack) || input.motion >= 9)
    return "award";
  if (input.motion >= 7 || input.variance >= 8 || /\b(unique|creative|impressive|visually striking|authored|memorable)\b/i.test(haystack) && /\b(animat|motion|interactive|smooth|choreograph)\b/i.test(haystack)) return "expressive";
  return "standard";
}

export const TIER_REQUIREMENTS: Record<AmbitionTier, string[]> = {
  standard: [
    "All existing behavior is preserved and the UX audit passes.",
    "Desktop and mobile layouts are verified with keyboard and reduced-motion coverage.",
  ],
  expressive: [
    "Standard ambition requirements pass.",
    "At least three distinct, purposeful motion or interaction moments ship with fallbacks.",
    "Heavy effects are measured on desktop and translated deliberately for mobile.",
  ],
  award: [
    "Expressive-tier requirements pass.",
    "The experience has a distinctive spatial, media, typographic, material, or interactive system, not isolated decoration; 3D is optional.",
    "Runtime, asset-weight, frame-time, occlusion, and fallback evidence is recorded.",
  ],
  experimental: [
    "Award requirements pass.",
    "Two or three purposeful unconventional provocations ship at selected peaks without damaging clarity.",
  ],
};
