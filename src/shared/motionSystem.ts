import type {
  DirectDesignPlan,
  MediaTransformation,
  MotionExecutionMoment,
  StaticFeelingReview,
  VerificationEvidence,
  VerificationReport,
  VisualCheckpoint,
} from "./artifacts.js";

const MOTION_SKILLS = new Set(["motion", "interaction", "immersive", "cinematic", "experimental", "3d"]);
const VAGUE = /^(?:smooth animation|subtle movement|gsap effects?|cinematic reveal|cool distortion|add a shader|use particles|image reveal on scroll|parallax the background|add a frame sequence)[.!]?$/i;
const BASIC_ONLY = /\b(?:opacity|fade|translate|slide|scale|stagger|light parallax|hover scale)\b/i;
const COMPOSITION_CHANGE = /\b(?:mask|clip|pixel|fragment|fold|tear|slice|smear|refract|dissolv|rebuild|depth|layer|pin|persist|handoff|morph|reorder|layout|composition|geometry|camera|type|image sequence|canvas|svg|shader|media)\b/i;
const DISABLED_MOBILE = /^(?:disable[sd]?|removed?|none|static only|turn(?:ed)? off)(?: on mobile)?[.!]?$/i;

function concrete(value: unknown, minimum = 12): value is string {
  return typeof value === "string" && value.trim().length >= minimum && !VAGUE.test(value.trim());
}

function unique(values: string[]): boolean {
  return new Set(values).size === values.length;
}

export function motionIsSelected(plan: Pick<DirectDesignPlan, "skills" | "motionMoments">): boolean {
  return plan.skills?.some((skill) => MOTION_SKILLS.has(skill)) || (plan.motionMoments?.length ?? 0) > 0;
}

function validateMoment(moment: MotionExecutionMoment, pages: Map<string, Set<string>>, prefix: string): string[] {
  const errors: string[] = [];
  if (!concrete(moment.id, 3)) errors.push(`${prefix}.id needs a stable identifier`);
  if (!pages.get(moment.pageId)?.has(moment.sectionId)) errors.push(`${prefix} references unknown page/section ${moment.pageId}/${moment.sectionId}`);
  if (!["decorative", "structural", "transformational"].includes(moment.class)) errors.push(`${prefix}.class is invalid`);
  if (!concrete(moment.driver, 3)) errors.push(`${prefix}.driver must name the actual input`);
  for (const key of ["owner", "staticComposition", "startState", "intermediateState", "endState", "handoff", "purpose", "renderingMechanism", "desktop", "mobile", "reducedMotion", "primaryImplementation", "runtimeFallback"] as const) {
    if (!concrete(moment[key])) errors.push(`${prefix}.${key} must be concrete and implementation-ready`);
  }
  if (!concrete(moment.implementationFile, 3)) errors.push(`${prefix}.implementationFile must name a project file`);
  if (!concrete(moment.implementationComponent, 3)) errors.push(`${prefix}.implementationComponent must name the owning component`);
  if (typeof moment.mobile === "string" && DISABLED_MOBILE.test(moment.mobile.trim())) errors.push(`${prefix}.mobile must be re-authored, not merely disabled`);
  if (!Array.isArray(moment.observedProperties) || moment.observedProperties.length === 0 || moment.observedProperties.some((item) => !concrete(item, 3))) errors.push(`${prefix}.observedProperties must name measurable state properties`);
  if (!Array.isArray(moment.successCriteria) || moment.successCriteria.length === 0 || moment.successCriteria.some((item) => !concrete(item, 20) || VAGUE.test(item))) errors.push(`${prefix}.successCriteria must describe externally observable outcomes`);
  if (!Array.isArray(moment.requiredEvidenceIds) || moment.requiredEvidenceIds.length === 0 || !unique(moment.requiredEvidenceIds)) errors.push(`${prefix}.requiredEvidenceIds must be unique and non-empty`);
  const criteria = Array.isArray(moment.successCriteria) ? moment.successCriteria : [];
  if ((moment.class === "structural" || moment.class === "transformational") && BASIC_ONLY.test([moment.startState, moment.intermediateState, moment.endState, moment.renderingMechanism, ...criteria].filter(Boolean).join(" ")) && !COMPOSITION_CHANGE.test([moment.intermediateState, moment.endState, ...criteria].filter(Boolean).join(" "))) errors.push(`${prefix} claims ${moment.class} motion using only basic transforms`);
  return errors;
}

const STATIC_FEELING_KEYS = ["developsWithoutEntrances", "firstViewportMeaningfulResponse", "beyondOpacityAndPosition", "crossSectionInfluence", "signatureDevelops", "brandSpecificMotion", "memorableSequence", "primarilyStaticStack"] as const;

function validateStaticFeeling(review: StaticFeelingReview | undefined, prefix: string, evidence?: Map<string, VerificationEvidence>): string[] {
  if (!review) return [`${prefix} is required`];
  const errors: string[] = [];
  const referenced: VerificationEvidence[] = [];
  for (const key of STATIC_FEELING_KEYS) {
    const answer = review[key];
    const expected = key === "primarilyStaticStack" ? false : true;
    if (!answer || answer.answer !== expected) errors.push(`${prefix}.${key}.answer must be ${expected}`);
    if (!answer || !concrete(answer.observation, 20)) errors.push(`${prefix}.${key}.observation must describe the visible result`);
    if (!answer || !Array.isArray(answer.evidenceIds) || answer.evidenceIds.length === 0) {
      errors.push(`${prefix}.${key}.evidenceIds must ground this answer`);
      continue;
    }
    if (evidence) for (const id of answer.evidenceIds) {
      const item = evidence.get(id);
      if (!item) errors.push(`${prefix}.${key} references missing evidence ${id}`);
      else if (item.status !== "pass") errors.push(`${prefix}.${key} references non-passing evidence ${id}`);
      else if (!["motion", "interaction", "media-transformation"].includes(item.kind ?? "") || !temporalProof(item)) errors.push(`${prefix}.${key} evidence ${id} is not grounded temporal proof`);
      else referenced.push(item);
    }
  }
  if (evidence && !referenced.some((item) => item.viewportClass === "desktop")) errors.push(`${prefix} requires passing desktop temporal evidence`);
  if (evidence && !referenced.some((item) => item.viewportClass === "mobile")) errors.push(`${prefix} requires passing mobile temporal evidence`);
  return errors;
}

function validateTransformation(item: MediaTransformation, momentIds: Set<string>, prefix: string): string[] {
  const errors: string[] = [];
  if (!concrete(item.id, 3) || !concrete(item.sourceAsset, 3) || !concrete(item.implementationFile, 3)) errors.push(`${prefix} requires an id, named source asset, and implementation file`);
  if (!momentIds.has(item.motionMomentId)) errors.push(`${prefix}.motionMomentId references an unknown motion moment`);
  if (!Array.isArray(item.candidates) || item.candidates.length !== 3) errors.push(`${prefix}.candidates must contain exactly three original transformation candidates`);
  const selected = (item.candidates ?? []).filter((candidate) => candidate.selected);
  if (selected.length !== 1 || selected[0]?.id !== item.selectedCandidateId) errors.push(`${prefix} must select exactly one recorded candidate`);
  for (const [index, candidate] of (item.candidates ?? []).entries()) {
    for (const key of ["visitorExperience", "brandRationale", "sourceAsset", "driver", "startState", "intermediateState", "endState", "desktopFeasibility", "mobile", "reducedMotion", "performanceRisk", "fallback"] as const) if (!concrete(candidate[key])) errors.push(`${prefix}.candidates[${index}].${key} is vague`);
    if (!candidate.selected && !concrete(candidate.rejectionReason)) errors.push(`${prefix}.candidates[${index}] needs a rejection reason`);
    if (!Array.isArray(candidate.requiredDerivatives) || candidate.requiredDerivatives.length === 0) errors.push(`${prefix}.candidates[${index}] must name required derivatives`);
  }
  if (!(item.mechanismComparison ?? []).some((entry) => entry.decision === "selected") || (item.mechanismComparison ?? []).some((entry) => !concrete(entry.feasibility) || !concrete(entry.reason))) errors.push(`${prefix}.mechanismComparison must select and justify the simplest capable mechanism`);
  if (!Array.isArray(item.derivatives) || item.derivatives.length === 0) errors.push(`${prefix}.derivatives must describe the asset pipeline`);
  for (const [index, derivative] of (item.derivatives ?? []).entries()) {
    for (const key of ["id", "path", "sourceAsset", "productionMethod", "dimensions", "aspectRatio", "format", "expectedUse", "optimizationTarget", "implementationConsumer"] as const) if (!concrete(derivative[key], 3)) errors.push(`${prefix}.derivatives[${index}].${key} is missing`);
    if (!Array.isArray(derivative.evidenceIds)) errors.push(`${prefix}.derivatives[${index}].evidenceIds must be recorded`);
    if (derivative.status === "planned") errors.push(`${prefix}.derivatives[${index}] cannot remain planned at completion`);
    if (derivative.status === "shipped" && (!Array.isArray(derivative.evidenceIds) || derivative.evidenceIds.length === 0)) errors.push(`${prefix}.derivatives[${index}] shipped without evidence`);
  }
  const selectedMechanism = item.mechanismComparison?.find((entry) => entry.decision === "selected")?.mechanism;
  if (selectedMechanism === "image sequence" && !item.frameSequence) errors.push(`${prefix} selects an image sequence without a frame-production plan`);
  if ((item.derivatives ?? []).some((entry) => entry.aiInstruction) && !concrete(item.consistencyInspection, 20)) errors.push(`${prefix} AI-assisted derivatives require a consistency inspection`);
  if (!Array.isArray(item.prototypeEvidenceIds) || item.prototypeEvidenceIds.length === 0 || !Array.isArray(item.finalEvidenceIds) || item.finalEvidenceIds.length === 0) errors.push(`${prefix} requires prototype and final evidence`);
  return errors;
}

function validInterval(start: unknown, end: unknown): boolean {
  return typeof start === "string" && typeof end === "string" && !Number.isNaN(Date.parse(start)) && !Number.isNaN(Date.parse(end)) && Date.parse(end) > Date.parse(start);
}

function temporalProof(item: VerificationEvidence, requireVisualCapture = false): boolean {
  const proof = item.proof;
  const recording = Boolean(proof.recordingPath && validInterval(proof.startTimestamp, proof.endTimestamp));
  const trace = Boolean(proof.tracePath && validInterval(proof.startTimestamp, proof.endTimestamp));
  const groundedSample = Boolean(proof.artifactPath || (proof.command && proof.exitCode === 0) || proof.playwrightTestId || proof.tracePath || proof.captureManifestPath);
  const visualCapture = Boolean(proof.artifactPath && /\.(?:png|jpe?g|webp|avif|gif)$/i.test(proof.artifactPath));
  const sampled = proof.controlledProgress !== undefined && (proof.observedProperties?.length ?? 0) > 0 && concrete(proof.expectedState) && concrete(proof.observedState) && groundedSample && (!requireVisualCapture || visualCapture);
  return proof.controlledProgress !== undefined ? sampled : recording || trace;
}

export function validateMotionExecution(plan: DirectDesignPlan, verification?: VerificationReport): string[] {
  if (plan.version !== 5 || plan.doctrineVersion !== 5) return [];
  const errors: string[] = [];
  const selected = motionIsSelected(plan);
  const ambitious = plan.tier === "expressive" || plan.tier === "award";
  const pages = new Map(plan.pages.map((page) => [page.id, new Set(page.sections.map((section) => section.id))]));
  const moments = plan.motionMoments ?? [];
  if ((selected || ambitious) && moments.length === 0) errors.push("motion-selected or expressive/award plans require typed motionMoments");
  if (!unique(moments.map((item) => item.id))) errors.push("motion moment IDs must be unique");
  moments.forEach((item, index) => errors.push(...validateMoment(item, pages, `motionMoments[${index}]`)));
  const momentsById = new Map(moments.map((item) => [item.id, item]));
  for (const page of plan.pages) for (const section of page.sections) {
    const ids = section.motionMomentIds ?? [];
    if (section.motionTreatment && section.motionTreatment.class !== "none" && ids.length === 0) errors.push(`${page.id}/${section.id}: planned motion treatment has no motion moment mapping`);
    for (const id of ids) {
      const moment = momentsById.get(id);
      if (!moment || moment.pageId !== page.id || moment.sectionId !== section.id) errors.push(`${page.id}/${section.id}: motion moment mapping ${id} is missing or points elsewhere`);
    }
    for (const id of section.mediaTransformationIds ?? []) if (!(plan.mediaTransformations ?? []).some((item) => item.id === id && item.pageId === page.id && item.sectionId === section.id)) errors.push(`${page.id}/${section.id}: media transformation mapping ${id} is missing or points elsewhere`);
    if (section.status === "fallback" && !(plan.fallbackExecutions ?? []).some((item) => item.sectionId === section.id)) errors.push(`${page.id}/${section.id}: fallback shipped without a typed primary-attempt record`);
  }
  if (ambitious) {
    const significant = moments.filter((item) => item.class === "structural" || item.class === "transformational");
    if (significant.length === 0) errors.push(`${plan.tier} requires structural or transformational composition change`);
    if (!moments.some((item) => ["scroll-progress", "pointer", "drag", "velocity"].includes(item.driver))) errors.push(`${plan.tier} requires a continuous input-driven motion moment`);
    if (!moments.some((item) => !/^no handoff/i.test(item.handoff))) errors.push(`${plan.tier} requires an authored composition handoff or persistent development`);
    if (!moments.some((item) => ["pointer", "drag", "velocity", "click"].includes(item.driver)) && !plan.pages.some((page) => page.sections.some((section) => section.interactions.length > 0))) errors.push(`${plan.tier} requires responsive interaction feedback`);
    if (!concrete(plan.motionComplexityBudget?.sharedLanguage, 20)) errors.push(`${plan.tier} requires a coherent motion language`);
    if (moments.every((item) => item.driver === "load")) errors.push("all motion moments are isolated entrance animations");
    if (plan.tier === "award") {
      if (!moments.some((item) => item.hero && item.class === "transformational")) errors.push("award requires a transformational hero moment");
      if (!moments.some((item) => item.hero && COMPOSITION_CHANGE.test(`${item.intermediateState} ${item.endState}`))) errors.push("award signature must develop through materially different compositions");
    }
  }
  const transformations = plan.mediaTransformations ?? [];
  if (!unique(transformations.map((item) => item.id))) errors.push("media transformation IDs must be unique");
  transformations.forEach((item, index) => errors.push(...validateTransformation(item, new Set(momentsById.keys()), `mediaTransformations[${index}]`)));
  if (verification) {
    const evidence = new Map(verification.evidence.map((item) => [item.id, item]));
    for (const moment of moments) {
      const items = moment.requiredEvidenceIds.map((id) => evidence.get(id));
      for (const [index, item] of items.entries()) {
        const id = moment.requiredEvidenceIds[index];
        if (!item || item.status !== "pass") errors.push(`${moment.id}: missing passing temporal evidence ${id}`);
        else if (item.motionMomentId !== moment.id) errors.push(`${moment.id}: evidence ${id} is not mapped to the motion moment`);
        else if (!["motion", "interaction", "media-transformation"].includes(item.kind ?? "")) errors.push(`${moment.id}: evidence ${id} has a non-temporal kind`);
        else if (!temporalProof(item, /\b(?:canvas|webgl|shader|pixel|image|frame)\b/i.test(moment.renderingMechanism))) errors.push(`${moment.id}: evidence ${id} lacks recording, trace, or grounded controlled-progress provenance`);
      }
      const states = new Set(items.map((item) => item?.timelineState));
      for (const state of ["initial", "early", "mid-transition", "final", "reverse-interaction", "mobile", "reduced-motion"] as const) if (!states.has(state)) errors.push(`${moment.id}: temporal evidence is missing ${state}`);
      if (!/^no handoff/i.test(moment.handoff) && !states.has("handoff")) errors.push(`${moment.id}: temporal evidence is missing handoff`);
      const controlled = items.filter((item): item is VerificationEvidence => Boolean(item && item.proof.controlledProgress !== undefined));
      if (controlled.length >= 3 && new Set(controlled.map((item) => String(item.proof.controlledProgress))).size < 3) errors.push(`${moment.id}: controlled-progress timeline must contain at least three distinct progress values`);
      const keyStates = ["initial", "mid-transition", "final"].map((state) => items.find((item) => item?.timelineState === state));
      if (keyStates.every(Boolean) && new Set(keyStates.map((item) => JSON.stringify(item?.proof.observedProperties?.map((property) => [property.property, property.observed])))).size < 3) errors.push(`${moment.id}: initial, mid-transition, and final evidence must contain distinct observed values`);
      const section = plan.pages.find((page) => page.id === moment.pageId)?.sections.find((item) => item.id === moment.sectionId);
      if (section?.status === "shipped" && items.some((item) => !item || item.status !== "pass")) errors.push(`${moment.pageId}/${moment.sectionId}: section is shipped before motion evidence passes`);
    }
    for (const fallback of plan.fallbackExecutions ?? []) {
      if (!fallback.primaryAttempted || fallback.failureEvidenceIds.length === 0 || fallback.fallbackSuccessEvidenceIds.length === 0) errors.push(`${fallback.sectionId}: fallback silently replaces an unproven primary treatment`);
      for (const id of [...fallback.failureEvidenceIds, ...fallback.fallbackSuccessEvidenceIds]) if (!evidence.has(id)) errors.push(`${fallback.sectionId}: fallback references missing evidence ${id}`);
      if (!fallback.finalTierSatisfied && !concrete(fallback.userApprovalReference, 3)) errors.push(`${fallback.sectionId}: fallback drops below the selected tier without explicit user approval`);
    }
    for (const transformation of transformations) {
      for (const id of [...transformation.prototypeEvidenceIds, ...transformation.finalEvidenceIds]) {
        const item = evidence.get(id);
        if (!item || item.status !== "pass") errors.push(`${transformation.id}: missing passing transformation evidence ${id}`);
        else if (item.mediaTransformationId !== transformation.id || item.motionMomentId !== transformation.motionMomentId) errors.push(`${transformation.id}: evidence ${id} is not mapped to the transformation and owning motion moment`);
        else if (item.kind !== "media-transformation" || !temporalProof(item, true)) errors.push(`${transformation.id}: evidence ${id} lacks screenshot-backed temporal media-transformation proof`);
      }
      for (const derivative of transformation.derivatives) for (const id of derivative.evidenceIds) if (!evidence.get(id) || evidence.get(id)?.status !== "pass") errors.push(`${transformation.id}/${derivative.id}: missing passing derivative evidence ${id}`);
    }
    if (ambitious) errors.push(...validateStaticFeeling(verification.staticFeelingReview, "verification.staticFeelingReview", evidence));
  }
  return errors;
}

export function validateMotionCheckpoint(plan: DirectDesignPlan, checkpoint: VisualCheckpoint, verification?: VerificationReport): string[] {
  if (!motionIsSelected(plan) && plan.tier !== "expressive" && plan.tier !== "award") return [];
  const prototype = checkpoint.motionPrototype;
  if (!prototype) return ["motion-selected work requires an approved motion prototype checkpoint"];
  const errors: string[] = [];
  const approvalAt = checkpoint.approval.approvedAt;
  if (!checkpoint.systemSpreadStartedAt) errors.push("motion prototype requires systemSpreadStartedAt");
  if (!approvalAt || Date.parse(checkpoint.capturedAt) >= Date.parse(approvalAt)) errors.push("motion prototype capturedAt must predate checkpoint approval");
  if (approvalAt && checkpoint.systemSpreadStartedAt && Date.parse(approvalAt) >= Date.parse(checkpoint.systemSpreadStartedAt)) errors.push("checkpoint approval must predate systemSpreadStartedAt");
  if (checkpoint.systemSpreadStartedAt && verification && Date.parse(checkpoint.systemSpreadStartedAt) >= Date.parse(verification.generatedAt)) errors.push("systemSpreadStartedAt must predate final verification generatedAt");
  for (const key of ["firstViewport", "importantComposition", "structuralOrTransformationalTransition", "interactionResponse", "desktop", "mobile", "reducedMotion", "realProject", "representativeAssets"] as const) if (!prototype[key]) errors.push(`motion prototype ${key} must be implemented`);
  if (prototype.motionMomentIds.length === 0 || prototype.evidenceIds.length === 0) errors.push("motion prototype requires mapped moments and temporal evidence");
  const evidence = new Map((verification?.evidence ?? []).map((item) => [item.id, item]));
  for (const id of prototype.evidenceIds) {
    const item = evidence.get(id);
    if (!item) errors.push(`motion prototype references missing evidence ${id}`);
    else if (item.status !== "pass") errors.push(`motion prototype evidence ${id} must pass`);
    else if (!["motion", "interaction", "media-transformation"].includes(item.kind ?? "") || !temporalProof(item, item.kind === "media-transformation")) errors.push(`motion prototype evidence ${id} must contain grounded temporal provenance`);
    else if (!item.motionMomentId || !prototype.motionMomentIds.includes(item.motionMomentId)) errors.push(`motion prototype evidence ${id} is not mapped to a prototype motion moment`);
    else if (approvalAt && Date.parse(item.proof.timestamp) > Date.parse(approvalAt)) errors.push(`motion prototype evidence ${id} was captured after checkpoint approval`);
    if (item && checkpoint.systemSpreadStartedAt && Date.parse(item.proof.timestamp) >= Date.parse(checkpoint.systemSpreadStartedAt)) errors.push(`motion prototype evidence ${id} was captured after system spread started`);
  }
  if (plan.tier === "expressive" || plan.tier === "award") errors.push(...validateStaticFeeling(prototype.staticFeelingReview, "motionPrototype.staticFeelingReview", evidence));
  return errors;
}
