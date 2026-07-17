import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { runDirectDesignAudit } from "./audit.js";
import { checkSkillInstallation } from "./installSkill.js";

export interface FinalizeResult { ok: boolean; commands: { command: string; exitCode: number }[]; blockers: string[]; }

export function runFinalize(projectDir: string, options: { target: "claude" | "codex"; sourceDir: string; packageVersion: string }): FinalizeResult {
  const blockers: string[] = [];
  if (!fs.existsSync(path.join(projectDir, ".dreative", "plan.yaml")))
    blockers.push("migration: finalization requires canonical .dreative/plan.yaml; legacy plan.json evidence is readable for migration but cannot certify completion");
  const runsDir = path.join(projectDir, ".dreative", "runs");
  const hasTrustedBrowserRun = fs.existsSync(runsDir) && fs.readdirSync(runsDir, { withFileTypes: true })
    .some((entry) => entry.isDirectory() && fs.existsSync(path.join(runsDir, entry.name, "trusted-verification.json")));
  if (!hasTrustedBrowserRun)
    blockers.push("evidence provenance: finalization requires a sealed `dreative verify` browser run; manually authored verify.json is not certifiable");
  const installation = checkSkillInstallation({ sourceDir: options.sourceDir, projectDir, packageVersion: options.packageVersion, target: options.target });
  blockers.push(...installation.map((item) => `skill installation: ${item}`));
  const packageFile = path.join(projectDir, "package.json");
  const pkg = fs.existsSync(packageFile) ? JSON.parse(fs.readFileSync(packageFile, "utf8")) : {};
  const commands: { command: string; exitCode: number }[] = [];
  for (const script of ["build", "test", "typecheck", "lint"] as const) {
    if (!pkg.scripts?.[script]) continue;
    const command = `npm run ${script}`;
    const result = process.platform === "win32"
      ? spawnSync(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", command], { cwd: projectDir, stdio: "inherit" })
      : spawnSync("npm", ["run", script], { cwd: projectDir, stdio: "inherit" });
    const exitCode = result.status ?? 1;
    commands.push({ command, exitCode });
    if (exitCode !== 0) blockers.push(`${command} exited ${exitCode}`);
  }
  const audit = runDirectDesignAudit(projectDir);
  blockers.push(...audit.findings.filter((item) => item.level === "error").map((item) => `${item.check}: ${item.message}`));
  return { ok: blockers.length === 0, commands, blockers: [...new Set(blockers)] };
}
