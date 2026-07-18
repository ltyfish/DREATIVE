import fs from "node:fs";
import path from "node:path";
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

/**
 * Finalization deliberately certifies only facts the CLI can determine.
 * Visual quality remains a browser-inspection responsibility in the skill;
 * local attestations, approval hashes, and model-authored evidence cannot make
 * an unattractive interface good.
 */
export function runFinalize(
  projectDir: string,
  options: { target: "claude" | "codex"; sourceDir: string; packageVersion: string },
): FinalizeResult {
  const commands: { command: string; exitCode: number }[] = [];
  const blockers: string[] = [];
  const packageFile = path.join(projectDir, "package.json");

  if (!fs.existsSync(packageFile)) {
    return { ok: false, commands, blockers: ["package.json is missing; deterministic project checks cannot run"] };
  }

  const pkg = JSON.parse(fs.readFileSync(packageFile, "utf8"));
  const scripts = ["build", "test", "typecheck", "lint"].filter((script) => Boolean(pkg.scripts?.[script]));
  if (!scripts.includes("build")) blockers.push("package.json must provide a build script");

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
