export type DeliveryProfileId = "efficient" | "recommended" | "showcase";
export type ReviewDepth = "fast" | "lean" | "full-audit";
export type PrototypePolicy = "skip" | "auto" | "required";

export interface DeliveryProfile {
  id: DeliveryProfileId;
  label: string;
  promise: string;
  scope: string;
  treatments: string;
  review: ReviewDepth;
  prototype: PrototypePolicy;
  referenceDefault: "supplied-or-scout" | "supplied-and-scout" | "supplied-only";
  sourceDefault: "best-fit" | "maximum" | "existing-only";
  packageDefault: "allow" | "keep-existing";
}

export const DELIVERY_PROFILES: readonly DeliveryProfile[] = [
  {
    id: "recommended",
    label: "Recommended",
    promise: "The direction the agent believes will produce the strongest result for this specific product.",
    scope: "A complete, coherent redesign with the treatments and mechanisms that genuinely improve the concept.",
    treatments: "Agent-selected; UX and Mobile always apply.",
    review: "lean",
    prototype: "auto",
    referenceDefault: "supplied-or-scout",
    sourceDefault: "best-fit",
    packageDefault: "allow",
  },
  {
    id: "efficient",
    label: "Efficient",
    promise: "The most token-efficient and implementation-efficient direction.",
    scope: "Small, high-value changes using the existing structure, assets, and stack wherever possible.",
    treatments: "UX, Mobile, and Refined; add another treatment only to fix the scoped experience.",
    review: "fast",
    prototype: "skip",
    referenceDefault: "supplied-only",
    sourceDefault: "existing-only",
    packageDefault: "keep-existing",
  },
  {
    id: "showcase",
    label: "Showcase",
    promise: "The absolute highest coherent creative and technical ceiling, visibly distinct from Recommended.",
    scope: "A flagship experience whose ambition is distributed beyond one isolated spectacle, using the strongest coherent combination of media, motion, interaction, spatial depth, and responsive craft.",
    treatments: "UX and Mobile always apply; every other treatment is selected only when it strengthens the premise. There is no minimum count.",
    review: "full-audit",
    prototype: "required",
    referenceDefault: "supplied-and-scout",
    sourceDefault: "maximum",
    packageDefault: "allow",
  },
] as const;

export function renderDeliveryBrief(recommendation: DeliveryProfileId = "recommended"): string {
  const ordered = [
    ...DELIVERY_PROFILES.filter((profile) => profile.id === recommendation),
    ...DELIVERY_PROFILES.filter((profile) => profile.id !== recommendation),
  ];
  return [
    "Choose a redesign direction:",
    "",
    ...ordered.flatMap((profile, index) => [
      `${index + 1}. ${profile.label}${profile.id === recommendation ? " — recommended" : ""}`,
      `   ${profile.promise}`,
      `   ${profile.scope}`,
      "",
    ]),
    "Reply with 1, 2, or 3. You can also say “show detailed plan”.",
  ].join("\n");
}

const mark = (selected: boolean): string => selected ? " — recommended" : "";

export function renderConfigurationChoices(profileId: DeliveryProfileId): string {
  const profile = deliveryProfile(profileId);
  return [
    `Configure ${profile.label}:`,
    "",
    "1. Review depth",
    `   Fast — one focused desktop/mobile pass${mark(profile.review === "fast")}`,
    `   Lean — full-page desktop/mobile, key interactions, and a correction pass${mark(profile.review === "lean")}`,
    `   Full Audit — Lean plus 320px, reduced motion, performance, routes, console/network, and final regression${mark(profile.review === "full-audit")}`,
    "",
    "2. References",
    `   Follow a website, URL, or file you provide${mark(profile.referenceDefault === "supplied-only")}`,
    `   Scout and adapt principles from relevant references${mark(profile.referenceDefault !== "supplied-only")}`,
    "   Use no external reference",
    "",
    "3. Sources",
    `   Existing assets only${mark(profile.sourceDefault === "existing-only")}`,
    `   Allow sourced/licensed images${mark(profile.sourceDefault === "best-fit")}`,
    `   Allow sourced and generated images; use video/3D if useful${mark(profile.sourceDefault === "maximum")}`,
    "   Ask before each new asset",
    "",
    "4. Packages",
    `   Allow focused package installation${mark(profile.packageDefault === "allow")}`,
    `   Keep the existing stack${mark(profile.packageDefault === "keep-existing")}`,
    "   Ask before installing",
    "",
    "5. Prototype",
    `   Skip${mark(profile.prototype === "skip")}`,
    `   Auto — only genuinely uncertain signature mechanisms${mark(profile.prototype === "auto")}`,
    `   Required — prototype the riskiest signature mechanism${mark(profile.prototype === "required")}`,
    "",
    "Reply “use recommended settings” or list any changes. Say “show detailed plan” for the full project-specific Creative Decision Brief.",
  ].join("\n");
}

export function renderDetailedPlanGuide(profileId: DeliveryProfileId): string {
  const profile = deliveryProfile(profileId);
  return [
    `Detailed ${profile.label} plan`,
    "",
    "Build a project-specific Creative Decision Brief with:",
    "1. Product truth/current state — audience, task, routes, content, subject vocabulary, behavior, assets, defects, and preservation.",
    "2. Selected direction — project-native premise, composition, type, material, media, motion/interaction grammar, continuity, and three product-only decisions.",
    "3. Reference synthesis — each adopted principle, deliberate differences, and the complete-fingerprint independence check.",
    `4. Workflow/resources — Fast/Lean/Full Audit, Skip/Auto/Required, references, sources, packages, and detected capability; recommend ${profile.review} + ${profile.prototype} for ${profile.label}.`,
    `5. Treatment guide and section allocation — project-specific use, cost, risk, insufficiency, post-hero peak, and continuity owner. ${profile.treatments}`,
    "6. Build architecture — signature mechanism, runtime ownership, component/asset pipeline, mobile and semantic fallbacks, accessibility, and performance.",
    "7. Observable review, risks, fallbacks, and one editable decision reply.",
    "Visible execution map — experience arc, section ownership, post-hero peak, continuity owner, and mobile transformation in roughly ten lines.",
    "Showcase ceiling — the highest coherent mechanism/media decision, prototype result, and why the delivered route is visibly beyond Recommended.",
    "Showcase final response — state `Showcase ceiling delivered:` and disclose materially rejected or replaced advanced treatments under `Not pursued:` with the reason.",
    "",
    "The brief must adapt every decision to the inspected project. Do not imitate a named site, emit a generic template, or require another implementation-contract approval.",
  ].join("\n");
}

export function deliveryProfile(id: DeliveryProfileId): DeliveryProfile {
  const profile = DELIVERY_PROFILES.find((candidate) => candidate.id === id);
  if (!profile) throw new Error(`unknown delivery profile: ${id}`);
  return profile;
}
