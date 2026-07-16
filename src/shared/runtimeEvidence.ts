import type { CanonicalPlan, RuntimeMechanismObservation, RuntimeStateSample } from "./planGovernance.js";
import type { VerificationReport } from "./artifacts.js";

export interface RuntimeEvidenceFinding { check: string; message: string; }
export interface StaticFeelingAssessment {
  score: number;
  significantMechanismIds: string[];
  postHeroMechanismIds: string[];
  assetTransformingMechanismIds: string[];
  findings: RuntimeEvidenceFinding[];
}

const finding = (check: string, message: string): RuntimeEvidenceFinding => ({ check, message });
const exactProgress = new Set([0, 25, 50, 75, 100]);
const ambitious = (plan: CanonicalPlan) =>
  plan.contract.workflow.ambition === "award"
  || plan.contract.workflow.ambition === "experimental"
  || plan.contract.allTreatmentsExplicit;
const selected = (plan: CanonicalPlan, treatment: string) => plan.contract.selectedTreatments.includes(treatment as never);

function sampleSetValid(samples: RuntimeStateSample[]): boolean {
  return samples.length === 5 && samples.every((sample) => exactProgress.has(sample.progress))
    && new Set(samples.map((sample) => sample.progress)).size === 5
    && new Set(samples.map((sample) => sample.artifactHash)).size >= 4
    && new Set(samples.map((sample) => sample.compositionStateHash)).size >= 3;
}

function changedSamples(observation: RuntimeMechanismObservation): RuntimeStateSample[] {
  return observation.samples.filter((sample) =>
    (sample.pixelDifferenceFromPrevious ?? 0) >= 0.06
    || (sample.structuralDifferenceFromPrevious ?? 0) >= 0.025);
}

function cameraTravel(observation: RuntimeMechanismObservation): number {
  const cameras = observation.samples.map((sample) => sample.camera).filter(Boolean) as NonNullable<RuntimeStateSample["camera"]>[];
  if (cameras.length < 2) return 0;
  const first = cameras[0].position;
  return Math.max(...cameras.slice(1).map((camera) =>
    Math.hypot(camera.position[0] - first[0], camera.position[1] - first[1], camera.position[2] - first[2])));
}

function dynamicTelemetry(observation: RuntimeMechanismObservation): boolean {
  const frames = new Set(observation.samples.map((sample) => sample.frameIndex).filter((value) => value !== undefined));
  const times = new Set(observation.samples.map((sample) => sample.mediaCurrentTime).filter((value) => value !== undefined));
  const masks = new Set(observation.samples.map((sample) => sample.maskProgress).filter((value) => value !== undefined));
  const uniforms = new Set(observation.samples.map((sample) => JSON.stringify(sample.uniforms ?? {})));
  const particles = new Set(observation.samples.map((sample) => JSON.stringify(sample.particleState ?? {})));
  return frames.size >= 3 || times.size >= 3 || masks.size >= 3 || uniforms.size >= 3 || particles.size >= 3 || cameraTravel(observation) >= 0.5;
}

function significant(observation: RuntimeMechanismObservation): boolean {
  if (!sampleSetValid(observation.samples) || observation.recordingIds.length === 0) return false;
  if (["ordinary-control", "decorative-motion"].includes(observation.mechanismFamily)) return false;
  if (changedSamples(observation).length < 2) return false;
  if (observation.mechanismFamily === "rigid-media-plane" && !dynamicTelemetry(observation)) return false;
  return observation.assetTransformsInternally || observation.pinnedOrControlledComposition || dynamicTelemetry(observation);
}

function channelUnion(observation: RuntimeMechanismObservation): Set<string> {
  return new Set(observation.samples.flatMap((sample) => sample.channels));
}

export function assessStaticFeeling(plan: CanonicalPlan): StaticFeelingAssessment {
  const findings: RuntimeEvidenceFinding[] = [];
  if (!ambitious(plan)) return { score: 100, significantMechanismIds: [], postHeroMechanismIds: [], assetTransformingMechanismIds: [], findings };
  const observations = plan.execution.runtimeObservations ?? [];
  const significantObservations = observations.filter(significant);
  const postHero = significantObservations.filter((item) => item.postHero);
  const transforming = significantObservations.filter((item) => item.assetTransformsInternally);
  const continuity = significantObservations.filter((item) => item.handoff?.persistedObjectOrState && item.handoff.ownerImplementation);
  const mobileAuthored = significantObservations.filter((item) => item.mobile.authored && !item.mobile.disabled && item.mobile.captureIds.length > 0);
  const controlled = significantObservations.filter((item) => item.pinnedOrControlledComposition);
  let score = 0;
  score += Math.min(30, significantObservations.length * 10);
  score += Math.min(20, postHero.length * 10);
  score += Math.min(20, transforming.length * 10);
  score += controlled.length ? 10 : 0;
  score += continuity.length >= 2 ? 10 : 0;
  score += significantObservations.length > 0 && mobileAuthored.length === significantObservations.length ? 10 : 0;

  if (significantObservations.length < 3) findings.push(finding("static-feeling", "ambitious delivery needs at least three significant controlled temporal mechanisms"));
  if (postHero.length < 2) findings.push(finding("static-feeling", "ambitious delivery needs at least two significant mechanisms after the hero"));
  if (transforming.length < 2) findings.push(finding("static-feeling", "the route does not contain two substantial asset-transforming moments"));
  if (!controlled.length) findings.push(finding("static-feeling", "no pinned or otherwise controlled composition demonstrates stable-viewport evolution"));
  if (continuity.length < 2) findings.push(finding("static-feeling", "typed handoff telemetry does not prove continuity across chapters"));
  if (observations.length === 0)
    findings.push(finding("mobile-motion-downgrade", "no typed mobile mechanism observations prove that defining motion was re-authored rather than flattened or disabled"));
  if (observations.some((item) => !["ordinary-control", "decorative-motion"].includes(item.mechanismFamily)
    && (!item.mobile.authored || item.mobile.disabled || item.mobile.captureIds.length === 0)))
    findings.push(finding("mobile-motion-downgrade", "one or more defining mechanisms are disabled or unproven on mobile"));
  for (const observation of observations) {
    if (!sampleSetValid(observation.samples)) findings.push(finding("runtime-telemetry", `${observation.id}: controlled 0/25/50/75/100 captures with distinct current-build hashes are required`));
    if (observation.mechanismFamily === "rigid-media-plane" && cameraTravel(observation) < 0.5 && !dynamicTelemetry(observation))
      findings.push(finding("3d-spatial-value", `${observation.id}: one rigid textured plane with micro motion is not substantial 3D`));
  }
  if (score < 70) findings.push(finding("static-feeling", `machine-grounded static-feeling score ${score}/100 is below the ambitious delivery threshold`));
  return {
    score,
    significantMechanismIds: significantObservations.map((item) => item.id),
    postHeroMechanismIds: postHero.map((item) => item.id),
    assetTransformingMechanismIds: transforming.map((item) => item.id),
    findings,
  };
}

export function validateAmbitiousRuntimeEvidence(plan: CanonicalPlan): RuntimeEvidenceFinding[] {
  if (!ambitious(plan)) return [];
  const findings = [...assessStaticFeeling(plan).findings];
  const observations = plan.execution.runtimeObservations ?? [];
  const significantObservations = observations.filter(significant);
  const packages = plan.execution.signatureMediaPackages ?? [];

  if (selected(plan, "media")) {
    const media = significantObservations.filter((item) => item.assetTransformsInternally);
    if (media.length < 2 || !media.some((item) => item.postHero))
      findings.push(finding("insufficient-media-transformation", "Media requires two runtime-proven asset transformations, including one after the hero"));
    if (plan.contract.workflow.ambition === "experimental" && packages.length === 0 && !plan.contract.conceptExemptions.some((item) => item.gate === "signature-media-package" && item.approved))
      findings.push(finding("signature-media-package", "Experimental + Media requires a Signature Media Production Package"));
    for (const mediaPackage of packages) {
      if (!mediaPackage.sourceAssets.length || !mediaPackage.derivatives.length || !mediaPackage.implementationConsumers.length
        || !mediaPackage.temporalEvidenceIds.length || !mediaPackage.mobileVariant || !mediaPackage.reducedMotionAsset)
        findings.push(finding("signature-media-package", `${mediaPackage.id}: source, derivatives, consumers, optimization, temporal proof, mobile and reduced-motion assets are required`));
    }
  }

  if (selected(plan, "3d")) {
    const spatial = significantObservations.filter((item) => item.spatialClassification !== "static-image");
    const substantial = spatial.some((item) =>
      item.spatialClassification === "model"
      || item.spatialClassification === "pre-rendered-angles"
      || item.spatialClassification === "frame-sequence"
      || cameraTravel(item) >= 0.5
      || item.samples.some((sample) => sample.channels.includes("depth") && sample.channels.includes("material")));
    if (!substantial) findings.push(finding("insufficient-3d-spatial-value", "3D requires meaningful viewpoint/depth/material development, persistence, or a real model/multi-angle sequence"));
    for (const item of spatial) if (item.performance.heavyChunkBytes >= 900_000 && !substantial)
      findings.push(finding("3d-value-cost", `${item.id}: heavy 3D runtime cost is not earned by visible spatial development`));
  }

  if (selected(plan, "cinematic")) {
    const coordinated = significantObservations.filter((item) => channelUnion(item).size >= 3);
    const handoffs = significantObservations.filter((item) => item.handoff?.targetMechanismId);
    if (!coordinated.length || !handoffs.length)
      findings.push(finding("insufficient-cinematic-development", "Cinematic requires a composition-level handoff and coordinated change across at least three channels"));
  }

  if (selected(plan, "immersive")) {
    const owners = new Map<string, Set<string>>();
    for (const item of significantObservations) if (item.handoff) owners.set(item.continuityOwner, new Set([...(owners.get(item.continuityOwner) ?? []), item.sectionId, item.handoff.targetMechanismId]));
    if (![...owners.values()].some((sections) => sections.size >= 3))
      findings.push(finding("immersive-continuity", "Immersive requires one implementation continuity owner with typed handoffs across at least three chapters"));
  }

  if (selected(plan, "experimental")) {
    for (const peak of plan.contract.experimentalPeaks) {
      const observation = significantObservations.find((item) => item.id === peak.id);
      if (!observation) findings.push(finding("insufficient-experimental-peaks", `${peak.id}: no significant runtime observation matches the selected peak`));
      else {
        if (!observation.nonObviousBehavior || !observation.neutralStylingStillSpecial)
          findings.push(finding("insufficient-experimental-peaks", `${peak.id}: ordinary behavior or styling-dependent novelty cannot satisfy Experimental`));
        if (observation.recordingIds.length === 0)
          findings.push(finding("insufficient-experimental-peaks", `${peak.id}: a representative start/active/resolved recording is required`));
      }
    }
  }

  const heavy = significantObservations.filter((item) => item.performance.averageFps < 45 || item.performance.worstFrameTimeMs > 50 || item.performance.longTasks > 3);
  if (heavy.length) findings.push(finding("performance-proof", `heavy mechanisms exceed the recorded runtime budget: ${heavy.map((item) => item.id).join(", ")}`));
  return findings;
}

export function validateRuntimeObservationGrounding(plan: CanonicalPlan, verification?: VerificationReport): RuntimeEvidenceFinding[] {
  if (!ambitious(plan)) return [];
  if (!verification) return [finding("runtime-grounding", "ambitious runtime observations require the current verify.json")];
  const findings: RuntimeEvidenceFinding[] = [];
  if ((plan.execution.runtimeObservations ?? []).length === 0) {
    const prose = plan.execution.evidence;
    if (prose.transformations.length || prose.sceneHandoffs.length || prose.meaningfulInteractions.length
      || prose.motionVocabulary.length || Object.keys(prose.treatmentObservations).length)
      findings.push(finding("self-authored-evidence", "positive transformation, handoff, interaction or treatment prose is not grounded in typed runtime telemetry and controlled pixel evidence"));
  }
  const evidence = new Map(verification.evidence.map((item) => [item.id, item]));
  for (const observation of plan.execution.runtimeObservations ?? []) {
    for (const sample of observation.samples) {
      const proof = evidence.get(sample.captureId);
      if (!proof) {
        findings.push(finding("runtime-grounding", `${observation.id}/${sample.progress}: capture ${sample.captureId} is absent from verify.json`));
        continue;
      }
      if (!["browser", "playwright", "devtools", "runtime-instrumentation"].includes(proof.proof?.captureSource ?? ""))
        findings.push(finding("runtime-grounding", `${sample.captureId}: controlled state is not browser/runtime grounded`));
      if (Number(proof.proof?.controlledProgress) !== sample.progress)
        findings.push(finding("runtime-grounding", `${sample.captureId}: verify progress does not match ${sample.progress}%`));
      if (proof.proof?.artifactHash !== sample.artifactHash)
        findings.push(finding("runtime-grounding", `${sample.captureId}: artifact hash does not match the runtime observation`));
      if (proof.proof?.compositionStateHash !== sample.compositionStateHash)
        findings.push(finding("runtime-grounding", `${sample.captureId}: composition-state hash is missing or mismatched`));
      if (!proof.proof?.observedProperties?.length)
        findings.push(finding("runtime-grounding", `${sample.captureId}: runtime properties are missing from verify.json`));
      if (sample.frameIndex !== undefined && proof.proof?.frameIndex !== sample.frameIndex)
        findings.push(finding("runtime-grounding", `${sample.captureId}: frame index is missing or mismatched`));
      if (sample.mediaCurrentTime !== undefined && proof.proof?.mediaCurrentTime !== sample.mediaCurrentTime)
        findings.push(finding("runtime-grounding", `${sample.captureId}: media currentTime is missing or mismatched`));
      if (sample.camera && JSON.stringify(proof.proof?.cameraState) !== JSON.stringify(sample.camera))
        findings.push(finding("runtime-grounding", `${sample.captureId}: camera telemetry is missing or mismatched`));
      if (sample.uniforms && JSON.stringify(proof.proof?.shaderUniforms) !== JSON.stringify(sample.uniforms))
        findings.push(finding("runtime-grounding", `${sample.captureId}: shader telemetry is missing or mismatched`));
      if (sample.particleState && JSON.stringify(proof.proof?.particleState) !== JSON.stringify(sample.particleState))
        findings.push(finding("runtime-grounding", `${sample.captureId}: particle telemetry is missing or mismatched`));
      if (sample.maskProgress !== undefined && proof.proof?.maskProgress !== sample.maskProgress)
        findings.push(finding("runtime-grounding", `${sample.captureId}: mask telemetry is missing or mismatched`));
    }
    for (const id of observation.recordingIds) {
      const proof = evidence.get(id);
      if (!proof?.proof?.recordingPath || !proof.proof.startTimestamp || !proof.proof.endTimestamp)
        findings.push(finding("runtime-grounding", `${observation.id}: recording ${id} is absent or lacks a bounded browser recording`));
    }
    for (const id of observation.mobile.captureIds) if (!evidence.has(id))
      findings.push(finding("runtime-grounding", `${observation.id}: mobile capture ${id} is absent from verify.json`));
    for (const id of observation.reducedMotion.captureIds) if (!evidence.has(id))
      findings.push(finding("runtime-grounding", `${observation.id}: reduced-motion capture ${id} is absent from verify.json`));
    for (const id of observation.reverse.evidenceIds) if (!evidence.has(id))
      findings.push(finding("runtime-grounding", `${observation.id}: reverse evidence ${id} is absent from verify.json`));
  }
  return findings;
}
