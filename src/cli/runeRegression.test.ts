import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AdmZip from "adm-zip";
import { runDirectDesignAudit } from "./audit.js";
import { runFinalize } from "./finalize.js";

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const archive = path.join(packageRoot, "fixtures", "rune-failed.zip");
const sourceDir = path.join(packageRoot, "skill", "dreative");
const packageVersion = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8")).version;

function extractRune(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-rune-regression-"));
  const zip = new AdmZip(archive);
  for (const entry of zip.getEntries()) {
    const name = entry.entryName.replaceAll("\\", "/");
    if (name.startsWith("__MACOSX/") || name.startsWith("idk/node_modules/")) continue;
    zip.extractEntryTo(entry, root, true, true);
  }
  return path.join(root, "idk");
}

test("unchanged failed RUNE dogfood fixture cannot audit or finalize", () => {
  assert.equal(fs.existsSync(archive), true, "immutable RUNE fixture archive is required");
  const root = extractRune();
  const audit = runDirectDesignAudit(root);
  assert.equal(audit.ok, false);
  const output = audit.findings.map((item) => `${item.check}: ${item.message}`).join("\n");
  for (const expected of [
    "IMPLEMENTATION_STARTED_BEFORE_PLAN_APPROVAL",
    "PLAN_MISSING_REQUIREMENT_TRACEABILITY",
    "UNTRUSTED_PLAYWRIGHT_PROVENANCE",
    "BUILDER_AUTHORED_CRITIC",
    "PLANNED_SCROLL_MECHANISM_MISSING",
    "MATERIAL_MECHANISM_SUBSTITUTION",
    "specifications view/download",
    "reservation close/reopen",
    "EVIDENCE_ARTIFACT_TYPE_MISMATCH",
  ]) assert.match(output, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), expected);
  const finalized = runFinalize(root, { target: "codex", sourceDir, packageVersion });
  assert.equal(finalized.ok, false);
  assert.ok(finalized.blockers.length > 0);
});
