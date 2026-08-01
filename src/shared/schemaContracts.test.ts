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
    referenceMode: "supplied",
    referenceMinimum: 1,
    referenceAdoptions: [
      {
        source: "Industrial control reference",
        sourceRef: "https://example.com/reference",
        rights: "reference use only",
        principle: "Direct cause and effect",
        decision: "use",
        requiredBy: "direction",
        targetSelector: "#peak",
        visibleImplementation: "The product instrument responds directly.",
        rationale: "The principle clarifies the task.",
      },
    ],
    assetCommitments: [
      { role: "Hero subject", stage: "hero", subjectKind: "realistic-physical", decision: "use", requiredBy: "user", targetSelector: "#hero", medium: "image", productionSource: "supplied", sourceKind: "local-file", sourceRef: "/media/hero.webp", rights: "supplied by user", treatment: "graded cutout", crop: "responsive portrait", animationTechnique: "layered parallax", mobileFallback: "static close crop", externalEvaluation: "supplied media is the strongest truthful source", rationale: "The user requested product imagery." },
      { role: "Product subject", stage: "peak", subjectKind: "realistic-physical", decision: "use", requiredBy: "user", targetSelector: "#peak", medium: "3d", productionSource: "licensed-3d", sourceKind: "local-file", sourceRef: "/models/product.glb", rights: "licensed for web use", treatment: "studio material and light pass", crop: "full object", animationTechnique: "direct manipulation", mobileFallback: "pre-rendered turntable", externalEvaluation: "licensed model exceeds procedural fidelity", rationale: "The peak needs a truthful physical subject." },
      { role: "Decision subject", stage: "post-peak", subjectKind: "realistic-physical", decision: "use", requiredBy: "direction", targetSelector: "#decision", medium: "image", productionSource: "generated", sourceKind: "generated-record", sourceRef: "/media/decision.json", rights: "project generation terms", treatment: "packaging composite", crop: "landscape", animationTechnique: "mask reveal", mobileFallback: "static resolved state", externalEvaluation: "generation supplies a product-specific outcome", rationale: "The result must remain visible after the peak." },
    ],
    productionFeasibility: {
      gateStatus: "ready",
      prototypeAssetRefs: ["media/hero-desktop.webp", "media/hero-mobile.webp"],
      focalSubjects: [{ stage: "hero", subject: "Hero product", treatmentDefining: true, requiredMedium: "image", outputKind: "native", responsiveMode: "distinct", exactToolOrSource: "supplied studio source", editingWork: ["grade and responsive crop"], desktopDeliverable: "media/hero-desktop.webp", mobileDeliverable: "media/hero-mobile.webp", rights: "supplied by user", cost: "free", readiness: "ready", outputFiles: ["media/hero-desktop.webp", "media/hero-mobile.webp"], prototypeBindings: [{ viewport: "desktop", selector: "#hero img", assetRef: "media/hero-desktop.webp" }, { viewport: "mobile", selector: "#hero img", assetRef: "media/hero-mobile.webp" }] }],
    },
    prototypeEvidence: {
      treatmentOptions: [
        { name: "Direct product instrument", frames: [{ stage: "input", visual: "User selects the input" }, { stage: "change", visual: "Instrument changes state" }, { stage: "outcome", visual: "Recommendation appears" }] },
        { name: "Spatial product journey", frames: [{ stage: "input", visual: "Product enters the scene" }, { stage: "change", visual: "Product moves through the process" }, { stage: "outcome", visual: "Resolved product appears" }] },
      ],
      comparisonRequired: true,
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
      fullPageContinuityStoryboards: {
        bestFit: { artifact: "/prototype/best", capture: "best-storyboard.png", heroSelector: "#hero", peakSelector: "#peak", postPeakSelector: "#decision" },
        boldAlternative: { artifact: "/prototype/bold", capture: "bold-storyboard.png", heroSelector: "#hero", peakSelector: "#peak", postPeakSelector: "#decision" },
      },
      comparisonParity: { bothFinalWorthy: true, sharedContent: true, sharedViewportCoverage: true, distinctInteractionModels: true },
      prototypeReview: { status: "accepted", acceptedBy: "user" },
      builderSelectionRationale: "The user selected the direct instrument.",
    },
    prototypeFidelity: {
      level: "production-like",
      limitations: "Representative interaction and media fidelity; human taste review remains external.",
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
    comparisonPolicy: { present: true, rationale: "Products are compared in a stable grid.", sectionSelector: "#products" },
    comparisonLayouts: [
      { selector: "#products", itemSelector: "[data-product]", identityAttribute: "data-product", strategy: "fixed-grid", reorderMode: "none", maxTravelViewportRatio: 0, maxItemResizeRatio: 0, gapTolerancePx: 4, alignmentTolerancePx: 4, identityChannels: [{ channel: "product media", selector: "img", uniqueProperty: "src" }, { channel: "packaging label", selector: "$self", uniqueProperty: "text" }], assetStatus: "production" },
    ],
    mechanisms: [
      {
        name: "Product instrument",
        stage: "peak",
        selector: "#peak",
        primarySelector: "img",
        primarySubject: "The product",
        trigger: "click",
        mediaMode: "image",
        mobileTransformation: "Compact direct control",
        productTruth: "Configuration changes product suitability",
        userCause: "The visitor selects a configuration",
        visibleChange: "The product image changes",
        decisionConsequence: "The recommendation changes",
        motionIntent: "state-transition",
        temporalEvidence: "runtime-sampled",
        animationOwner: "native-js",
        ownedProperties: ["src"],
        stateCount: 3,
      },
    ],
  };
  assert.equal(validate(contract), true, JSON.stringify(validate.errors, null, 2));
  const singlePrototype: any = structuredClone(contract);
  singlePrototype.prototypeEvidence.comparisonRequired = false;
  delete singlePrototype.prototypeEvidence.boldAlternativeApproach;
  delete singlePrototype.prototypeEvidence.boldAlternativeArtifact;
  delete singlePrototype.prototypeEvidence.boldAlternativeCaptures;
  delete singlePrototype.prototypeEvidence.boldAlternativeRecordings;
  delete singlePrototype.prototypeEvidence.fullPageContinuityStoryboards.boldAlternative;
  delete singlePrototype.prototypeEvidence.comparisonParity;
  assert.equal(validate(singlePrototype), true, JSON.stringify(validate.errors, null, 2));
});

test("Draft 2020-12 strictly compiles the Experience Map schema", () => {
  const schema = JSON.parse(fs.readFileSync(path.resolve("skill", "dreative", "schemas", "experience-map.schema.json"), "utf8"));
  assert.doesNotThrow(() => new Ajv2020({ strict: true }).compile(schema));
});
