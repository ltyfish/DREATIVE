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

export type AmbitionTier = "solid" | "premium" | "expressive" | "award";

export interface SkillDefinition {
  name: SpecialistSkill;
  description: string;
  dependencies: SpecialistSkill[];
  signature: RegExp;
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
    description: "Premium clean business, DTC, and commerce design with restraint and strong photography.",
    dependencies: ["ux", "mobile"],
    signature: /\b(clean (and )?(modern|professional)|modern clean|business (site|website|use)|corporate|professional look|premium (minimal|clean)|dtc|d2c|e[- ]?commerce|ecommerce|shopify|calm|understated)\b/i,
  },
  {
    name: "motion",
    description: "Scroll choreography, entrances, kinetic type, springs, parallax, and transitions.",
    dependencies: ["ux", "mobile"],
    signature: /\b(animat|motion|parallax|scroll[- ]?(driven|trigger|story|choreo)|gsap|framer|lenis|marquee|kinetic|stagger|reveal|transition)\b/i,
  },
  {
    name: "interaction",
    description: "Hover craft, magnetic controls, cursor effects, tactile feedback, and state morphs.",
    dependencies: ["ux", "mobile"],
    signature: /\b(micro[- ]?interaction|hover (effect|state)s?|cursor|magnetic|tilt|spotlight|glow|ripple|tactile|interactive|draggable)\b/i,
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
    description: "Shader-graded experiential interfaces, living surfaces, gesture exploration, and sound.",
    dependencies: ["motion", "interaction", "media", "ux", "mobile"],
    signature: /\b(cinematic|experiential|unseen\.co|fluid (sim(ulation)?|distortion)|gpgpu|drag[- ]to[- ]explore|click ?(&|and) ?hold|film grain|graded|velocity[- ]reactive|sound design|ambient (audio|sound))\b/i,
  },
  {
    name: "experimental",
    description: "Unconventional composition, material shifts, provocations, and high-variance creative direction.",
    dependencies: ["motion", "interaction", "media", "ux", "mobile"],
    signature: /\b(experimental|crazy|bizarre|never seen before|more creative|wow factor|unconventional|unexpected|provocation)\b/i,
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

export function resolveAmbitionTier(input: {
  variance: number;
  motion: number;
  aesthetic?: string;
  texts?: (string | undefined)[];
}): AmbitionTier {
  const haystack = [input.aesthetic, ...(input.texts ?? [])].filter(Boolean).join(" ");
  if (/\b(award|awwwards|immersive|cinematic|experimental|unseen\.co)\b/i.test(haystack) || input.motion >= 9)
    return "award";
  if (input.motion >= 7 || input.variance >= 8) return "expressive";
  if (input.motion >= 4 || input.variance >= 5) return "premium";
  return "solid";
}

export const TIER_REQUIREMENTS: Record<AmbitionTier, string[]> = {
  solid: [
    "All existing behavior is preserved and the UX audit passes.",
    "Desktop and mobile layouts are verified with keyboard and reduced-motion coverage.",
  ],
  premium: [
    "Solid-tier requirements pass.",
    "The page has a clear design read, one signature detail, and a completed craft pass.",
    "Media is intentionally cropped/graded and interaction states are designed.",
  ],
  expressive: [
    "Premium-tier requirements pass.",
    "At least three distinct, purposeful motion or interaction moments ship with fallbacks.",
    "Heavy effects are measured on desktop and translated deliberately for mobile.",
  ],
  award: [
    "Expressive-tier requirements pass.",
    "The experience has a distinctive spatial or media system, not isolated decoration.",
    "Runtime, asset-weight, frame-time, occlusion, and fallback evidence is recorded.",
  ],
};
