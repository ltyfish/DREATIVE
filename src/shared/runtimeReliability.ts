import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { activeLockfile } from "./projectIdentity.js";

export interface PackageTransactionResult {
  ok: boolean;
  group: string;
  rolledBack: boolean;
  commands: { command: string; exitCode: number }[];
  error?: string;
}

function run(command: string, cwd: string): number {
  const result = process.platform === "win32"
    ? spawnSync(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", command], { cwd, stdio: "pipe" })
    : spawnSync("sh", ["-lc", command], { cwd, stdio: "pipe" });
  return result.status ?? 1;
}

export function installRuntimeGroup(projectDir: string, group: string, packages: string[], smokeCommands: string[], runner = run): PackageTransactionResult {
  const packageFile = path.join(projectDir, "package.json");
  if (!fs.existsSync(packageFile)) return { ok: false, group, rolledBack: false, commands: [], error: "missing package.json" };
  const lockName = activeLockfile(projectDir);
  const lockFile = lockName ? path.join(projectDir, lockName) : null;
  const packageBackup = fs.readFileSync(packageFile);
  const lockBackup = lockFile && fs.existsSync(lockFile) ? fs.readFileSync(lockFile) : null;
  const pkg = JSON.parse(packageBackup.toString());
  const manager = lockName?.startsWith("pnpm") ? "pnpm" : lockName === "yarn.lock" ? "yarn" : lockName?.startsWith("bun") ? "bun" : "npm";
  const install = manager === "npm" ? `npm install ${packages.join(" ")}` : manager === "yarn" ? `yarn add ${packages.join(" ")}` : manager === "bun" ? `bun add ${packages.join(" ")}` : `pnpm add ${packages.join(" ")}`;
  const commands: { command: string; exitCode: number }[] = [];
  const restore = () => {
    fs.writeFileSync(packageFile, packageBackup);
    if (lockFile && lockBackup) fs.writeFileSync(lockFile, lockBackup);
    else if (lockFile && fs.existsSync(lockFile)) fs.rmSync(lockFile);
  };
  for (const command of [install, ...smokeCommands]) {
    const exitCode = runner(command, projectDir);
    commands.push({ command, exitCode });
    if (exitCode !== 0) {
      restore();
      return { ok: false, group, rolledBack: true, commands, error: `${command} failed; package and lockfile state restored` };
    }
  }
  void pkg;
  return { ok: true, group, rolledBack: false, commands };
}

export function detectCompetingOwners(source: string): string[] {
  const owners = [
    /ReactLenis|\bLenis\b/.test(source) && "lenis",
    /ScrollTrigger/.test(source) && "gsap-scrolltrigger",
    /addEventListener\(["']scroll/.test(source) && "custom-scroll-listener",
    /requestAnimationFrame/.test(source) && "requestAnimationFrame",
    /gsap\.ticker/.test(source) && "gsap-ticker",
    /renderer\.setAnimationLoop|renderer\.render/.test(source) && "webgl-render-loop",
  ].filter(Boolean) as string[];
  return owners.length > 1 ? owners : [];
}

