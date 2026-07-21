import { test, expect } from "@playwright/test";
import { runVisualSmoke, validateMechanisms, type MechanismContractEntry } from "./visualSmoke.js";

const base = "http://127.0.0.1:4181";
const contract: MechanismContractEntry[] = [
  { name: "before", selector: "#before", trigger: "click" },
  { name: "peak", selector: "#peak", trigger: "click" },
  { name: "after", selector: "#after", trigger: "click" },
];

test("healthy responsive fixture and three real mechanisms pass", async () => {
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", mechanisms: contract });
  expect(result.blockers).toEqual([]);
});

test("mechanism contract is structural and mandatory for Showcase", () => {
  expect(validateMechanisms("showcase", contract)).toEqual([]);
  expect(validateMechanisms("showcase", contract.slice(0, 2))).toContain("Showcase mechanism contract is missing after");
  expect(validateMechanisms("recommended", [])).toEqual([]);
});

for (const [path, expected] of [
  ["sticky", "sticky clipping risk"],
  ["empty", "near-empty viewport"],
  ["broken", "returned HTTP 404"],
  ["fallback", "200 SPA fallback"],
] as const) test(`${path} fixture is blocked`, async () => {
  const result = await runVisualSmoke(`${base}/${path}`, { profile: "recommended" });
  expect(result.ok).toBe(false);
  expect(result.blockers.join("\n")).toContain(expected);
});

test("a transform-driven long section without an ID is recognised", async () => {
  const result = await runVisualSmoke(`${base}/no-id-transform`, { profile: "recommended" });
  expect(result.blockers.filter((item) => item.includes("long region"))).toEqual([]);
});

for (const [path, expected] of [
  ["console", "console: fixture exploded"],
  ["asset", "asset HTTP 404"],
  ["reduced-overflow", "mobile-390-reduced: document is"],
] as const) test(`${path} context failure is blocked`, async () => {
  const result = await runVisualSmoke(`${base}/${path}`, { profile: "efficient" });
  expect(result.blockers.join("\n")).toContain(expected);
});
