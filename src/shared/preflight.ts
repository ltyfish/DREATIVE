import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { activeLockfile } from "./projectIdentity.js";

export type CapabilityStatus =
  | "available"
  | "available-after-package-installation"
  | "available-through-sourcing"
  | "available-only-with-supplied-assets"
  | "unavailable"
  | "permission-denied";

export type CreativeCapabilityId =
  | "gsap-runtime"
  | "threejs-runtime"
  | "canvas-runtime"
  | "webgl-runtime"
  | "scrolltrigger-runtime"
  | "ffmpeg-editing"
  | "sharp-editing"
  | "browser-verification"
  | "image-search"
  | "image-generation"
  | "video-search"
  | "video-generation"
  | "image-editing"
  | "video-editing"
  | "3d-asset-search"
  | "3d-model-generation"
  | "3d-authoring"
  | "screenshot-capture"
  | "browser-automation";

export interface CapabilityInput {
  id: CreativeCapabilityId;
  available: boolean;
  source: string;
  notes?: string;
}

export interface CapabilityAssessment {
  id: CreativeCapabilityId;
  category: "runtime" | "authoring" | "sourcing" | "verification";
  status: CapabilityStatus;
  source: string;
  notes: string;
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

const category = (id: CreativeCapabilityId): CapabilityAssessment["category"] =>
  id.includes("search") ? "sourcing"
    : id.includes("verification") || id.includes("capture") || id.includes("automation") ? "verification"
      : id.includes("runtime") ? "runtime"
        : "authoring";

const commandAvailable = (command: string): boolean => {
  const result = spawnSync(command, ["-version"], { stdio: "ignore", shell: process.platform === "win32" });
  return result.status === 0;
};

function assessment(id: CreativeCapabilityId, status: CapabilityStatus, source: string, notes: string): CapabilityAssessment {
  return { id, category: category(id), status, source, notes };
}

export function resolveCreativeCapabilities(
  installed: string[],
  permissions: CreativePermissions,
  explicit: CapabilityInput[] = [],
  environment: { ffmpeg?: boolean; canvas?: boolean; webgl?: boolean } = {},
): CapabilityAssessment[] {
  const overrides = new Map(explicit.map((item) => [item.id, item]));
  const has = (name: string) => installed.includes(name);
  const explicitStatus = (id: CreativeCapabilityId): CapabilityAssessment | undefined => {
    const item = overrides.get(id);
    return item ? assessment(id, item.available ? "available" : "unavailable", item.source, item.notes ?? "Explicit tool capability input.") : undefined;
  };
  const runtime = (
    id: CreativeCapabilityId,
    present: boolean,
    installable: boolean,
    notes: string,
  ) => explicitStatus(id) ?? assessment(id, present ? "available" : installable && permissions.packageInstallationAllowed ? "available-after-package-installation" : "unavailable", present ? "environment" : "package-preflight", notes);
  const authored = (
    id: CreativeCapabilityId,
    permitted: boolean,
    unavailableNotes: string,
  ) => {
    if (!permitted) return assessment(id, "permission-denied", "user-permission", "The user did not allow this creative operation.");
    return explicitStatus(id) ?? assessment(id, "unavailable", "tool-preflight", unavailableNotes);
  };

  const capabilities: CapabilityAssessment[] = [
    runtime("gsap-runtime", has("gsap"), true, "GSAP is a runtime animation library; availability does not prove cinematic authorship."),
    runtime("threejs-runtime", has("three") || has("@react-three/fiber"), true, "Three.js renders spatial scenes; it does not generate or author a 3D model."),
    runtime("canvas-runtime", environment.canvas ?? true, false, "Canvas can render authored frames or procedural graphics."),
    runtime("webgl-runtime", environment.webgl ?? true, false, "WebGL runtime support is separate from 3D asset authoring."),
    runtime("scrolltrigger-runtime", has("gsap"), true, "ScrollTrigger coordinates runtime scroll states; it is not authored choreography by itself."),
    runtime("sharp-editing", has("sharp"), true, "Sharp creates production image derivatives; it does not generate original imagery."),
    runtime("browser-verification", has("playwright") || has("@playwright/test"), true, "Browser tools verify output and do not author media."),
    explicitStatus("ffmpeg-editing") ?? assessment("ffmpeg-editing", environment.ffmpeg ? "available" : "unavailable", "environment", "FFmpeg edits or compiles existing footage and frames; it does not generate original footage."),
    authored("image-generation", permissions.generatedImagesAllowed, "Image generation permission exists, but no image-generation tool was detected."),
    authored("video-generation", permissions.generatedVideoAllowed, "Video generation permission exists, but no video-generation tool was detected."),
    authored("image-editing", permissions.generatedImagesAllowed || permissions.externalImagesAllowed, "No image-editing authoring tool was detected beyond production derivative tooling."),
    authored("video-editing", permissions.generatedVideoAllowed || permissions.externalVideoAllowed, "No video authoring tool was detected; FFmpeg availability is reported separately as encoding/editing."),
    authored("3d-model-generation", permissions.threeDPolicy === "generation-and-sourcing-allowed", "No 3D model-generation tool was detected."),
    authored("3d-authoring", permissions.threeDPolicy === "generation-and-sourcing-allowed", "No Blender, Spline, or equivalent authoring capability was detected."),
    explicitStatus("image-search") ?? assessment("image-search", permissions.externalImagesAllowed ? "available-through-sourcing" : "permission-denied", "user-permission", permissions.externalImagesAllowed ? "Use a configured image-search or sourcing tool and record rights." : "External image sourcing is denied."),
    explicitStatus("video-search") ?? assessment("video-search", permissions.externalVideoAllowed ? "available-through-sourcing" : "permission-denied", "user-permission", permissions.externalVideoAllowed ? "Use a configured video sourcing tool and record rights." : "External video sourcing is denied."),
    explicitStatus("3d-asset-search") ?? assessment("3d-asset-search", permissions.threeDPolicy === "external-sourcing-allowed" || permissions.threeDPolicy === "generation-and-sourcing-allowed" ? "available-through-sourcing" : permissions.threeDPolicy === "supplied-only" ? "available-only-with-supplied-assets" : "permission-denied", "user-permission", "Model sourcing and model generation are separate capabilities."),
    explicitStatus("screenshot-capture") ?? assessment("screenshot-capture", has("playwright") || has("@playwright/test") ? "available" : "unavailable", "environment", "Screenshot capture verifies the current implementation."),
    explicitStatus("browser-automation") ?? assessment("browser-automation", has("playwright") || has("@playwright/test") ? "available" : "unavailable", "environment", "Browser automation verifies interactions; it does not produce creative assets."),
  ];
  return capabilities;
}

export function resolveRuntimeRequirements(mechanisms: string[], preflight: ProjectPreflight): RuntimeRequirement[] {
  const prefix = preflight.packageManager === "npm" ? "npm install" : preflight.packageManager === "yarn" ? "yarn add" : preflight.packageManager === "bun" ? "bun add" : "pnpm add";
  return mechanisms.map((mechanism) => {
    const packages = RUNTIME_RULES.find((rule) => rule.pattern.test(mechanism))?.packages ?? [];
    return { mechanism, packages, packageManager: preflight.packageManager, installCommand: packages.length ? `${prefix} ${packages.map((item) => `${item.name}@${item.compatibleVersion}`).join(" ")}` : "not required (native CSS/SVG/Canvas)" };
  });
}

export function detectProjectPreflight(
  projectDir: string,
  options: { permissions?: Partial<CreativePermissions>; explicitCapabilities?: CapabilityInput[] } = {},
): ProjectPreflight {
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
    generatedImagesAllowed: false,
    externalImagesAllowed: false,
    generatedVideoAllowed: false,
    externalVideoAllowed: false,
    threeDPolicy: "not-allowed",
    packageInstallationAllowed: false,
    ...options.permissions,
  };
  const ffmpeg = commandAvailable("ffmpeg");
  return {
    capturedAt: new Date().toISOString(), framework: frameworkName ?? "unknown", frameworkVersion: deps[frameworkName ?? ""] ?? "unknown",
    packageManager: manager, lockfile: activeLockfile(projectDir), sourceLayout,
    installedCapabilities, scripts: pkg.scripts ?? {},
    browserVerification: Boolean(deps.playwright || deps["@playwright/test"] || /playwright|puppeteer/i.test(source)),
    reducedMotionInfrastructure: /prefers-reduced-motion|useReducedMotion|reducedMotion/i.test(source) ? ["source-detected"] : [],
    scrollOwner: /ReactLenis|Lenis/.test(source) ? "lenis" : /ScrollTrigger/.test(source) ? "gsap-scrolltrigger" : null,
    animationTicker: /gsap\.ticker/.test(source) ? "gsap" : /requestAnimationFrame/.test(source) ? "requestAnimationFrame" : null,
    assetCapabilities: [deps.sharp && "sharp", deps.canvas && "canvas", ffmpeg && "ffmpeg"].filter(Boolean) as string[],
    creativeCapabilities: resolveCreativeCapabilities(installedCapabilities, permissions, options.explicitCapabilities, { ffmpeg, canvas: true, webgl: true }),
  };
}

function walk(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => entry.name === "node_modules" ? [] : entry.isDirectory() ? walk(path.join(root, entry.name)) : [path.join(root, entry.name)]);
}
