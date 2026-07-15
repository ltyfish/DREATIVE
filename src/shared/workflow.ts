import type { AmbitionTier } from "./skillSystem.js";

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
  tier?: AmbitionTier;
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
  artifacts: ("plan.json" | "critic.json" | "verify.json" | "preservation.json" | "ledger.json" | "certification.json" | "behaviour-analysis.json")[];
  independentCritics: number;
  followUpCritic: "risk-triggered" | "required";
  representativeWidths: number[];
  collectPerformanceEvidence: boolean;
  collectBehaviourEvidence: boolean;
}

const ambitionFromTier = (tier?: AmbitionTier): DesignAmbition =>
  tier === "expressive" ? "expressive" : tier === "award" ? "award" : "standard";

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
  const artifacts: WorkflowPolicy["artifacts"] = ["plan.json", "verify.json"];
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
  };
}

export function shouldCreatePrototype(configuration: WorkflowConfiguration, risks: InteractionRisk[]): boolean {
  if (configuration.prototype === "skip") return false;
  if (configuration.prototype === "required") return true;
  return risks.some((risk) => ["layered-media", "pinned-scroll", "canvas-webgl", "frame-sequence"].includes(risk));
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
