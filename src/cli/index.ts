#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline";
import {
  detectCodingHost,
  detectProjectPreflight,
  parseCapabilitiesFile,
  runBrowserWorkflowProbe,
  resolveRuntimeRequirements,
  type CreativePermissions,
  validateCreativePermissions,
} from "../shared/preflight.js";
import { printDocsCheck, runDocsCheck } from "./docsCheck.js";
import { runFinalize } from "./finalize.js";
import { runVisualSmoke, type DeliveryProfile, type ShowcaseMechanismContract } from "./visualSmoke.js";
import { availableSkills, checkSkillInstallation, installSkill, installationDirectory, resolveSkillSelection } from "./installSkill.js";
import { renderAgentCatalogue, searchCreativeCatalog } from "../shared/creativeCatalog.js";
import { renderConfigurationChoices, renderDeliveryBrief, renderDetailedPlanGuide, type DeliveryProfileId } from "../shared/deliveryProfiles.js";
import { initializeProjectContext, readProjectContext } from "../shared/projectContext.js";

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
  install-skill    exact-sync the packaged skill and write a hashed manifest
                   --list | --skills all|a,b | --codex | --check
  preflight        detect the current framework, package manager, scripts and capabilities
                   --mechanisms a,b   resolve mechanism-led package/install requirements
                   --permissions file-or-json
                   --generated-images allow|deny  --external-images allow|deny
                   --generated-video allow|deny   --external-video allow|deny
                   --three-d-policy not-allowed|supplied-only|external-sourcing-allowed|generation-and-sourcing-allowed
                   --packages allow|deny  --capabilities file
                   --probe-browser http://127.0.0.1:PORT
                     bounded Chromium launch + preview-navigation verification
  context          durable project design memory: init | check | show
  catalogue        search the executable creative catalogue [--query phrase] [--json]
  visual-smoke     production-equivalent browser smoke audit --url URL --profile efficient|recommended|showcase
                   Showcase also requires --mechanism-contract file-or-json
  finalize         run deterministic checks; always requires --visual-smoke-url URL and --profile
                   --codex --visual-smoke-url URL --profile efficient|recommended|showcase
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
    case "install-skill": await installCommand(); return;
    case "finalize": {
      const valueAfter = (flag: string): string | undefined => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
      const smokeIndex = args.indexOf("--visual-smoke-url");
      const smokeUrl = smokeIndex >= 0 ? args[smokeIndex + 1] : undefined;
      const profile = valueAfter("--profile") as DeliveryProfile | undefined;
      if (!smokeUrl || !profile || !["efficient", "recommended", "showcase"].includes(profile)) {
        console.error("BLOCKER finalize requires --visual-smoke-url and --profile efficient|recommended|showcase.");
        process.exitCode = 1;
        return;
      }
      const contractInput = valueAfter("--mechanism-contract");
      const showcase = contractInput ? JSON.parse(fs.existsSync(path.resolve(contractInput)) ? fs.readFileSync(path.resolve(contractInput), "utf8") : contractInput) as ShowcaseMechanismContract : undefined;
      {
        const smoke = await runVisualSmoke(smokeUrl, { profile, showcase });
        smoke.checks.forEach((item) => console.log(`PASS visual-smoke ${item}`));
        if (!smoke.ok) {
          smoke.blockers.forEach((item) => console.error(`BLOCKER visual-smoke: ${item}`));
          process.exitCode = 1;
          return;
        }
      }
      const result = runFinalize(process.cwd(), { target: hostTarget(), sourceDir: packagedSkillDir, packageVersion });
      for (const item of result.commands) console.log(`${item.exitCode === 0 ? "PASS" : "FAIL"} ${item.command}`);
      if (!result.ok) {
        result.blockers.forEach((item) => console.error(`BLOCKER ${item}`));
        console.error("Dreative finalization failed. The build is incomplete.");
        process.exitCode = 1;
        return;
      }
      console.log("DREATIVE_CHECKS_PASSED");
      console.log("Visual quality is not certified by this command.");
      return;
    }
    case "visual-smoke": {
      const valueAfter = (flag: string): string | undefined => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
      const url = valueAfter("--url");
      const profile = valueAfter("--profile") as DeliveryProfile | undefined;
      if (!url || !profile || !["efficient", "recommended", "showcase"].includes(profile)) throw new Error("visual-smoke requires --url and --profile efficient|recommended|showcase");
      const contractInput = valueAfter("--mechanism-contract");
      const showcase = contractInput ? JSON.parse(fs.existsSync(path.resolve(contractInput)) ? fs.readFileSync(path.resolve(contractInput), "utf8") : contractInput) as ShowcaseMechanismContract : undefined;
      const result = await runVisualSmoke(url, { profile, showcase });
      result.checks.forEach((item) => console.log(`PASS ${item}`));
      result.blockers.forEach((item) => console.error(`BLOCKER ${item}`));
      if (!result.ok) process.exitCode = 1;
      return;
    }
    case "preflight": {
      const valueAfter = (flag: string): string | undefined => {
        const index = args.indexOf(flag);
        return index >= 0 ? args[index + 1] : undefined;
      };
      const permissionInput = valueAfter("--permissions");
      let permissions: Partial<CreativePermissions> = {};
      if (permissionInput) {
        const raw = fs.existsSync(path.resolve(permissionInput))
          ? fs.readFileSync(path.resolve(permissionInput), "utf8")
          : permissionInput;
        const parsed: unknown = JSON.parse(raw);
        validateCreativePermissions(parsed);
        permissions = parsed;
      }
      const booleanChoice = (flag: string): boolean | undefined => {
        const value = valueAfter(flag);
        if (value === undefined) return undefined;
        if (value === "allow") return true;
        if (value === "deny") return false;
        throw new Error(`${flag} must be allow or deny`);
      };
      const choices: [keyof CreativePermissions, boolean | undefined][] = [
        ["generatedImagesAllowed", booleanChoice("--generated-images")],
        ["externalImagesAllowed", booleanChoice("--external-images")],
        ["generatedVideoAllowed", booleanChoice("--generated-video")],
        ["externalVideoAllowed", booleanChoice("--external-video")],
        ["packageInstallationAllowed", booleanChoice("--packages")],
      ];
      for (const [key, value] of choices) if (value !== undefined) permissions[key] = value as never;
      const threeDPolicy = valueAfter("--three-d-policy");
      if (threeDPolicy) {
        const allowed = ["not-allowed", "supplied-only", "external-sourcing-allowed", "generation-and-sourcing-allowed"];
        if (!allowed.includes(threeDPolicy)) throw new Error(`invalid --three-d-policy: ${threeDPolicy}`);
        permissions.threeDPolicy = threeDPolicy as CreativePermissions["threeDPolicy"];
      }
      const capabilitiesFile = valueAfter("--capabilities");
      const probeUrl = valueAfter("--probe-browser");
      if (args.includes("--probe-browser") && (!probeUrl || probeUrl.startsWith("--")))
        throw new Error("--probe-browser requires the URL of an already-running preview");
      const browserProbe = probeUrl ? runBrowserWorkflowProbe(process.cwd(), probeUrl) : undefined;
      const preflight = detectProjectPreflight(process.cwd(), {
        permissions,
        explicitCapabilities: capabilitiesFile ? parseCapabilitiesFile(path.resolve(capabilitiesFile)) : undefined,
        browserProbe,
      });
      const index = args.indexOf("--mechanisms");
      const mechanisms = index >= 0 ? (args[index + 1] ?? "").split(",").map((item) => item.trim()).filter(Boolean) : [];
      console.log(JSON.stringify({ preflight, runtimeRequirements: resolveRuntimeRequirements(mechanisms, preflight) }, null, 2));
      return;
    }
    case "context": {
      const action = args[1] ?? "check";
      if (action === "init") {
        const result = initializeProjectContext(process.cwd());
        console.log(`${result.created ? "created" : "exists"} ${result.file}`);
        return;
      }
      const result = readProjectContext(process.cwd());
      if (!result.context) {
        console.error(result.errors.length ? result.errors.join("\n") : `missing ${result.file}; run dreative context init`);
        process.exitCode = 1;
        return;
      }
      if (result.errors.length) {
        result.errors.forEach((error) => console.error(`ERROR ${error}`));
        process.exitCode = 1;
        return;
      }
      if (action === "show") console.log(JSON.stringify(result.context, null, 2));
      else if (action === "check") console.log(`valid ${result.file} (${result.context.status})`);
      else throw new Error("usage: dreative context init|check|show");
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
    default: console.error(`unknown command: ${cmd}\n${USAGE}`); process.exit(1);
  }
}

main().catch((error) => { console.error(String(error)); process.exit(1); });
