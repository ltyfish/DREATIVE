import type { CanonicalPlan } from "./planGovernance.js";
import type { SpecialistSkill } from "./skillSystem.js";

export interface ExperienceFinding { check: string; message: string; }
const finding = (check: string, message: string): ExperienceFinding => ({ check, message });
const selected = (plan: CanonicalPlan, skill: SpecialistSkill) => plan.contract.selectedTreatments.includes(skill);
const exempt = (plan: CanonicalPlan, gate: string) => plan.contract.conceptExemptions.some((item) => item.gate === gate && item.approved);

export function validateExperienceDelivery(plan: CanonicalPlan): ExperienceFinding[] {
  const findings: ExperienceFinding[] = [];
  const ambition = plan.contract.workflow.ambition;
  const ambitious = ambition === "award" || ambition === "experimental" || plan.contract.allTreatmentsExplicit;
  const evidence = plan.execution.evidence;
  if (ambition !== "standard" && !plan.contract.experienceArc) findings.push(finding("experience-arc", `${ambition} requires a complete experience arc`));
  if (ambitious) {
    if (evidence.transformations.length === 0 && !exempt(plan, "transformation")) findings.push(finding("anti-static", "Award, Experimental or all-treatment work needs a materially different transformed state"));
    if (evidence.sceneHandoffs.length === 0 && !exempt(plan, "scene-handoff")) findings.push(finding("anti-static", "a structural section or scene handoff is missing"));
    if (evidence.meaningfulInteractions.length === 0 && !exempt(plan, "meaningful-interaction")) findings.push(finding("anti-static", "a user-controlled interaction must alter media, layout, viewpoint or meaningful state"));
    if (evidence.persistentSystemSections.length < 3 && !exempt(plan, "persistent-system")) findings.push(finding("anti-static", "one persistent concept system must develop across at least three sections"));
    if (evidence.pacing.length < 2 && !exempt(plan, "pacing")) findings.push(finding("anti-static", "intentional peak/rest pacing is not demonstrated"));
    if (evidence.mobileNative.length === 0) findings.push(finding("mobile", "the defining idea needs a mobile-native translation"));
    if (evidence.reducedMotion.length === 0) findings.push(finding("reduced-motion", "the reduced-motion composition must remain intentional"));
  }
  for (const skill of plan.contract.selectedTreatments) {
    const proofs = evidence.treatmentEvidence[skill] ?? [];
    if (proofs.length === 0) findings.push(finding("treatment-perceptibility", `selected treatment ${skill} has no perceptible delivery evidence`));
  }
  if (selected(plan, "motion")) {
    if (evidence.transformations.length === 0 || evidence.sceneHandoffs.length === 0) findings.push(finding("motion", "Motion cannot be satisfied by entrances, hover, tiny parallax or one isolated interaction"));
    if (evidence.motionVocabulary.length > 0 && evidence.motionVocabulary.every((item) => /^(fade|opacity|translate|scale|hover|tab-switch)$/i.test(item))) findings.push(finding("static-feeling", "motion made only of fades, translate, scale, hover or tab switching fails"));
  }
  if (selected(plan, "interaction") && evidence.meaningfulInteractions.length === 0) findings.push(finding("interaction", "Interaction requires input that changes meaningful media, layout, viewpoint or state"));
  if (selected(plan, "media")) {
    const browser = plan.execution.browserValidation;
    if (!browser) findings.push(finding("media", "Media requires browser-grounded loading and transformation validation"));
    else if (browser.visibleImages.some((item) => item.primary && (!item.complete || item.naturalWidth <= 0 || item.altFallbackVisible))) findings.push(finding("broken-media", "primary media is broken or showing visible alt fallback"));
  }
  if (selected(plan, "3d")) {
    const draws = plan.execution.browserValidation?.webglDraws ?? [];
    if (!draws.some((item) => item.drawCount > 0)) findings.push(finding("3d", "selected 3D requires a mounted, visibly rendered spatial/WebGL contribution"));
  }
  if (selected(plan, "immersive") && evidence.persistentSystemSections.length < 2) findings.push(finding("immersive", "selected Immersive requires continuity across multiple sections"));
  if (selected(plan, "cinematic") && evidence.sceneHandoffs.length === 0) findings.push(finding("cinematic", "selected Cinematic requires temporal pacing and a meaningful scene handoff"));
  if (selected(plan, "experimental") && (evidence.treatmentEvidence.experimental?.length ?? 0) < 2) findings.push(finding("experimental", "selected Experimental requires two or three purposeful provocations with implementation bindings"));
  const browser = plan.execution.browserValidation;
  if (browser) {
    if (browser.visibleImages.some((item) => !item.complete || item.naturalWidth <= 0)) findings.push(finding("broken-media", "every visible image must be complete with naturalWidth > 0"));
    if (browser.failedRequests.length || browser.unexpectedHttpErrors.length) findings.push(finding("runtime-assets", "failed font, image, video, model, sequence or unexpected HTTP resource responses were observed"));
    if (browser.emptyCanvases.length || browser.webglDraws.some((item) => item.drawCount <= 0)) findings.push(finding("canvas", "empty canvas or zero-draw WebGL scene observed"));
    if (browser.consoleErrors.length || browser.runtimeErrors.length) findings.push(finding("runtime", "uncaught console, hydration or runtime errors were observed"));
    if (browser.productionMediaMissing.length) findings.push(finding("production-media", "required media is missing from the production build"));
  } else if (ambitious || selected(plan, "media") || selected(plan, "3d")) findings.push(finding("browser-validation", "browser-grounded asset and runtime validation is required"));
  const conceptRequired = ambitious || (plan.contract.workflow.execution === "full-audit" && plan.contract.workflow.purpose === "dreative-dogfood");
  if (conceptRequired) {
    const checkpoint = plan.execution.checkpoints.conceptCheckpoint;
    if (!checkpoint || checkpoint.status !== "passed" || checkpoint.reviewer === "none" || [checkpoint.actualHero, checkpoint.downstreamSection, checkpoint.realVisualSystem, checkpoint.mainTemporalOrMediaIdea, checkpoint.mobile390, checkpoint.reducedMotion, checkpoint.realApplication].some((item) => !item))
      findings.push(finding("concept-checkpoint", "a real-app vertical slice with hero, downstream section, visual system, defining temporal/media idea, 390px mobile and reduced motion must pass"));
  }
  if (plan.contract.workflow.prototype === "required" && plan.execution.checkpoints.mechanismPrototype?.status !== "passed") findings.push(finding("mechanism-prototype", "Required prototype has not proved technical feasibility"));
  if (plan.contract.workflow.prototype === "required" && conceptRequired && !plan.execution.checkpoints.conceptCheckpoint) findings.push(finding("prototype-scope", "mechanism prototype evidence cannot substitute for concept validation"));
  return findings;
}
