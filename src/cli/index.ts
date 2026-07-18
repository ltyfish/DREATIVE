#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline";
import { createServer } from "../server/index.js";
import { detectCodingHost, detectProjectPreflight, resolveRuntimeRequirements } from "../shared/preflight.js";
import { printDocsCheck, runDocsCheck } from "./docsCheck.js";
import { runFinalize } from "./finalize.js";
import { availableSkills, checkSkillInstallation, installSkill, installationDirectory, resolveSkillSelection } from "./installSkill.js";
import { renderAgentCatalogue, searchCreativeCatalog } from "../shared/creativeCatalog.js";
import { renderConfigurationChoices, renderDeliveryBrief, renderDetailedPlanGuide, type DeliveryProfileId } from "../shared/deliveryProfiles.js";

const port = Number(process.env.DREATIVE_PORT || 4820);
const base = `http://localhost:${port}`;
const args = process.argv.slice(2);
const cmd = args[0] && !args[0].startsWith("-") ? args[0] : "brief";
const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const packagedSkillDir = path.join(packageRoot, "skill", "dreative");
const packageVersion = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8")).version as string;

function hostTarget(): "codex" | "claude" {
  if (args.includes("--codex")) return "codex";
  if (args.includes("--claude")) return "claude";
  const detected = detectCodingHost(process.cwd());
  if (!detected.expectedSkillTarget)
    throw new Error("CODING_HOST_UNKNOWN: pass --codex or --claude (or set DREATIVE_HOST); Dreative will not silently default to Claude");
  return detected.expectedSkillTarget;
}

const USAGE = `usage: dreative [command]
  brief            show the three concise delivery approaches (default)
                   --recommend efficient|recommended|showcase
                   --configure efficient|recommended|showcase
                   --detailed efficient|recommended|showcase
  start-editor     explicitly serve the optional visual editor; never opens a browser
  install-skill    exact-sync the packaged skill and write a hashed manifest
                   --list | --skills all|a,b | --codex | --check
  preflight        detect the current framework, package manager, scripts and capabilities
                   --mechanisms a,b   resolve mechanism-led package/install requirements
  catalogue        search the executable creative catalogue [--query phrase] [--json]
  finalize         run build/test/typecheck/lint/docs checks; prints DREATIVE_FINALIZED on success
                   --codex
  docs-check       validate packaged documentation consistency [--json]`;

async function installCommand(): Promise<void> {
  const available = availableSkills(packagedSkillDir);
  if (args.includes("--list")) {
    console.log("specialist skills:");
    for (const name of available) console.log(`  ${name}`);
    return;
  }
  const target = hostTarget();
  if (args.includes("--check")) {
    const errors = checkSkillInstallation({ sourceDir: packagedSkillDir, projectDir: process.cwd(), packageVersion, target });
    if (errors.length) { errors.forEach((error) => console.error(`ERROR ${error}`)); process.exitCode = 1; return; }
    const manifest = JSON.parse(fs.readFileSync(path.join(installationDirectory(process.cwd(), target), ".dreative-install.json"), "utf8"));
    console.log(`ok — exact ${target} installation verified`);
    console.log(`specialist skills: ${manifest.selectedSkills.join(", ") || "none"}`);
    return;
  }
  const index = args.indexOf("--skills");
  let raw = index >= 0 ? args[index + 1] : undefined;
  if (index < 0 && process.stdin.isTTY && available.length) {
    console.log(`specialist skills: ${available.join(", ")}`);
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    raw = (await new Promise<string>((resolve) => rl.question("install which? (names, comma-separated; Enter = all): ", resolve))).trim();
    rl.close();
  }
  const selection = resolveSkillSelection(raw, available);
  const manifest = installSkill({ sourceDir: packagedSkillDir, projectDir: process.cwd(), packageVersion, target, ...selection });
  console.log(`installed exact ${target} skill set to ${installationDirectory(process.cwd(), target)}`);
  console.log(`specialist skills: ${manifest.selectedSkills.join(", ") || "none"}`);
}

async function main(): Promise<void> {
  if (args.includes("--help") || args.includes("-h")) { console.log(USAGE); return; }
  switch (cmd) {
    case "brief": {
      const configureIndex = args.indexOf("--configure");
      if (configureIndex >= 0) {
        const selected = (args[configureIndex + 1] ?? "") as DeliveryProfileId;
        if (!["efficient", "recommended", "showcase"].includes(selected))
          throw new Error(`invalid --configure: ${selected}`);
        console.log(renderConfigurationChoices(selected));
        return;
      }
      const detailedIndex = args.indexOf("--detailed");
      if (detailedIndex >= 0) {
        const selected = (args[detailedIndex + 1] ?? "recommended") as DeliveryProfileId;
        if (!["efficient", "recommended", "showcase"].includes(selected))
          throw new Error(`invalid --detailed: ${selected}`);
        console.log(renderDetailedPlanGuide(selected));
        return;
      }
      const index = args.indexOf("--recommend");
      const recommendation = (index >= 0 ? args[index + 1] : "recommended") as DeliveryProfileId;
      if (!["efficient", "recommended", "showcase"].includes(recommendation))
        throw new Error(`invalid --recommend: ${recommendation}`);
      console.log(renderDeliveryBrief(recommendation));
      return;
    }
    case "start": {
      console.error("deprecated: use `dreative start-editor`; the editor is optional and will not open a browser");
      process.exitCode = 1;
      return;
    }
    case "start-editor": {
      const server = createServer(process.cwd()).listen(port, () => {
        console.log(`\nOptional Dreative editor running for ${process.cwd()}\n${base}\n`);
      });
      server.on("error", (error) => { console.error(`failed to start on :${port} — ${String(error)}`); process.exit(1); });
      return;
    }
    case "install-skill": await installCommand(); return;
    case "finalize": {
      const result = runFinalize(process.cwd(), { target: hostTarget(), sourceDir: packagedSkillDir, packageVersion });
      for (const item of result.commands) console.log(`${item.exitCode === 0 ? "PASS" : "FAIL"} ${item.command}`);
      if (!result.ok) {
        result.blockers.forEach((item) => console.error(`BLOCKER ${item}`));
        console.error("Dreative finalization failed. The build is incomplete.");
        process.exitCode = 1;
        return;
      }
      console.log("DREATIVE_FINALIZED");
      return;
    }
    case "preflight": {
      const preflight = detectProjectPreflight(process.cwd());
      const index = args.indexOf("--mechanisms");
      const mechanisms = index >= 0 ? (args[index + 1] ?? "").split(",").map((item) => item.trim()).filter(Boolean) : [];
      console.log(JSON.stringify({ preflight, runtimeRequirements: resolveRuntimeRequirements(mechanisms, preflight) }, null, 2));
      return;
    }
    case "catalogue": {
      const index = args.indexOf("--query");
      const query = index >= 0 ? args[index + 1] ?? "" : args.slice(1).filter((item) => !item.startsWith("--")).join(" ");
      if (args.includes("--json")) console.log(JSON.stringify(searchCreativeCatalog(query), null, 2));
      else console.log(renderAgentCatalogue(query || undefined));
      return;
    }
    case "docs-check": {
      const report = runDocsCheck(packagedSkillDir); printDocsCheck(report, args.includes("--json"));
      if (!report.ok) process.exitCode = 1; return;
    }
    case "wait": {
      const index = args.indexOf("--timeout");
      const deadline = Date.now() + (index >= 0 ? Number(args[index + 1]) : 480) * 1000;
      while (Date.now() < deadline) {
        const response = await fetch(`${base}/api/agent/next`);
        if (response.status === 204) continue;
        if (!response.ok) throw new Error(`server error ${response.status}`);
        console.log(JSON.stringify(await response.json())); return;
      }
      console.log(JSON.stringify({ kind: "none" })); return;
    }
    case "respond": {
      const id = args[1]; if (!id) throw new Error("usage: dreative respond <requestId> [resultFile] [--error msg]");
      const errorIndex = args.indexOf("--error");
      const body: { id: string; result?: unknown; error?: string } = { id };
      if (errorIndex >= 0) body.error = args[errorIndex + 1] || "agent error";
      else body.result = args[2] ? JSON.parse(fs.readFileSync(args[2], "utf8")) : { ok: true };
      const response = await fetch(`${base}/api/agent/respond`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error(`respond failed: ${await response.text()}`);
      console.log("ok"); return;
    }
    case "baseline": {
      const response = await fetch(`${base}/api/baseline`, { method: "POST" });
      if (!response.ok) throw new Error(`baseline failed: ${await response.text()}`);
      console.log("ok"); return;
    }
    default: console.error(`unknown command: ${cmd}\n${USAGE}`); process.exit(1);
  }
}

main().catch((error) => { console.error(String(error)); process.exit(1); });
