import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { runDirectDesignAudit } from "./audit.js";

test("direct-design audit verifies artifacts and preservation needles", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-audit-"));
  try {
    fs.mkdirSync(path.join(root, ".dreative"));
    fs.mkdirSync(path.join(root, "src"));
    fs.writeFileSync(path.join(root, "src", "App.tsx"), 'export const App = () => <a href="/pricing">Pricing</a>;');
    fs.writeFileSync(
      path.join(root, ".dreative", "plan.json"),
      JSON.stringify({
        version: 2,
        request: "Polish pricing",
        createdAt: new Date().toISOString(),
        tier: "solid",
        depth: "restyle",
        skills: ["ux", "mobile"],
        skillPolicy: { mode: "hybrid", global: ["ux", "mobile"], routingApproved: true, userAssignments: [] },
        designRead: { register: "product", concept: "clear value", signature: "pricing rail" },
        preservationManifest: ".dreative/preservation.json",
        decisionLedger: ".dreative/ledger.json",
        pages: [
          {
            id: "pricing-page",
            name: "Pricing page",
            skills: ["ux", "mobile"],
            sections: [
              {
                id: "pricing",
                name: "Pricing",
                layoutFamily: "comparison",
                skills: ["ux", "mobile"],
                interactions: [],
                mobile: "stacked plans",
                fallback: "semantic table",
                verification: ["Pricing link remains"],
                assets: [],
                status: "shipped",
              },
            ],
          },
        ],
      }),
    );
    fs.writeFileSync(
      path.join(root, ".dreative", "preservation.json"),
      JSON.stringify({
        version: 1,
        createdAt: new Date().toISOString(),
        items: [{ id: "pricing-link", kind: "link", file: "src/App.tsx", needle: 'href="/pricing"', purpose: "Pricing navigation" }],
      }),
    );
    fs.writeFileSync(path.join(root, ".dreative", "ledger.json"), JSON.stringify({ version: 1, entries: [] }));
    fs.writeFileSync(
      path.join(root, ".dreative", "verify.json"),
      JSON.stringify({
        version: 1,
        generatedAt: new Date().toISOString(),
        evidence: [
          {
            id: "pricing-link",
            criterion: "Pricing link remains",
            status: "pass",
            evidence: "Clicked /pricing in production build",
            proof: { timestamp: new Date().toISOString(), testedUrl: "http://localhost:3000/pricing", consoleErrorCount: 0 },
          },
        ],
      }),
    );

    const report = runDirectDesignAudit(root);
    assert.equal(report.ok, true, JSON.stringify(report.findings));
    assert.ok(report.findings.some((item) => item.check === "migration" && item.level === "warning"));

    const verifyFile = path.join(root, ".dreative", "verify.json");
    const verify = JSON.parse(fs.readFileSync(verifyFile, "utf-8"));
    verify.evidence[0].proof.artifactPath = ".dreative/screenshots/missing.png";
    fs.writeFileSync(verifyFile, JSON.stringify(verify));
    const missingArtifact = runDirectDesignAudit(root);
    assert.equal(missingArtifact.ok, false);
    assert.ok(missingArtifact.findings.some((item) => item.message.includes("evidence artifact is missing")));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
