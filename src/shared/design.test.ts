import test from "node:test";
import assert from "node:assert/strict";
import { buildDesignPlan, buildDesignSourceContext, buildRuntimeCoherence, lintDesignPlan } from "./design.js";
import type { Block, DesignBrief, Page } from "./types.js";

function transactionalPage(): Page {
  const section = (id: string, type: Block["type"], label: string, children: Block[] = []): Block => ({ id, type, label, direction: "column", children });
  return {
    id: "outlet-selection",
    name: "Choose an outlet",
    status: "designed",
    canvasPos: { x: 0, y: 0 },
    generatedFile: "generated/outlet-selection.tsx",
    layout: section("root", "column", "Outlet selection page", [
      section("header", "nav", "Standard header"),
      section("intro", "hero", "Promotional chicken-rice introduction"),
      section("search", "form", "Search outlets", [{ id: "search-button", type: "button", label: "Search nearby outlets", text: "Search" }]),
      section("cards", "card-grid", "Repeated outlet cards"),
      section("continue", "section", "Continuation action", [{ id: "continue-button", type: "button", label: "Continue with selected outlet", text: "Continue" }]),
    ]),
  };
}

function plan(brief: DesignBrief) {
  return buildDesignPlan(transactionalPage(), brief);
}

test("case A: restyle + expressive retains structure without claiming transformation", () => {
  const result = plan({ transformationDepth: "restyle", variance: 8, motion: 8 });
  assert.equal(result.depth, "restyle");
  assert.equal(result.tier, "expressive");
  assert.equal(result.sourceStrategy, "patch");
  assert.equal(result.structuralDelta.rebuiltBoundaries.length, 0);
  assert.match(result.structuralDelta.depthHonesty, /restyle/i);
});

test("case B: restructure + standard produces a task-specific architecture", () => {
  const result = plan({ transformationDepth: "restructure", aesthetic: "trust", variance: 3, motion: 2 });
  assert.equal(result.tier, "standard");
  assert.equal(result.depth, "restructure");
  assert.equal(result.register, "task-transaction");
  assert.match(result.structuralDelta.proposedModel, /task-first.*workspace/i);
  assert.ok(result.structuralDelta.materialChanges.length >= 3);
  assert.equal(lintDesignPlan(result).length, 0);
});

test("case C: restructure + expressive carries structural, expression, mobile, preservation, and verification directives", () => {
  const result = plan({ transformationDepth: "restructure", variance: 8, motion: 8 });
  assert.equal(result.sourceStrategy, "rebuild-from-contracts");
  assert.ok(result.expression);
  assert.match(result.expression!.mechanism, /selection.*persistent context/i);
  assert.match(result.mobileBlueprint.firstViewportPurpose, /immediately.*before promotional/i);
  assert.match(result.structuralDelta.preservedContracts.join(" "), /routes.*handlers.*data flow/i);
  assert.ok(result.verification.length > 0);
});

test("case D: stack-only mobile plan is blocking", () => {
  const result = plan({ transformationDepth: "restructure", variance: 3, motion: 2 });
  result.mobileBlueprint.mobileOnlyComposition = "stack vertically";
  assert.ok(lintDesignPlan(result).some((message) => message.includes("mobile-native")));
});

test("case E: deep redesign treats previous file as behavior reference, never composition source", () => {
  const deep = buildDesignSourceContext("restructure", "generated/outlet-selection.tsx");
  assert.equal(deep.strategy, "rebuild-from-contracts");
  assert.equal(deep.previousFile, undefined);
  assert.equal(deep.behaviorReferenceFile, "generated/outlet-selection.tsx");
  assert.match(deep.compositionDirective, /independently from the previous visual tree/i);
  const light = buildDesignSourceContext("restyle", "generated/outlet-selection.tsx");
  assert.equal(light.previousFile, "generated/outlet-selection.tsx");
});

test("multi-page coherence records page registers without assigning a repeated shell", () => {
  const outlet = transactionalPage();
  const account: Page = { ...transactionalPage(), id: "account", name: "Account status", designPrompt: "Profile and billing settings" };
  const coherence = buildRuntimeCoherence([outlet, account], { transformationDepth: "restructure" });
  assert.deepEqual(coherence.pages.map((item) => item.register), ["task-transaction", "account-status"]);
  assert.ok(coherence.prohibitedRepeatedShells.some((item) => item.includes("unrelated routes")));
});

test("refined minimal surface does not clamp separately signaled creative motion", () => {
  const prompt = "Clean luxury and minimalistic, but creative, unique and impressive with smooth animations";
  const result = plan({ aesthetic: "minimal", variance: 5, motion: 3, notes: prompt });
  assert.equal(result.tier, "expressive");
  assert.ok(result.skills.includes("refined"));
  assert.ok(result.skills.includes("motion"));
  assert.match(result.directives.join(" "), /section motion treatments/i);
  assert.doesNotMatch(result.directives.join(" "), /hover\/active states only/);
});
