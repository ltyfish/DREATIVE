import type { CanonicalPlan } from "./planGovernance.js";
import type { SpecialistSkill } from "./skillSystem.js";
import { validateAmbitiousRuntimeEvidence } from "./runtimeEvidence.js";

export interface ExperienceFinding { check: string; message: string; }
const finding = (check: string, message: string): ExperienceFinding => ({ check, message });
const selected = (plan: CanonicalPlan, skill: SpecialistSkill) => plan.contract.selectedTreatments.includes(skill);
const exempt = (plan: CanonicalPlan, gate: string) => plan.contract.conceptExemptions.some((item) => item.gate === gate && item.approved);

export function validateExperienceDelivery(plan: CanonicalPlan): ExperienceFinding[] {
  const findings: ExperienceFinding[] = validateAmbitiousRuntimeEvidence(plan);
  const ambition = plan.contract.workflow.ambition;
  const ambitious = ambition === "award" || ambition === "experimental" || plan.contract.allTreatmentsExplicit;
  const evidence = plan.execution.evidence;
  const distribution = plan.contract.experienceDistribution ?? [];
  const mechanisms = plan.contract.mechanismFallbacks ?? [];
  const mechanismOutcomes = new Map(plan.execution.mechanisms.map((item) => [item.id, item]));
  if (ambition !== "standard" && !plan.contract.experienceArc) findings.push(finding("experience-arc", `${ambition} requires a complete experience arc`));
  if (ambitious) {
    if (evidence.transformations.length === 0 && !exempt(plan, "transformation")) findings.push(finding("anti-static", "Award, Experimental or all-treatment work needs a materially different transformed state"));
    if (evidence.sceneHandoffs.length === 0 && !exempt(plan, "scene-handoff")) findings.push(finding("anti-static", "a structural section or scene handoff is missing"));
    if (evidence.meaningfulInteractions.length === 0 && !exempt(plan, "meaningful-interaction")) findings.push(finding("anti-static", "a user-controlled interaction must alter media, layout, viewpoint or meaningful state"));
    if (evidence.persistentSystemSections.length < 3 && !exempt(plan, "persistent-system")) findings.push(finding("anti-static", "one persistent concept system must develop across at least three sections"));
    if (evidence.pacing.length < 2 && !exempt(plan, "pacing")) findings.push(finding("anti-static", "intentional peak/rest pacing is not demonstrated"));
    if (evidence.mobileNative.length === 0) findings.push(finding("mobile", "the defining idea needs a mobile-native translation"));
    if (evidence.reducedMotion.length === 0) findings.push(finding("reduced-motion", "the reduced-motion composition must remain intentional"));
    if (distribution.filter((item) => item.role === "peak").length < 2) findings.push(finding("experience-distribution", "Award, Experimental and all-treatment routes need multiple distributed experience peaks"));
    if (!distribution.some((item) => item.order > 0 && ["peak", "transformation"].includes(item.role))) findings.push(finding("hero-only", "the hero cannot be the only substantive experience event"));
    if (evidence.postFirstViewportEvents.length === 0) findings.push(finding("hero-only", "no substantive observed event occurs after the first viewport"));
  }
  for (const skill of plan.contract.selectedTreatments) {
    const proofs = evidence.treatmentEvidence[skill] ?? [];
    if (proofs.length === 0) findings.push(finding("treatment-perceptibility", `selected treatment ${skill} has no perceptible delivery evidence`));
  }
  if (selected(plan, "motion")) {
    if (evidence.transformations.length === 0 || evidence.sceneHandoffs.length === 0) findings.push(finding("motion", "Motion cannot be satisfied by entrances, hover, tiny parallax or one isolated interaction"));
    if (evidence.motionVocabulary.length > 0 && evidence.motionVocabulary.every((item) => /^(fade|opacity|translate|scale|hover|tab-switch)$/i.test(item))) findings.push(finding("static-feeling", "motion made only of fades, translate, scale, hover or tab switching fails"));
    const observed = evidence.treatmentObservations.motion;
    if (!observed || !observed.start.length || !observed.active.length || !observed.resolved.length) findings.push(finding("motion", "Motion needs observed structural start, active and resolved states"));
  }
  if (selected(plan, "interaction")) {
    if (evidence.meaningfulInteractions.length === 0) findings.push(finding("interaction", "Interaction requires input that changes meaningful media, layout, viewpoint or state"));
    const effects = evidence.treatmentObservations.interaction?.inputEffect ?? [];
    if (!effects.length || effects.every((item) => /\b(tab|button|carousel next|toggle)\b/i.test(item))) findings.push(finding("interaction", "ordinary tabs, buttons or a basic carousel do not satisfy selected Interaction"));
  }
  if (selected(plan, "media")) {
    const browser = plan.execution.browserValidation;
    if (!browser) findings.push(finding("media", "Media requires browser-grounded loading and transformation validation"));
    else if (browser.visibleImages.some((item) => item.primary && (!item.complete || item.naturalWidth <= 0 || item.altFallbackVisible))) findings.push(finding("broken-media", "primary media is broken or showing visible alt fallback"));
    const observed = evidence.treatmentObservations.media;
    if (!observed || !observed.start.length || !observed.active.length || !observed.resolved.length) findings.push(finding("media", "Media requires loaded media with visible start, transformed and resolved states; scale-only movement is insufficient"));
    else {
      const states = [...observed.start, ...observed.active, ...observed.resolved].map((item) => item.trim().toLowerCase());
      if (new Set(states).size < 3 || (states.some((item) => /scale|zoom|move/.test(item)) && !states.some((item) => /fragment|mask|frame|material|slice|region|sequence|reconstruct|displace|depth/.test(item))))
        findings.push(finding("media", "a static image with scale or position animation alone does not satisfy Media"));
    }
  }
  if (selected(plan, "3d")) {
    const draws = plan.execution.browserValidation?.webglDraws ?? [];
    if (!draws.some((item) => item.drawCount > 0)) findings.push(finding("3d", "selected 3D requires a mounted, visibly rendered spatial/WebGL contribution"));
    const classes = evidence.treatmentObservations["3d"]?.assetClassifications ?? [];
    if (!classes.some((item) => item !== "static-image")) findings.push(finding("3d", "3D evidence must honestly classify the contribution as a model, spatial cutout, billboard, frame set or media plane"));
  }
  if (selected(plan, "immersive") && evidence.persistentSystemSections.length < 2) findings.push(finding("immersive", "selected Immersive requires continuity across multiple sections"));
  if (selected(plan, "cinematic") && evidence.sceneHandoffs.length === 0) findings.push(finding("cinematic", "selected Cinematic requires temporal pacing and a meaningful scene handoff"));
  if (selected(plan, "experimental")) {
    if ((evidence.treatmentEvidence.experimental?.length ?? 0) < 2) findings.push(finding("experimental", "selected Experimental requires two or three purposeful provocations with implementation bindings"));
    for (const peak of plan.contract.experimentalPeaks ?? []) {
      const spreadPeak = plan.execution.checkpoints.adaptiveSpread?.peakEvidence.find((item) => item.peakId === peak.id);
      if (!spreadPeak || !spreadPeak.start.length || !spreadPeak.active.length || !spreadPeak.resolved.length) findings.push(finding("experimental-peak", `${peak.id}: critic-quality start, active and resolved evidence is missing`));
    }
  }
  for (const mechanism of mechanisms) {
    const outcome = mechanismOutcomes.get(mechanism.id);
    if (!outcome || ["pending", "in-progress"].includes(outcome.status)) findings.push(finding("mechanism-reconciliation", `${mechanism.id}: execution status remains ${outcome?.status ?? "missing"}`));
    else if (outcome.status === "fallback-triggered") {
      if (!outcome.triggerObserved || outcome.triggerEvidenceIds.length === 0) findings.push(finding("fallback-governance", `${mechanism.id}: fallback was claimed without observed trigger evidence`));
      if (mechanism.userReapprovalRequired && !outcome.approvalReference) findings.push(finding("fallback-governance", `${mechanism.id}: approved fallback requires an approval reference`));
    } else if (outcome.status === "approved-change" && !outcome.approvalReference) findings.push(finding("fallback-governance", `${mechanism.id}: approved change lacks an approval reference`));
    else if (outcome.status === "failed") findings.push(finding("mechanism-reconciliation", `${mechanism.id}: approved primary mechanism failed`));
    else if (outcome.status === "not-applicable" && plan.contract.experimentalPeaks.some((peak) => peak.id === mechanism.id)) findings.push(finding("mechanism-reconciliation", `${mechanism.id}: selected peak cannot become not-applicable without an approved change`));
    if (outcome?.substitutionUsed && !mechanism.allowedSubstitutions.includes(outcome.substitutionUsed) && !outcome.approvalReference)
      findings.push(finding("fallback-governance", `${mechanism.id}: unapproved substitution ${outcome.substitutionUsed}`));
  }
  const capability = new Map(plan.contract.capabilityPreflight?.creativeCapabilities.map((item) => [item.id, item]) ?? []);
  const capabilityActions = new Map((plan.execution.capabilityActions ?? []).map((item) => [item.capabilityId, item]));
  const videoRelevant = selected(plan, "media") && (selected(plan, "cinematic") || selected(plan, "experimental"))
    && plan.contract.videoDeliveryDecision?.decision !== "approved-exemption";
  if (videoRelevant) {
    for (const id of ["ffmpeg-processing", "video-transcoding", "frame-extraction"]) {
      const item = capability.get(id as any);
      if (item?.requiredAction === "install-or-select-fallback") {
        const action = capabilityActions.get(id);
        if (!action || !["succeeded", "selected"].includes(action.result))
          findings.push(finding("capability-action", `${id}: missing capability must produce a recorded installation attempt or selected high-fidelity fallback`));
      }
    }
  }
  const assetOutcomes = new Map(plan.execution.assets.map((item) => [item.id, item]));
  for (const asset of plan.contract.assetStrategy) {
    const outcome = assetOutcomes.get(asset.id);
    const sourcingId = /video/i.test(asset.intendedRole) ? "video-search" : asset.classification === "model" ? "3d-asset-search" : "image-search";
    const sourcingConfirmed = ["available", "available-through-confirmed-tool"].includes(capability.get(sourcingId as any)?.status ?? "");
    if (asset.priority === "generated" && asset.sourcingPolicy !== "generation-first-exemption" && sourcingConfirmed && asset.suitableExternalMediaCouldExist
      && !outcome?.sourcingAttempts.length && !outcome?.preSearchExemption)
      findings.push(finding("external-first-sourcing", `${asset.id}: generated media bypassed a confirmed sourcing capability without an asset-specific exemption`));
    if (asset.sourcingPolicy === "generation-first-exemption" && !outcome?.preSearchExemption && !asset.generationRationale)
      findings.push(finding("external-first-sourcing", `${asset.id}: generation-first execution lacks the approved concrete exemption`));
    if (outcome?.shipping && !outcome.survivedFinalImplementation) findings.push(finding("asset-integrity", `${asset.id}: shipping asset did not survive final implementation`));
    if (outcome?.usageLocations.length && outcome.usageLocations.length > 2 && !/persistent|travelling|continuity|narrative/i.test(asset.reusePolicy))
      findings.push(finding("asset-diversity", `${asset.id}: repeated media reuse lacks an approved persistent narrative role`));
  }
  const assets = plan.execution.assetObservation;
  if (assets) {
    const manifest = new Set(assets.manifestEntries);
    const disk = new Set(assets.filesOnDisk);
    const app = new Set(assets.applicationReferences);
    for (const entry of manifest) {
      if (!disk.has(entry)) findings.push(finding("asset-integrity", `manifest asset is missing on disk: ${entry}`));
      if (!app.has(entry) && !plan.execution.assets.some((item) => item.actualFiles.includes(entry) && item.shipping === false)) findings.push(finding("asset-integrity", `manifest asset is unused by the shipped application: ${entry}`));
    }
    for (const entry of app) if (!manifest.has(entry)) findings.push(finding("asset-integrity", `application references an asset absent from the manifest: ${entry}`));
    for (const intent of plan.contract.assetStrategy) {
      const asset = assetOutcomes.get(intent.id);
      if (!asset?.shipping || asset.actualFiles.length === 0) continue;
      const sourcePath = asset.actualFiles[0];
      const actual = assets.weights[sourcePath];
      if (actual === undefined) findings.push(finding("asset-performance", `${asset.id}: manifest weight is missing`));
      if (intent.sizeBudgetBytes !== undefined && actual !== undefined && actual > intent.sizeBudgetBytes) findings.push(finding("asset-performance", `${asset.id}: actual weight ${actual} exceeds declared budget ${intent.sizeBudgetBytes}`));
      if (["frame-sequence", "model", "webgl-media-plane"].includes(intent.classification) && !asset.mobileVariant) findings.push(finding("asset-performance", `${asset.id}: high-cost media needs a mobile variant or reduced strategy`));
      if (/video/i.test(intent.intendedRole) && !asset.poster) findings.push(finding("asset-performance", `${asset.id}: video needs a poster state`));
      if (asset.usageLocations.some((location) => !/hero|first|opening/i.test(location)) && !/lazy|defer|on-entry/i.test(asset.loadingStrategy ?? "")) findings.push(finding("asset-performance", `${asset.id}: below-fold media needs a lazy or staged loading strategy`));
    }
  } else if (plan.contract.workflow.execution === "full-audit" || plan.contract.workflow.purpose === "dreative-dogfood") findings.push(finding("asset-integrity", "Full Audit and Dogfood require manifest, disk and shipped-application asset reconciliation"));
  const run = plan.execution.run;
  if (run) {
    if (run.contractHash !== plan.approval.contractHash) findings.push(finding("run-identity", "current run belongs to another approved contract"));
    if (run.evidenceFiles.some((file) => !file.includes(run.runId))) findings.push(finding("run-identity", "evidence paths must live under the unique current run identity"));
  } else if (plan.contract.workflow.execution === "full-audit" || plan.contract.workflow.purpose === "dreative-dogfood") findings.push(finding("run-identity", "Full Audit and Dogfood require a unique .dreative/runs/<run-id>/ manifest"));
  const spreadRequired = ambition === "experimental" || plan.contract.workflow.purpose === "dreative-dogfood";
  if (spreadRequired && plan.execution.checkpoints.adaptiveSpread?.status !== "passed") findings.push(finding("adaptive-spread", "Adaptive Spread Validation must pass before critic and finalization"));
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
  if (conceptRequired) {
    const ambitionPrototype = plan.execution.checkpoints.ambitionPrototype;
    if (!ambitionPrototype || ambitionPrototype.status !== "passed"
      || !ambitionPrototype.representativeFinalQualityMedia || !ambitionPrototype.completePostHeroPeak
      || !ambitionPrototype.trueAssetTransformation || ambitionPrototype.recordingDurationSeconds < 10
      || ambitionPrototype.recordingDurationSeconds > 20 || !ambitionPrototype.desktopAuthored
      || !ambitionPrototype.mobileAuthored || !ambitionPrototype.independentCritic
      || ambitionPrototype.requiredRevisions.length > 0)
      findings.push(finding("ambition-prototype", "ambitious work requires a passed 10–20 second final-quality ambition prototype with a post-hero peak, true asset transformation, desktop/mobile authorship and independent criticism"));
  }
  const prototypeOutcomes = new Map(plan.execution.prototypes.map((item) => [item.id, item]));
  for (const prototype of plan.contract.prototypeContracts ?? []) {
    const outcome = prototypeOutcomes.get(prototype.id);
    if (prototype.required && outcome?.status !== "passed") findings.push(finding("mechanism-prototype", `${prototype.id}: required unresolved risk family is not proven`));
    if (outcome?.status === "passed" && (!outcome.observedResults.length || !outcome.implementationDecision.trim())) findings.push(finding("mechanism-prototype", `${prototype.id}: prototype must state observed results and implementation decision`));
  }
  if (plan.contract.workflow.prototype === "required" && conceptRequired && !plan.execution.checkpoints.conceptCheckpoint) findings.push(finding("prototype-scope", "mechanism prototype evidence cannot substitute for concept validation"));
  return findings;
}
