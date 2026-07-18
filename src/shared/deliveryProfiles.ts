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
    promise: "The absolute highest creative and technical ceiling.",
    scope: "All treatments integrated into one flagship experience with maximum useful media, motion, interaction, spatial depth, and responsive craft.",
    treatments: "All ten: UX, Mobile, Refined, Motion, Interaction, Media, 3D, Immersive, Cinematic, and Experimental.",
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
    "1. Current state — routes, content, working behavior, assets, defects, and preservation.",
    "2. Selected direction — palette/material, typography, composition, media, motion, interaction, and why it fits.",
    `3. Workflow — show Fast/Lean/Full Audit, Skip/Auto/Required, references, sources, and packages; recommend ${profile.review} + ${profile.prototype} for ${profile.label}.`,
    `4. Treatment guide — all ten treatments with project-specific use, cost, risk, insufficiency, and decisions. ${profile.treatments}`,
    "5. Section allocation and tensions — route order, post-hero strength, continuity owner, mobile, performance, and accessibility.",
    "6. Capability/source preflight — supplied/missing assets and actual package, image, video, 3D, processing, and browser capabilities.",
    "7. Risks, fallbacks, and one editable decision reply.",
    "",
    "The brief must adapt every decision to the inspected project. Do not emit a generic template or require another implementation-contract approval.",
  ].join("\n");
}

export function deliveryProfile(id: DeliveryProfileId): DeliveryProfile {
  const profile = DELIVERY_PROFILES.find((candidate) => candidate.id === id);
  if (!profile) throw new Error(`unknown delivery profile: ${id}`);
  return profile;
}
