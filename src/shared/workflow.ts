import type { AmbitionTier, LegacyAmbitionTier } from "./skillSystem.js";

export type DesignAmbition = "standard" | "expressive" | "award" | "experimental";
export type ExecutionMode = "fast" | "lean" | "full-audit";
export type PrototypePolicy = "skip" | "auto" | "required";
export type EvaluationPurpose = "project-delivery" | "production-certification" | "dreative-dogfood";
export type InteractionRisk = "static" | "simple-motion" | "layered-media" | "pinned-scroll" | "canvas-webgl" | "frame-sequence";

export interface WorkflowConfiguration {
  ambition: DesignAmbition;
  execution: ExecutionMode;
  prototype: PrototypePolicy;
  purpose: EvaluationPurpose;
}

export interface LegacyWorkflowOptions {
  tier?: AmbitionTier | LegacyAmbitionTier;
  fullAudit?: boolean;
  audit?: boolean;
  dogfood?: boolean;
  prototype?: boolean;
  skipPrototype?: boolean;
  verificationMode?: "fast" | "standard" | "exhaustive";
}

export interface WorkflowResolution {
  configuration: WorkflowConfiguration;
  deprecations: string[];
}

export interface WorkflowPolicy {
  artifacts: ("plan.yaml" | "critic.json" | "verify.json" | "preservation.json" | "ledger.json" | "certification.json" | "behaviour-analysis.json")[];
  independentCritics: number;
  followUpCritic: "risk-triggered" | "required";
  representativeWidths: number[];
  collectPerformanceEvidence: boolean;
  collectBehaviourEvidence: boolean;
  spreadValidation: "not-required" | "internal" | "explicit-approval";
}

export interface PrototypeRisk {
  id: string;
  family: "webgl-shader" | "frame-sequence" | "fragmented-media" | "spatial-selector" | "persistent-handoff" | "other";
  risk: InteractionRisk;
  unresolved: boolean;
}

export interface AdaptiveSpreadRequirements {
  required: boolean;
  approval: "none" | "internal" | "explicit";
  desktopCapture: boolean;
  mobileCapture: boolean;
  peakStateEvidence: boolean;
  mechanismTable: boolean;
  fallbackDisclosure: boolean;
  sectionRoleTable: boolean;
  sourceIdentity: boolean;
  continuousRecording: boolean;
  mobileRecording: boolean;
  reverseScroll: boolean;
  montage: boolean;
}

const ambitionFromTier = (tier?: AmbitionTier | LegacyAmbitionTier): DesignAmbition =>
  tier === "expressive" ? "expressive" : tier === "award" ? "award" : tier === "experimental" ? "experimental" : "standard";

export function resolveWorkflowConfiguration(
  input: Partial<WorkflowConfiguration> = {},
  legacy: LegacyWorkflowOptions = {},
): WorkflowResolution {
  const deprecations: string[] = [];
  let execution = input.execution;
  let prototype = input.prototype;
  let purpose = input.purpose;

  if (!execution && (legacy.fullAudit || legacy.audit || legacy.verificationMode === "exhaustive")) {
    execution = "full-audit";
    deprecations.push("legacy audit settings map to execution=full-audit");
  }
  if (!execution && legacy.verificationMode === "fast") {
    execution = "fast";
    deprecations.push("verificationMode=fast maps to execution=fast");
  }
  if (!prototype && legacy.skipPrototype) {
    prototype = "skip";
    deprecations.push("skipPrototype maps to prototype=skip");
  } else if (!prototype && legacy.prototype === true) {
    prototype = "required";
    deprecations.push("prototype=true maps to prototype=required");
  } else if (!prototype && legacy.prototype === false) {
    prototype = "skip";
    deprecations.push("prototype=false maps to prototype=skip");
  }
  if (!purpose && legacy.dogfood) {
    purpose = "dreative-dogfood";
    deprecations.push("dogfood maps to purpose=dreative-dogfood");
  }

  return {
    configuration: {
      ambition: input.ambition ?? ambitionFromTier(legacy.tier),
      execution: execution ?? "lean",
      prototype: prototype ?? "auto",
      purpose: purpose ?? "project-delivery",
    },
    deprecations,
  };
}

export function resolveWorkflowPolicy(configuration: WorkflowConfiguration, narrowWidthRisk = false): WorkflowPolicy {
  const fullAudit = configuration.execution === "full-audit";
  const dogfood = configuration.purpose === "dreative-dogfood";
  const artifacts: WorkflowPolicy["artifacts"] = ["plan.yaml", "verify.json"];
  if (configuration.execution !== "fast") artifacts.splice(1, 0, "critic.json");
  if (fullAudit) artifacts.push("preservation.json", "ledger.json", "certification.json");
  if (dogfood) artifacts.push("behaviour-analysis.json");
  return {
    artifacts,
    independentCritics: configuration.execution === "fast" ? 0 : 1,
    followUpCritic: dogfood ? "required" : "risk-triggered",
    representativeWidths: narrowWidthRisk || fullAudit || dogfood ? [1440, 390, 320] : [1440, 390],
    collectPerformanceEvidence: fullAudit || dogfood,
    collectBehaviourEvidence: dogfood,
    spreadValidation: dogfood && configuration.ambition === "experimental"
      ? "explicit-approval"
      : configuration.ambition === "experimental" || configuration.ambition === "award"
        ? "internal"
        : "not-required",
  };
}

export function shouldCreatePrototype(configuration: WorkflowConfiguration, risks: InteractionRisk[]): boolean {
  if (configuration.prototype === "skip") return false;
  if (configuration.prototype === "required") return true;
  return risks.some((risk) => ["layered-media", "pinned-scroll", "canvas-webgl", "frame-sequence"].includes(risk));
}

export function selectPrototypeRisks(configuration: WorkflowConfiguration, risks: PrototypeRisk[]): PrototypeRisk[] {
  if (configuration.prototype === "skip" || configuration.execution === "fast") return [];
  const unresolved = risks.filter((item) => item.unresolved);
  if (configuration.prototype === "required") return unresolved.slice(0, 3);
  if (configuration.execution === "full-audit" && configuration.ambition === "experimental")
    return [...new Map(unresolved.map((item) => [item.family, item])).values()].slice(0, 3);
  return unresolved.slice(0, 1);
}

export function resolveAdaptiveSpreadValidation(configuration: WorkflowConfiguration, input: {
  highRiskMechanismCount?: number;
  riskTriggered?: boolean;
  immersiveContinuityPrimary?: boolean;
  cinematicContinuityPrimary?: boolean;
  persistentAcrossChapters?: boolean;
  staticCapturesInsufficient?: boolean;
  mobileChoreographyDiffers?: boolean;
  reversible?: boolean;
  pinnedLifecycleRisk?: boolean;
  montageUseful?: boolean;
  materialConceptChange?: boolean;
} = {}): AdaptiveSpreadRequirements {
  const dogfoodExperimental = configuration.purpose === "dreative-dogfood" && configuration.ambition === "experimental";
  const required = configuration.ambition === "experimental"
    || configuration.purpose === "dreative-dogfood"
    || (configuration.ambition === "award" && (input.highRiskMechanismCount ?? 0) > 1)
    || Boolean(input.riskTriggered);
  const continuousRecording = required && Boolean(
    input.immersiveContinuityPrimary
    || input.cinematicContinuityPrimary
    || input.persistentAcrossChapters
    || input.staticCapturesInsufficient,
  );
  return {
    required,
    approval: dogfoodExperimental || (configuration.purpose === "production-certification" && input.materialConceptChange)
      ? "explicit"
      : required ? "internal" : "none",
    desktopCapture: required,
    mobileCapture: required,
    peakStateEvidence: required,
    mechanismTable: required,
    fallbackDisclosure: required,
    sectionRoleTable: required,
    sourceIdentity: required,
    continuousRecording,
    mobileRecording: continuousRecording && Boolean(input.mobileChoreographyDiffers),
    reverseScroll: required && Boolean(input.reversible || input.pinnedLifecycleRisk),
    montage: required && Boolean(input.montageUseful),
  };
}

export function verificationStatesFor(risk: InteractionRisk, expensive = false): string[] {
  const states: Record<InteractionRisk, string[]> = {
    static: ["final-desktop", "final-mobile"],
    "simple-motion": ["start", "midpoint", "end"],
    "layered-media": ["resting", "active", "resolved", "mobile", "reduced-motion"],
    "pinned-scroll": ["entry", "midpoint", "exit", "mobile", "scroll-release"],
    "canvas-webgl": ["initial", "active", "resolved", "resize", "mobile-fallback", "reduced-motion"],
    "frame-sequence": ["early", "middle", "final", "loading", "mobile-strategy", "reduced-motion"],
  };
  return expensive && risk === "canvas-webgl" ? [...states[risk], "performance"] : states[risk];
}

export function configurationFromArgs(args: string[]): WorkflowResolution {
  const read = (flag: string) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };
  const input: Partial<WorkflowConfiguration> = {
    ambition: read("--ambition") as DesignAmbition | undefined,
    execution: read("--execution") as ExecutionMode | undefined,
    prototype: read("--prototype") as PrototypePolicy | undefined,
    purpose: read("--purpose") as EvaluationPurpose | undefined,
  };
  const allowed = {
    ambition: ["standard", "expressive", "award", "experimental"],
    execution: ["fast", "lean", "full-audit"],
    prototype: ["skip", "auto", "required"],
    purpose: ["project-delivery", "production-certification", "dreative-dogfood"],
  } as const;
  for (const [key, values] of Object.entries(allowed)) {
    const value = input[key as keyof WorkflowConfiguration];
    if (value && !(values as readonly string[]).includes(value)) throw new Error(`invalid --${key}: ${value}`);
  }
  return resolveWorkflowConfiguration(input, {
    fullAudit: args.includes("--full-audit"),
    dogfood: args.includes("--dogfood"),
    prototype: args.includes("--require-prototype") ? true : undefined,
    skipPrototype: args.includes("--skip-prototype"),
  });
}
