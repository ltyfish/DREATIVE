import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { Ajv2020 } from "ajv/dist/2020.js";

test("Draft 2020-12 validates a complete Showcase contract", () => {
  const schema = JSON.parse(fs.readFileSync(path.resolve("skill", "dreative", "schemas", "showcase-mechanism.schema.json"), "utf8"));
  const validate = new Ajv2020({ strict: true }).compile(schema);
  const contract = {
    version: 2,
    experienceType: "interface",
    classification: { implementation: "attempted" },
    recommendedBaseline: "A direct product interface.",
    showcaseDelta: ["Connected product state.", "A spatial decision response."],
    mediaOpportunities: [
      { opportunity: "Product image", decision: "use", rationale: "Shows the real subject." },
      { opportunity: "Process video", decision: "reject", rationale: "No truthful footage exists." },
    ],
    referenceAdoptions: [
      {
        source: "Industrial control reference",
        principle: "Direct cause and effect",
        decision: "use",
        requiredBy: "direction",
        targetSelector: "#peak",
        visibleImplementation: "The product instrument responds directly.",
        rationale: "The principle clarifies the task.",
      },
    ],
    assetCommitments: [
      { role: "Product subject", decision: "use", requiredBy: "user", targetSelector: "#peak", medium: "image", rationale: "The user requested product imagery." },
    ],
    prototypeEvidence: {
      bestFitApproach: "Direct product instrument.",
      boldAlternativeApproach: "Spatial product journey.",
      selectedApproach: "Direct product instrument.",
      selectedBy: "user",
      bestFitArtifact: "/prototype/best-fit",
      boldAlternativeArtifact: "/prototype/bold",
      bestFitCaptures: { desktop: "best-desktop.png", mobile: "best-mobile.png" },
      boldAlternativeCaptures: { desktop: "bold-desktop.png", mobile: "bold-mobile.png" },
      bestFitRecordings: { desktop: "best-desktop.mp4", mobile: "best-mobile.mp4" },
      boldAlternativeRecordings: { desktop: "bold-desktop.mp4", mobile: "bold-mobile.mp4" },
      comparisonParity: { bothFinalWorthy: true, sharedContent: true, sharedViewportCoverage: true, distinctInteractionModels: true },
      builderSelectionRationale: "The user selected the direct instrument.",
    },
    prototypeFidelity: {
      selectedArtifact: "/prototype/best-fit",
      prototypeSubjectSelector: "#instrument",
      integratedSubjectSelector: "#peak",
      focalObject: "The product instrument",
      copyBalance: "Product remains primary",
      controlPlacement: "Controls stay attached",
      materialLighting: "Material stays legible",
      desktopFraming: "Complete instrument",
      mobileFraming: "Complete compact instrument",
    },
    continuity: {
      stateKey: "choice",
      sourceSelector: "#choice",
      sourceTrigger: "click",
      stateCount: 3,
      affectedRegions: [
        { selector: "#control", stage: "before", effect: "Sets the choice." },
        { selector: "#peak", stage: "peak", effect: "Changes the product." },
        { selector: "#decision", stage: "after", effect: "Changes the recommendation." },
      ],
    },
    agencyChain: {
      controlSectionSelector: "#control",
      inputSelector: "#choice",
      primaryResponseSelector: "#peak",
      downstreamSelector: "#decision",
      userAction: "Select a product state.",
      immediateResponse: "The product changes.",
      decisionOutcome: "The recommendation changes.",
    },
    mechanisms: [
      {
        name: "Product instrument",
        stage: "peak",
        selector: "#peak",
        primarySelector: "img",
        primarySubject: "The product",
        trigger: "click",
        experienceRole: "Transforms the product",
        ceilingContribution: "Makes product causality tangible",
        mediaMode: "image",
        continuityConnection: "Reads the shared choice",
        mobileTransformation: "Compact direct control",
        recommendedDifference: "Adds a connected response",
        meaningfulOutcome: "Changes the product decision",
        productTruth: "Configuration changes product suitability",
        userCause: "The visitor selects a configuration",
        visibleChange: "The product image changes",
        decisionConsequence: "The recommendation changes",
        removalCost: "The relationship becomes invisible",
        animationOwner: "native-js",
        ownedProperties: ["src"],
        stateCount: 3,
      },
    ],
  };
  assert.equal(validate(contract), true, JSON.stringify(validate.errors, null, 2));
});

test("Draft 2020-12 strictly compiles the Experience Map schema", () => {
  const schema = JSON.parse(fs.readFileSync(path.resolve("skill", "dreative", "schemas", "experience-map.schema.json"), "utf8"));
  assert.doesNotThrow(() => new Ajv2020({ strict: true }).compile(schema));
});
