import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { runDirectDesignAudit } from "./audit.js";
import { checkSkillInstallation } from "./installSkill.js";

export interface FinalizeResult { ok: boolean; commands: { command: string; exitCode: number }[]; blockers: string[]; }

export function runFinalize(projectDir: string, options: { target: "claude" | "codex"; sourceDir: string; packageVersion: string }): FinalizeResult {
  const blockers: string[] = [];
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
