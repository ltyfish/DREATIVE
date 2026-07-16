import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { activeLockfile } from "./projectIdentity.js";

export type CapabilityStatus =
  | "available"
  | "available-after-package-install"
  | "available-through-confirmed-tool"
  | "available-through-supplied-asset"
  | "expected-browser-api-unverified"
  | "permitted-but-tool-unverified"
  | "permission-unresolved"
  | "permission-denied"
  | "unavailable"
  | "runtime-verification-failed";

export type CapabilityCategory = "creative-authoring" | "sourcing" | "runtime-rendering" | "processing" | "verification";
export type PermissionState = "allowed" | "denied" | "unresolved" | "not-applicable";
export type CapabilityConfidence = "verified" | "detected" | "expected" | "unverified";

export const CAPABILITY_IDS = [
  "dom-css-runtime", "canvas-runtime", "webgl-runtime", "webgpu-runtime", "threejs-runtime", "gsap-runtime",
  "scrolltrigger-runtime", "video-playback", "image-sequence-playback",
  "ffmpeg-processing", "sharp-processing", "image-conversion", "video-transcoding", "frame-extraction", "compression",
  "image-generation", "image-editing", "video-generation", "video-editing", "frame-sequence-creation",
  "3d-model-generation", "3d-model-editing", "audio-generation",
  "image-search", "video-search", "3d-asset-search", "font-search", "texture-search",
  "browser-automation", "screenshot-capture", "video-recording", "console-inspection", "performance-collection",
  "mobile-viewport-verification", "reduced-motion-verification",
] as const;
export type CreativeCapabilityId = typeof CAPABILITY_IDS[number];

export const CAPABILITY_STATES: CapabilityStatus[] = [
  "available", "available-after-package-install", "available-through-confirmed-tool", "available-through-supplied-asset",
  "expected-browser-api-unverified", "permitted-but-tool-unverified", "permission-denied", "unavailable",
  "permission-unresolved", "runtime-verification-failed",
];

export interface CapabilityInput {
  id: CreativeCapabilityId;
  state: CapabilityStatus;
  provider?: string;
  package?: string;
  verified: boolean;
  evidence?: string[];
  limitation?: string;
  substitutes?: string[];
}

export interface CapabilityAssessment {
  id: CreativeCapabilityId;
  category: CapabilityCategory;
  permission: PermissionState;
  status: CapabilityStatus;
  detectionSource: "environment" | "package-preflight" | "explicit-capability" | "browser-verification" | "user-permission" | "supplied-asset";
  confidence: CapabilityConfidence;
  provider?: string;
  package?: string;
  verificationEvidence: string[];
  limitation: string;
  permittedSubstitutes: string[];
  requiredAction?: "none" | "install-or-select-fallback" | "search-or-record-exemption" | "verify-in-browser";
  actionOptions?: string[];
}

export interface CreativePermissions {
  generatedImagesAllowed: boolean;
  externalImagesAllowed: boolean;
  generatedVideoAllowed: boolean;
  externalVideoAllowed: boolean;
  threeDPolicy: "not-allowed" | "supplied-only" | "external-sourcing-allowed" | "generation-and-sourcing-allowed";
  packageInstallationAllowed: boolean;
}

export interface ProjectPreflight {
  capturedAt: string;
  identity: string;
  framework: string;
  frameworkVersion: string;
  packageManager: string;
  lockfile: string | null;
  sourceLayout: string[];
  installedCapabilities: string[];
  scripts: Record<string, string>;
  browserVerification: boolean;
  reducedMotionInfrastructure: string[];
  scrollOwner: string | null;
  animationTicker: string | null;
  assetCapabilities: string[];
  creativeCapabilities: CapabilityAssessment[];
}

export interface RuntimeRequirement {
  mechanism: string;
  packages: { name: string; compatibleVersion: string }[];
  installCommand: string;
  packageManager: string;
}

const RUNTIME_RULES: { pattern: RegExp; packages: { name: string; compatibleVersion: string }[] }[] = [
  { pattern: /motion(?:\/react)?|layout motion|spring|presence|gesture/i, packages: [{ name: "motion", compatibleVersion: "^12" }] },
  { pattern: /gsap|scrolltrigger|pinned timeline/i, packages: [{ name: "gsap", compatibleVersion: "^3" }] },
  { pattern: /lenis|smooth scroll/i, packages: [{ name: "lenis", compatibleVersion: "^1" }] },
  { pattern: /react three|r3f|@react-three\/fiber/i, packages: [{ name: "three", compatibleVersion: "^0" }, { name: "@react-three/fiber", compatibleVersion: "^9" }] },
  { pattern: /three(?:\.js)?|webgl scene/i, packages: [{ name: "three", compatibleVersion: "^0" }] },
];

const CATEGORY: Record<CreativeCapabilityId, CapabilityCategory> = {
  "dom-css-runtime": "runtime-rendering", "canvas-runtime": "runtime-rendering", "webgl-runtime": "runtime-rendering",
  "webgpu-runtime": "runtime-rendering", "threejs-runtime": "runtime-rendering", "gsap-runtime": "runtime-rendering",
  "scrolltrigger-runtime": "runtime-rendering", "video-playback": "runtime-rendering", "image-sequence-playback": "runtime-rendering",
  "ffmpeg-processing": "processing", "sharp-processing": "processing", "image-conversion": "processing",
  "video-transcoding": "processing", "frame-extraction": "processing", "compression": "processing",
  "image-generation": "creative-authoring", "image-editing": "creative-authoring", "video-generation": "creative-authoring",
  "video-editing": "creative-authoring", "frame-sequence-creation": "creative-authoring", "3d-model-generation": "creative-authoring",
  "3d-model-editing": "creative-authoring", "audio-generation": "creative-authoring",
  "image-search": "sourcing", "video-search": "sourcing", "3d-asset-search": "sourcing", "font-search": "sourcing", "texture-search": "sourcing",
  "browser-automation": "verification", "screenshot-capture": "verification", "video-recording": "verification",
  "console-inspection": "verification", "performance-collection": "verification", "mobile-viewport-verification": "verification",
  "reduced-motion-verification": "verification",
};

const commandAvailable = (command: string): boolean =>
  spawnSync(command, ["-version"], { stdio: "ignore", shell: process.platform === "win32" }).status === 0;

const permissionFor = (id: CreativeCapabilityId, permissions: CreativePermissions, unresolved = false): PermissionState => {
  if (unresolved && ["image-generation", "image-editing", "video-generation", "video-editing", "frame-sequence-creation", "audio-generation", "image-search", "font-search", "texture-search", "video-search", "3d-asset-search", "3d-model-generation", "3d-model-editing"].includes(id)) return "unresolved";
  if (["image-generation", "image-editing"].includes(id)) return permissions.generatedImagesAllowed ? "allowed" : "denied";
  if (["video-generation", "video-editing", "frame-sequence-creation", "audio-generation"].includes(id)) return permissions.generatedVideoAllowed ? "allowed" : "denied";
  if (id === "image-search" || id === "font-search" || id === "texture-search") return permissions.externalImagesAllowed ? "allowed" : "denied";
  if (id === "video-search") return permissions.externalVideoAllowed ? "allowed" : "denied";
  if (id === "3d-asset-search") return ["external-sourcing-allowed", "generation-and-sourcing-allowed"].includes(permissions.threeDPolicy) ? "allowed" : "denied";
  if (id === "3d-model-generation" || id === "3d-model-editing") return permissions.threeDPolicy === "generation-and-sourcing-allowed" ? "allowed" : "denied";
  return "not-applicable";
};

function record(id: CreativeCapabilityId, permission: PermissionState, status: CapabilityStatus,
  detectionSource: CapabilityAssessment["detectionSource"], confidence: CapabilityConfidence, limitation: string,
  extra: Partial<CapabilityAssessment> = {}): CapabilityAssessment {
  return { id, category: CATEGORY[id], permission, status, detectionSource, confidence, verificationEvidence: [], limitation, permittedSubstitutes: [], ...extra };
}

export function validateCapabilityInputs(inputs: CapabilityInput[]): string[] {
  const errors: string[] = [];
  const seen = new Map<CreativeCapabilityId, CapabilityInput>();
  for (const input of inputs) {
    if (!CAPABILITY_IDS.includes(input.id)) errors.push(`unknown capability id: ${String(input.id)}`);
    if (!CAPABILITY_STATES.includes(input.state)) errors.push(`${input.id}: invalid capability state ${String(input.state)}`);
    const previous = seen.get(input.id);
    if (previous && JSON.stringify(previous) !== JSON.stringify(input)) errors.push(`${input.id}: contradictory capability declarations`);
    seen.set(input.id, input);
    if (input.state === "available-through-confirmed-tool" && !input.provider) errors.push(`${input.id}: confirmed tool state requires provider`);
    if (input.state === "available-after-package-install" && !input.package) errors.push(`${input.id}: package-install state requires package`);
    if (input.verified && ["expected-browser-api-unverified", "permitted-but-tool-unverified"].includes(input.state))
      errors.push(`${input.id}: an unverified state cannot be marked verified`);
  }
  return errors;
}

export function parseCapabilitiesFile(file: string): CapabilityInput[] {
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as { capabilities?: CapabilityInput[] };
  if (!Array.isArray(parsed.capabilities)) throw new Error("capabilities file must contain a capabilities array");
  const errors = validateCapabilityInputs(parsed.capabilities);
  if (errors.length) throw new Error(errors.join("\n"));
  return parsed.capabilities;
}

export function resolveCreativeCapabilities(installed: string[], permissions: CreativePermissions,
  explicit: CapabilityInput[] = [], environment: { ffmpeg?: boolean; unresolvedPermissions?: boolean } = {}): CapabilityAssessment[] {
  const errors = validateCapabilityInputs(explicit);
  if (errors.length) throw new Error(errors.join("\n"));
  const overrides = new Map(explicit.map((item) => [item.id, item]));
  const has = (name: string) => installed.includes(name);
  const explicitRecord = (id: CreativeCapabilityId): CapabilityAssessment | undefined => {
    const input = overrides.get(id);
    if (!input) return undefined;
    const permission = permissionFor(id, permissions, environment.unresolvedPermissions);
    if (permission === "denied" && !["permission-denied", "unavailable"].includes(input.state))
      throw new Error(`${id}: capability declaration contradicts denied user permission`);
    return record(id, permission, input.state, "explicit-capability", input.verified ? "verified" : "detected",
      input.limitation ?? "Declared by the executing environment.", {
        provider: input.provider, package: input.package, verificationEvidence: input.evidence ?? [],
        permittedSubstitutes: input.substitutes ?? [],
      });
  };
  const runtimePackage = (id: CreativeCapabilityId, packageName: string, present: boolean, limitation: string) =>
    explicitRecord(id) ?? record(id, "not-applicable", present ? "available" : permissions.packageInstallationAllowed ? "available-after-package-install" : "unavailable",
      present ? "environment" : "package-preflight", present ? "detected" : "unverified", limitation, { package: packageName });
  const permittedTool = (id: CreativeCapabilityId, limitation: string, substitutes: string[] = []) => {
    const permission = permissionFor(id, permissions, environment.unresolvedPermissions);
    if (permission === "denied") return record(id, permission, "permission-denied", "user-permission", "verified", "The user denied this operation.", { permittedSubstitutes: substitutes });
    if (permission === "unresolved") return explicitRecord(id) ?? record(id, permission, "permission-unresolved", "user-permission", "unverified", "Permission has not been resolved yet; capability detection remains separate.", { permittedSubstitutes: substitutes });
    return explicitRecord(id) ?? record(id, permission, "permitted-but-tool-unverified", "user-permission", "unverified", limitation, { permittedSubstitutes: substitutes });
  };
  const browserExpected = (id: CreativeCapabilityId, limitation: string) =>
    explicitRecord(id) ?? record(id, "not-applicable", "expected-browser-api-unverified", "environment", "expected", limitation, {
      requiredAction: "verify-in-browser", actionOptions: ["run controlled browser verification"],
    });
  const mediaProcessing = (id: CreativeCapabilityId, limitation: string) => {
    const explicitValue = explicitRecord(id);
    if (explicitValue) return explicitValue;
    if (environment.ffmpeg) return record(id, "not-applicable", "available", "environment", "verified", limitation, {
      provider: "system-ffmpeg", requiredAction: "none",
    });
    if (permissions.packageInstallationAllowed) return record(id, "not-applicable", "available-after-package-install", "package-preflight", "unverified", limitation, {
      package: "ffmpeg-static", requiredAction: "install-or-select-fallback",
      actionOptions: ["install ffmpeg-static and verify its binary", "use a confirmed processing provider", "select a bounded image/pre-rendered sequence fallback"],
    });
    return record(id, "not-applicable", "unavailable", "environment", "unverified", limitation, {
      requiredAction: "install-or-select-fallback",
      actionOptions: ["use a confirmed processing provider", "select a bounded procedural or pre-rendered sequence fallback"],
    });
  };

  return [
    record("dom-css-runtime", "not-applicable", "available", "environment", "detected", "DOM/CSS is provided by the target browser but still requires browser verification."),
    browserExpected("canvas-runtime", "Canvas is expected in typical browsers but is not runtime verified yet."),
    browserExpected("webgl-runtime", "WebGL is expected in typical browsers but is not runtime verified yet."),
    browserExpected("webgpu-runtime", "WebGPU support is browser/device dependent and unverified."),
    runtimePackage("threejs-runtime", "three", has("three") || has("@react-three/fiber"), "Three.js renders spatial scenes; it does not generate or author models."),
    runtimePackage("gsap-runtime", "gsap", has("gsap"), "GSAP orchestrates animation; it does not create cinematic design."),
    runtimePackage("scrolltrigger-runtime", "gsap", has("gsap"), "ScrollTrigger coordinates scroll states; it does not author choreography."),
    browserExpected("video-playback", "Video playback depends on codec, browser and device verification."),
    browserExpected("image-sequence-playback", "Image-sequence playback requires runtime decode and performance verification."),
    mediaProcessing("ffmpeg-processing", "FFmpeg processes existing media; it does not generate original video."),
    runtimePackage("sharp-processing", "sharp", has("sharp"), "Sharp creates image derivatives; it does not author original imagery."),
    runtimePackage("image-conversion", "sharp", has("sharp"), "Image conversion processes supplied or sourced pixels."),
    mediaProcessing("video-transcoding", "Transcoding changes existing media formats."),
    mediaProcessing("frame-extraction", "Frame extraction requires existing footage."),
    explicitRecord("compression") ?? record("compression", "not-applicable", has("sharp") || Boolean(environment.ffmpeg) ? "available" : "unavailable", "environment", "detected", "Compression is processing, not creative authoring."),
    permittedTool("image-generation", "Image-generation permission exists, but no generation tool was confirmed.", ["sourced image", "supplied image", "procedural graphic"]),
    permittedTool("image-editing", "Image-editing permission exists, but no authoring tool was confirmed.", ["CSS/SVG treatment", "production derivative"]),
    permittedTool("video-generation", "Video-generation permission exists, but no generation tool was confirmed.", ["sourced video", "frame sequence", "still-state treatment"]),
    permittedTool("video-editing", "Video-editing permission exists, but no authoring tool was confirmed.", ["FFmpeg processing when existing footage is supplied"]),
    permittedTool("frame-sequence-creation", "No tool for creating original sequence states was confirmed.", ["sourced footage extraction", "semantic still states"]),
    permittedTool("3d-model-generation", "No model-generation tool was confirmed.", ["sourced model", "spatial cutout", "layered billboard"]),
    permittedTool("3d-model-editing", "No Blender, Spline or equivalent model-editing tool was confirmed.", ["pre-rendered angles", "spatial cutout"]),
    permittedTool("audio-generation", "No audio-generation tool was confirmed."),
    permittedTool("image-search", "External-image permission does not prove that a sourcing connector exists."),
    permittedTool("video-search", "External-video permission does not prove that a sourcing connector exists."),
    permittedTool("3d-asset-search", "3D sourcing permission does not prove that a model marketplace or search tool exists."),
    permittedTool("font-search", "Font sourcing permission does not prove a rights-safe font search tool exists."),
    permittedTool("texture-search", "Texture sourcing permission does not prove a rights-safe texture tool exists."),
    runtimePackage("browser-automation", "playwright", has("playwright") || has("@playwright/test"), "Browser automation verifies output; it is not a rendering or authoring package."),
    runtimePackage("screenshot-capture", "playwright", has("playwright") || has("@playwright/test"), "Screenshots prove observed rendering state only."),
    runtimePackage("video-recording", "playwright", has("playwright") || has("@playwright/test"), "Recording proves temporal runtime state only."),
    runtimePackage("console-inspection", "playwright", has("playwright") || has("@playwright/test"), "Console inspection verifies runtime health."),
    runtimePackage("performance-collection", "playwright", has("playwright") || has("@playwright/test"), "Performance collection verifies runtime cost."),
    runtimePackage("mobile-viewport-verification", "playwright", has("playwright") || has("@playwright/test"), "Mobile viewport support must be observed."),
    runtimePackage("reduced-motion-verification", "playwright", has("playwright") || has("@playwright/test"), "Reduced-motion behavior must be observed."),
  ];
}

export function upgradeBrowserCapabilities(preflight: ProjectPreflight, evidence: {
  verified: CreativeCapabilityId[]; failed?: CreativeCapabilityId[]; evidenceIds: string[];
}): ProjectPreflight {
  const verified = new Set(evidence.verified);
  const failed = new Set(evidence.failed ?? []);
  const creativeCapabilities = preflight.creativeCapabilities.map((item) => {
    if (failed.has(item.id)) return { ...item, status: "runtime-verification-failed" as const, confidence: "verified" as const, detectionSource: "browser-verification" as const, verificationEvidence: evidence.evidenceIds };
    if (verified.has(item.id)) return { ...item, status: "available" as const, confidence: "verified" as const, detectionSource: "browser-verification" as const, verificationEvidence: evidence.evidenceIds };
    return item;
  });
  return { ...preflight, creativeCapabilities, identity: capabilityPreflightIdentity({ ...preflight, creativeCapabilities }) };
}

export function capabilityPreflightIdentity(preflight: Omit<ProjectPreflight, "identity"> | ProjectPreflight): string {
  const stable = {
    framework: preflight.framework, frameworkVersion: preflight.frameworkVersion, packageManager: preflight.packageManager,
    installedCapabilities: preflight.installedCapabilities, creativeCapabilities: preflight.creativeCapabilities,
  };
  return crypto.createHash("sha256").update(JSON.stringify(stable)).digest("hex");
}

export function resolveRuntimeRequirements(mechanisms: string[], preflight: ProjectPreflight): RuntimeRequirement[] {
  const prefix = preflight.packageManager === "npm" ? "npm install" : preflight.packageManager === "yarn" ? "yarn add" : preflight.packageManager === "bun" ? "bun add" : "pnpm add";
  return mechanisms.map((mechanism) => {
    const packages = RUNTIME_RULES.find((rule) => rule.pattern.test(mechanism))?.packages ?? [];
    return { mechanism, packages, packageManager: preflight.packageManager, installCommand: packages.length ? `${prefix} ${packages.map((item) => `${item.name}@${item.compatibleVersion}`).join(" ")}` : "not required (native CSS/SVG/Canvas)" };
  });
}

export function renderCreativeCapabilityPreflight(preflight: ProjectPreflight): string {
  const render = (item: CapabilityAssessment) =>
    `  - ${item.id}: ${item.status}; permission=${item.permission}; confidence=${item.confidence}; source=${item.detectionSource}${item.provider ? `; provider=${item.provider}` : ""}. ${item.limitation}${item.requiredAction && item.requiredAction !== "none" ? ` Required action: ${item.requiredAction}; options: ${(item.actionOptions ?? []).join(" | ")}.` : ""}`;
  const section = (category: CapabilityCategory, label: string) => [label, ...preflight.creativeCapabilities.filter((item) => item.category === category).map(render)];
  return [
    "Creative capability preflight:",
    `  Identity: ${preflight.identity}. Project runtime: ${preflight.framework} ${preflight.frameworkVersion}; ${preflight.packageManager}.`,
    "  Permission is not capability. Package installation is not authoring. Browser APIs remain unverified until browser evidence upgrades them.",
    ...section("creative-authoring", "Creative authoring:"),
    ...section("sourcing", "Sourcing:"),
    ...section("runtime-rendering", "Runtime rendering:"),
    ...section("processing", "Processing:"),
    ...section("verification", "Verification:"),
    "  Three.js renders scenes but does not create models. GSAP orchestrates animation but does not create cinematic design. FFmpeg processes existing media but does not generate original video.",
  ].join("\n");
}

export function detectProjectPreflight(projectDir: string, options: { permissions?: Partial<CreativePermissions>; explicitCapabilities?: CapabilityInput[]; permissionsUnresolved?: boolean } = {}): ProjectPreflight {
  const packageFile = path.join(projectDir, "package.json");
  const pkg = fs.existsSync(packageFile) ? JSON.parse(fs.readFileSync(packageFile, "utf8")) : {};
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) } as Record<string, string>;
  const frameworkName = ["next", "nuxt", "@sveltejs/kit", "vite", "react", "vue", "svelte"].find((name) => deps[name]);
  const manager = fs.existsSync(path.join(projectDir, "pnpm-lock.yaml")) ? "pnpm" : fs.existsSync(path.join(projectDir, "yarn.lock")) ? "yarn" : fs.existsSync(path.join(projectDir, "bun.lock")) || fs.existsSync(path.join(projectDir, "bun.lockb")) ? "bun" : "npm";
  const sourceLayout = ["src", "app", "pages", "components", "public", "assets"].filter((name) => fs.existsSync(path.join(projectDir, name)));
  const files = sourceLayout.flatMap((name) => walk(path.join(projectDir, name))).filter((file) => /\.(?:[jt]sx?|vue|svelte|css|scss)$/.test(file) && !/\.(?:test|spec)\.[jt]sx?$/.test(file));
  const source = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
  const capabilityPackages = ["motion", "framer-motion", "gsap", "lenis", "three", "@react-three/fiber", "@react-three/drei", "sharp", "playwright", "@playwright/test"];
  const installedCapabilities = capabilityPackages.filter((name) => deps[name]);
  const permissions: CreativePermissions = {
    generatedImagesAllowed: false, externalImagesAllowed: false, generatedVideoAllowed: false, externalVideoAllowed: false,
    threeDPolicy: "not-allowed", packageInstallationAllowed: false, ...options.permissions,
  };
  const ffmpeg = commandAvailable("ffmpeg");
  const base = {
    capturedAt: new Date().toISOString(), framework: frameworkName ?? "unknown", frameworkVersion: deps[frameworkName ?? ""] ?? "unknown",
    packageManager: manager, lockfile: activeLockfile(projectDir), sourceLayout, installedCapabilities, scripts: pkg.scripts ?? {},
    browserVerification: Boolean(deps.playwright || deps["@playwright/test"] || /playwright|puppeteer/i.test(source)),
    reducedMotionInfrastructure: /prefers-reduced-motion|useReducedMotion|reducedMotion/i.test(source) ? ["source-detected"] : [],
    scrollOwner: /ReactLenis|Lenis/.test(source) ? "lenis" : /ScrollTrigger/.test(source) ? "gsap-scrolltrigger" : null,
    animationTicker: /gsap\.ticker/.test(source) ? "gsap" : /requestAnimationFrame/.test(source) ? "requestAnimationFrame" : null,
    assetCapabilities: [deps.sharp && "sharp", ffmpeg && "ffmpeg"].filter(Boolean) as string[],
    creativeCapabilities: resolveCreativeCapabilities(installedCapabilities, permissions, options.explicitCapabilities, { ffmpeg, unresolvedPermissions: options.permissionsUnresolved }),
  };
  return { ...base, identity: capabilityPreflightIdentity(base) };
}

function walk(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => entry.name === "node_modules" ? [] : entry.isDirectory() ? walk(path.join(root, entry.name)) : [path.join(root, entry.name)]);
}
