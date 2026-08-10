import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { checkSkillInstallation } from "./installSkill.js";
import { spawnSync } from "node:child_process";
import { runDocsCheck } from "./docsCheck.js";

export interface FinalizeResult {
  ok: boolean;
  commands: { command: string; exitCode: number }[];
  blockers: string[];
}

function runNpmScript(projectDir: string, script: string): { command: string; exitCode: number } {
  const command = `npm run ${script}`;
  const result = process.platform === "win32"
    ? spawnSync(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", command], {
      cwd: projectDir, stdio: "inherit", windowsHide: true,
    })
    : spawnSync("npm", ["run", script], { cwd: projectDir, stdio: "inherit" });
  return { command, exitCode: result.status ?? 1 };
}

function runNpmCommand(projectDir: string, args: string[]): { command: string; exitCode: number } {
  const command = `npm ${args.join(" ")}`;
  const result = process.platform === "win32"
    ? spawnSync(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", command], { cwd: projectDir, stdio: "inherit", windowsHide: true })
    : spawnSync("npm", args, { cwd: projectDir, stdio: "inherit" });
  return { command, exitCode: result.status ?? 1 };
}

function gitOutput(projectDir: string, args: string[]): { ok: boolean; output: string } {
  const result = spawnSync("git", args, { cwd: projectDir, encoding: "utf8", windowsHide: true });
  return { ok: result.status === 0, output: result.stdout?.trim() ?? "" };
}

export function checkPortableArtifacts(projectDir: string, files: string[]): string[] {
  if (!files.length) return [];
  const inside = gitOutput(projectDir, ["rev-parse", "--show-toplevel"]);
  if (!inside.ok) return ["portable Showcase evidence requires a Git worktree"];
  const root = path.resolve(inside.output);
  const blockers: string[] = [];
  for (const file of files) {
    const absolute = path.resolve(projectDir, file);
    const relative = path.relative(root, absolute).replaceAll("\\", "/");
    if (relative.startsWith("../") || path.isAbsolute(relative))
      blockers.push(`required artifact is outside the repository: ${file}`);
    else if (!fs.existsSync(absolute))
      blockers.push(`required artifact is missing: ${relative}`);
    else {
      const tracked = gitOutput(root, ["ls-files", "--error-unmatch", "--", relative]);
      if (!tracked.ok) {
        const ignored = spawnSync("git", ["check-ignore", "-q", "--", relative], { cwd: root, windowsHide: true }).status === 0;
        blockers.push(`required artifact must be tracked${ignored ? " and is currently ignored" : ""}: ${relative}`);
      }
    }
  }
  return blockers;
}

/**
 * Only media the shipped route actually loads. Prototype captures, recordings
 * and storyboards used to be tracked and byte-checked here; they proved a file
 * existed with plausible dimensions, never that it showed the design, so the
 * portability requirement now covers assets the browser resolves on the page.
 */
export function localShowcaseArtifacts(contract: {
  assetCommitments?: { sourceKind?: string; sourceRef?: string }[];
}): { files: string[]; blockers: string[] } {
  const values = (contract.assetCommitments ?? [])
    .filter((asset) => asset.sourceKind === "local-file")
    .map((asset) => asset.sourceRef ?? "")
    .filter(Boolean);
  const files: string[] = [];
  const blockers: string[] = [];
  for (const value of values) {
    if (/^https?:\/\//i.test(value)) continue;
    if (path.win32.isAbsolute(value) || path.posix.isAbsolute(value)) blockers.push(`Showcase evidence must not use an absolute machine path: ${value}`);
    else files.push(value);
  }
  return { files: [...new Set(files)], blockers };
}

function allowedUntrackedPath(file: string): boolean {
  const normalized = file.replaceAll("\\", "/");
  return normalized.startsWith(".dreative/generated/")
    || normalized.startsWith(".dreative/cache/")
    || normalized.startsWith(".dreative/.cache/")
    || normalized.startsWith(".dreative/evaluation/screenshots/")
    || normalized === ".dreative/context.local.json"
    || normalized === ".env.local"
    || /^\.env\..+\.local$/.test(normalized);
}

function checkEvaluationHandoff(projectDir: string): string[] {
  const record = path.join(projectDir, ".dreative", "evaluation", "current-run.md");
  if (!fs.existsSync(record)) return [];
  const text = fs.readFileSync(record, "utf8");
  const blockers: string[] = [];
  if (/##\s+Reviewer verdict[\s\S]*?\b(?:Result|Verdict)\s*:\s*pass\b/i.test(text))
    blockers.push("evaluation handoff contains a self-authored reviewer pass");
  const git = gitOutput(projectDir, ["rev-parse", "--is-inside-work-tree"]);
  if (!git.ok || git.output !== "true") return blockers;

  const revisionFields = text.split(/\r?\n/).filter((line) => /^\s*-\s*Commit(?:\s+or\s+branch)?\s*:/i.test(line));
  const revisions = revisionFields.flatMap((line) => line.match(/\b[0-9a-f]{7,40}\b/gi) ?? []);
  if (revisionFields.length !== 1 || revisions.length !== 1) {
    blockers.push('evaluation handoff requires exactly one explicit Commit or "Commit or branch" entry containing one Git revision');
  } else {
    const revision = revisions[0];
    const implementation = gitOutput(projectDir, ["rev-parse", "--verify", `${revision}^{commit}`]);
    const head = gitOutput(projectDir, ["rev-parse", "HEAD"]);
    const ancestor = implementation.ok && head.ok
      ? spawnSync("git", ["merge-base", "--is-ancestor", implementation.output, head.output], { cwd: projectDir, windowsHide: true }).status === 0
      : false;
    if (!implementation.ok || !head.ok || !ancestor) {
      blockers.push(`evaluation handoff revision ${revision} is not an implementation commit reachable from current HEAD`);
    } else if (implementation.output !== head.output) {
      const changed = gitOutput(projectDir, ["diff", "--name-only", `${implementation.output}..${head.output}`]);
      const nonEvaluation = changed.ok
        ? changed.output.split(/\r?\n/).filter(Boolean).filter((file) => !file.replaceAll("\\", "/").startsWith(".dreative/evaluation/"))
        : [];
      if (!changed.ok) blockers.push("evaluation handoff could not inspect commits after the implementation revision");
      else if (nonEvaluation.length) blockers.push(`implementation files changed after the evaluated revision: ${nonEvaluation.join(", ")}`);
    }
  }

  const status = gitOutput(projectDir, ["status", "--porcelain", "--untracked-files=no"]);
  if (!status.ok) blockers.push("evaluation handoff could not verify the tracked working tree");
  else if (status.output) blockers.push("evaluation handoff requires all tracked changes to be committed");

  const untracked = gitOutput(projectDir, ["ls-files", "--others", "--exclude-standard"]);
  if (!untracked.ok) blockers.push("evaluation handoff could not inspect untracked files");
  else {
    const unexpected = untracked.output.split(/\r?\n/).filter(Boolean).filter((file) => !allowedUntrackedPath(file));
    if (unexpected.length) blockers.push(`evaluation handoff contains unexpected untracked files: ${unexpected.join(", ")}`);
  }
  return blockers;
}

/**
 * Finalization deliberately certifies only facts the CLI can determine.
 * Visual quality remains a browser-inspection responsibility in the skill;
 * local attestations, approval hashes, and model-authored evidence cannot make
 * an unattractive interface good.
 */
export function runFinalize(
  projectDir: string,
  options: { target: "claude" | "codex"; sourceDir: string; packageVersion: string; portableArtifacts?: string[]; cleanWorktree?: boolean },
): FinalizeResult {
  const commands: { command: string; exitCode: number }[] = [];
  const blockers: string[] = [];
  const packageFile = path.join(projectDir, "package.json");

  if (!fs.existsSync(packageFile)) {
    return { ok: false, commands, blockers: ["package.json is missing; deterministic project checks cannot run"] };
  }

  blockers.push(...checkSkillInstallation({
    sourceDir: options.sourceDir,
    projectDir,
    packageVersion: options.packageVersion,
    target: options.target,
  }).map((message) => `skill installation: ${message}`));
  blockers.push(...checkEvaluationHandoff(projectDir));
  blockers.push(...checkPortableArtifacts(projectDir, options.portableArtifacts ?? []));

  const pkg = JSON.parse(fs.readFileSync(packageFile, "utf8"));
  const scripts = ["build", "test", "typecheck", "lint"].filter((script) => Boolean(pkg.scripts?.[script]));
  if (!scripts.includes("build")) blockers.push("package.json must provide a build script");

  if (options.cleanWorktree) {
    const root = gitOutput(projectDir, ["rev-parse", "--show-toplevel"]);
    const status = gitOutput(projectDir, ["status", "--porcelain"]);
    if (!root.ok) blockers.push("Showcase clean-worktree verification requires Git");
    else if (!status.ok || status.output) blockers.push("Showcase clean-worktree verification requires a clean committed HEAD");
    else {
      const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-clean-worktree-"));
      fs.rmSync(temporary, { recursive: true, force: true });
      const added = spawnSync("git", ["worktree", "add", "--detach", temporary, "HEAD"], { cwd: root.output, encoding: "utf8", windowsHide: true });
      if (added.status !== 0) blockers.push(`could not create clean verification worktree: ${added.stderr?.trim() || "git worktree add failed"}`);
      else {
        try {
          const install = fs.existsSync(path.join(temporary, "package-lock.json"))
            ? runNpmCommand(temporary, ["ci", "--ignore-scripts"])
            : runNpmCommand(temporary, ["install", "--ignore-scripts"]);
          commands.push({ command: `clean-worktree: ${install.command}`, exitCode: install.exitCode });
          if (install.exitCode !== 0) blockers.push(`clean-worktree ${install.command} exited ${install.exitCode}`);
          if (install.exitCode === 0) for (const script of scripts) {
            const result = runNpmScript(temporary, script);
            commands.push({ command: `clean-worktree: ${result.command}`, exitCode: result.exitCode });
            if (result.exitCode !== 0) blockers.push(`clean-worktree ${result.command} exited ${result.exitCode}`);
          }
        } finally {
          spawnSync("git", ["worktree", "remove", "--force", temporary], { cwd: root.output, windowsHide: true });
          fs.rmSync(temporary, { recursive: true, force: true });
        }
      }
    }
  }

  for (const script of scripts) {
    const result = runNpmScript(projectDir, script);
    commands.push(result);
    if (result.exitCode !== 0) blockers.push(`${result.command} exited ${result.exitCode}`);
  }

  const docs = runDocsCheck(options.sourceDir);
  commands.push({ command: "dreative docs-check", exitCode: docs.ok ? 0 : 1 });
  blockers.push(...docs.findings.map((finding) => `${finding.file}: ${finding.message}`));

  return { ok: blockers.length === 0, commands, blockers: [...new Set(blockers)] };
}
