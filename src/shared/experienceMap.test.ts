import test from "node:test";
import assert from "node:assert/strict";
import {
  journeyBalanceAdvisories,
  renderExperienceMap,
  renderImplementationObligations,
  validateShowcaseExperienceMap,
  validateExperienceMap,
  type ExperienceMap,
} from "./experienceMap.js";

const map: ExperienceMap = {
  version: 1,
  direction: "showcase",
  route: "/",
  concept: "Origin becomes roast, product, and allocation",
  primaryPeak: "roast",
  recommendations: ["Let Roast own the peak; strengthen Beans and Subscribe instead of adding competing hero motion."],
  sections: [
    { id: "hero", title: "Hero", role: "establish origin", intensity: 3, rhythm: "build", agency: "influence", inputState: "default origin", startState: "unselected origin", endState: "selected origin", mechanismOwner: "origin selector", connection: "sends origin to Roast", desktop: "split composition", mobile: "direct tap rail", reducedMotion: "instant selected state", evidenceTarget: "desktop/mobile selected-state capture" },
    { id: "roast", title: "Roast", role: "primary transformation", intensity: 5, rhythm: "peak", agency: "control", inputState: "selected green bean", startState: "green bean", endState: "roasted bean", mechanismOwner: "scroll timeline", connection: "produces Beans input", desktop: "pinned sequence", mobile: "bounded staged sequence", reducedMotion: "four-step static diagram", evidenceTarget: "entry/midpoint/release captures", selector: "#roast", trigger: "scroll", ownedProperties: ["transform", "clip-path"], meaningfulOutcome: "the selected origin becomes a roastable product" },
    { id: "beans", title: "Beans", role: "resolve into product", intensity: 3, rhythm: "release", agency: "control", inputState: "roasted bean", startState: "roast output", endState: "selected product", mechanismOwner: "shared layout transition", connection: "hands selection to Subscribe", desktop: "spatial product resolution", mobile: "single-card resolution", reducedMotion: "instant product state", evidenceTarget: "before/after product capture" },
  ],
};

test("experience maps validate and render user-facing choices", () => {
  assert.deepEqual(validateExperienceMap(map), []);
  const rendered = renderExperienceMap(map);
  assert.match(rendered, /use Dreative’s recommended approach/);
  assert.match(rendered, /more animated.+calmer.+change layout/i);
  assert.match(rendered, /Roast\s+5\/5 · peak · control/);
});

test("experience rows compile into implementation obligations", () => {
  const compiled = renderImplementationObligations(map);
  assert.match(compiled, /Visible change: green bean → roasted bean/);
  assert.match(compiled, /Desktop\/mobile\/reduced/);
  assert.match(compiled, /Evidence:/);
  assert.match(compiled, /Runtime contract: #roast/);
});

test("all-5 maps warn that maximum intensity can flatten the journey", () => {
  const flat = { ...map, sections: map.sections.map((section) => ({ ...section, intensity: 5 as const, selector: `#${section.id}`, trigger: "click" as const, ownedProperties: ["transform"], meaningfulOutcome: "a distinct product state" })) };
  assert.match(journeyBalanceAdvisories(flat).join("\n"), /5\/5 craft|primary peak/i);
});

test("journey balance is advisory, not a fake taste verdict", () => {
  assert.deepEqual(journeyBalanceAdvisories(map), []);
  const lopsided = { ...map, sections: map.sections.map((section) => section.id === "beans" ? { ...section, intensity: 1 as const } : section) };
  assert.match(journeyBalanceAdvisories(lopsided).join("\n"), /experiential weight|after the primary peak/i);
});

test("invalid maps fail on missing peak and incomplete obligations", () => {
  const invalid = { ...map, primaryPeak: "missing", sections: [{ id: "hero" }] };
  const errors = validateExperienceMap(invalid).join("\n");
  assert.match(errors, /at least two/);
});

test("keep-static rejects high intensity and active motion mechanisms", () => {
  const staticContradiction = {
    ...map,
    sections: map.sections.map((section) => section.id === "hero" ? {
      ...section,
      intensity: 5 as const,
      override: "keep-static" as const,
      mechanismOwner: "scroll timeline",
      mobile: "animated card transition",
    } : section),
  };
  const errors = validateExperienceMap(staticContradiction).join("\n");
  assert.match(errors, /keep-static requires intensity 1 or 2/);
  assert.match(errors, /mechanismOwner contradicts keep-static/);
  assert.match(errors, /mobile contradicts keep-static/);
});

test("intensity 5 rows require an executable rendered-state contract", () => {
  const incompletePeak = {
    ...map,
    sections: map.sections.map((section) => section.id === "roast" ? {
      ...section,
      selector: undefined,
      trigger: undefined,
      ownedProperties: undefined,
      meaningfulOutcome: undefined,
    } : section),
  };
  const errors = validateExperienceMap(incompletePeak).join("\n");
  assert.match(errors, /selector is required for intensity 5/);
  assert.match(errors, /ownedProperties/);
  assert.match(errors, /meaningfulOutcome/);
});

test("experience maps reject duplicate selector/property ownership", () => {
  const conflict = {
    ...map,
    sections: [
      map.sections[0],
      map.sections[1],
      { ...map.sections[1], id: "second-peak", title: "Second peak", mechanismOwner: "css timeline" },
    ],
  };
  assert.match(validateExperienceMap(conflict).join("\n"), /conflicts with scroll timeline ownership of #roast transform/);
});

test("Showcase maps require Showcase direction and an intensity-5 primary peak", () => {
  assert.deepEqual(validateShowcaseExperienceMap(map), []);
  const recommended = { ...map, direction: "recommended" as const };
  assert.match(validateShowcaseExperienceMap(recommended).join("\n"), /direction showcase/);
  const weakPeak = { ...map, sections: map.sections.map((section) => section.id === "roast" ? { ...section, intensity: 4 as const } : section) };
  const errors = validateShowcaseExperienceMap(weakPeak).join("\n");
  assert.match(errors, /primary peak must have intensity 5/);
  assert.match(errors, /at least one intensity-5 section/);
});

test("maps keep one explicit peak and Showcase requires user control", () => {
  const twoPeaks = { ...map, sections: map.sections.map((section) => section.id === "hero" ? { ...section, rhythm: "peak" as const } : section) };
  assert.match(validateExperienceMap(twoPeaks).join("\n"), /exactly one section must use rhythm peak/);
  const passive = { ...map, sections: map.sections.map((section) => ({ ...section, agency: "watch" as const })) };
  assert.match(validateShowcaseExperienceMap(passive).join("\n"), /at least one section where the user has control/);
});
