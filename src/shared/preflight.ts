import fs from "node:fs";
import path from "node:path";
import { activeLockfile } from "./projectIdentity.js";

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

export function resolveRuntimeRequirements(mechanisms: string[], preflight: ProjectPreflight): RuntimeRequirement[] {
  const prefix = preflight.packageManager === "npm" ? "npm install" : preflight.packageManager === "yarn" ? "yarn add" : preflight.packageManager === "bun" ? "bun add" : "pnpm add";
  return mechanisms.map((mechanism) => {
    const packages = RUNTIME_RULES.find((rule) => rule.pattern.test(mechanism))?.packages ?? [];
    return { mechanism, packages, packageManager: preflight.packageManager, installCommand: packages.length ? `${prefix} ${packages.map((item) => `${item.name}@${item.compatibleVersion}`).join(" ")}` : "not required (native CSS/SVG/Canvas)" };
  });
}

export function detectProjectPreflight(projectDir: string): ProjectPreflight {
  const packageFile = path.join(projectDir, "package.json");
  const pkg = fs.existsSync(packageFile) ? JSON.parse(fs.readFileSync(packageFile, "utf8")) : {};
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) } as Record<string, string>;
  const frameworkName = ["next", "nuxt", "@sveltejs/kit", "vite", "react", "vue", "svelte"].find((name) => deps[name]);
  const manager = fs.existsSync(path.join(projectDir, "pnpm-lock.yaml")) ? "pnpm" : fs.existsSync(path.join(projectDir, "yarn.lock")) ? "yarn" : fs.existsSync(path.join(projectDir, "bun.lock")) || fs.existsSync(path.join(projectDir, "bun.lockb")) ? "bun" : "npm";
  const sourceLayout = ["src", "app", "pages", "components", "public", "assets"].filter((name) => fs.existsSync(path.join(projectDir, name)));
  const files = sourceLayout.flatMap((name) => walk(path.join(projectDir, name))).filter((file) => /\.(?:[jt]sx?|vue|svelte|css|scss)$/.test(file) && !/\.(?:test|spec)\.[jt]sx?$/.test(file));
  const source = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
  const capabilityPackages = ["motion", "framer-motion", "gsap", "lenis", "three", "@react-three/fiber", "@react-three/drei", "sharp", "playwright", "@playwright/test"];
  return {
    capturedAt: new Date().toISOString(), framework: frameworkName ?? "unknown", frameworkVersion: deps[frameworkName ?? ""] ?? "unknown",
    packageManager: manager, lockfile: activeLockfile(projectDir), sourceLayout,
    installedCapabilities: capabilityPackages.filter((name) => deps[name]), scripts: pkg.scripts ?? {},
    browserVerification: Boolean(deps.playwright || deps["@playwright/test"] || /playwright|puppeteer/i.test(source)),
    reducedMotionInfrastructure: /prefers-reduced-motion|useReducedMotion|reducedMotion/i.test(source) ? ["source-detected"] : [],
    scrollOwner: /ReactLenis|Lenis/.test(source) ? "lenis" : /ScrollTrigger/.test(source) ? "gsap-scrolltrigger" : null,
    animationTicker: /gsap\.ticker/.test(source) ? "gsap" : /requestAnimationFrame/.test(source) ? "requestAnimationFrame" : null,
    assetCapabilities: [deps.sharp && "sharp", deps.canvas && "canvas", deps.ffmpeg && "ffmpeg"].filter(Boolean) as string[],
  };
}

function walk(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => entry.name === "node_modules" ? [] : entry.isDirectory() ? walk(path.join(root, entry.name)) : [path.join(root, entry.name)]);
}
