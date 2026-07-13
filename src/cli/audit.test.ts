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
        version: 1,
        request: "Polish pricing",
        createdAt: new Date().toISOString(),
        tier: "solid",
        depth: "restyle",
        skills: ["ux", "mobile"],
        designRead: { register: "product", concept: "clear value", signature: "pricing rail" },
        preservationManifest: ".dreative/preservation.json",
        decisionLedger: ".dreative/ledger.json",
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
        evidence: [{ id: "pricing-link", criterion: "Pricing link remains", status: "pass", evidence: "Clicked /pricing in production build" }],
      }),
    );

    const report = runDirectDesignAudit(root);
    assert.equal(report.ok, true, JSON.stringify(report.findings));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
