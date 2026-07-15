import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

export const SOURCE_HASH_ALGORITHM = "dreative-source-v1-sha256";
const EXCLUDED = new Set([".git", ".dreative", "node_modules", "dist", "build", ".next", ".nuxt", "coverage", "evidence"]);
const INCLUDED_ROOT_FILES = new Set(["package.json", "package-lock.json", "npm-shrinkwrap.json", "yarn.lock", "pnpm-lock.yaml", "bun.lock", "bun.lockb", "vite.config.ts", "vite.config.js", "next.config.js", "next.config.mjs", "next.config.ts", "svelte.config.js", "nuxt.config.ts", "tsconfig.json"]);
const SOURCE_DIRS = new Set(["src", "app", "pages", "components", "public", "assets", "styles"]);

function sha256(value: Buffer | string): string { return crypto.createHash("sha256").update(value).digest("hex"); }

function collect(root: string, current: string, mode: "source" | "build"): string[] {
  if (!fs.existsSync(current)) return [];
  const result: string[] = [];
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    if (EXCLUDED.has(entry.name) && mode === "source") continue;
    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) result.push(...collect(root, absolute, mode));
    else if (entry.isFile()) result.push(path.relative(root, absolute).replaceAll("\\", "/"));
  }
  return result;
}

export function hashFiles(root: string, files: string[]): string {
  const digest = crypto.createHash("sha256");
  for (const relative of [...files].sort()) {
    const absolute = path.join(root, relative);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) continue;
    digest.update(relative.replaceAll("\\", "/"));
    digest.update("\0");
    digest.update(fs.readFileSync(absolute));
    digest.update("\0");
  }
  return digest.digest("hex");
}

export function sourceFiles(projectDir: string): string[] {
  const files: string[] = [];
  for (const name of INCLUDED_ROOT_FILES) if (fs.existsSync(path.join(projectDir, name))) files.push(name);
  for (const name of SOURCE_DIRS) files.push(...collect(projectDir, path.join(projectDir, name), "source"));
  return [...new Set(files)].sort();
}

export interface BuildIdentity {
  algorithm: typeof SOURCE_HASH_ALGORITHM;
  runId: string;
  dreativeVersion: string;
  schemaVersion: number;
  gitHead: string | null;
  dirty: boolean;
  sourceTreeHash: string;
  packageJsonHash: string | null;
  lockfile: string | null;
  lockfileHash: string | null;
  publicAssetHash: string;
  productionBuildDirectory: string;
  productionBuildHash: string;
  framework: string;
  packageManager: string;
  buildCommand: string;
  serverCommand: string;
  testedOrigin: string;
  testedUrl: string;
  serverStartedAt: string;
  verificationStartedAt: string;
  verificationFinishedAt: string;
}

export function activeLockfile(projectDir: string): string | null {
  return ["pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb", "package-lock.json", "npm-shrinkwrap.json"].find((name) => fs.existsSync(path.join(projectDir, name))) ?? null;
}

export function defaultBuildDirectory(projectDir: string): string {
  return ["dist", "build", ".next", ".output"].find((name) => fs.existsSync(path.join(projectDir, name))) ?? "dist";
}

export function computeCurrentIdentity(projectDir: string, basis: Pick<BuildIdentity, "runId" | "dreativeVersion" | "schemaVersion" | "framework" | "packageManager" | "buildCommand" | "serverCommand" | "testedOrigin" | "testedUrl" | "serverStartedAt" | "verificationStartedAt" | "verificationFinishedAt"> & { productionBuildDirectory?: string }): BuildIdentity {
  const git = (args: string[]) => { try { return execFileSync("git", args, { cwd: projectDir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; } };
  const lockfile = activeLockfile(projectDir);
  const buildDir = basis.productionBuildDirectory ?? defaultBuildDirectory(projectDir);
  const publicFiles = collect(projectDir, path.join(projectDir, "public"), "source");
  const buildFiles = collect(projectDir, path.join(projectDir, buildDir), "build");
  return {
    algorithm: SOURCE_HASH_ALGORITHM,
    ...basis,
    gitHead: git(["rev-parse", "HEAD"]) || null,
    dirty: Boolean(git(["status", "--porcelain"])),
    sourceTreeHash: hashFiles(projectDir, sourceFiles(projectDir)),
    packageJsonHash: fs.existsSync(path.join(projectDir, "package.json")) ? sha256(fs.readFileSync(path.join(projectDir, "package.json"))) : null,
    lockfile,
    lockfileHash: lockfile ? sha256(fs.readFileSync(path.join(projectDir, lockfile))) : null,
    publicAssetHash: hashFiles(projectDir, publicFiles),
    productionBuildDirectory: buildDir,
    productionBuildHash: hashFiles(projectDir, buildFiles),
  };
}

export function compareBuildIdentity(expected: BuildIdentity, actual: BuildIdentity): string[] {
  const errors: string[] = [];
  const keys: (keyof BuildIdentity)[] = ["algorithm", "sourceTreeHash", "packageJsonHash", "lockfile", "lockfileHash", "publicAssetHash", "productionBuildDirectory", "productionBuildHash"];
  for (const key of keys) if (expected[key] !== actual[key]) errors.push(`build identity ${key} is stale (verified ${String(expected[key])}, current ${String(actual[key])})`);
  if (!expected.runId) errors.push("build identity runId is required");
  if (!expected.testedOrigin || !expected.testedUrl.startsWith(expected.testedOrigin)) errors.push("testedUrl must belong to testedOrigin");
  return errors;
}
