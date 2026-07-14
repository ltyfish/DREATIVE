import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { renderCriticPrompt } from "./critic.js";

test("critic-prompt renders only the closed objective input artifact", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-critic-prompt-"));
  try {
    fs.mkdirSync(path.join(root, ".dreative"));
    const input = { version: 1, generatedAt: "2026-07-14T02:00:00.000Z", originalBrief: "Create an authored editorial product website for this brand.", userConstraints: [], approvedConcept: "A product ledger controls composition and interaction across the story.", visualBlueprints: [{ pageId: "home", sectionId: "hero", blueprint: "An offset ledger connects the hero product state to later editorial chapters." }], intendedSignature: "Product ledger", baselineAvailable: false, evidence: [{ id: "desktop", kind: "final-screenshot", description: "Final desktop", artifactPath: ".dreative/desktop.png", viewport: { width: 1440, height: 900 } }, { id: "mobile", kind: "final-screenshot", description: "Final mobile", artifactPath: ".dreative/mobile.png", viewport: { width: 390, height: 844 } }], contextPolicy: { firstPass: "objective-only", excluded: ["builder-self-review", "implementation-rationale", "quality-claims", "difficulty-excuses", "builder-score"] } };
    fs.writeFileSync(path.join(root, ".dreative", "critic-input.json"), JSON.stringify(input));
    const prompt = renderCriticPrompt(root);
    assert.match(prompt, /Product ledger/);
    assert.match(prompt, /objective-only/);
    assert.doesNotMatch(prompt, /builder said it looks excellent/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
