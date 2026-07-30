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
      { role: "Hero subject", stage: "hero", subjectKind: "realistic-physical", decision: "use", requiredBy: "user", targetSelector: "#hero", medium: "image", productionSource: "supplied", sourceRef: "/media/hero.webp", rights: "supplied by user", treatment: "graded cutout", crop: "responsive portrait", animationTechnique: "layered parallax", mobileFallback: "static close crop", externalEvaluation: "supplied media is the strongest truthful source", rationale: "The user requested product imagery." },
      { role: "Product subject", stage: "peak", subjectKind: "realistic-physical", decision: "use", requiredBy: "user", targetSelector: "#peak", medium: "3d", productionSource: "licensed-3d", sourceRef: "/models/product.glb", rights: "licensed for web use", treatment: "studio material and light pass", crop: "full object", animationTechnique: "direct manipulation", mobileFallback: "pre-rendered turntable", externalEvaluation: "licensed model exceeds procedural fidelity", rationale: "The peak needs a truthful physical subject." },
      { role: "Decision subject", stage: "post-peak", subjectKind: "realistic-physical", decision: "use", requiredBy: "direction", targetSelector: "#decision", medium: "image", productionSource: "generated", sourceRef: "/media/decision.webp", rights: "project generation terms", treatment: "packaging composite", crop: "landscape", animationTechnique: "mask reveal", mobileFallback: "static resolved state", externalEvaluation: "generation supplies a product-specific outcome", rationale: "The result must remain visible after the peak." },
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
      fullPageContinuityStoryboards: { bestFit: "best-storyboard.png", boldAlternative: "bold-storyboard.png" },
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
    comparisonLayouts: [],
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
