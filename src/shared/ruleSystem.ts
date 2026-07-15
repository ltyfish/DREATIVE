import type { DirectDesignPlan, VerificationReport } from "./artifacts.js";
import { validateMotionExecution } from "./motionSystem.js";

export type RuleCategory = "hard-gate" | "evidence-backed-default" | "creative-provocation";

export interface RuleDefinition {
  id: string;
  category: RuleCategory;
  observedFailure: string;
  defaultRemedy: string;
  exceptionAllowed: boolean;
  exceptionTest: string;
  reviewAfterRuns: number;
}

export interface RuleRegistry {
  version: 1;
  wordingPrinciple: string;
  rules: RuleDefinition[];
}

export interface ReflexFontRegistry {
  version: 1;
  fonts: string[];
  validReasonKinds: string[];
  invalidGenericReasons: string[];
}

function normalized(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

function distinct(values: string[]): string[] {
  return [...new Set(values.map(normalized).filter(Boolean))];
}

function specific(value: string | undefined, minLength: number): boolean {
  if (!value || value.trim().length < minLength) return false;
  return !/^(it |this )?(did not fit|didn't fit|felt better|was unnecessary|was not needed|looked better|fits? the design|restraint)$/i.test(value.trim());
}

function genericMotionOnly(value: string): boolean {
  const text = normalized(value);
  const basic = /\b(fade|opacity|translate|slide|scale|zoom|parallax|reveal|stagger)\b/;
  const structural = /\b(mask|fragment|tile|pixel|layer|depth|pin|persist|handoff|morph|reconstruct|sequence|canvas|svg|webgl|shader|state|composition|camera|clip-path|typography)\b/;
  return basic.test(text) && !structural.test(text);
}

export function validateRuleControls(
  plan: DirectDesignPlan,
  registry: RuleRegistry,
  reflexFonts: ReflexFontRegistry,
  verification?: VerificationReport,
): string[] {
  if (plan.doctrineVersion !== 2 && plan.doctrineVersion !== 3 && plan.doctrineVersion !== 4 && plan.doctrineVersion !== 5) return [];
  const errors: string[] = [];
  const rules = new Map(registry.rules.map((rule) => [rule.id, rule]));
  const evidence = new Map((verification?.evidence ?? []).map((item) => [item.id, item]));

  for (const exception of plan.ruleExceptions ?? []) {
    if (exception.decision !== "substituted") errors.push(`${exception.ruleId || "unknown rule"}: decision must be substituted`);
    const rule = rules.get(exception.ruleId);
    if (!rule) {
      errors.push(`unknown rule exception: ${exception.ruleId}`);
      continue;
    }
    if (rule.category === "hard-gate" || !rule.exceptionAllowed) {
      errors.push(`hard gate ${exception.ruleId} cannot be substituted`);
      continue;
    }
    if (!specific(exception.reason, 30)) errors.push(`${exception.ruleId}: reason is vague or too short`);
    if (!specific(exception.alternative, 40)) errors.push(`${exception.ruleId}: alternative is vague or too short`);
    const criteria = Array.isArray(exception.successCriteria) ? exception.successCriteria : [];
    if (distinct(criteria).length < 2 || criteria.some((criterion) => criterion.trim().length < 12))
      errors.push(`${exception.ruleId}: needs at least two observable success criteria`);
    if (!plan.implementationStartedAt || Number.isNaN(Date.parse(plan.implementationStartedAt)))
      errors.push(`${exception.ruleId}: implementationStartedAt is required to prove planning-time declaration`);
    else if (Number.isNaN(Date.parse(exception.declaredAt)) || Date.parse(exception.declaredAt) > Date.parse(plan.implementationStartedAt))
      errors.push(`${exception.ruleId}: exception must be declared before implementation starts`);
    const evidenceIds = Array.isArray(exception.evidenceIds) ? exception.evidenceIds : [];
    if (evidenceIds.length === 0) errors.push(`${exception.ruleId}: substitution requires verification evidence`);
    for (const id of evidenceIds) {
      const item = evidence.get(id);
      if (!item) errors.push(`${exception.ruleId}: missing verification evidence ${id}`);
      else if (item.status !== "pass") errors.push(`${exception.ruleId}: evidence ${id} is not passing`);
    }
  }

  if (!plan.fontDecision) {
    errors.push("fontDecision is required for doctrineVersion 2 plans");
  } else {
    const decision = plan.fontDecision;
    const candidates = Array.isArray(decision.candidates) ? decision.candidates : [];
    if (distinct(candidates.map((candidate) => candidate.name)).length < 3)
      errors.push("fontDecision requires at least three distinct candidates");
    if (!candidates.some((candidate) => normalized(candidate.name) === normalized(decision.selected)))
      errors.push("selected font must appear in font candidates");
    const reflexSet = new Set(reflexFonts.fonts.map(normalized));
    for (const candidate of candidates) {
      if (candidate.reflex !== reflexSet.has(normalized(candidate.name)))
        errors.push(`${candidate.name}: reflex marker does not match REFLEX_FONTS.json`);
    }
    const selectedIsReflex = reflexSet.has(normalized(decision.selected));
    if (selectedIsReflex) {
      const reason = decision.justification ?? "";
      const validKinds = new Set(reflexFonts.validReasonKinds ?? []);
      if (!(decision.reasonKinds ?? []).some((kind) => validKinds.has(kind)))
        errors.push(`${decision.selected}: reflex font requires at least one registered reason kind`);
      if (!specific(reason, 40) || reflexFonts.invalidGenericReasons.some((phrase) => normalized(reason).includes(normalized(phrase))))
        errors.push(`${decision.selected}: reflex font requires a specific non-generic justification`);
    }
    if ((decision.recentDisplayFonts ?? []).map(normalized).includes(normalized(decision.selected)) && !specific(decision.repeatJustification, 40))
      errors.push(`${decision.selected}: repeating a recent display font requires a stronger justification`);
  }

  if (plan.tier === "expressive" || plan.tier === "award") {
    const strategy = plan.creativeStrategy;
    if (!strategy) errors.push(`${plan.tier} plans require a diversity-or-development creativeStrategy`);
    else if (strategy.path === "diversity") {
      if (distinct(strategy.mechanisms ?? []).length === 0) errors.push("diversity path requires at least one concept-specific mechanism");
      if (distinct(strategy.drivers ?? []).length === 0) errors.push("diversity path requires at least one meaningful driver");
    } else {
      if (!specific(strategy.signatureMechanism, 12)) errors.push("development path requires a named signature mechanism");
      if (distinct(strategy.states ?? []).length < 2 || (strategy.states ?? []).some((state) => state.trim().length < 12))
        errors.push("development path requires materially different described states");
      if (!Array.isArray(strategy.secondaryMechanisms)) errors.push("development path must record its quieter supporting mechanisms");
      if (distinct(strategy.drivers ?? []).length === 0) errors.push("development path requires a meaningful driver");
    }

    const sections = plan.pages.flatMap((page) => page.sections);
    const sectionIds = new Set(sections.map((section) => section.id));
    const budget = plan.motionComplexityBudget;
    if (!budget) errors.push(`${plan.tier} plans require a contextual motionComplexityBudget`);
    else {
      if (budget.heroMoments.length === 0 || budget.heroMoments.length > 3)
        errors.push("motion complexity must be concentrated into one to three hero moments");
      for (const moment of budget.heroMoments) {
        if (!sectionIds.has(moment.sectionId)) errors.push(`motion hero moment references unknown section ${moment.sectionId}`);
        if (!specific(moment.reason, 20)) errors.push(`motion hero moment ${moment.sectionId} needs a concept-specific reason`);
      }
      for (const sectionId of budget.calmSectionIds) {
        if (!sectionIds.has(sectionId)) errors.push(`motion calm section references unknown section ${sectionId}`);
      }
      if (!specific(budget.sharedLanguage, 20) || !specific(budget.deviceLimits, 20) || !specific(budget.progressiveEnhancement, 20))
        errors.push("motion complexity budget needs shared language, device limits, and progressive-enhancement decisions");
      const antiDefault = budget.antiDefaultReview;
      if (!antiDefault) errors.push("motion complexity budget requires the anti-default review");
      else
        for (const [name, answer] of Object.entries(antiDefault)) {
          if (!specific(answer, 20)) errors.push(`anti-default review ${name} needs a concrete answer`);
        }
    }

    const treatments = sections.map((section) => section.motionTreatment);
    if (treatments.some((treatment) => !treatment)) errors.push(`${plan.tier} plans require a motion treatment for every major section, including calm sections`);
    const significant = treatments.filter(
      (treatment): treatment is NonNullable<typeof treatment> =>
        Boolean(treatment && (treatment.class === "structural" || treatment.class === "transformational")),
    );
    if (significant.length === 0) errors.push(`${plan.tier} motion cannot be decorative-only`);
    if (
      significant.length > 0 &&
      significant.every((treatment) => genericMotionOnly(`${treatment.mechanism} ${(treatment.changes ?? []).join(" ")} ${treatment.handoff}`))
    )
      errors.push(`${plan.tier} motion still describes only generic fade/slide/scale behavior; revise the scene architecture`);
    for (const [index, treatment] of treatments.entries()) {
      if (!treatment) continue;
      const prefix = `motion treatment ${sections[index].id}`;
      for (const [name, value] of Object.entries({
        staticComposition: treatment.staticComposition,
        startState: treatment.startState,
        endState: treatment.endState,
        handoff: treatment.handoff,
        purpose: treatment.purpose,
        mechanism: treatment.mechanism,
        mobile: treatment.mobile,
        reducedMotion: treatment.reducedMotion,
      })) {
        if (!specific(value, 12)) errors.push(`${prefix}.${name} needs a concrete decision`);
      }
    }

    if (verification) {
      const timelineStates = new Set(verification.evidence.map((item) => item.timelineState).filter(Boolean));
      const requiredStates: NonNullable<VerificationReport["evidence"][number]["timelineState"]>[] = [
        "initial",
        "early",
        "mid-transition",
        "final",
        "handoff",
        "mobile",
        "reduced-motion",
      ];
      if (treatments.some((treatment) => (treatment?.pinnedElements?.length ?? 0) > 0))
        requiredStates.push("pinned-midpoint", "pinned-exit");
      for (const state of requiredStates) {
        if (!timelineStates.has(state)) errors.push(`visual verification is missing timeline state ${state}`);
      }
      const refinement = verification.refinement;
      if (!refinement || refinement.changes.length === 0 || refinement.evidenceIds.length === 0)
        errors.push(`${plan.tier} verification requires a recorded refinement pass after visual inspection`);
      else {
        for (const id of refinement.evidenceIds) {
          const item = evidence.get(id);
          if (!item || item.status !== "pass") errors.push(`refinement references missing or failing evidence ${id}`);
        }
      }
    }
  }

  if (plan.skills.includes("experimental")) {
    const experimental = plan.experimentalPlan;
    if (!experimental) errors.push("experimental skill requires experimentalPlan");
    else {
      const candidates = Array.isArray(experimental.candidates) ? experimental.candidates : [];
      const covered = new Set(candidates.map((candidate) => candidate.sectionId));
      for (const sectionId of experimental.majorSectionIds ?? []) {
        if (!covered.has(sectionId)) errors.push(`experimental exploration is missing major section ${sectionId}`);
      }
      const selected = candidates.filter((candidate) => candidate.selected);
      if (selected.length < 2 || selected.length > 3) errors.push("experimental delivery must select only the strongest two or three provocations");
      if (candidates.some((candidate) => candidate.idea.trim().length < 20))
        errors.push("experimental candidates must be concrete, non-obvious ideas");
    }
  }

  if ((plan.recipeAccess?.length ?? 0) > 0) {
    if (!plan.conceptExploration || distinct(plan.conceptExploration.concepts.map((concept) => concept.concept)).length < 3)
      errors.push("three original concepts must be recorded before recipe access");
    else {
      const exploredAt = Date.parse(plan.conceptExploration.recordedAt);
      for (const access of plan.recipeAccess ?? []) {
        if (Number.isNaN(Date.parse(access.loadedAt)) || Date.parse(access.loadedAt) < exploredAt)
          errors.push(`${access.file}: recipe was loaded before concept exploration was recorded`);
      }
    }
  }

  errors.push(...validateMotionExecution(plan, verification));
  return errors;
}
