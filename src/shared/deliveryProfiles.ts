export type DeliveryProfileId = "efficient" | "recommended" | "showcase";
export type ReviewDepth = "fast" | "lean" | "full-audit";
// Technical implementation experiments; the visual-selection gate is separate.
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
    id: "recommended", label: "Recommended",
    promise: "A complete design and implementation for the specific product.",
    scope: "Generate distinct visual directions and plans, implement the user's selection faithfully, and refine the complete responsive route in the browser.",
    treatments: "Choose sourcing, generation, interaction and motion to serve the selected design. Honor an explicitly motion-led brief; ordinary designs need no signature effect.",
    review: "lean", prototype: "auto", referenceDefault: "supplied-or-scout",
    sourceDefault: "best-fit", packageDefault: "allow",
  },
  {
    id: "efficient", label: "Efficient",
    promise: "A narrower production scope or targeted improvement using existing resources.",
    scope: "Preserve the chosen design and focus effort on the requested change. Open design work still needs a visual choice unless already supplied or delegated.",
    treatments: "Use existing assets and mechanisms where suitable; retain usable responsive controls and visual care.",
    review: "fast", prototype: "skip", referenceDefault: "supplied-only",
    sourceDefault: "existing-only", packageDefault: "keep-existing",
  },
  {
    id: "showcase", label: "Showcase",
    promise: "An explicitly selected advanced production with deeper implementation and review.",
    scope: "Resolve ambitious visual and technical work across the selected experience, with a faithful mechanism prototype and the existing Showcase delivery contract.",
    treatments: "Select advanced media and motion only when they strengthen the design; there is no minimum count.",
    review: "full-audit", prototype: "required", referenceDefault: "supplied-and-scout",
    sourceDefault: "maximum", packageDefault: "allow",
  },
] as const;

export function renderDeliveryBrief(recommendation: DeliveryProfileId = "recommended"): string {
  const profile = deliveryProfile(recommendation);
  return [
    "Design visually → choose → build faithfully → refine in the browser.",
    "",
    "For an open brief, inspect the project and generate multiple distinct page design images with concrete plans. Show the actual images, recommend one, and stop for the user's selection before implementation.",
    "Each plan explains composition, content and task, imagery production, mobile adaptation, useful interaction/motion, feasibility and relative cost.",
    "After selection, obtain separate assets, build real responsive UI, and compare the browser render with the chosen design. Prototype technical uncertainty when needed; motion serves the design.",
    "Supplied selections, scoped fixes and explicit delegation take precedence. Missing generation must be disclosed rather than replaced with an imaginary mockup.",
    "",
    `Delivery profile: ${profile.label}. ${profile.promise}`,
    "Efficient, Recommended and Showcase are delivery profiles, not the visual directions the user chooses between. Infer routine settings; avoid an extra configuration interview.",
    "Use PLAN.md and references/VISUAL_DESIGN.md. Offer show detailed plan when requested.",
  ].join("\n");
}

export function renderConfigurationChoices(profileId: DeliveryProfileId): string {
  const p = deliveryProfile(profileId);
  return [
    `${p.label} delivery defaults (optional overrides):`,
    `Review depth: ${p.review}; References: ${p.referenceDefault}; Sources: ${p.sourceDefault}; Packages: ${p.packageDefault}.`,
    `Prototype for technical uncertainty: ${p.prototype}. This applies after visual selection; it does not skip the requested image-and-plan gate.`,
    "Honor existing source, cost and package restrictions. Infer ordinary settings from the brief rather than asking the user to configure them all.",
  ].join("\n");
}

export function renderDetailedPlanGuide(profileId: DeliveryProfileId): string {
  const p = deliveryProfile(profileId);
  return [
    `Detailed ${p.label} plan`,
    "1. Inspect product, audience, task, actual content, preserved behavior and available resources.",
    "2. Generate multiple structurally different visual directions. Pair each actual design image with composition, imagery, mobile, interaction/motion, execution approach and cost/risk notes.",
    "3. Recommend one and stop for selection unless the user already selected or explicitly delegated the choice. Profiles are not visual options.",
    "4. Carry the selected images and user changes into a compact implementation note. Translate spatial decisions into responsive layout, available typography, separate assets and live controls.",
    `5. Source/generate the required material and build a representative composition with its adjacent region. ${p.treatments}`,
    `6. Use a ${p.prototype} technical-prototype policy to resolve consequential uncertainty, without adding an automatic second approval stop.`,
    "7. Compare matching browser/reference states; refine the full desktop/mobile route, exercise the primary task and any motion/reduced-motion behavior, then finalize with the selected delivery profile.",
    "For explicitly selected Showcase, follow references/SHOWCASE.md and its existing mechanism contract. Report implementation evidence separately from the user's taste verdict.",
  ].join("\n");
}

export function deliveryProfile(id: DeliveryProfileId): DeliveryProfile {
  const profile = DELIVERY_PROFILES.find((candidate) => candidate.id === id);
  if (!profile) throw new Error(`unknown delivery profile: ${id}`);
  return profile;
}
