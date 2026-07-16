import type { SpecialistSkill } from "./skillSystem.js";

export interface TreatmentDefinition {
  name: SpecialistSkill;
  explanation: string;
  dependencies: SpecialistSkill[];
  cost: "low" | "medium" | "high";
  risk: string;
  tensions: string[];
  substantive: string[];
  insufficient: string[];
}

export const TREATMENT_DEFINITIONS: TreatmentDefinition[] = [
  { name: "ux", explanation: "Keeps navigation, forms, states, accessibility and functional workflows honest.", dependencies: [], cost: "low", risk: "Low visual risk; high product risk if omitted.", tensions: [], substantive: ["Working routes, controls, keyboard paths and truthful states."], insufficient: ["A static screenshot with untested controls."] },
  { name: "mobile", explanation: "Translates the defining idea into a touch-native composition instead of stacking desktop sections.", dependencies: ["ux"], cost: "medium", risk: "Small viewports expose overlap, pinning and performance failures.", tensions: ["Fine-pointer effects require touch alternatives."], substantive: ["A designed 390px route with reachable actions and adapted media/motion."], insufficient: ["Desktop columns merely stacked vertically."] },
  { name: "refined", explanation: "Polishes typography, spacing, surfaces, visual hierarchy and material finish; it does not require the site to remain static.", dependencies: ["ux", "mobile"], cost: "low", risk: "Low runtime risk; can accidentally suppress selected expressive treatments.", tensions: ["Refined and Experimental are compatible, but refinement must discipline experimental peaks."], substantive: ["Visible craft, coherent hierarchy, intentional materials and resolved states."], insufficient: ["Using refinement as permission to remove motion, media or spatial ambition."] },
  { name: "motion", explanation: "Designs how the experience changes over time or scroll, including structural transitions and choreography, not only fade-in entrances.", dependencies: ["ux", "mobile"], cost: "medium", risk: "Competing tickers or scroll owners can cause jank and lifecycle bugs.", tensions: ["Multiple motion libraries or scroll owners can conflict."], substantive: ["Grounded start, intermediate, end and resolution states with at least one structural change."], insufficient: ["Fades, hover states, tiny parallax or one isolated draggable hero."] },
  { name: "interaction", explanation: "Makes pointer, touch and keyboard input visibly affect controls, media, layout or meaningful state.", dependencies: ["ux", "mobile"], cost: "medium", risk: "Fine-pointer behavior needs touch and keyboard equivalents.", tensions: ["Fine-pointer effects require touch alternatives."], substantive: ["Input alters media, layout, viewpoint, navigation model or meaningful state."], insufficient: ["Button presses and ordinary tab switches alone."] },
  { name: "media", explanation: "Produces and transforms real images or video through masks, layers, sequences, fragments, edited states or responsive media systems.", dependencies: ["ux", "mobile"], cost: "medium", risk: "Loading, decoding and missing-asset risk rise quickly.", tensions: ["3D, large media sequences and cinematic effects together have high loading, battery and mobile risk."], substantive: ["Key media loads and its internal regions or states visibly change."], insufficient: ["Moving or scaling one flat rectangle, or listing unused derivatives."] },
  { name: "3d", explanation: "Adds a real spatial or WebGL contribution with depth, lighting and a safe fallback.", dependencies: ["ux", "mobile"], cost: "high", risk: "High implementation, GPU, battery and mobile cost.", tensions: ["3D, large media sequences and cinematic effects together have high loading, battery and mobile risk."], substantive: ["A mounted, visibly rendered spatial/WebGL scene with measured fallback."], insufficient: ["CSS circles, shadows, a rotated photograph or an empty canvas."] },
  { name: "immersive", explanation: "Creates continuity across multiple sections so the site feels like one developing environment rather than separate slides.", dependencies: ["motion", "interaction", "media", "ux", "mobile"], cost: "high", risk: "Continuity increases scroll, state and mobile complexity.", tensions: ["Immersive and Cinematic overlap, so one should normally be primary."], substantive: ["A persistent system or environmental progression develops across multiple sections."], insufficient: ["One large hero interaction followed by unrelated static sections."] },
  { name: "cinematic", explanation: "Controls scene pacing, framing and handoffs across time; it can be bright, editorial or playful and does not imply dark visuals.", dependencies: ["motion", "interaction", "media", "ux", "mobile"], cost: "high", risk: "Media weight and timeline complexity can harm loading and mobile.", tensions: ["Immersive and Cinematic overlap, so one should normally be primary."], substantive: ["Temporal pacing with peaks, rests and at least one meaningful scene handoff."], insufficient: ["Large headings and static photographs."] },
  { name: "experimental", explanation: "Adds two or three purposeful unconventional behaviours while preserving clarity and usability.", dependencies: ["motion", "interaction", "media", "ux", "mobile"], cost: "high", risk: "Raises creative variance, implementation uncertainty and usability risk.", tensions: ["Experimental treatments must be limited to selected peaks.", "Refined and Experimental are compatible, but refinement must discipline experimental peaks."], substantive: ["Two or three selected provocations have real implementation bindings."], insufficient: ["Shipping every explored idea or using novelty labels without behavior."] },
];

export function treatment(name: SpecialistSkill): TreatmentDefinition {
  const found = TREATMENT_DEFINITIONS.find((item) => item.name === name);
  if (!found) throw new Error(`unknown treatment ${name}`);
  return found;
}

export function renderTreatmentSummary(selected: SpecialistSkill[], explicitAll = false): string {
  const lines = selected.map((name) => {
    const item = treatment(name);
    return [
      `${name}: ${item.explanation}`,
      `  Dependencies: ${item.dependencies.join(", ") || "none"}. Cost: ${item.cost}. Mobile/performance risk: ${item.risk}`,
      `  Tensions: ${item.tensions.join(" ") || "None beyond the shared runtime budget."}`,
      `  Substantive: ${item.substantive.join(" ")}`,
      `  Does not count: ${item.insufficient.join(" ")}`,
    ].join("\n");
  });
  if (explicitAll) lines.push(
    "All-treatment summary: use Immersive or Cinematic as the primary continuity owner, keep 3D and Experimental at selected peaks, and let Refined discipline the finish. Expect high loading, battery, mobile and integration risk. Confirm once before planning; no selected treatment may be silently pruned.",
  );
  return lines.join("\n");
}
